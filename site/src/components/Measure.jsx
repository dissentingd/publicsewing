// The Measure page: pick a garment, take its measurements one at a time beside an animated figure,
// and enter them as you go. They're kept under the pattern tool's "my measurements", so every design
// offers them. The figures are FreeSewing's, in static/img/measure/ (scripts/fetch-measure-figures.mjs),
// and the pattern tool's measurement help shows them too (MeasureHelp, through
// patches/@freesewing+react+4.10.2.patch). The wording is ours.
import React, { useEffect, useRef, useState } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import useBaseUrl from '@docusaurus/useBaseUrl'
import designs from '@site/src/generated/measurements.json'
import { editorConfig, MY_KEY } from './PatternEditor'

export const guide = {
  chest: ['Chest', 'Around the fullest part of the chest (or bust), under the arms, tape level all round.'],
  highBust: ['High bust', 'Around the chest above the bust, high under the arms and across the shoulder blades.'],
  highBustFront: ['High bust, front', 'The front half of the high bust: from side seam to side seam, under the arms.'],
  bustFront: ['Bust, front', 'The front half of the bust: from side seam to side seam across the fullest part.'],
  bustSpan: ['Bust span', 'Straight across between the two bust points.'],
  waist: ['Waist', 'Around the natural waist, the narrowest part of the torso. Tie a string round it first: other measurements start from it.'],
  waistBack: ['Waist, back', 'The back half of the waist, from side to side.'],
  hips: ['Hips', 'Around the body at the top of the hip bones, where trousers sit.'],
  seat: ['Seat', 'Around the fullest part of the seat (the buttocks), feet together.'],
  seatBack: ['Seat, back', 'The back half of the seat, from side to side.'],
  neck: ['Neck', 'Around the base of the neck, where a shirt collar sits, one finger under the tape.'],
  head: ['Head', 'Around the fullest part of the head, at the height of the forehead.'],
  biceps: ['Biceps', 'Around the fullest part of the upper arm, arm relaxed.'],
  wrist: ['Wrist', 'Around the wrist bone.'],
  knee: ['Knee', 'Around the knee, leg straight.'],
  ankle: ['Ankle', 'Around the leg, just above the ankle.'],
  shoulderToShoulder: ['Shoulder to shoulder', 'Across the back from one shoulder point (the bony tip) to the other.'],
  shoulderSlope: ['Shoulder slope', 'The angle of the shoulder from the neck down to the shoulder point, in degrees. About 13° is typical; under 10° is square, over 18° sloping.'],
  shoulderToWrist: ['Shoulder to wrist', 'From the shoulder point down the outside of the arm to the wrist bone, arm hanging straight.'],
  shoulderToElbow: ['Shoulder to elbow', 'From the shoulder point to the point of the elbow, arm bent a little.'],
  hpsToBust: ['HPS to bust', 'From the high point of the shoulder (where the shoulder meets the neck) straight down to the bust point (or the chest line).'],
  hpsToWaistBack: ['HPS to waist, back', 'From the high point of the shoulder down the back to the waist string.'],
  hpsToWaistFront: ['HPS to waist, front', 'From the high point of the shoulder down the front, over the bust, to the waist string.'],
  waistToArmpit: ['Waist to armpit', 'From the waist string up the side to the armpit.'],
  waistToHips: ['Waist to hips', 'From the waist string down the side to the top of the hip bone (where trousers sit).'],
  waistToSeat: ['Waist to seat', 'From the waist string down the side to the fullest part of the seat.'],
  waistToUpperLeg: ['Waist to upper leg', 'From the waist string down the side to where the leg meets the seat.'],
  waistToKnee: ['Waist to knee', 'From the waist string down the side to the middle of the knee.'],
  waistToFloor: ['Waist to floor', 'From the waist string down the side to the floor, barefoot.'],
  crossSeam: ['Crotch length', 'From the waist at the centre front, between the legs, to the waist at the centre back.'],
  crossSeamFront: ['Crotch length, front', 'The front part of the crotch length: from the centre-front waist to between the legs, under the body.'],
}

const PREFS_KEY = 'publicsewing-measure-prefs'
const defaultPrefs = { figure: 'sarah', units: 'metric' }
const figures = { sarah: 'Sarah', tim: 'Tim' }
const titleOf = (m) => guide[m]?.[0] ?? m

// The designs, by name, each under the id of its page (its editor state is under about.id)
const sorted = Object.entries(designs).sort(([, a], [, b]) => a.name.localeCompare(b.name))
const findDesign = (id) => sorted.find(([key, d]) => key === id || d.editorId === id)?.[0]
const inGuideOrder = (list) => Object.keys(guide).filter((m) => list.includes(m))

/** A measurement's animated figure, or a still one if the device asks for less motion */
function Figure({ m, figure }) {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const name = m.toLowerCase()
  const src = useBaseUrl(`/img/measure/${figure}/${still ? 'still/' : ''}${name}.svg`)
  const background = useBaseUrl(`/img/measure/${figure}-standing.jpg`)
  return (
    <img
      key={`${figure}-${m}`}
      className="measure-figure"
      src={src}
      style={{ backgroundImage: `url(${background})` }}
      alt={`${figures[figure]} being measured: ${titleOf(m)}`}
      width={2000}
      height={1500}
      loading="lazy"
    />
  )
}

