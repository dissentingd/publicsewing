// Drape designs unattended and leave a report to review later: designs a change may have
// affected, again (regress), and designs with no drape yet (new). Each drapes on its config's
// average body and at a small and a large size set, each on its nearest dataset body.
// Runs on the GPU host (Cloudbox) through tools/drape-pipeline.sh, or anywhere drape.mjs runs.
//
// Usage: node tools/drape-pipeline.mjs [design ...] [--mode new|regress|nightly] [--sets a,b|none]
//          [--all] [--max N] [--hours H] [--llm] [--dry-run] [--redo] [--retry-skipped]
//   design ...       only these (a draped design is draped again, a new one gets settings first)
//   --mode           new (default): designs with a brief and no runs.yaml entry. regress: draped
//                    designs a change since the last regression run may affect (a design's own
//                    files and its descendants'; everything for shared code, configs or blocks),
//                    each compared with its last drape. nightly: regress, then new
//   --sets           size sets to drape at besides the average body (default DEFAULT_SETS)
//   --all            regress: every draped design, not only the affected ones
//   --max N          stop after N designs; --hours H: start no design after H hours
//   --llm            ask the model when no draped design's settings fit (off by default: in the
//                    first runs it solved none)
//   --dry-run        settings and the quick check only (export + spec), no simulation
//   --redo           new: try again designs the state file says are done
//   --retry-skipped  new: try again designs skipped at this commit (by default they wait)
//
// For each new design:
//   1. Settings: a draped design's runs.yaml entry whose config's pieces and points are all
//      among this design's parts, its nearest ancestor's first. With --llm, when none passes the
//      quick check, the model (Ollama, PIPELINE_MODEL, default qwen2.5-coder:7b, on the CPU so
//      the GPU stays free for the simulator) proposes settings and is shown each error:
//      LLM_TRIES attempts.
//   2. Quick check: export and build the specification (drape.mjs, upTo 'spec'), no GPU.
// Then, for every design, each size:
//   3. Drape: simulate, check inside the body, fetch renders. A failure in a step that can
//      fail for a passing reason (upload, sim, inside, fetch) is retried SIM_TRIES times, waiting
//      longer each time. Then the drape is skipped and the run goes on. A drape is compared with
//      the last one of the same design and size: OK turned REVIEW, intersections up by half and
//      ten, or cloth half a centimetre deeper inside the body is flagged in the report.
// The run stops itself: after STOP_INFRA designs in a row failing on the host (container, GPU,
// disk, copying, the model), STOP_SKIPS drapes in a row failing, or the same drape error
// STOP_SAME times in a row, since then the next designs would fail the same way. A design
// whose settings can't be found is skipped without counting: that's an outcome, not a fault.
// Before starting it checks the container, the GPU, the model, Python and free disk.
//
// Output, under out/drape-pipeline/ (gitignored):
//   state.json            every new design's last outcome, every drape's last result (to compare),
//                         and the commit the last regression run covered
//   <run>/pipeline.log    what happened, readable; <run>/events.jsonl the same as data
//   <run>/report.md       a table to review: verdict, numbers, renders, why skipped
//   <run>/proposals.yaml  settings that draped, to copy into drape/runs.yaml after a look
//   <run>/llm/            every prompt and answer
//   ../drape/<design>-pipeline/  each drape's renders and result.json (drape.mjs)
import { execFileSync } from 'node:child_process'
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statfsSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse, stringify } from 'yaml'
import { drape, DrapeError } from './drape.mjs'
import { loadDesign, measurementSet } from './render.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const DESIGNS = join(HERE, '..')
const OUT = join(DESIGNS, 'out', 'drape-pipeline')

const LLM_TRIES = 3 // proposals per design, each shown the last error
const SIM_TRIES = 3 // attempts at the GPU steps
const BACKOFF = [30e3, 120e3] // waits between them
const STOP_INFRA = 3
const STOP_SKIPS = 5
const STOP_SAME = 3
const MIN_DISK_GB = 5
const OLLAMA = process.env.OLLAMA_URL ?? 'http://localhost:11434'
const MODEL = process.env.PIPELINE_MODEL ?? 'qwen2.5-coder:7b'
// The drape bodies, and the size and measurements each design is drafted at to match
const BODIES = {
  m_smpl_average_A40: { size: 'cisMaleAdult38', measurements: { chest: 1000, waist: 800, seat: 1000 } },
  f_smpl_average_A40: { size: 'cisFemaleAdult34', measurements: { chest: 900, waist: 800, seat: 1070 } },
}
// The size sets each design also drapes at, besides the config's average body: a small and a
// large one, each on its nearest dataset body (drape/bodies.yaml). --sets changes them
const DEFAULT_SETS = {
  m_smpl_average_A40: ['cisMaleAdult34', 'cisMaleAdult46'],
  f_smpl_average_A40: ['cisFemaleAdult30', 'cisFemaleAdult42'],
}
const INFRA = /No such container|Cannot connect to the Docker daemon|is not running|CUDA|out of memory|No space left|Connection (refused|reset|closed)|ssh:|timed out|ENOSPC|EACCES/i

