import React, { useState } from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'
import catalog from '@site/src/generated/catalog.json'

const isExternal = (href) => /^https?:\/\//.test(href)

export default function DesignCatalog({ folder, category }) {
  const items = folder === 'section' ? catalog.sections?.[category] ?? [] : folder === 'all'
    ? [...(catalog.designs?.[category] ?? []), ...(catalog.inspired?.[category] ?? [])].sort((a, b) => a.name.localeCompare(b.name))
    : catalog[folder]?.[category] ?? []
  const [selectedId, setSelectedId] = useState(items[0]?.id)
  const selected = items.find((item) => item.id === selectedId) ?? items[0]
  const base = useBaseUrl('/')
  const localUrl = (path) => path?.startsWith('/') ? `${base}${path.slice(1)}` : path

  if (!selected) return null
  return <div className="design-catalog">
    <div className="design-catalog-list" role="group" aria-label={`${category} designs`}>
      <div className="design-catalog-list-head"><span>Design</span><span>Difficulty</span></div>
      {items.map((item) => <div key={item.id} role="button" tabIndex={0}
        className={`design-catalog-row${selected.id === item.id ? ' is-selected' : ''}`}
        aria-pressed={selected.id === item.id} onClick={() => setSelectedId(item.id)}
        onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedId(item.id) } }}>
        {item.thumbnail && <img className="design-catalog-thumb" src={localUrl(item.thumbnail)} alt="" loading="lazy" />}
        <a className="design-catalog-row-name" href={localUrl(item.href)} onClick={(event) => event.stopPropagation()}>{item.name}</a>
        <span className="design-catalog-row-rating">
        {item.traditions?.map((tradition) => <span className="design-catalog-row-flags" key={tradition.key} title={tradition.label} aria-label={tradition.label}>
          {(tradition.flags ?? (tradition.flag ? [tradition.flag] : [])).map((flag) => <img key={flag} src={localUrl(`/img/flags/${flag}.svg`)} alt="" />)}
        </span>)}
        {item.difficulty ? <span className="design-catalog-dots" aria-label={`Difficulty ${item.difficulty} of 5`}>
          {'●'.repeat(item.difficulty)}<span>{'●'.repeat(5 - item.difficulty)}</span>
        </span> : <span className="design-catalog-row-kind">External</span>}
        </span>
      </div>)}
    </div>
    <section className="design-catalog-preview" aria-live="polite" aria-label={`${selected.name} preview`}>
      <div className="design-catalog-hero">
        {selected.image ? <img src={localUrl(selected.image)} alt={`${selected.name} illustration`} loading="lazy" />
          : <div className="design-catalog-no-image">{selected.name}</div>}
        <div className="design-catalog-hero-copy">
          <span className="design-catalog-kicker">{selected.status}</span>
          <h4>{selected.name}</h4>
          {selected.difficulty && <p className="design-catalog-difficulty">Difficulty {selected.difficulty} of 5</p>}
          <p>{selected.description}</p>
        </div>
      </div>
      <div className="design-catalog-meta">
        {selected.source && <a className="design-catalog-source" href={localUrl(selected.source.href)}>
          <span>Built on</span><strong>{selected.source.text.replace(/^(Built on|Inspired by)\s+/i, '')}</strong>
        </a>}
        {selected.traditions?.map((tradition) => <span className="design-catalog-tradition" key={tradition.key} title={tradition.label}>
          {(tradition.flags ?? (tradition.flag ? [tradition.flag] : [])).map((flag) => <img key={flag} src={localUrl(`/img/flags/${flag}.svg`)} alt="" />)}
          {tradition.label}
        </span>)}
      </div>
      <dl className="design-catalog-facts">
        {selected.sizing && <div><dt>Sizing</dt><dd>{selected.sizing}</dd></div>}
        {selected.patternParts > 0 && <div><dt>Pattern parts</dt><dd>{selected.patternParts}</dd></div>}
        {selected.licence && <div><dt>Source licence</dt><dd><a href={localUrl(selected.licence.href)}>{selected.licence.text}</a></dd></div>}
      </dl>
      {selected.techniques?.length > 0 && <p className="design-catalog-detail"><strong>Construction:</strong> {selected.techniques.join(' · ')}</p>}
      {selected.variants?.length > 0 && <p className="design-catalog-detail"><strong>Variants:</strong> {selected.variants.map((v, i) => <React.Fragment key={v.href}>{i > 0 && ', '}<a href={localUrl(v.href)}>{v.name}</a></React.Fragment>)}</p>}
      {selected.related?.length > 0 && <p className="design-catalog-detail"><strong>Related:</strong> {selected.related.map((v, i) => <React.Fragment key={v.href}>{i > 0 && ', '}<a href={localUrl(v.href)}>{v.name}</a></React.Fragment>)}</p>}
      {selected.imageCredit && <p className="design-catalog-credit">Image: {selected.imageCredit}. <a href={localUrl('/sources#illustrations')}>Image sourcing</a></p>}
      <a className="button button--primary design-catalog-action" href={localUrl(selected.href)}>
        {isExternal(selected.href) ? 'Visit pattern' : 'View design'} →
      </a>
    </section>
  </div>
}
