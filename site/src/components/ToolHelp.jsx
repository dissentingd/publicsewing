// The pattern tool's help for one design option, from our own labels (designs/labels.yaml and the
// spec, through src/lib/collection.mjs), in place of FreeSewing's page in a frame, which has nothing
// for our designs. Reached through patches/@freesewing+react+4.10.2.patch.
import React from 'react'

export function OptionHelp({ design, option }) {
  const { i18n } = require('@site/src/lib/collection.mjs')
  const label = i18n[design]?.en?.o?.[option]
  return (
    <div className="measure-help">
      <h3>{label?.t ?? option}</h3>
      <p>{label?.d || 'No notes on this option yet. Try changing it and watch what the pattern does.'}</p>
    </div>
  )
}