function FigureSwitch({ figure, setFigure }) {
  return (
    <div className="measure-switch" role="group" aria-label="Figure">
      {Object.entries(figures).map(([id, label]) => (
        <button
          key={id}
          type="button"
          className={`button button--sm ${figure === id ? 'button--primary' : 'button--secondary'}`}
          aria-pressed={figure === id}
          onClick={() => setFigure(id)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

const round = (v, places) => Math.round(v * 10 ** places) / 10 ** places
const isDegrees = (m) => m === 'shoulderSlope'
const unitOf = (m, units) => (isDegrees(m) ? '°' : units === 'imperial' ? 'in' : 'cm')

/** What's kept (mm, or degrees) as what the visitor reads */
function toText(m, value, units) {
  if (value === undefined) return ''
  if (isDegrees(m)) return String(value)
  return String(units === 'imperial' ? round(value / 25.4, 2) : round(value / 10, 1))
}

/** What the visitor typed as what's kept: null if it isn't a usable number. Inches can be 33 1/2 */
function fromText(m, text, units) {
  const match = text.trim().replace(',', '.').match(/^(?:(\d*\.?\d+)\s+)?(\d*\.?\d+)(?:\/(\d+))?$/)
  if (!match) return null
  if (match[1] !== undefined && match[3] === undefined) return null
  const number = Number(match[1] ?? 0) + Number(match[2]) / Number(match[3] ?? 1)
  if (!(number > 0) || !Number.isFinite(number)) return null
  if (isDegrees(m)) return number < 90 ? number : null
  return round(number * (units === 'imperial' ? 25.4 : 10), 1)
}

function Row({ m, value, units, figure, selected, onSelect, onCommit, onNext, rowRef }) {
  const [text, setText] = useState(() => toText(m, value, units))
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)
  const invalid = text.trim() !== '' && fromText(m, text, units) === null

  // Follow changes from elsewhere (the units switch, the pattern tool in another tab)
  useEffect(() => {
    if (!focused) setText(toText(m, value, units))
  }, [value, units, focused])
  useEffect(() => {
    if (selected && focused === false && document.activeElement?.dataset?.measure) inputRef.current?.focus()
  }, [selected])

  const change = (e) => {
    setText(e.target.value)
    if (e.target.value.trim() === '') onCommit(undefined)
    else {
      const parsed = fromText(m, e.target.value, units)
      if (parsed !== null) onCommit(parsed)
    }
  }
  return (
    <li id={m} ref={rowRef} className={`measure-row${selected ? ' measure-row-selected' : ''}`} onClick={() => onSelect(m)}>
      <div className="measure-row-head">
        <label htmlFor={`measure-${m}`}>
          {value !== undefined && !invalid ? <span className="measure-done" aria-label="Entered">✓ </span> : null}
          {titleOf(m)}
        </label>
        <span className="measure-input">
          <input
            ref={inputRef}
            id={`measure-${m}`}
            data-measure={m}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={text}
            aria-invalid={invalid}
            onChange={change}
            onFocus={() => {
              setFocused(true)
              onSelect(m)
            }}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onNext(m)
              }
            }}
          />
          <span className="measure-unit">{unitOf(m, units)}</span>
        </span>
      </div>
      {invalid ? <p className="measure-invalid">That isn't a number we can use.</p> : null}
      {selected ? (
        <>
          <p className="measure-how">{guide[m]?.[1]}</p>
          <div className="measure-inline">
            <Figure m={m} figure={figure} />
            <FigureSwitch figure={figure} setFigure={onSelect.setFigure} />
          </div>
        </>
      ) : null}
    </li>
  )
}

function Tool() {
  const useLocalStorageState = require('use-local-storage-state').default
  const [mine, setMine] = useLocalStorageState(MY_KEY, { defaultValue: null })
  const [prefs, setPrefs] = useLocalStorageState(PREFS_KEY, { defaultValue: defaultPrefs })
  const { figure, units } = { ...defaultPrefs, ...prefs }
  const setFigure = (id) => setPrefs((p) => ({ ...p, figure: id }))
  const rows = useRef({})

  const params = new URLSearchParams(window.location.search)
  const hash = decodeURIComponent(window.location.hash.slice(1))
  const [designId, setDesignId] = useState(() => findDesign(params.get('for')) ?? '')
  const design = designs[designId]
  const required = design ? inGuideOrder(design.required) : Object.keys(guide)
  const optional = design ? inGuideOrder(design.optional) : []
  const list = [...required, ...optional]

  const firstOpen = (keys) => keys.find((m) => mine?.[m] === undefined) ?? keys[0]
  const [selected, setSelected] = useState(() => (hash && guide[hash] ? hash : firstOpen(required)))
  const showing = list.includes(selected) ? selected : firstOpen(required)

  // Keep the address on what's showing, so it can be shared or come back to. The value stays out of it.
  useEffect(() => {
    const query = designId ? `?for=${designId}` : ''
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${query}#${showing}`)
  }, [designId, showing])
  useEffect(() => {
    if (hash && rows.current[hash]) rows.current[hash].scrollIntoView({ block: 'center' })
  }, [])

  const commit = (m, value) =>
    setMine((cur) => {
      const next = { ...(cur || {}) }
      if (value === undefined) delete next[m]
      else next[m] = value
      return next
    })
  const next = (m) => {
    const after = list[list.indexOf(m) + 1]
    if (!after) return
    setSelected(after)
    document.getElementById(`measure-${after}`)?.focus()
    rows.current[after]?.scrollIntoView({ block: 'nearest' })
  }
  const select = (m) => setSelected(m)
  select.setFigure = setFigure

  const done = required.filter((m) => mine?.[m] !== undefined).length

  // Load them into this design's pattern tool, so that it opens drafted from them
  const useThem = () => {
    const key = editorConfig(design.editorId).stateKey
    let state = {}
    try {
      state = JSON.parse(window.localStorage.getItem(key)) ?? {}
    } catch {
      state = {}
    }
    const measurements = Object.fromEntries(list.filter((m) => mine?.[m] !== undefined).map((m) => [m, mine[m]]))
    window.localStorage.setItem(
      key,
      JSON.stringify({ ...state, view: 'draft', settings: { ...(state.settings ?? {}), units, measurements, metadata: undefined } })
    )
  }

  const rowFor = (m) => (
    <Row
      key={m}
      m={m}
      value={mine?.[m]}
      units={units}
      figure={figure}
      selected={showing === m}
      onSelect={select}
      onCommit={(value) => commit(m, value)}
      onNext={next}
      rowRef={(el) => {
        rows.current[m] = el
      }}
    />
  )

  return (
    <div className="measure-tool">
      <div className="measure-controls">
        <label>
          <strong>What are you making?</strong>{' '}
          <select value={designId} onChange={(e) => setDesignId(e.target.value)}>
            <option value="">Show every measurement</option>
            {sorted.map(([id, d]) => (
              <option key={id} value={id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
        <div className="measure-switch" role="group" aria-label="Units">
          {[['metric', 'cm'], ['imperial', 'inches']].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`button button--sm ${units === id ? 'button--primary' : 'button--secondary'}`}
              aria-pressed={units === id}
              onClick={() => setPrefs((p) => ({ ...p, units: id }))}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="measure-progress" aria-live="polite">
        {done} of {required.length} {design ? `for the ${design.name.toLowerCase()}` : 'entered'}.
        {design ? (
          <>
            {' '}
            <a className={`button button--sm ${done === required.length ? 'button--primary' : 'button--secondary'}`} href={`/designs/${designId}`} onClick={useThem}>
              {done === required.length ? 'Make the pattern with these' : 'Go to the pattern'}
            </a>
          </>
        ) : null}
      </p>

      <div className="measure-panes">
        <div className="measure-list">
          <ul>{required.map(rowFor)}</ul>
          {optional.length ? (
            <>
              <h3>Optional for this garment</h3>
              <ul>{optional.map(rowFor)}</ul>
            </>
          ) : null}
        </div>
        <aside className="measure-side">
          <h3>{titleOf(showing)}</h3>
          <Figure m={showing} figure={figure} />
          <FigureSwitch figure={figure} setFigure={setFigure} />
          <button type="button" className="button button--sm button--secondary" disabled={list.indexOf(showing) === list.length - 1} onClick={() => next(showing)}>
            Next measurement
          </button>
          <p className="measure-credit">
            Figures by <a href="/sources#freesewing">FreeSewing</a>.
          </p>
        </aside>
      </div>
    </div>
  )
}

/** The same words without the tool: what's there before the page's script runs, and for search engines */
function Plain() {
  return (
    <dl>
      {Object.entries(guide).map(([id, [title, how]]) => (
        <React.Fragment key={id}>
          <dt id={id}>{title}</dt>
          <dd>{how}</dd>
        </React.Fragment>
      ))}
    </dl>
  )
}

export function MeasureTool() {
  return <BrowserOnly fallback={<Plain />}>{() => <Tool />}</BrowserOnly>
}

/** The pattern tool's help for one measurement, in place of FreeSewing's page in a frame */
export function MeasureHelp({ m }) {
  const useLocalStorageState = require('use-local-storage-state').default
  const [prefs, setPrefs] = useLocalStorageState(PREFS_KEY, { defaultValue: defaultPrefs })
  const { figure } = { ...defaultPrefs, ...prefs }
  return (
    <div className="measure-help">
      <h3>{titleOf(m)}</h3>
      {guide[m] ? <p>{guide[m][1]}</p> : null}
      <Figure m={m} figure={figure} />
      <FigureSwitch figure={figure} setFigure={(id) => setPrefs((p) => ({ ...p, figure: id }))} />
      <p className="measure-credit">
        <a href={`/measure#${m}`}>All the measurements</a>. Figures by <a href="/sources#freesewing">FreeSewing</a>.
      </p>
    </div>
  )
}
