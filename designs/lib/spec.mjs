// Build a FreeSewing design from a spec (YAML): a block, options, and pieces made by named
// operations. See chore-coat/spec.yaml for the format.
//
// Expressions (lib/expr.mjs) in a spec read names in this order: the piece's `let` values and
// the operation's own earlier arguments; measurements; options; `coat.<key>` from the store;
// `<landmark>.x` / `.y` (standard names, mapped through the block's `landmarks`).
import { Design, hidePresets, pctBasedOn } from '@freesewing/core'
import { evaluate } from './expr.mjs'
import { flagMeasurements } from './checks.mjs'
import {
  bodyOptions,
  bodyMeasurements,
  draftCoatBack,
  draftCoatFront,
  draftCollar,
  draftShawl,
  draftNotchLapel,
  draftBackVent,
  placeButtons,
  placeZip,
  facingPart,
  backNeckFacingPart,
  frontLiningPart,
  backLiningPart,
  sleevePart,
  cuffPart,
  adaptedCredit,
} from './coat.mjs'
import { markPocket, pocketPart, flapPart, beltPart, setInPocketPart } from './pockets.mjs'
import { applyRaglan, raglanSleevePart } from './raglan.mjs'
import { backYokeCut, backPanelPart, frontYokeCut, frontPanelPart } from './panels.mjs'
import { hoodPart } from './hood.mjs'
import {
  draftBody3Back,
  draftBody3Front,
  sideBodyPart, body3SkirtPart,
  libraryPart,
  weltPart,
  weltBagPart,
  body3FrontLiningPart,
  body3BackLiningPart,
} from './body3.mjs'
import { topsleeve, undersleeve } from '@freesewing/library'
import {
  yokeOptions,
  yokeMeasurements,
  draftYokeSide,
  yokePiecePart,
  yokeSleevePart,
  sleeveBandPart,
  sleevePlacketPart,
  placketPart,
  neckBandPart,
  sailorCollarPart,
} from './yoke.mjs'
import { brian } from '../blocks/brian.mjs'
import { bent } from '../blocks/bent.mjs'
import { titan } from '../blocks/titan.mjs'
import { breanna } from '../blocks/breanna.mjs'
import { sarah } from '../blocks/sarah.mjs'
import { bella } from '../blocks/bella.mjs'
import { bibi } from '../blocks/bibi.mjs'
import { noble } from '../blocks/noble.mjs'
import { ribPart } from './rib.mjs'
import { brandPart } from './knit.mjs'
import { draftSkirtLayout, gorePart, goreFacingPart, culottePart, draftCircularLayout, circularPart, draftTunicLayout, tunicPart } from './skirt.mjs'
import { draftGatheredLeg, legBandPart, draftTrouserLeg, stripPart, legInOnePart } from './trousers.mjs'
import { draftJacketBase, draftJacketLayout, draftBoxLayout, jacketPanelPart, flyPart } from './jacket.mjs'
import { draftSuitBody, suitPiecePart, polygonPart } from './flat.mjs'
import { draftCapeBase, draftJacketCapeBase, draftCapeLayout, draftDolmanLayout, capePart } from './cape.mjs'
import { draftKiltLayout, kiltApronPart, kiltPleatsPart } from './kilt.mjs'

const blocks = { brian, bent, titan, breanna, sarah, bella, bibi, noble }
/** FreeSewing library parts a piece can use as is (`part: library`) */
const libraryParts = { topsleeve, undersleeve }

/**
 * Operations a piece's `ops` list can run, in order, inside its draft. `literal` arguments are
 * taken as written (not evaluated); `options` and `measurements` are added to the piece.
 */
