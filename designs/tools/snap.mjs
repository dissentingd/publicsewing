// Scaled PNG previews of SVGs: node snap.mjs a.svg b.svg (NODE_PATH=$(npm root -g))
import { createRequire } from 'node:module'
import { writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
const { chromium } = createRequire(join(process.env.NODE_PATH, 'x.js'))('playwright')
const b = await chromium.launch(); const p = await b.newPage()
for (const f of process.argv.slice(2)) {
  const html = resolve(f).replace(/\.svg$/, '.html')
  writeFileSync(html, `<body style="margin:0;background:#fff"><img src="file://${resolve(f)}" style="width:1000px"></body>`)
  await p.setViewportSize({ width: 1000, height: 800 }); await p.goto('file://' + html)
  await p.screenshot({ path: resolve(f).replace(/\.svg$/, '.png'), fullPage: true })
}
await b.close()
