// One command for a 3D drape: export a design's outlines, build the GarmentCode specification,
// simulate it on the GPU host, fetch the renders, and say where the cloth goes inside the body.
// Usage: node tools/drape.mjs <design> [--set <size set>] [--name <run name>] [--options '<json>']
//   --set: draft at that size set and drape on its nearest dataset body (drape/bodies.yaml)
//   instead of the runs.yaml size on the config's average body
//   The design's drape settings are in drape/runs.yaml. Results go to out/drape/<name>/
//   (renders, result.json).
// The GPU host runs GarmentCode in a Docker container (built from docker/, see
// drape/README.md) with a host folder mounted at /data. Say where it is with environment
// variables, or the same keys in drape/local.json (gitignored):
//   DRAPE_HOST       ssh destination, e.g. user@gpu-box; `local` when this is the GPU host
//                    (tools/drape-pipeline.mjs on Cloudbox)
//   DRAPE_DATA       the host folder mounted at /data (relative to the ssh user's home, or absolute)
//   DRAPE_CONTAINER  the container's name (default garmentcode)
// Verdict: REVIEW if the cloth is more than 1 cm inside the body anywhere but the wrists and
// hands (sleeve hems resting on the wrists in the simulator's arms-out pose are expected);
// GarmentCode's own body-cloth intersection count is reported alongside. Exit code 0 for OK,
// 2 for REVIEW, 1 for an error.
import { execFileSync } from 'node:child_process'
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { basename, dirname, isAbsolute, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse, stringify } from 'yaml'

const HERE = dirname(fileURLToPath(import.meta.url))
const DESIGNS = join(HERE, '..')
const REPO = join(DESIGNS, '..')
const DEPTH_LIMIT = 1.0 // cm inside the body, outside the wrists and hands, before a drape needs a look
// How long a step may take before it counts as hung (simulations take 1-4 minutes on Cloudbox)
const TIMEOUT = { sim: 20 * 60e3, step: 5 * 60e3 }
// The configs' bodies (their yaml in GarmentCode's assets/bodies), which placements are set for
const REFERENCE = {
  m_smpl_average_A40: { height: 178.1, head_l: 25.6, bust: 100, shoulder_w: 38.2 },
  f_smpl_average_A40: { height: 165, head_l: 25, bust: 90, shoulder_w: 38 },
}

const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { cwd: DESIGNS, encoding: 'utf8', maxBuffer: 1 << 28, ...opts })

/** A failed step, naming which: export, spec, upload, sim, inside or fetch */
export class DrapeError extends Error {
  constructor(stage, message) {
    super(`${stage}: ${message}`)
    this.stage = stage
  }
}

function stage(name, f) {
  try {
    return f()
  } catch (e) {
    if (e instanceof DrapeError) throw e
    const hung = e.code === 'ETIMEDOUT' || e.signal === 'SIGTERM' ? 'timed out. ' : ''
    const text = [e.stderr, e.stdout, e.message].filter(Boolean).join('\n').trim()
    throw new DrapeError(name, hung + text.split('\n').slice(-25).join('\n'))
  }
}

function hostSettings() {
  const file = join(DESIGNS, 'drape', 'local.json')
  const local = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {}
  const host = process.env.DRAPE_HOST ?? local.host
  const data = process.env.DRAPE_DATA ?? local.data
  const container = process.env.DRAPE_CONTAINER ?? local.container ?? 'garmentcode'
  if (!host || !data) throw new Error('set DRAPE_HOST and DRAPE_DATA (or drape/local.json): see the top of tools/drape.mjs')
  return { host, data, container }
}

/** Shell, copy up and copy down on the GPU host: over ssh, or here for DRAPE_HOST=local */
function hostOps({ host, data }) {
  if (host === 'local') {
    const dir = isAbsolute(data) ? data : join(homedir(), data)
    return {
      dir,
      sh: (cmd, timeout = TIMEOUT.step) => run('sh', ['-c', cmd], { timeout }),
      put: (src, sub = '') => {
        const to = join(dir, sub, basename(src))
        if (statSync(src).isDirectory()) cpSync(src, to, { recursive: true })
        else copyFileSync(src, to)
      },
      get: (path, out) => copyFileSync(path.replace(/^\/data/, dir), join(out, basename(path))),
    }
  }
  const remote = `${host}:${data}`
  return {
    dir: data,
    sh: (cmd, timeout = TIMEOUT.step) => run('ssh', [host, cmd], { timeout }),
    put: (src, sub = '') => run('scp', ['-q', '-r', src, `${remote}/${sub}`], { timeout: TIMEOUT.step }),
    get: (path, out) => run('scp', ['-q', `${host}:${path.replace(/^\/data/, data)}`, out], { timeout: TIMEOUT.step }),
  }
}

/**
 * Drape one design. `entry`: drape settings to use instead of its runs.yaml entry (the
 * pipeline's proposals). `upTo: 'spec'` stops once the specification is built: a quick check
 * that needs no GPU.
 */