export const operations = {
  coatBack: { run: draftCoatBack, options: bodyOptions, measurements: bodyMeasurements },
  coatFront: { run: draftCoatFront },
  buttons: { run: placeButtons },
  // A zip up the front edge (after coatFront)
  zip: { run: placeZip },
  collar: { run: draftCollar, literal: ['key', 'title'] },
  markPocket: { run: (sh, { id, pocket }) => markPocket(sh, id, pocket), literal: ['id'] },
  store: { run: ({ store }, { key, value }) => store.set(key, value), literal: ['key'] },
  // A block's piece as it is, with our title in place of its own and no logo (Bibi's pieces)
  brand: { run: brandPart, literal: ['title'] },
  // Cut the back or front along its raglan line (after coatBack / coatFront)
  raglan: { run: (sh, { which, ...rest }) => applyRaglan(sh, which, rest), literal: ['which'] },
  // A shawl collar cut in one with the front (after coatFront with a neckY)
  shawl: { run: draftShawl },
  // A notched lapel and gorge on a round-necked front (after coatFront, no neckY)
  lapel: { run: draftNotchLapel },
  // A back vent and CB seam (after coatBack)
  backVent: { run: draftBackVent },
  // A yoke garment's back or front (lib/yoke.mjs), drafted into the store on a hidden base
  yokeSide: {
    run: (sh, { side }) => draftYokeSide(sh, side),
    literal: ['side'],
    options: yokeOptions,
    measurements: yokeMeasurements,
  },
  // A full leg gathered into a band, on Titan's back or front (lib/trousers.mjs)
  gatheredLeg: { run: draftGatheredLeg, literal: ['which'] },
  // A tailored leg on Titan's back or front: waist dart, tapered and curved hem, fly, pockets
  trouserLeg: { run: draftTrouserLeg, literal: ['which', 'dartFrom'] },
  // Princess-seamed jackets on Breanna (lib/jacket.mjs): each base read in, then cut into panels
  jacketBase: { run: draftJacketBase, literal: ['side', 'style'] },
  boxLayout: { run: draftBoxLayout, literal: ['sleeveStore'] },
  jacketLayout: { run: draftJacketLayout, literal: ['sleeveStore'] },
  // A three-piece body (lib/body3.mjs): back panel, then the forepart
  body3Back: { run: draftBody3Back },
  body3Front: { run: draftBody3Front },
  // Mark a coat back's yoke line, before cutting it into panels (lib/panels.mjs)
  backYokeCut: { run: backYokeCut },
  // Mark a coat front's yoke seam, before cutting it into front panels
  frontYokeCut: { run: frontYokeCut },
  // A marked line (placement for a belt, a pocket mouth...) from [x, y] to [x, y]
  markLine: {
    run: ({ paths, Path, Point }, { id, from, to, class: cls }) => {
      paths[id] = new Path().move(new Point(...from)).line(new Point(...to)).addClass(cls)
    },
    literal: ['id', 'class'],
  },
  // A flat-cut one-piece suit's body (lib/flat.mjs): no block, sizes from measurements, into `suit.*`
  suitBody: {
    run: draftSuitBody,
    measurements: ['chest', 'seat', 'biceps', 'neck', 'hpsToWaistBack', 'waistToFloor', 'waistToUpperLeg', 'shoulderToWrist', 'shoulderToShoulder'],
  },
  // Gored skirt (lib/skirt.mjs): the gores laid out on Sarah's base, into `skirt.*`
  skirtLayout: { run: draftSkirtLayout },
  // A wrap kilt (lib/kilt.mjs): aprons and pleated lengths, into `kilt`
  kiltLayout: { run: draftKiltLayout },
  // Circular skirt (lib/skirt.mjs): a fan slashed and spread from above the seat line, into `skirt.circular`
  circularLayout: { run: draftCircularLayout },
  tunicLayout: { run: draftTunicLayout, measurements: ['waist', 'seat'] },
  // A cape (lib/cape.mjs): the block's neck and shoulder into `cape.raw.<which>`, then laid out
  capeBase: { run: draftCapeBase, literal: ['which'] },
  jacketCapeBase: { run: draftJacketCapeBase, literal: ['which'] },
  capeLayout: { run: draftCapeLayout },
  dolmanLayout: { run: draftDolmanLayout },
  // Change the piece's cutting (e.g. a waistcoat back cut twice from lining)
  cutlist: {
    run: ({ store }, { cut, from, onFold = false }) => store.cutlist.setCut({ cut, from, onFold }),
    literal: ['from'],
  },
  // Leave the piece out (with `if:`); the piece's later operations don't run
  hidePiece: {
    run: ({ macro, part }) => {
      macro('rmtitle')
      part.hide()
      return STOP
    },
  },
}
const STOP = Symbol('stop')