// ---------------------------------------------------------------- arguments, lock, logging
const args = process.argv.slice(2)
const flag = (f) => args.includes(f)
const value = (f) => (args.includes(f) ? args[args.indexOf(f) + 1] : undefined)
const valued = new Set(['--max', '--hours', '--mode', '--sets'].flatMap((f) => (args.includes(f) ? [args.indexOf(f) + 1] : [])))
const only = args.filter((a, i) => !a.startsWith('--') && !valued.has(i))
const setsArg = value('--sets')
const opts = {
  mode: value('--mode') ?? 'new',
  sets: setsArg === undefined ? undefined : setsArg === 'none' ? [] : setsArg.split(','),
  all: flag('--all'),
  max: Number(value('--max') ?? Infinity),
  hours: Number(value('--hours') ?? Infinity),
  llm: flag('--llm'),
  dry: flag('--dry-run'),
  redo: flag('--redo'),
  retrySkipped: flag('--retry-skipped'),
}
if (!['new', 'regress', 'nightly'].includes(opts.mode)) throw new Error(`--mode is new, regress or nightly, not ${opts.mode}`)
const drapeName = (design, set) => (set ? `${design}-${set}-pipeline` : `${design}-pipeline`)

const runId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
const RUN = join(OUT, runId)
mkdirSync(join(RUN, 'llm'), { recursive: true })
const started = Date.now()

function log(level, msg, data) {
  const line = `${new Date().toISOString()} ${level.padEnd(5)} ${msg}`
  console.log(line)
  appendFileSync(join(RUN, 'pipeline.log'), line + '\n')
  appendFileSync(join(RUN, 'events.jsonl'), JSON.stringify({ t: new Date().toISOString(), level, msg, ...data }) + '\n')
}

const LOCK = join(OUT, 'lock')
function lock() {
  if (existsSync(LOCK)) {
    const pid = Number(readFileSync(LOCK, 'utf8'))
    let alive = false
    try {
      process.kill(pid, 0)
      alive = true
    } catch {}
    if (alive) throw new Error(`another run (pid ${pid}) holds ${LOCK}`)
    log('warn', `removing a stale lock from pid ${pid}`)
  }
  writeFileSync(LOCK, String(process.pid))
}
const unlock = () => existsSync(LOCK) && Number(readFileSync(LOCK, 'utf8')) === process.pid && rmSync(LOCK)

const sh = (cmd, a, timeout = 60e3) => execFileSync(cmd, a, { encoding: 'utf8', timeout, cwd: DESIGNS, stdio: ['ignore', 'pipe', 'pipe'] })
const commit = () => {
  try {
    return sh('git', ['rev-parse', '--short', 'HEAD']).trim()
  } catch {
    return 'unknown'
  }
}

// ---------------------------------------------------------------- what to drape
const runs = parse(readFileSync(join(DESIGNS, 'drape', 'runs.yaml'), 'utf8'))
const designs = readdirSync(DESIGNS).filter((d) => existsSync(join(DESIGNS, d, 'spec.yaml')) && existsSync(join(DESIGNS, d, 'BRIEF.md')))
const specOf = (d) => parse(readFileSync(join(DESIGNS, d, 'spec.yaml'), 'utf8'))

/** The nearest design up the `extends:` chain that has a drape */
function ancestor(d) {
  let s = specOf(d)
  for (let i = 0; i < 10 && s.extends; i++) {
    const path = resolve(DESIGNS, d, s.extends)
    const id = relative(DESIGNS, dirname(path))
    if (runs[id]) return id
    if (!existsSync(path) || !path.endsWith('spec.yaml')) return null
    d = id
    s = specOf(id)
  }
  return null
}

/** The design's own drafted parts: "prefix.part" -> its point names */
async function partsOf(d, size = 'cisMaleAdult38') {
  const Design = await loadDesign(d)
  const pattern = new Design({ measurements: measurementSet(size), sa: 0 }).draft()
  const parts = {}
  for (const [full, part] of Object.entries(pattern.parts[0])) if (part.paths.seam && !part.hidden) parts[full] = Object.keys(part.points)
  return parts
}

