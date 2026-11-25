import React from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'

export default function SearchBar() {
  const action = useBaseUrl('/search')

  return <form className="navbar-search-form" action={action} method="get" role="search">
    <label className="navbar-search-label" htmlFor="navbar-search-input">Search the site</label>
    <input id="navbar-search-input" name="q" type="search" placeholder="Search" aria-label="Search the site" required />
    <button type="submit" aria-label="Submit search">Search</button>
  </form>
}