/** `enabled(options)` for a factory piece's `if:` expression (true without one) */
const enabledBy = (cond) => (o) => cond === undefined || Boolean(evaluate(cond, optionLookup(o)))
const optionLookup = (o) => (name) => {
  if (name in o) return o[name]
  throw new Error(`unknown option "${name}"`)
}

/** Pieces made whole by a library part factory instead of `ops` */
const factories = {
  facing: (p, ctx) => facingPart({ name: p.name, from: ctx.parts[p.from], nr: p.nr }),
  backNeckFacing: (p, ctx) =>
    backNeckFacingPart({
      name: p.name,
      from: ctx.parts[p.from],
      nr: p.nr,
      width: (sh) => evaluate(p.width, lookupIn(sh, ctx.block, {})),
      enabled: enabledBy(p.if),
    }),
  sleeve: (p, ctx) =>
    sleevePart({
      name: p.name,
      after: ctx.after(p),
      options: ctx.options(p),
      enabled: enabledBy(p.if),
      lining: p.lining === undefined ? false : enabledBy(p.lining),
      ...(p.slit === undefined ? {} : { slit: (sh) => evaluate(p.slit, lookupIn(sh, ctx.block, {})) }),
    }),
  // A Brian coat's lining: the front (from the front) and the back (from the back, below a
  // back-neck facing `width` deep, the same expression as that facing's), `pleat` extra at CB
  frontLining: (p, ctx) =>
    frontLiningPart({ name: p.name, from: ctx.parts[p.from], after: ctx.after(p), nr: p.nr, enabled: enabledBy(p.if) }),
  backLining: (p, ctx) =>
    backLiningPart({
      name: p.name,
      from: ctx.parts[p.from],
      after: ctx.after(p),
      nr: p.nr,
      pleat: (sh) => evaluate(p.pleat, lookupIn(sh, ctx.block, {})),
      width: (sh) => evaluate(p.width, lookupIn(sh, ctx.block, {})),
      enabled: enabledBy(p.if),
    }),
  flap: (p, ctx) =>
    flapPart({ name: p.name, after: ctx.after(p), key: p.key, nr: p.nr, label: p.label, cut: p.cut, enabled: enabledBy(p.if) }),
  belt: (p, ctx) => beltPart({ name: p.name, after: ctx.after(p), piece: p.piece, nr: p.nr, enabled: enabledBy(p.if) }),
  raglanSleeve: (p, ctx) =>
    raglanSleevePart({ name: p.name, after: ctx.after(p), which: p.which, nr: p.nr, options: ctx.options(p), enabled: enabledBy(p.if) }),
  // One panel of a back cut across the body; `from` is the hidden whole back
  backPanel: (p, ctx) =>
    backPanelPart({
      name: p.name,
      from: ctx.parts[p.from],
      panel: p.panel,
      nr: p.nr,
      label: p.label,
      args: (sh) => evalMap({ pleat: p.pleat, pleatAt: p.pleatAt, pleats: p.pleats, spacing: p.spacing, vent: p.vent }, lookupIn(sh, ctx.block, {}), {}),
      lining: p.lining === undefined ? () => false : enabledBy(p.lining),
    }),
  // One panel of a front cut by frontYokeCut; `from` is the hidden whole front, `keep` names
  // marks drawn on it (a pocket mouth) that the lower panel keeps
  frontPanel: (p, ctx) =>
    frontPanelPart({
      name: p.name,
      from: ctx.parts[p.from],
      panel: p.panel,
      nr: p.nr,
      label: p.label,
      keep: p.keep,
      args: (sh) => evalMap({ pleat: p.pleat, pleatAt: p.pleatAt, pleats: p.pleats, spacing: p.spacing }, lookupIn(sh, ctx.block, {}), {}),
      lining: p.lining === undefined ? () => false : enabledBy(p.lining),
    }),
  // A two-piece hood (lib/hood.mjs) sewn to the neckline; its sizes are expressions
  hood: (p, ctx) =>
    hoodPart({
      name: p.name,
      after: ctx.after(p),
      nr: p.nr,
      options: ctx.options(p),
      size: (sh) =>
        evalMap(
          { target: p.target, spring: p.spring, height: p.height, lean: p.lean, depth: p.depth, corner: p.corner, casing: p.casing },
          lookupIn(sh, ctx.block, {}),
          {},
        ),
      enabled: enabledBy(p.if),
      lining: p.lining === undefined ? () => false : enabledBy(p.lining),
    }),
  // Yoke garments (lib/yoke.mjs): a body or yoke piece cut from a base, sleeve, band, placket
  yokePiece: (p, ctx) =>
    yokePiecePart({ name: p.name, after: ctx.after(p), side: p.side, piece: p.piece, nr: p.nr, label: p.label, cut: p.cut }),
  yokeSleeve: (p, ctx) => yokeSleevePart({ name: p.name, after: ctx.after(p), nr: p.nr }),
  sleeveBand: (p, ctx) => sleeveBandPart({ name: p.name, after: ctx.after(p), nr: p.nr }),
  sleevePlacket: (p, ctx) => sleevePlacketPart({ name: p.name, after: ctx.after(p), nr: p.nr, width: p.width, storeKey: p.store }),
  // A shirt's cuff (lib/coat.mjs): { length, depth, lap }
  cuff: (p, ctx) =>
    cuffPart({
      name: p.name,
      after: ctx.after(p),
      nr: p.nr,
      size: (sh) => evalMap({ length: p.length, depth: p.depth, lap: p.lap }, lookupIn(sh, ctx.block, {}), {}),
      enabled: enabledBy(p.if),
    }),
  placket: (p, ctx) => placketPart({ name: p.name, after: ctx.after(p), nr: p.nr }),
  neckBand: (p, ctx) => neckBandPart({ name: p.name, after: ctx.after(p), nr: p.nr }),
  // A sailor collar on a yoke garment's V neck: `depth` below the CB neck, `width` out from CB
  sailorCollar: (p, ctx) =>
    sailorCollarPart({ name: p.name, after: ctx.after(p), nr: p.nr, size: (sh) => evalMap({ depth: p.depth, width: p.width }, lookupIn(sh, ctx.block, {}), {}), enabled: enabledBy(p.if) }),
  legBand: (p, ctx) =>
    legBandPart({ name: p.name, after: ctx.after(p), nr: p.nr, size: (sh) => evalMap({ length: p.length, width: p.width }, lookupIn(sh, ctx.block, {}), {}), enabled: enabledBy(p.if) }),
  // A trouser leg cut in one, back and front joined on their straight outseam (trouserLeg's
  // straightOutseam on both)
  legInOne: (p, ctx) =>
    legInOnePart({
      name: p.name,
      after: ctx.after(p),
      nr: p.nr,
      // A drop front: { below, centre, buttons, inset }, expressions
      ...(p.fall === undefined ? {} : { fall: (sh) => evalMap(p.fall, lookupIn(sh, ctx.block, {}), {}) }),
    }),
  // A plain rectangle (waistband, fly shield, belt loops): `length`, `width`, `fold`, `cut`
  strip: (p, ctx) =>
    stripPart({
      name: p.name,
      after: ctx.after(p),
      nr: p.nr,
      label: p.label ?? p.name.split('.').pop(),
      cut: p.cut ?? 1,
      fold: p.fold ?? false,
      material: p.material ?? 'fabric',
      enabled: enabledBy(p.if),
      size: (sh) => evalMap({ length: p.length, width: p.width }, lookupIn(sh, ctx.block, {}), {}),
      ...(p.options ? { options: ctx.options(p) } : {}),
    }),
  // A gored skirt's gore (`index` 0: the front panel), from skirtLayout; `zip` marks the CB zip's end
  gore: (p, ctx) =>
    gorePart({
      name: p.name,
      after: ctx.after(p),
      index: p.index,
      nr: p.nr,
      label: p.label ?? p.name.split('.').pop(),
      zip: (sh) => (p.zip === undefined ? 0 : evaluate(p.zip, lookupIn(sh, ctx.block, {}))),
      // Pleat underlays below the seat line: { style (literal or an expression), hip, hem, if }
      ...(p.pleat === undefined
        ? {}
        : {
            pleat: (sh) => {
              const look = lookupIn(sh, ctx.block, {})
              if (p.pleat.if !== undefined && !evaluate(p.pleat.if, look)) return null
              return { style: evaluate(p.pleat.style, look), hip: evaluate(p.pleat.hip, look), hem: evaluate(p.pleat.hem, look) }
            },
          }),
    }),
  // The facing for a gore's rise above the waist (`index`), from skirtLayout's `riseHeight`
  goreFacing: (p, ctx) => goreFacingPart({ name: p.name, after: ctx.after(p), index: p.index, nr: p.nr, label: p.label ?? p.name.split('.').pop() }),
  kiltApron: (p, ctx) => kiltApronPart({ name: p.name, after: ctx.after(p), nr: p.nr, label: p.label }),
  kiltPleats: (p, ctx) => kiltPleatsPart({ name: p.name, after: ctx.after(p), nr: p.nr, label: p.label }),
  // A divided skirt's front or back (`which`), optionally targeting `index`: `crotch`, `ext`, `zip`
  culotte: (p, ctx) =>
    culottePart({
      name: p.name,
      after: ctx.after(p),
      which: p.which,
      index: p.index,
      nr: p.nr,
      size: (sh) => evalMap({ crotch: p.crotch, ext: p.ext }, lookupIn(sh, ctx.block, {}), {}),
      zip: (sh) => (p.zip === undefined ? 0 : evaluate(p.zip, lookupIn(sh, ctx.block, {}))),
    }),
  // A skirt in one piece on a body3 body cut off above the seat line: `length`, `lean`, `round`, `facing`;
  // `tailAt`, `tailWidth` (both > 0): cut away in front to a tail
  body3Skirt: (p, ctx) =>
    body3SkirtPart({
      name: p.name,
      after: ctx.after(p),
      nr: p.nr,
      options: ctx.options(p),
      lining: p.lining ?? false,
      enabled: enabledBy(p.if),
      size: (sh) =>
        evalMap({ length: p.length, lean: p.lean, round: p.round, facing: p.facing, pocketLen: p.pocketLen ?? 0, pocketBelow: p.pocketBelow ?? 0, pocketAt: p.pocketAt ?? 0, pocketFlap: p.pocketFlap ?? 0, tailAt: p.tailAt ?? 0, tailWidth: p.tailWidth ?? 0 }, lookupIn(sh, ctx.block, {}), {}),
    }),
  // A cape's piece (`which`: front, back or whole), from capeLayout: `count`, `spacing` its buttons
  cape: (p, ctx) =>
    capePart({
      name: p.name,
      after: ctx.after(p),
      which: p.which,
      nr: p.nr,
      enabled: enabledBy(p.if),
      buttons: (sh) => (p.count === undefined ? { count: 0 } : evalMap({ count: p.count, spacing: p.spacing }, lookupIn(sh, ctx.block, {}), {})),
    }),
  // A circular skirt's front or back (`which`), from circularLayout: `zip`
  circular: (p, ctx) =>
    circularPart({
      name: p.name,
      after: ctx.after(p),
      which: p.which,
      nr: p.nr,
      zip: (sh) => (p.zip === undefined ? 0 : evaluate(p.zip, lookupIn(sh, ctx.block, {}))),
    }),
  tunic: (p, ctx) => tunicPart({ name: p.name, after: ctx.after(p), nr: p.nr }),
  // `material` (default fabric); `lining:` an expression over options, when true it's cut in lining too
  jacketPanel: (p, ctx) =>
    jacketPanelPart({
      name: p.name,
      after: ctx.after(p),
      panel: p.panel,
      nr: p.nr,
      label: p.label,
      cut: p.cut,
      buttons: p.buttons,
      material: p.material,
      lining: p.lining === undefined ? false : enabledBy(p.lining),
      enabled: enabledBy(p.if),
    }),
  // A jacket's fly-front button strip: `width` x the lap (lib/jacket.mjs)
  fly: (p, ctx) => flyPart({ name: p.name, after: ctx.after(p), nr: p.nr, label: p.label, width: (sh) => evaluate(p.width ?? 1.5, lookupIn(sh, ctx.block, {})), enabled: enabledBy(p.if) }),
  sideBody: (p, ctx) =>
    sideBodyPart({ name: p.name, after: ctx.after(p), nr: p.nr, lining: p.lining === undefined ? false : enabledBy(p.lining) }),
  // A three-piece body's lining (lib/body3.mjs): as frontLining and backLining; the front's
  // `pocket` is an inside breast pocket's opening length (0: none)
  body3FrontLining: (p, ctx) =>
    body3FrontLiningPart({
      name: p.name,
      from: ctx.parts[p.from],
      after: ctx.after(p),
      nr: p.nr,
      pocket: p.pocket === undefined ? undefined : (sh) => evaluate(p.pocket, lookupIn(sh, ctx.block, {})),
      enabled: enabledBy(p.if),
    }),
  body3BackLining: (p, ctx) =>
    body3BackLiningPart({
      name: p.name,
      from: ctx.parts[p.from],
      after: ctx.after(p),
      nr: p.nr,
      pleat: (sh) => evaluate(p.pleat, lookupIn(sh, ctx.block, {})),
      width: (sh) => evaluate(p.width, lookupIn(sh, ctx.block, {})),
      enabled: enabledBy(p.if),
    }),
  library: (p, ctx) =>
    libraryPart({
      name: p.name,
      from: libraryParts[p.from],
      after: ctx.after(p),
      options: ctx.options(p),
      lining: p.lining === undefined ? false : enabledBy(p.lining),
      // A sleeve vent: { if, length, width, buttons } (lib/body3.mjs sleeveVent)
      vent:
        p.vent === undefined
          ? undefined
          : (sh) => {
              const look = lookupIn(sh, ctx.block, {})
              if (p.vent.if !== undefined && !evaluate(p.vent.if, look)) return null
              return { length: evaluate(p.vent.length, look), width: evaluate(p.vent.width, look), buttons: evaluate(p.vent.buttons ?? 0, look) }
            },
    }),
  // Welt pockets: `store` names the store key (blouse.welts unless given)
  welt: (p, ctx) => weltPart({ name: p.name, after: ctx.after(p), key: p.key, nr: p.nr, store: p.store, enabled: enabledBy(p.if) }),
  weltBag: (p, ctx) => weltBagPart({ name: p.name, after: ctx.after(p), key: p.key, nr: p.nr, store: p.store, enabled: enabledBy(p.if) }),
  pocket: (p, ctx) =>
    pocketPart({ name: p.name, after: ctx.after(p), key: p.key, nr: p.nr, label: p.label, cut: p.cut, enabled: enabledBy(p.if) }),
  // A flat-cut suit's sleeve, gussets, pockets, facing or collar band (`piece`), from suitBody
  suitPiece: (p, ctx) =>
    suitPiecePart({ name: p.name, after: ctx.after(p), piece: p.piece, nr: p.nr, label: p.label, enabled: enabledBy(p.if) }),
  // A straight-edged piece from its corners (`points`, `allowance`, `fold`, marks), after `let`
  polygon: (p, ctx) =>
    polygonPart({
      name: p.name,
      after: ctx.after(p),
      nr: p.nr,
      label: p.label,
      cut: p.cut ?? 1,
      material: p.material ?? 'fabric',
      enabled: enabledBy(p.if),
      shape: (sh) =>
        evalMap(
          { ...p.let, points: p.points, allowance: p.allowance, fold: p.fold, notches: p.notches, buttons: p.buttons, buttonholes: p.buttonholes, lines: p.lines },
          lookupIn(sh, ctx.block, {}),
          {},
        ),
    }),
  // A rib band or cuff (`edge`, `stretch`, `height`, `round`), sized from the edge it finishes
  rib: (p, ctx) =>
    ribPart({
      name: p.name,
      after: ctx.after(p),
      nr: p.nr,
      label: p.label,
      cut: p.cut ?? 1,
      material: p.material ?? 'ribbing',
      enabled: enabledBy(p.if),
      shape: (sh) => evalMap({ ...p.let, edge: p.edge, stretch: p.stretch, height: p.height, round: p.round }, lookupIn(sh, ctx.block, {}), {}),
    }),
  // A set-in flap pocket's flap, jet or bag (`jacket.pockets`, from boxLayout)
  setInPocket: (p, ctx) =>
    setInPocketPart({ name: p.name, after: ctx.after(p), key: p.key, piece: p.piece, nr: p.nr, label: p.label, enabled: enabledBy(p.if) }),
}