/**
 * Settings that drape another design and fit this one: every piece its config sews is one of
 * this design's parts, with every point the config uses there (clipTop and clipBottom come from
 * the clip or split). The nearest ancestor's first, then the rest in runs.yaml's order.
 */
function borrowed(d, parts) {
  const a = ancestor(d)
  const prefixes = [...new Set(Object.keys(parts).map((k) => k.split('.')[0]))]
  const out = []
  const seen = new Set()
  for (const id of [...(a ? [a] : []), ...Object.keys(runs).filter((x) => x !== a)]) {
    const e = runs[id]
    const cfg = configSummary(e.config)
    for (const prefix of prefixes) {
      const fits = Object.entries(cfg.pieces).every(([role, points]) => {
        const base = role.replace(/(Plus|Minus)$/, '')
        const part = role === 'back' ? (e.back ?? 'back') : e.split && base in e.split ? base : role
        const have = parts[`${prefix}.${part}`]
        return have && points.every((p) => ['clipTop', 'clipBottom'].includes(p) || have.includes(p))
      })
      if (!fits) continue
      const entry = { ...structuredClone(e), prefix }
      const key = JSON.stringify([entry.config, entry.pieces, entry.clip, entry.split, entry.back, entry.prefix, entry.options])
      if (!seen.has(key)) out.push({ from: id, ancestor: id === a, entry })
      seen.add(key)
      break
    }
  }
  return { list: out, why: a ? `no draped design's settings fit its parts (nearest draped ancestor: ${a})` : 'no draped design\'s settings fit its parts' }
}
const BORROW_TRIES = 4 // borrowed settings put through the quick check, before the model

// ---------------------------------------------------------------- the model
const configs = readdirSync(join(DESIGNS, 'drape')).filter((f) => f.endsWith('.yaml') && f !== 'runs.yaml')
function configSummary(f) {
  const text = readFileSync(join(DESIGNS, 'drape', f), 'utf8')
  const c = parse(text)
  const about = text.split('\n').filter((l) => l.startsWith('#')).slice(0, 3).map((l) => l.slice(2)).join(' ')
  const pieces = Object.fromEntries(Object.keys(c.pieces).map((p) => [p, [...new Set([...text.matchAll(new RegExp(`\\b${p}\\.(\\w+)`, 'g'))].map((m) => m[1]))]]))
  return { file: f, body: c.body, about, pieces }
}

async function ask(design, messages, n) {
  const body = { model: MODEL, messages, stream: false, format: 'json', keep_alive: '10m', options: { temperature: 0, num_gpu: 0, num_ctx: 12288 } }
  for (let tryN = 1; ; tryN++) {
    try {
      const res = await fetch(`${OLLAMA}/api/chat`, { method: 'POST', body: JSON.stringify(body), signal: AbortSignal.timeout(15 * 60e3) })
      if (!res.ok) throw new Error(`Ollama ${res.status}: ${await res.text()}`)
      const answer = (await res.json()).message.content
      writeFileSync(join(RUN, 'llm', `${design}-${n}.json`), JSON.stringify({ messages, answer }, null, 1))
      return JSON.parse(answer)
    } catch (e) {
      if (tryN >= 2) throw new Error(`the model didn't answer: ${e.message}`)
      log('warn', `${design}: model call failed (${e.message}); trying once more`)
      await sleep(10e3)
    }
  }
}

