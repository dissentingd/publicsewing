// An entry in the Learn page's index, linkable as /learn#<name-as-slug>. `img` is a path under
// static/, for the illustrations to come; entries without one lay out the same, just shorter.
import React from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'

export default function Term({ name, img, children }) {
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const src = useBaseUrl(img || '')
  return (
    <div className="learn-term" id={id}>
      {img && <img src={src} alt="" loading="lazy" />}
      <dt>{name}</dt>
      <dd>{children}</dd>
    </div>
  )
}