/** Name lookup for expressions inside a part's draft */
function lookupIn(sh, block, local) {
  const { points, measurements, options, store } = sh
  const landmarks = block?.landmarks ?? {}
  return (name) => {
    if (name in local) return local[name]
    const [head, ...rest] = name.split('.')
    if (!rest.length) {
      // `in` first: reading a missing name logs a FreeSewing warning
      if (head in measurements && measurements[head] !== undefined) return measurements[head]
      if (head in options && options[head] !== undefined) return options[head]
    } else if (head === 'coat' || head === 'trousers' || head === 'skirt' || head === 'kilt' || head === 'suit' || head === 'polygon' || head === 'yoke' || head === 'rib') return store.get(name)
    // A value the block stores under its own name (Bibi's `neckSizeBack`): `block.<key>`
    else if (head === 'block') return store.get(rest.join('.'))
    else {
      // A landmark names one point, or a list when the block's parts name it differently (Bella's
      // back has `waistSide`, its front `sideHem`): the first this part has
      const p = points[[landmarks[head] ?? head].flat().find((n) => n in points) ?? head]
      if (p && rest.length === 1 && (rest[0] === 'x' || rest[0] === 'y')) return p[rest[0]]
    }
    throw new Error(`unknown name "${name}"`)
  }
}