export function drape(design, { name, options: extra = {}, entry, upTo, set } = {}) {
  const runs = parse(readFileSync(join(DESIGNS, 'drape', 'runs.yaml'), 'utf8'))
  let r = entry ?? runs[design]
  if (!r) throw new Error(`no drape settings for ${design} in drape/runs.yaml (has: ${Object.keys(runs).join(', ')})`)
  if (!r.config || !existsSync(join(DESIGNS, 'drape', r.config))) throw new DrapeError('export', `no drape config "${r.config}" in drape/`)
  const config = parse(readFileSync(join(DESIGNS, 'drape', r.config), 'utf8'))
  // At a size set: drafted at the set's own measurements, on its nearest dataset body
  // (drape/bodies.yaml), the config's placements scaled to that body
  let body = config.body
  if (set) {
    const match = parse(readFileSync(join(DESIGNS, 'drape', 'bodies.yaml'), 'utf8'))[set]
    if (!match) throw new DrapeError('export', `no size set ${set} in drape/bodies.yaml`)
    if (!match.body) throw new DrapeError('export', `${set} has no body within reach (nearest ${match.nearest}, ${match.error}% off)`)
    body = `gcd_${match.body}`
    r = { ...r, size: set, measurements: undefined }
  }
  name ??= `${design}-${new Date().toISOString().slice(0, 10)}`.replace(/[^a-z0-9-]/gi, '')
  const out = join(DESIGNS, 'out', 'drape', name)
  mkdirSync(out, { recursive: true })
  const pairs = (o) => Object.entries(o ?? {}).map(([k, v]) => `${k}=${v}`).join(',')

  // 1. Outlines (cm) and 2. the GarmentCode specification
  const outlines = join(out, `${name}.json`)
  const exportArgs = ['tools/drape-export.mjs', design, r.size, outlines, '--pieces', r.pieces.join(','), '--options', JSON.stringify({ ...r.options, ...extra })]
  if (r.clip) exportArgs.push('--clip', pairs(r.clip))
  if (r.split) exportArgs.push('--split', pairs(r.split))
  if (r.measurements) exportArgs.push('--m', pairs(r.measurements))
  if (r.prefix) exportArgs.push('--prefix', r.prefix)
  console.log(stage('export', () => run(process.execPath, exportArgs, { timeout: TIMEOUT.step })).trim())
  const specs = join(out, 'specs')
  let configPath = join('drape', r.config)
  let scale = 1
  if (body !== config.body) {
    // The config places pieces for its own average body: scale up and down by nape height,
    // across and front to back by bust. The body goes up to the host first
    const { host, data } = hostSettings()
    const h = hostOps({ host, data })
    const id = body.slice(4)
    const bodies = process.env.DRAPE_BODIES ?? '~/custom-clothing/datasets/garmentcodedata-v2/extract/bodies'
    const target = stage('upload', () => {
      h.put(join(HERE, 'drape_bodies.py'))
      h.sh(`python3 ${h.dir}/drape_bodies.py install ${bodies} ${id} ${h.dir}`)
      return parse(h.sh(`cat ${h.dir}/bodies/${body}.yaml`)).body
    })
    const ref = REFERENCE[config.body]
    const sy = (target.height - target.head_l) / (ref.height - ref.head_l)
    const sxz = target.bust / ref.bust
    scale = sy
    // Each body's right arm, measured from its mesh: a line, its angle down, its radius
    const container = hostSettings().container
    const armOf = (path) => JSON.parse(stage('upload', () => h.sh(`docker exec ${container} python /data/drape_bodies.py arm ${path}`)).trim().split('\n').pop())
    const armRef = armOf(`/opt/garmentcode/assets/bodies/${config.body}.obj`)
    const armT = armOf(`/data/bodies/${body}.obj`)
    const onAxis = (a, x) => {
      const t = (x - a.point[0]) / a.dir[0]
      return a.point.map((c, i) => c + t * a.dir[i])
    }
    const turn = armT.angle - armRef.angle
    const scaled = structuredClone(config)
    for (const p of Object.values(scaled.pieces)) {
      const [x, y, z] = p.translation
      if (p.rotation?.[2]) {
        // A sleeve: keep its offset from the arm's line as on the config's body, spaced by the
        // arm's radius, at the matching point along this body's arm; turned by the angle change
        const q = onAxis(armRef, x)
        const s = armT.radius / armRef.radius
        const qt = onAxis(armT, x * (target.shoulder_w / REFERENCE[config.body].shoulder_w))
        p.translation = [qt[0] + (x - q[0]), qt[1] + (y - q[1]) * s, qt[2] + (z - q[2]) * s]
        p.rotation = [p.rotation[0], p.rotation[1], p.rotation[2] + turn]
      } else p.translation = [x * sxz, y * sy, z * sxz]
    }
    scaled.body = body
    configPath = join(out, `${name}-config.yaml`)
    writeFileSync(configPath, stringify(scaled))
    console.log(`body ${body}: body pieces scaled ${sy.toFixed(3)} up, ${sxz.toFixed(3)} across; sleeves on its arm, turned ${turn.toFixed(1)} deg`)
  }
  const specArgs = ['tools/drape_spec.py', outlines, configPath, specs, name]
  if (r.back) specArgs.push('--back', r.back)
  console.log(stage('spec', () => run(process.env.PYTHON ?? 'python', specArgs, { timeout: TIMEOUT.step })).trim())
  if (upTo === 'spec') return { design, name, stage: 'spec' }

  // 3. Simulate on the host (the simulation and the inside-the-body check go up each run)
  const { host, data, container } = hostSettings()
  const h = hostOps({ host, data })
  stage('upload', () => {
    h.sh(`mkdir -p ${h.dir}/ps`)
    h.put(join(REPO, 'docker', 'ccat_sim.py'))
    h.put(join(HERE, 'drape_inside.py'))
    h.put(join(specs, name), 'ps')
  })
  // holdWaist: GarmentCode's default sim settings, with its waist pin (edges labelled
  // lower_interface) kept for the whole run instead of released after 400 frames
  let props = ''
  if (r.holdWaist) {
    stage('upload', () => h.sh(`docker exec ${container} sh -c "sed 's/attachment_frames: 400/attachment_frames: 100000/' /opt/garmentcode/assets/Sim_props/default_sim_props.yaml > /data/sim_props_hold.yaml"`))
    props = ' -s /data/sim_props_hold.yaml'
  }
  const sim = stage('sim', () =>
    h.sh(`docker exec -w /opt/garmentcode ${container} python /data/ccat_sim.py -p /data/ps/${name}/${name}_specification.json -b ${body}${props}`, TIMEOUT.sim),
  ).replace(/\r/g, '\n')
  const grab = (re) => sim.match(re)?.[1]
  const logDir = grab(/^OUT (\/data\/Logs\/\S+)/m)
  if (!logDir) throw new DrapeError('sim', `the simulation didn't finish:\n${sim.split('\n').filter((l) => l && !l.startsWith('Progress')).slice(-15).join('\n')}`)
  const result = {
    design,
    name,
    size: r.size,
    body,
    set: set ?? null,
    options: { ...r.options, ...extra },
    garmentcode: {
      intersections: Number(grab(/BODY CLOTH INTERSECTIONS:\s*(\d+)/)),
      selfIntersections: Number(grab(/Self-Intersecting with (\d+)/) ?? 0),
      frames: Number(grab(/#frames=(\d+)/)),
    },
  }

  // 4. Where the cloth is inside the body, and 5. the renders
  const inside = stage('inside', () => h.sh(`docker exec ${container} python /data/drape_inside.py ${logDir}/${name}_sim.obj /opt/garmentcode/assets/bodies/${body}.obj --json --scale ${scale}`))
  result.inside = stage('inside', () => JSON.parse(inside.trim().split('\n').pop()))
  stage('fetch', () => {
    for (const view of ['front', 'back']) h.get(`${logDir}/${name}_render_${view}.png`, out)
  })
  result.renders = ['front', 'back'].map((v) => join('out', 'drape', name, `${name}_render_${v}.png`).replace(/\\/g, '/'))

  const flagged = Object.entries(result.inside.regions).filter(([region, s]) => region !== 'wrist/hand' && s.deepest > DEPTH_LIMIT)
  result.verdict = flagged.length ? 'REVIEW' : 'OK'
  result.flagged = Object.fromEntries(flagged)
  writeFileSync(join(out, 'result.json'), JSON.stringify(result, null, 1))
  return result
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const flag = (f) => (args.includes(f) ? args[args.indexOf(f) + 1] : undefined)
  try {
    const r = drape(args[0], { name: flag('--name'), set: flag('--set'), options: JSON.parse(flag('--options') ?? '{}') })
    const g = r.garmentcode
    console.log(`\n${r.design} on ${r.body} (drafted at ${r.size}): ${r.verdict}`)
    console.log(`  GarmentCode: ${g.intersections} body-cloth intersections (its limit 35), ${g.selfIntersections} self-intersections, ${g.frames} frames`)
    for (const [region, s] of Object.entries(r.inside.regions).sort((a, b) => b[1].count - a[1].count)) {
      const mark = region !== 'wrist/hand' && s.deepest > DEPTH_LIMIT ? '  <- more than 1 cm in' : ''
      console.log(`  inside the body: ${String(s.count).padStart(4)} at ${region}, deepest ${s.deepest} cm${mark}`)
    }
    console.log(`  renders: ${r.renders.join(', ')}`)
    process.exit(r.verdict === 'OK' ? 0 : 2)
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  }
}
