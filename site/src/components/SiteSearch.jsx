import React, { useEffect, useMemo, useState } from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'
import pages from '@site/src/generated/search.json'

const normalize = (value) => value.toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')

export default function SiteSearch() {
  const [query, setQuery] = useState('')
  const base = useBaseUrl('/')
  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get('q') ?? '')
  }, [])
  const terms = useMemo(() => normalize(query.trim()).split(/\s+/).filter(Boolean), [query])
  const results = useMemo(() => {
    if (!terms.length) return []
    return pages.map((page) => {
      const title = normalize(page.title)
      const description = normalize(page.description)
      const body = normalize(page.body)
      if (!terms.every((term) => title.includes(term) || description.includes(term) || body.includes(term))) return null
      const score = terms.reduce((sum, term) => sum + (title.includes(term) ? 10 : 0) + (description.includes(term) ? 4 : 0) + (body.includes(term) ? 1 : 0), 0)
      const first = Math.min(...terms.map((term) => body.indexOf(term)).filter((index) => index >= 0))
      const start = Number.isFinite(first) ? Math.max(0, first - 65) : 0
      const snippet = page.body.slice(start, start + 190)
      return { ...page, score, snippet: `${start ? '…' : ''}${snippet}${start + 190 < page.body.length ? '…' : ''}` }
    }).filter(Boolean).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
  }, [terms])

  return <div className="site-search">
    <label htmlFor="site-search-input">Search the site</label>
    <input id="site-search-input" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try coat, measuring, or buttons" autoComplete="off" />
    {terms.length > 0 && <>
      <p role="status">{results.length} {results.length === 1 ? 'result' : 'results'} for “{query.trim()}”</p>
      <ul>{results.map((page) => <li key={page.href}>
        <a href={`${base}${page.href.replace(/^\//, '')}`}>{page.title}</a>
        <p>{page.description || page.snippet}</p>
        {page.description && <small>{page.snippet}</small>}
      </li>)}</ul>
    </>}
  </div>
}