/**
 * Evaluate a map's values in order; each value can use the ones before it. A value that comes
 * out null is left out (so a function sees it as not given), and so is a `_name`: a working
 * value for the ones after it.
 */
function evalMap(map, lookup, parent, literal = [], local = Object.create(parent)) {
  const out = {}
  for (const [k, v] of Object.entries(map ?? {})) {
    const value = literal.includes(k) ? v : evalValue(v, lookup, local)
    local[k] = value
    if (value !== null && !k.startsWith('_')) out[k] = value
  }
  return out
}

/** A map with an `if:` that is false comes out null (left out of its parent); so does a list's null item */
function evalValue(v, lookup, local) {
  if (Array.isArray(v)) return v.map((x) => evalValue(x, lookup, local)).filter((x) => x !== null)
  const find = (name) => {
    if (name in local) return local[name]
    // A dotted name can read into an earlier value: `lower.x`
    const [head, ...rest] = name.split('.')
    if (rest.length && head in local) return rest.reduce((o, k) => o?.[k], local[head])
    return lookup(name)
  }
  if (v && typeof v === 'object') {
    const { if: cond, ...rest } = v
    if (cond !== undefined && !evaluate(cond, find)) return null
    return evalMap(rest, lookup, local)
  }
  return evaluate(v, find)
}

