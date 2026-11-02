// "Use this variant" on a design's page: sets the variant's options in the pattern tool (the same
// localStorage state the size picker writes, so the editor redraws) and goes to the tool. `keys`
// are all the options the design's variants touch: they're cleared first, so one variant doesn't
// inherit another's, while the visitor's other changes stay. With no `options`, this is the way
// back to the design as shown at the top of the page.
import React from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { editorConfig } from './PatternEditor'

function Button({ design, options = {}, keys, defaults, label }) {
  const useLocalStorageState = require('use-local-storage-state').default
  const [state, setState] = useLocalStorageState(editorConfig(design).stateKey, { defaultValue: {} })
  const current = state?.settings?.options ?? {}
  const inUse = keys.every((k) => (current[k] ?? defaults[k]) === (options[k] ?? defaults[k]))

  const use = () => {
    setState((cur) => {
      const next = { ...(cur?.settings?.options ?? {}) }
      for (const k of keys) delete next[k]
      return { ...(cur || {}), view: 'draft', settings: { ...(cur?.settings || {}), options: { ...next, ...options } } }
    })
    document.getElementById('make-the-pattern')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <button className={`button button--sm ${inUse ? 'button--secondary' : 'button--primary'} variant-button`} disabled={inUse} onClick={use}>
      {inUse ? 'In use in the pattern tool' : label}
    </button>
  )
}

export default function VariantButton(props) {
  return (
    <BrowserOnly fallback={<button className="button button--sm button--secondary variant-button" disabled>{props.label}</button>}>
      {() => <Button {...props} />}
    </BrowserOnly>
  )
}
