// One command for a 3D drape: export a design's outlines, build the GarmentCode specification,
// simulate it on the GPU host, fetch the renders, and say where the cloth goes inside the body.
// Usage: node tools/drape.mjs <design> [--name <run name>] [--options '<json>']
//   The design's drape settings are in drape/runs.yaml. Results go to out/drape/<name>/
//   (renders, result.json).
// The GPU host runs GarmentCode in a Docker container (built from docker/, see
// drape/README.md) with a host folder mounted at /data. Say where it is with environment
// variables, or the same keys in drape/local.json (gitignored):
//   DRAPE_HOST       ssh destination, e.g. user@gpu-box
//   DRAPE_DATA       the host folder mounted at /data (relative to the ssh user's home, or absolute)
//   DRAPE_CONTAINER  the container's name (default garmentcode)
// Verdict: REVIEW if the cloth is more than 1 cm inside the body anywhere but the wrists and
// hands (sleeve hems resting on the wrists in the simulator's arms-out pose are expected);
// GarmentCode's own body-cloth intersection count is reported alongside. Exit code 0 for OK,
// 2 for REVIEW, 1 for an error.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

const HERE = dirname(fileURLToPath(import.meta.url))
const DESIGNS = join(HERE, '..')
const REPO = join(DESIGNS, '..')
const DEPTH_LIMIT = 1.0 // cm inside the body, outside the wrists and hands, before a drape needs a look

const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { cwd: DESIGNS, encoding: 'utf8', maxBuffer: 1 << 28, ...opts })

function hostSettings() {
  const file = join(DESIGNS, 'drape', 'local.json')
  const local = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {}
  const host = process.env.DRAPE_HOST ?? local.host
  const data = process.env.DRAPE_DATA ?? local.data
  const container = process.env.DRAPE_CONTAINER ?? local.container ?? 'garmentcode'
  if (!host || !data) throw new Error('set DRAPE_HOST and DRAPE_DATA (or drape/local.json): see the top of tools/drape.mjs')
  return { host, data, container }
}

export function drape(design, { name, options: extra = {} } = {}) {
  const runs = parse(readFileSync(join(DESIGNS, 'drape', 'runs.yaml'), 'utf8'))
  const r = runs[design]
  if (!r) throw new Error(`no drape settings for ${design} in drape/runs.yaml (has: ${Object.keys(runs).join(', ')})`)
  const config = parse(readFileSync(join(DESIGNS, 'drape', r.config), 'utf8'))
  const { host, data, container } = hostSettings()
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
  console.log(run(process.execPath, exportArgs).trim())
  const specs = join(out, 'specs')
  const specArgs = ['tools/drape_spec.py', outlines, join('drape', r.config), specs, name]
  if (r.back) specArgs.push('--back', r.back)
  console.log(run('python', specArgs).trim())

  // 3. Simulate on the host (the simulation and the inside-the-body check go up each run)
  const remote = `${host}:${data}`
  run('scp', ['-q', join(REPO, 'docker', 'ccat_sim.py'), join(HERE, 'drape_inside.py'), `${remote}/`])
  run('ssh', [host, `mkdir -p ${data}/ps`])
  run('scp', ['-q', '-r', join(specs, name), `${remote}/ps/`])
  // holdWaist: GarmentCode's default sim settings, with its waist pin (edges labelled
  // lower_interface) kept for the whole run instead of released after 400 frames
  let props = ''
  if (r.holdWaist) {
    run('ssh', [host, `docker exec ${container} sh -c "sed 's/attachment_frames: 400/attachment_frames: 100000/' /opt/garmentcode/assets/Sim_props/default_sim_props.yaml > /data/sim_props_hold.yaml"`])
    props = ' -s /data/sim_props_hold.yaml'
  }
  const sim = run('ssh', [host, `docker exec -w /opt/garmentcode ${container} python /data/ccat_sim.py -p /data/ps/${name}/${name}_specification.json -b ${config.body}${props}`]).replace(/\r/g, '\n')
  const grab = (re) => sim.match(re)?.[1]
  const logDir = grab(/^OUT (\/data\/Logs\/\S+)/m)
  if (!logDir) throw new Error(`the simulation didn't finish:\n${sim.split('\n').filter((l) => l && !l.startsWith('Progress')).slice(-15).join('\n')}`)
  const result = {
    design,
    name,
    size: r.size,
    body: config.body,
    options: { ...r.options, ...extra },
    garmentcode: {
      intersections: Number(grab(/BODY CLOTH INTERSECTIONS:\s*(\d+)/)),
      selfIntersections: Number(grab(/Self-Intersecting with (\d+)/) ?? 0),
      frames: Number(grab(/#frames=(\d+)/)),
    },
  }

  // 4. Where the cloth is inside the body, and 5. the renders
  const hostLogs = `${data}/Logs/${logDir.split('/').pop()}`
  const inside = run('ssh', [host, `docker exec ${container} python /data/drape_inside.py ${logDir}/${name}_sim.obj /opt/garmentcode/assets/bodies/${config.body}.obj --json`])
  result.inside = JSON.parse(inside.trim().split('\n').pop())
  for (const view of ['front', 'back']) run('scp', ['-q', `${host}:${hostLogs}/${name}_render_${view}.png`, out])
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
    const r = drape(args[0], { name: flag('--name'), options: JSON.parse(flag('--options') ?? '{}') })
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
