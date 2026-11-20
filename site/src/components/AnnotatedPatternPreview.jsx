import React from 'react'

// Coordinates match the 1000 × 938 default chore-coat preview. This is an annotated
// guide to that layout, not a replacement for the full-size exported pattern.
const marks = [
  { code: 'A', x: 178, y: 26, note: 'shoulder: front 1' },
  { code: 'A', x: 807, y: 26, note: 'shoulder: back 2' },
  { code: 'B', x: 267, y: 460, note: 'side seam: front 1' },
  { code: 'B', x: 907, y: 460, note: 'side seam: back 2' },
  { code: 'C', x: 229, y: 178, note: 'armhole: front 1' },
  { code: 'C', x: 854, y: 178, note: 'armhole: back 2' },
  { code: 'C', x: 483, y: 28, note: 'sleeve cap: sleeve 3' },
  { code: 'D', x: 70, y: 31, note: 'neckline: front 1' },
  { code: 'D', x: 708, y: 31, note: 'neckline: back 2' },
  { code: 'D', x: 538, y: 564, note: 'neck edge: collar 4' },
  { code: 'E', x: 15, y: 318, note: 'front edge: front 1' },
  { code: 'E', x: 983, y: 318, note: 'front edge: facing 5' },
  { code: 'F', x: 291, y: 315, note: 'underarm seam: sleeve 3' },
  { code: 'F', x: 669, y: 315, note: 'underarm seam: sleeve 3' },
  { code: 'P6', x: 127, y: 245, note: 'breast-pocket placement on front 1' },
  { code: 'P7', x: 183, y: 558, note: 'lower-pocket placement on front 1' },
  { code: 'G', x: 610, y: 606, note: 'collar outer edge: collar 4' },
  { code: 'H', x: 145, y: 745, note: 'hem: front 1' },
  { code: 'H', x: 490, y: 517, note: 'hem: sleeve 3' },
  { code: 'H', x: 790, y: 745, note: 'hem: back 2' },
  { code: 'BH', x: 40, y: 386, note: 'buttonhole position: front 1' },
]

const key = [
  ['A', 'Shoulder', '1 front + 2 back', 'FF'],
  ['B', 'Side seam', '1 front + 2 back', 'FF'],
  ['C', 'Armhole and sleeve cap', '1 front + 2 back + 3 sleeve', 'SS'],
  ['D', 'Neckline and collar', '1 front + 2 back + 4 collar', 'SS'],
  ['E', 'Front edge and facing', '1 front + 5 facing', 'SS'],
  ['F', 'Sleeve underarm', '3 sleeve, sewn to itself', 'FF'],
  ['G', 'Collar outer edge', 'two layers of 4 collar', 'SS'],
  ['H', 'Coat and sleeve hems', '1 front + 2 back + 3 sleeve', 'TS'],
  ['P6', 'Breast-pocket mark', 'piece 6 on left front 1', 'TS'],
  ['P7', 'Lower-pocket marks', 'piece 7 on both fronts 1', 'TS'],
  ['BH', 'Buttonhole marks', 'front 1', 'BH'],
]

const stitchKey = [
  ['FF', 'Flat-felled', 'Straight-stitch the join, fold one allowance over the other, then topstitch it down.'],
  ['SS', 'Straight seam', 'One straight-stitch join; finish the raw allowances as the step directs.'],
  ['TS', 'Topstitch', 'Visible straight stitching close to a folded edge or pocket edge.'],
  ['BH', 'Buttonhole', 'Use the machine buttonhole stitch at the marked opening positions.'],
]

function StitchSymbol({ type }) {
  return <svg className={`stitch-symbol stitch-symbol-${type.toLowerCase()}`} viewBox="0 0 46 18" aria-hidden="true">
    {type === 'BH' ? <><rect x="14" y="2" width="18" height="14" rx="7" /><path d="M23 4 V14" /></> : <>
      <path d="M2 5 H44" />
      {type === 'FF' && <path d="M2 13 H44" />}
      {type === 'TS' && <path className="stitch-edge" d="M2 13 H44" />}
    </>}
  </svg>
}

export default function AnnotatedPatternPreview({ src }) {
  return <section className="annotated-pattern" aria-labelledby="pattern-map-title">
    <div className="annotated-pattern-heading">
      <div>
        <p className="design-eyebrow">Chore coat · default pattern</p>
        <h2 id="pattern-map-title">Pattern map</h2>
      </div>
      <p>Numbers identify cut pieces. Letters match seam lines; P6 and P7 mark pocket positions. The key pairs each line with its stitch type.</p>
    </div>
    <div className="annotated-pattern-layout">
      <div className="annotated-pattern-image">
        <img src={src} alt="Chore coat pattern pieces 1 to 7, with seam lines and pocket placement marks" />
        <svg viewBox="0 0 1000 938" role="img" aria-label="Seam codes A to H, pocket marks P6 and P7, and buttonhole marks over the numbered pattern layout">
          {marks.map((mark, i) => <g key={`${mark.code}-${i}`} transform={`translate(${mark.x} ${mark.y})`}>
            <title>{mark.code}: {mark.note}</title>
            <circle r={mark.code.length > 1 ? 14 : 12} />
            <text textAnchor="middle" dominantBaseline="central">{mark.code}</text>
          </g>)}
        </svg>
      </div>
      <div className="annotated-pattern-key" aria-label="Pattern map key">
        {key.map(([code, seam, pieces, stitch]) => <div key={code} className="annotated-pattern-key-row">
          <span className="annotated-pattern-code">{code}</span>
          <span><strong>{seam}</strong><small>{pieces}</small><small className="annotated-pattern-stitch">{stitch} · {stitchKey.find(([id]) => id === stitch)[1]}</small></span>
        </div>)}
      </div>
    </div>
    <div className="stitch-legend" aria-label="Stitch type legend">
      <h3>Stitch legend</h3>
      <div className="stitch-legend-items">{stitchKey.map(([code, name, detail]) => <div className="stitch-legend-item" key={code}>
        <StitchSymbol type={code} />
        <span><strong>{code} · {name}</strong><small>{detail}</small></span>
      </div>)}</div>
    </div>
    <p className="annotated-pattern-note">Preview at the default options, size 38, with seam allowance. Stitch types describe this proposed construction. Use the exported PDF or SVG for cutting; these stitch codes are currently shown on the page map only.</p>
  </section>
}