/** A spec option ({ pct, min, max, of: chest, menu }) as a FreeSewing option; its label
 * (`title`, `description`, see labels.yaml) is for the site, not FreeSewing */
function option({ of, title, description, ...o }) {
  return of ? { ...o, ...pctBasedOn(of) } : o
}

export function designFromSpec(spec) {
  const block = blocks[spec.block]
  if (!block) throw new Error(`unknown block "${spec.block}"`)
  const allOptions = Object.fromEntries(Object.entries(spec.options ?? {}).map(([k, o]) => [k, option(o)]))
  const parts = {}
  const ctx = {
    block,
    parts,
    after: (p) => {
      const a = [p.after ?? []].flat().map((k) => parts[k])
      return a.length === 1 ? a[0] : a
    },
    // `options: all` takes every option the spec defines
    options: (p) => (p.options === 'all' ? { ...allOptions } : Object.fromEntries((p.options ?? []).map((k) => [k, allOptions[k]]))),
  }

  for (const [key, piece] of Object.entries(spec.pieces)) {
    const p = { ...piece, name: `${piece.prefix ?? spec.about.id}.${piece.name ?? key}` }
    if (p.part) {
      if (!factories[p.part]) throw new Error(`${key}: unknown part type "${p.part}"`)
      parts[key] = factories[p.part](p, ctx)
      // A piece type draws from what the spec's expressions name, so its measurements count too: the
      // site's size picker gives a design only those it declares
      if (p.measurements) parts[key].measurements = [...new Set([...(parts[key].measurements ?? []), ...p.measurements])]
      if (p.options) parts[key].options = { ...parts[key].options, ...ctx.options(p) }
      continue
    }
    const ops = (p.ops ?? []).map((entry) => {
      const [[name, args]] = Object.entries(entry)
      if (!operations[name]) throw new Error(`${key}: unknown operation "${name}"`)
      return { name, args: args ?? {} }
    })
    const part = { name: p.name }
    if (p.from) {
      const [b, bp] = p.from.split('.')
      part.from = blocks[b]?.parts[bp]
      if (!part.from) throw new Error(`${key}: unknown block part "${p.from}"`)
    }
    if (p.after) part.after = ctx.after(p)
    if (p.hide === 'tree') part.hide = hidePresets.HIDE_TREE
    else if (p.hide) part.hide = p.hide // FreeSewing's own form: { self, from, inherited }
    const measurements = [...(p.measurements ?? [])]
    let options = {}
    for (const { name } of ops) {
      options = { ...options, ...operations[name].options }
      for (const m of operations[name].measurements ?? []) if (!measurements.includes(m)) measurements.push(m)
    }
    options = { ...options, ...ctx.options(p) }
    if (measurements.length) part.measurements = measurements
    if (Object.keys(options).length) part.options = options
    part.draft = (sh) => {
      // `if:` an option expression; when false the piece isn't cut (as a block part hides itself:
      // Bibi's sleeve with `sleeves` off)
      if (p.if !== undefined && !enabledBy(p.if)(sh.options)) return sh.part.hide()
      const lookup = lookupIn(sh, block, {})
      // The piece's `let` values (null ones too, so later expressions can test them)
      const local = {}
      evalMap(p.let, lookup, {}, [], local)
      for (const { name, args } of ops) {
        const op = operations[name]
        const { if: cond, ...rest } = args
        if (cond !== undefined && !evalValue(cond, lookup, local)) continue
        if (op.run(sh, evalMap(rest, lookup, local, op.literal)) === STOP) break
      }
      return sh.part
    }
    parts[key] = part
  }

  // A test square on its own piece, in every design: printed at 100%, the box is its stated size
  parts.testSquare = {
    name: `${spec.about.id}.testSquare`,
    draft: ({ points, paths, Point, Path, macro, part, store, measurements }) => {
      flagMeasurements({ store, measurements })
      points.scalebox = new Point(0, 0)
      macro('scalebox', {
        at: points.scalebox,
        lead: 'PublicSewing',
        title: spec.about.name,
        text: 'Draft pattern, untested. Print at 100% and measure this box.',
        link: 'publicsewing.org',
      })
      // Printed patterns have no other place for a source's credit that every format keeps
      adaptedCredit(spec.about.source).forEach((line, i) => {
        points[`credit${i}`] = new Point(-51, 34 + i * 5).addText(line, 'text-xs')
      })
      if (adaptedCredit(spec.about.source).length)
        paths.creditSpace = new Path().move(new Point(-51, 30)).line(new Point(58, 46)).hide()
      return part
    },
  }

  return { Design: new Design({ data: spec.about, parts: Object.values(parts) }), parts, about: spec.about }
}
