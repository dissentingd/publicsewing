// The pattern editor for one design: FreeSewing's Editor (@freesewing/react), browser only
// (it reads localStorage and window), with no backend, no account and our views only, plus a
// picker for our size sets. State lives in localStorage, one key per design (see
// patches/@freesewing+react+4.10.2.patch); the visitor's own measurements are kept once, under
// MY_KEY, so they carry from one design to the next.
import React, { useEffect } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import sizes from '@site/src/generated/sizes.json'

const MY_KEY = 'publicsewing-my-measurements'
const groups = { women: 'Women', men: 'Men', stout: 'Stout figures', girls: 'Girls (USDA 1939)', boys: 'Boys (USDA 1939)' }

export const editorConfig = (design) => ({
  enableBackend: false,
  stateKey: `publicsewing-editor-${design}`,
  // No 'designs' (FreeSewing's collection picker), 'save' (its backend) or 'docs' (its site)
  mainViews: ['draft', 'export'],
  extraViews: ['measurements', 'undos', 'layout'],
  devViews: ['inspect', 'logs', 'test'],
  hrefNewSet: false,
})

function SizePicker({ design, Design, useLocalStorageState }) {
  const [state, setState] = useLocalStorageState(editorConfig(design).stateKey, { defaultValue: {} })
  const [mine, setMine] = useLocalStorageState(MY_KEY, { defaultValue: null })
  const needed = [...Design.patternConfig.measurements, ...Design.patternConfig.optionalMeasurements]
  const current = state?.settings?.measurements
  const setName = state?.settings?.metadata?.setName

  // Measurements entered by hand (no set loaded) become "my measurements"
  useEffect(() => {
    if (current && !setName && Object.keys(current).length) setMine((m) => ({ ...(m || {}), ...current }))
  }, [JSON.stringify(current), setName])

  const load = (measurements, name) => {
    const m = Object.fromEntries(needed.filter((k) => measurements[k] !== undefined).map((k) => [k, measurements[k]]))
    setState((cur) => ({
      ...(cur || {}),
      view: 'draft',
      settings: { ...(cur?.settings || {}), measurements: m, metadata: name ? { setName: name } : undefined },
    }))
  }
  const pick = (e) => {
    const v = e.target.value
    if (v === 'mine') load(mine, undefined)
    else {
      const set = Object.values(sizes).flat().find((s) => s.id === v)
      if (set) load(set.measurements, set.label)
    }
    e.target.value = ''
  }
  const missingMine = mine ? needed.filter((k) => Design.patternConfig.measurements.includes(k) && mine[k] === undefined) : []

  return (
    <div className="size-picker">
      <label>
        <strong>Size set:</strong>{' '}
        <select onChange={pick} defaultValue="">
          <option value="" disabled>
            {setName ? `${setName} (change)` : current ? 'My measurements (change)' : 'Choose…'}
          </option>
          {mine ? <option value="mine">My measurements{missingMine.length ? ` (${missingMine.length} missing)` : ''}</option> : null}
          {Object.entries(groups).map(([g, label]) => (
            <optgroup key={g} label={label}>
              {sizes[g].map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>{' '}
      <span className="size-picker-note">
        Or enter your own under <em>Measurements</em>; they're kept in this browser for every design.
      </span>
    </div>
  )
}

const save = (name, text, type) => {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([text], { type }))
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

// Files for other pattern software, drafted from the editor's current settings, and a SeamlyMe
// measurements file loaded in as "my measurements"
function OtherSoftware({ design, Design, useLocalStorageState }) {
  const [state, setState] = useLocalStorageState(editorConfig(design).stateKey, { defaultValue: {} })
  const [, setMine] = useLocalStorageState(MY_KEY, { defaultValue: null })
  const [note, setNote] = React.useState('')
  const settings = state?.settings ?? {}
  const ready = settings.measurements && Object.keys(settings.measurements).length
  const size = settings.metadata?.setName ?? 'own measurements'

  const download = (ext, type) => {
    const { exportFiles } = require('../../../designs/lib/export/index.mjs')
    const { about } = require('@site/src/lib/collection.mjs')
    // CAD and Seamly expect the allowance: the editor's width (kept in samm even while it's
    // switched off), else 10 mm
    const sa = settings.samm ?? settings.sa ?? 10
    try {
      const files = exportFiles(Design, { ...settings, sa }, { name: design, size, source: about[design]?.source })
      save(`${design}-${size.replace(/[^\w.-]+/g, '_')}.${ext}`, files[ext], type)
      setNote('')
    } catch (e) {
      setNote(`Couldn't make the file: ${e.message}`)
    }
  }
  const load = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const { fromSmis } = require('../../../designs/lib/export/index.mjs')
    try {
      const { measurements, skipped } = fromSmis(await file.text())
      setMine((m) => ({ ...(m || {}), ...measurements }))
      setState((cur) => ({ ...(cur || {}), view: 'draft', settings: { ...(cur?.settings || {}), measurements: { ...(cur?.settings?.measurements || {}), ...measurements }, metadata: undefined } }))
      setNote(`Loaded ${Object.keys(measurements).length} measurements from ${file.name}${skipped.length ? `; ${skipped.length} have no match here and were left out` : ''}. Check them under Measurements.`)
    } catch (err) {
      setNote(`Couldn't read ${file.name}: ${err.message}`)
    }
  }

  return (
    <details className="other-software">
      <summary>
        <strong>For other pattern software</strong> (Seamly2D, CLO3D and other CAD)
      </summary>
      <p>
        Drafted at the size and options above, with seam allowance. AAMA DXF opens in CLO3D, Marvelous Designer,
        Browzwear, Style3D, Optitex, Gerber and Lectra, and as a drawing in LibreCAD or Inkscape. The Seamly2D file
        is fixed at these measurements: draft again here for other ones.
      </p>
      <p>
        <button className="button button--secondary button--sm" disabled={!ready} onClick={() => download('dxf', 'application/dxf')}>
          AAMA DXF
        </button>{' '}
        <button className="button button--secondary button--sm" disabled={!ready} onClick={() => download('sm2d', 'application/xml')}>
          Seamly2D (.sm2d)
        </button>{' '}
        <button className="button button--secondary button--sm" disabled={!ready} onClick={() => download('smis', 'application/xml')}>
          SeamlyMe measurements (.smis)
        </button>{' '}
        <label className="button button--secondary button--sm">
          Load SeamlyMe measurements…
          <input type="file" accept=".smis,.vit" onChange={load} hidden />
        </label>
      </p>
      {!ready ? <p>Choose a size set or enter measurements first.</p> : null}
      {note ? <p>{note}</p> : null}
    </details>
  )
}

export default function PatternEditor({ design }) {
  return (
    <BrowserOnly fallback={<div className="pattern-editor">Loading the pattern tool…</div>}>
      {() => {
        const { Editor } = require('@freesewing/react/components/Editor')
        const { designs } = require('@site/src/lib/collection.mjs')
        const useLocalStorageState = require('use-local-storage-state').default
        const { patternStyle } = require('./patternStyle.mjs')
        return (
          <div className="pattern-editor">
            <style>{patternStyle}</style>
            <SizePicker design={design} Design={designs[design]} useLocalStorageState={useLocalStorageState} />
            <Editor design={design} localDesigns={designs} config={editorConfig(design)} />
            <OtherSoftware design={design} Design={designs[design]} useLocalStorageState={useLocalStorageState} />
          </div>
        )
      }}
    </BrowserOnly>
  )
}