function prompt(design, parts, hint) {
  const examples = Object.entries(runs).slice(0, 18).map(([id, e]) => `${id} (${specOf(id).extends ?? specOf(id).block ?? ''}): ${JSON.stringify({ config: e.config, pieces: e.pieces, clip: e.clip, split: e.split, back: e.back, prefix: e.prefix, options: e.options, holdWaist: e.holdWaist })}`)
  const s = specOf(design)
  return [
    {
      role: 'system',
      content: `You choose 3D drape settings for a sewing pattern. A drape config places named pieces on a body and sews them; it names points as <piece>.<point>. Settings say which of the design's parts become the config's pieces:
- config: one of the config files below. Answer null only when the garment is of a kind no config sews at all (a skirt, a cape, an apron, trousers with a fly); otherwise try the nearest config: a coat, jacket or shirt with a back, front and sleeve can try coat-shell.yaml, jacket.yaml or box.yaml, a waistcoat coat-vest.yaml, trousers trousers.yaml. You will be shown the error and can fix it, so trying costs little.
- pieces: part names WITHOUT the prefix, the ones the config sews (collars, facings, pockets, linings, cuffs and bands are left out)
- prefix: the part-name prefix before the dot, when it isn't the design id
- back: the design's back part name, when the config calls it "back" and the design doesn't
- clip: {piece: x or point name}: keep the piece at x >= that (a front cut at its centre-front line, so two fronts sew edge to edge: e.g. front: 0 or front: cfLine). Clipped pieces gain the points clipTop and clipBottom.
- split: {piece: x}: cut a one-piece sleeve into <piece>Plus and <piece>Minus at x (e.g. sleeve: 0), which configs with sleevePlus/sleeveMinus need. Split pieces gain clipTop and clipBottom.
- options: design options to change for the drape (rarely: e.g. a vent closed), else {}
- holdWaist: true only for trousers whose waist must be held up
Every point a config uses must exist on the piece you map to it. Answer with JSON only: {"config": ..., "pieces": [...], "prefix": ..., "back": ..., "clip": {...}, "split": {...}, "options": {...}, "holdWaist": false, "why": "one sentence"}.

Configs (the points each uses per piece):
${configs.map((f) => JSON.stringify(configSummary(f))).join('\n')}

Settings that work for draped designs (id (what it extends or its block): settings):
${examples.join('\n')}`,
    },
    {
      role: 'user',
      content: `Design ${design}: "${s.about?.name}", ${s.about?.description ?? ''}. ${s.extends ? `It extends ${s.extends}.` : `Block: ${s.block}.`}
Its parts and their points:
${Object.entries(parts).map(([k, v]) => `${k}: ${v.join(' ')}`).join('\n')}${hint ? `\n\n${hint}` : ''}`,
    },
  ]
}

/** Fill in the size and measurements for the config's body; drop empty fields */
function complete(entry) {
  const e = Object.fromEntries(Object.entries(entry).filter(([k, v]) => v != null && !(typeof v === 'object' && !Array.isArray(v) && !Object.keys(v).length) && k !== 'why'))
  // Part names given with their prefix ("mackinaw.back"): the prefix goes to `prefix`
  const bare = (n) => {
    const [p, rest] = String(n).split('.')
    if (rest === undefined) return n
    e.prefix ??= p
    return rest
  }
  if (Array.isArray(e.pieces)) e.pieces = e.pieces.map(bare)
  if (e.back) e.back = bare(e.back)
  for (const k of ['clip', 'split']) if (e[k]) e[k] = Object.fromEntries(Object.entries(e[k]).map(([p, v]) => [bare(p), v]))
  const cfg = e.config && existsSync(join(DESIGNS, 'drape', e.config)) ? parse(readFileSync(join(DESIGNS, 'drape', e.config), 'utf8')) : null
  if (cfg && BODIES[cfg.body]) Object.assign(e, { size: e.size ?? BODIES[cfg.body].size, measurements: e.measurements ?? BODIES[cfg.body].measurements })
  if (!Array.isArray(e.pieces)) e.pieces = []
  return e
}

