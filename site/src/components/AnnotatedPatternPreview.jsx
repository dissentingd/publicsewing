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
]

const key = [
  ['A', 'Shoulder', '1 front + 2 back'],
  ['B', 'Side seam', '1 front + 2 back'],
  ['C', 'Armhole and sleeve cap', '1 front + 2 back + 3 sleeve'],
  ['D', 'Neckline and collar', '1 front + 2 back + 4 collar'],
  ['E', 'Front edge and facing', '1 front + 5 facing'],
  ['F', 'Sleeve underarm', '3 sleeve, sewn to itself'],
  ['P6', 'Breast-pocket mark', '6 pocket on 1 front'],
  ['P7', 'Lower-pocket marks', '7 pockets on both 1 fronts'],
]

export default function AnnotatedPatternPreview({ src }) {
  return <section className="annotated-pattern" aria-labelledby="pattern-map-title">
    <div className="annotated-pattern-heading">
      <div>
        <p className="design-eyebrow">Chore coat · default pattern</p>
        <h2 id="pattern-map-title">Pattern map</h2>
      </div>
      <p>Numbers identify cut pieces. Letters match seam lines; P6 and P7 mark pocket positions. Follow the same codes in Construction below.</p>
    </div>
    <div className="annotated-pattern-layout">
      <div className="annotated-pattern-image">
        <img src={src} alt="Chore coat pattern pieces 1 to 7, with seam lines and pocket placement marks" />
        <svg viewBox="0 0 1000 938" role="img" aria-label="Seam codes A to F and pocket marks P6 and P7 over the numbered pattern layout">
          {marks.map((mark, i) => <g key={`${mark.code}-${i}`} transform={`translate(${mark.x} ${mark.y})`}>
            <title>{mark.code}: {mark.note}</title>
            <circle r={mark.code.length > 1 ? 14 : 12} />
            <text textAnchor="middle" dominantBaseline="central">{mark.code}</text>
          </g>)}
        </svg>
      </div>
      <div className="annotated-pattern-key" aria-label="Pattern map key">
        {key.map(([code, seam, pieces]) => <div key={code} className="annotated-pattern-key-row">
          <span className="annotated-pattern-code">{code}</span>
          <span><strong>{seam}</strong><small>{pieces}</small></span>
        </div>)}
      </div>
    </div>
    <p className="annotated-pattern-note">Preview at the default options, size 38, with seam allowance. Use the exported PDF or SVG for cutting; this map is for finding pieces and matching seams.</p>
  </section>
}