// ---------------------------------------------------------------- one design
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
// An error's gist: its first line, or for a Python traceback its stage and last line
function firstLine(m) {
  const lines = String(m).split('\n').map((l) => l.trim()).filter(Boolean)
  if (!lines.length) return ''
  if (lines.some((l) => /^Traceback|^File "/.test(l))) return `${lines[0].split(':')[0]}: ${lines.at(-1)}`
  return lines[0]
}
const signature = (m) => firstLine(m).replace(/\d+(\.\d+)?/g, '#').replace(/[\w-]+-pipeline/g, '<name>').slice(0, 160)

/** Settings that pass the quick check, or why there are none */
async function settle(design) {
  let parts
  try {
    parts = await partsOf(design)
  } catch (e) {
    return { skip: `it doesn't draft: ${firstLine(e.message)}`, kind: 'settings' }
  }
  const tries = []
  const quick = (entry) => {
    try {
      drape(design, { name: `${design}-pipeline`, entry, upTo: 'spec' })
      return null
    } catch (e) {
      return e.message
    }
  }
  const b = borrowed(design, parts)
  if (!b.list.length) log('info', `${design}: nothing to borrow (${b.why})`, { design })
  for (const { from, ancestor: anc, entry: raw } of b.list.slice(0, BORROW_TRIES)) {
    const entry = complete(raw)
    const err = quick(entry)
    log(err ? 'warn' : 'info', `${design}: ${from}'s settings${anc ? ' (its ancestor)' : ''} ${err ? `fail the quick check: ${firstLine(err)}` : 'pass the quick check'}`, { design, from, entry, error: err })
    if (!err) return { entry, source: `${anc ? 'inherited' : 'borrowed'} from ${from}` }
    tries.push({ from, entry, err })
  }
  if (!opts.llm) return tries.length ? { skip: `borrowed settings fail: ${firstLine(tries[0].err)}`, kind: 'settings' } : { skip: `nothing to borrow (${b.why}), and the model is off`, kind: 'no-settings' }

  let hint = tries.length ? `${tries[0].from}'s settings ${JSON.stringify(tries[0].entry)} failed with:\n${tries[0].err.slice(-1500)}` : ''
  for (let n = 1; n <= LLM_TRIES; n++) {
    let answer
    try {
      answer = await ask(design, prompt(design, parts, hint), n)
    } catch (e) {
      return { skip: e.message, kind: 'infra' }
    }
    if (!answer.config) {
      log('info', `${design}: the model says no config fits: ${answer.why}`, { design, answer })
      return { skip: `no drape config fits (the model: ${answer.why ?? 'no reason given'})`, kind: 'needs-config' }
    }
    const entry = complete(answer)
    const err = quick(entry)
    log(err ? 'warn' : 'info', `${design}: proposal ${n} (${answer.why ?? ''}) ${err ? `fails: ${firstLine(err)}` : 'passes the quick check'}`, { design, entry, error: err })
    if (!err) return { entry, source: `the model, try ${n}: ${answer.why ?? ''}` }
    tries.push({ entry, err })
    hint = `Your settings ${JSON.stringify(entry)} failed with:\n${err.slice(0, 1500)}\nFix them, or answer config null if no config can drape this garment.`
  }
  return { skip: `${LLM_TRIES} proposals failed; last: ${firstLine(tries.at(-1).err)}`, kind: 'settings' }
}

/** The drape itself, retried when a host step fails. `set`: at a size set on its matched body */
async function simulate(design, entry, set) {
  let last
  for (let n = 1; n <= SIM_TRIES; n++) {
    try {
      return { result: drape(design, { name: drapeName(design, set), entry, set }) }
    } catch (e) {
      last = e
      const host = e instanceof DrapeError ? ['upload', 'sim', 'inside', 'fetch'].includes(e.stage) : true
      log('warn', `${design}: drape attempt ${n} failed${e.stage ? ` at ${e.stage}` : ''}: ${firstLine(e.message)}`, { design, attempt: n, error: e.message })
      if (!host || n === SIM_TRIES) break
      await sleep(BACKOFF[n - 1] ?? BACKOFF.at(-1))
    }
  }
  return { error: last.message, kind: INFRA.test(last.message) ? 'infra' : 'drape', stage: last.stage }
}

// ---------------------------------------------------------------- checks before starting
function preflight() {
  const problems = []
  const check = (what, f) => {
    try {
      const r = f()
      log('info', `preflight: ${what}: ${r}`)
    } catch (e) {
      problems.push(`${what}: ${firstLine(e.message)}`)
    }
  }
  const local = (process.env.DRAPE_HOST ?? '') === 'local'
  const remote = local ? (cmd) => sh('sh', ['-c', cmd]) : (cmd) => sh('ssh', [JSON.parse(readFileSync(join(DESIGNS, 'drape', 'local.json'), 'utf8')).host, cmd])
  const container = process.env.DRAPE_CONTAINER ?? 'garmentcode'
  check('python and pyyaml', () => sh(process.env.PYTHON ?? 'python', ['-c', 'import yaml; print("ok")']).trim())
  if (!opts.dry) {
    check('container', () => {
      const s = remote(`docker inspect -f '{{.State.Running}}' ${container}`).trim()
      if (s !== 'true') throw new Error(`${container} isn't running`)
      return 'running'
    })
    check('GPU', () => remote(`docker exec ${container} nvidia-smi --query-gpu=name,memory.used,memory.total --format=csv,noheader`).trim())
    check('disk', () => {
      const free = Number(remote(`df -BG --output=avail ${local ? '$HOME' : '.'} | tail -1`).replace(/\D/g, ''))
      if (free < MIN_DISK_GB) throw new Error(`${free} GB free, under ${MIN_DISK_GB}`)
      return `${free} GB free`
    })
  }
  if (!problems.length) {
    const s = statfsSync(DESIGNS)
    const gb = (s.bavail * s.bsize) / 2 ** 30
    if (gb < 1) problems.push(`only ${gb.toFixed(1)} GB free here`)
  }
  return problems
}

async function modelReady() {
  if (!opts.llm) return
  const res = await fetch(`${OLLAMA}/api/tags`, { signal: AbortSignal.timeout(15e3) }).catch((e) => ({ ok: false, statusText: e.message }))
  if (!res.ok) throw new Error(`Ollama at ${OLLAMA}: ${res.statusText}`)
  const names = (await res.json()).models.map((m) => m.name)
  if (!names.includes(MODEL)) throw new Error(`Ollama has no ${MODEL} (has ${names.join(', ')})`)
  log('info', `preflight: model ${MODEL} at ${OLLAMA}, on the CPU`)
}

// ---------------------------------------------------------------- the run
// state.json: { designs: { <design>: last settings outcome }, drapes: { <design>@<set>: last
// drape }, regressedAt: the commit the last regression run covered }
const statePath = join(OUT, 'state.json')
const loaded = existsSync(statePath) ? JSON.parse(readFileSync(statePath, 'utf8')) : {}
const state = loaded.designs ? loaded : { designs: loaded, drapes: {}, regressedAt: null }
const saveState = () => writeFileSync(statePath, JSON.stringify(state, null, 1))

/** The sizes a design drapes at: its config's average body ('avg'), then opts.sets for that body */
function setsFor(entry) {
  const body = parse(readFileSync(join(DESIGNS, 'drape', entry.config), 'utf8')).body
  const wanted = opts.sets ?? DEFAULT_SETS[body] ?? []
  const matched = parse(readFileSync(join(DESIGNS, 'drape', 'bodies.yaml'), 'utf8'))
  return ['avg', ...wanted.filter((s) => matched[s]?.body)]
}

/** What changed since the last drape of the same design and size, worth a look */
function compare(prev, result) {
  if (!prev?.result) return null
  const deepest = (r) => Math.max(0, ...Object.entries(r.inside.regions).filter(([k]) => k !== 'wrist/hand').map(([, s]) => s.deepest))
  const notes = []
  if (prev.result.verdict === 'OK' && result.verdict === 'REVIEW') notes.push('was OK')
  const [a, b] = [prev.result.garmentcode.intersections, result.garmentcode.intersections]
  if (b > a * 1.5 + 10) notes.push(`intersections ${a} -> ${b}`)
  const [da, db] = [deepest(prev.result), deepest(result)]
  if (db > da + 0.5) notes.push(`deepest ${da} -> ${db} cm`)
  return notes.length ? `changed since ${prev.commit}: ${notes.join(', ')}` : null
}

/** Draped designs a change since commit `from` can affect (all of them when unsure) */
function affected(from) {
  const draped = Object.keys(runs)
  if (!from) return { list: draped, why: 'no earlier regression run' }
  let files
  try {
    files = sh('git', ['diff', '--name-only', from, 'HEAD', '--', '.', '../docker']).trim().split('\n').filter(Boolean)
  } catch {
    return { list: draped, why: `can't diff from ${from}` }
  }
  // Files every drape goes through: drafting code (not the site's lists or the exporters), the
  // blocks, the drape steps, the simulation script and the dependencies
  const shared = files.filter(
    (f) =>
      /^designs\/(lib|blocks|templates)\//.test(f) && !/^designs\/lib\/(categories\.mjs|export\/)/.test(f) ||
      /^designs\/tools\/(drape\.mjs|drape-export\.mjs|drape_spec\.py|drape_inside\.py|drape_bodies\.py|render\.mjs|gcspec\/)/.test(f) ||
      /^designs\/package-lock\.json$|^docker\/ccat_sim\.py$/.test(f),
  )
  if (shared.length) return { list: draped, why: `shared files changed: ${shared.slice(0, 5).join(', ')}` }
  const descends = (x, d) => {
    for (let id = x, i = 0; i < 10; i++) {
      const e = specOf(id).extends
      if (!e) return false
      id = relative(DESIGNS, dirname(resolve(DESIGNS, id, e)))
      if (id === d) return true
      if (!existsSync(join(DESIGNS, id, 'spec.yaml'))) return false
    }
    return false
  }
  const hit = new Set()
  for (const f of files) {
    const m = f.match(/^designs\/([^/]+)\//)
    if (!m) continue
    if (m[1] === 'drape') {
      const file = f.slice('designs/drape/'.length)
      for (const d of draped) if (runs[d].config === file || ['runs.yaml', 'bodies.yaml'].includes(file)) hit.add(d)
    } else if (existsSync(join(DESIGNS, m[1], 'spec.yaml'))) {
      for (const d of draped) if (d === m[1] || descends(d, m[1])) hit.add(d)
    }
  }
  return { list: [...hit], why: `${files.length} files changed since ${from}` }
}

function report(rows, stopped) {
  const rel = (p) => relative(RUN, join(DESIGNS, p)).replace(/\\/g, '/')
  const n = (v) => rows.filter((r) => r.status === v).length
  const changed = rows.filter((r) => r.change)
  const lines = [
    `# Drape pipeline, ${runId}`,
    '',
    `Commit ${commit()}, ${opts.mode}${opts.dry ? ', dry run (quick check only)' : ''}, ${opts.llm ? `model ${MODEL}` : 'no model'}. ${rows.length} drapes: ${n('OK')} OK, ${n('REVIEW')} to review, ${n('checked')} checked, ${n('skipped')} skipped${changed.length ? `, **${changed.length} changed since their last drape**` : ''}.${stopped ? `\n\n**Stopped early:** ${stopped}` : ''}`,
    '',
    "Verdicts are drape.mjs's: REVIEW when cloth is more than 1 cm inside the body outside the wrists. Look at every render anyway: a drape can pass and still be wrong (a piece flipped, a seam sewn to the wrong edge). Size `avg` is the config's average body; the others are our size sets on their nearest dataset body (drape/bodies.yaml). Settings that draped, for designs not yet in runs.yaml, are in proposals.yaml.",
    '',
    '| Design | Size | Outcome | Settings from | GarmentCode (limit 35) | Deepest inside, outside the wrists | Renders | Notes |',
    '|---|---|---|---|---|---|---|---|',
    ...rows.map((r) => {
      const g = r.result?.garmentcode
      const deep = r.result ? Object.entries(r.result.inside.regions).filter(([k]) => k !== 'wrist/hand').sort((a, b) => b[1].deepest - a[1].deepest)[0] : null
      const renders = r.result ? r.result.renders.map((p, i) => `[${i ? 'back' : 'front'}](${rel(p)})`).join(' ') : ''
      const notes = [r.change ? `**${r.change}**` : '', r.reason ?? ''].filter(Boolean).join('. ')
      return `| ${r.design} | ${r.set ?? ''} | ${r.status} | ${r.source ?? ''} | ${g ? `${g.intersections} (self ${g.selfIntersections}, ${g.frames} frames)` : ''} | ${deep ? `${deep[1].deepest} cm (${deep[0]})` : ''} | ${renders} | ${notes.replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 300)} |`
    }),
  ]
  writeFileSync(join(RUN, 'report.md'), lines.join('\n') + '\n')
  const proposals = Object.fromEntries(rows.filter((r) => r.entry && r.status !== 'skipped' && !runs[r.design]).map((r) => [r.design, r.entry]))
  writeFileSync(join(RUN, 'proposals.yaml'), `# Drape settings that ${opts.dry ? 'passed the quick check' : 'draped'} in run ${runId}, for designs not in runs.yaml: review the renders, then copy them in\n${Object.keys(proposals).length ? stringify(proposals) : ''}`)
}

async function main() {
  lock()
  const at = commit()
  log('info', `run ${runId} at commit ${at}: ${JSON.stringify(opts)}`)
  const problems = preflight()
  try {
    await modelReady()
  } catch (e) {
    problems.push(e.message)
  }
  if (problems.length) {
    for (const p of problems) log('error', `preflight: ${p}`)
    report([], `preflight failed: ${problems.join('; ')}`)
    return 3
  }

  // What to drape: draped designs a change can affect (regress), designs with no drape (new)
  const jobs = []
  if (only.length) for (const d of only) jobs.push({ design: d, mode: runs[d] ? 'regress' : 'new' })
  else {
    if (['regress', 'nightly'].includes(opts.mode)) {
      const a = opts.all ? { list: Object.keys(runs), why: '--all' } : affected(state.regressedAt)
      log('info', `regression: ${a.list.length} draped designs to drape again (${a.why})`)
      for (const d of a.list) jobs.push({ design: d, mode: 'regress' })
    }
    if (['new', 'nightly'].includes(opts.mode)) {
      const fresh = designs.filter((d) => !runs[d]).filter((d) => {
        const s = state.designs[d]
        if (opts.redo || !s) return true
        if (['OK', 'REVIEW'].includes(s.status)) return false
        if (s.status === 'skipped' && s.commit === at && !opts.retrySkipped) return false
        return true
      })
      log('info', `new: ${fresh.length} designs without a drape to try`)
      for (const d of fresh) jobs.push({ design: d, mode: 'new' })
    }
  }
  log('info', `${jobs.length} designs: ${jobs.map((j) => j.design).join(', ')}`)

  const rows = []
  let infraRun = 0
  let skipRun = 0
  let sameRun = 0
  let lastSig = ''
  let stopped = ''
  let done = 0
  // Stop when the next drapes would fail the same way. Only failures in the drape itself or on
  // the host count: a design whose settings can't be found (no-settings, needs-config, settings)
  // is an expected outcome, and a family of designs can share one
  const count = (row) => {
    if (row.status === 'skipped' && ['no-settings', 'needs-config', 'settings'].includes(row.kind)) return
    if (row.status === 'skipped') {
      skipRun++
      infraRun = row.kind === 'infra' ? infraRun + 1 : 0
      const sig = signature(row.reason)
      sameRun = sig === lastSig ? sameRun + 1 : 1
      lastSig = sig
    } else {
      skipRun = infraRun = sameRun = 0
      lastSig = ''
    }
    if (infraRun >= STOP_INFRA) stopped = `${infraRun} drapes in a row failed on the host; last: ${firstLine(row.reason)}`
    else if (sameRun >= STOP_SAME) stopped = `the same error ${sameRun} times in a row: ${lastSig}`
    else if (skipRun >= STOP_SKIPS) stopped = `${skipRun} drapes in a row failed`
  }
  const record = (row) => {
    rows.push(row)
    report(rows)
    log(row.status === 'skipped' ? 'warn' : 'info', `${row.design}${row.set ? ` at ${row.set}` : ''}: ${row.status}${row.change ? ` (${row.change})` : ''}${row.reason ? `: ${firstLine(row.reason)}` : ''} (${row.seconds} s)`, { design: row.design, set: row.set, status: row.status, kind: row.kind, change: row.change, seconds: row.seconds })
    count(row)
  }

  for (const { design, mode } of jobs) {
    if (done >= opts.max) {
      stopped = `reached --max ${opts.max}`
      break
    }
    if ((Date.now() - started) / 36e5 > opts.hours) {
      stopped = `reached --hours ${opts.hours}`
      break
    }
    done++
    log('info', `== ${design} (${done} of ${jobs.length}, ${mode})`, { design, mode })
    let t0 = Date.now()
    let entry = runs[design]
    let source = 'runs.yaml'
    if (mode === 'new') {
      const s = await settle(design)
      state.designs[design] = { status: s.skip ? 'skipped' : opts.dry ? 'checked' : 'settled', commit: at, run: runId, reason: s.skip, kind: s.kind, entry: s.entry, at: new Date().toISOString() }
      saveState()
      if (s.skip) {
        record({ design, status: 'skipped', reason: s.skip, kind: s.kind, seconds: Math.round((Date.now() - t0) / 1000) })
        if (stopped) break
        continue
      }
      entry = s.entry
      source = s.source
      if (opts.dry) {
        record({ design, status: 'checked', entry, source, seconds: Math.round((Date.now() - t0) / 1000) })
        continue
      }
    } else if (opts.dry) continue

    const verdicts = []
    for (const set of setsFor(entry)) {
      t0 = Date.now()
      const key = `${design}@${set}`
      const sim = await simulate(design, entry, set === 'avg' ? undefined : set)
      const row = { design, set, entry, source, seconds: Math.round((Date.now() - t0) / 1000) }
      if (sim.result) {
        Object.assign(row, { status: sim.result.verdict, result: sim.result, change: compare(state.drapes[key], sim.result) })
        state.drapes[key] = { commit: at, run: runId, result: sim.result, at: new Date().toISOString() }
        verdicts.push(sim.result.verdict)
      } else Object.assign(row, { status: 'skipped', reason: `drape failed${sim.stage ? ` at ${sim.stage}` : ''}: ${sim.error}`, kind: sim.kind })
      saveState()
      record(row)
      if (stopped) break
    }
    if (mode === 'new') {
      state.designs[design].status = verdicts.includes('REVIEW') ? 'REVIEW' : verdicts.length ? 'OK' : 'skipped'
      saveState()
    }
    if (stopped) break
  }
  if (!stopped && !opts.dry && ['regress', 'nightly'].includes(opts.mode) && !only.length) {
    state.regressedAt = at
    saveState()
  }
  report(rows, stopped)
  log(stopped && !/--max|--hours/.test(stopped) ? 'error' : 'info', `done: ${rows.length} drapes of ${done} designs in ${Math.round((Date.now() - started) / 60e3)} min${stopped ? `; stopped: ${stopped}` : ''}. Report: ${join(RUN, 'report.md')}`)
  return stopped && !/--max|--hours/.test(stopped) ? 2 : 0
}

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    log('warn', `stopped by ${sig}`)
    unlock()
    process.exit(130)
  })
}
let code = 1
try {
  code = await main()
} catch (e) {
  log('error', `the pipeline failed: ${e.stack ?? e.message}`)
} finally {
  unlock()
}
process.exit(code)
