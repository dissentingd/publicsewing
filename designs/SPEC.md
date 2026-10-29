# Design specs

Every design is `<design>/spec.yaml`, built into a FreeSewing design by `lib/spec.mjs`
(`<design>/src/index.mjs` only loads it). A spec is data: a block, options, and pieces made
by named operations. [chore-coat/spec.yaml](chore-coat/spec.yaml) is the plainest example.

## Top level

| Key | What |
|---|---|
| `about` | The design's data: `id` (prefixes its piece names), `name`, `description`, `difficulty`, `tags`, `techniques`, `version`, `source` (book, figure, corpus folder id), `preview` (the measurement set of the pattern-pieces preview on its site page, default `cisMaleAdult38`; `tools/preview.mjs`). |
| `block` | The FreeSewing block it starts from: `brian`, `bent`, `titan`, `breanna`, `sarah` (`blocks/`). A flat-cut design (the jumpsuit) names one but drafts no piece from it. |
| `options` | Every option, with the source's number as its default. An option with a block option's name replaces it (the gored skirt sets Sarah's `length`, and hides Sarah's unused options by leaving out `menu`). `{ pct, min, max, of: chest, menu }` is a percentage (of a measurement with `of`); `{ count, min, max }`, `{ bool }` and `{ dflt, list }` as in FreeSewing. The pattern tool labels options from [labels.yaml](labels.yaml) by name (`npm test` checks every shown option has one); `title:` and `description:` on an option override that label for this design. |
| `pieces` | The pattern pieces, in order (below). |
| `extends` | Start from another spec file: its pieces, block and options. This spec's `options` entries are merged into the parent's (`buttons: { count: 5 }` changes only the default); its `pieces` are added, or replace the parent's by key. A parent with no `about` is a template (`templates/`): its pieces take this design's name. |

## Pieces

A piece is either drafted by operations or made by a piece type.

**Drafted:** `from: <block>.<part>` (e.g. `brian.front`) or nothing (a new piece, with
`after: [pieces]` it needs drafted first), then:

| Key | What |
|---|---|
| `hide` | `tree` hides the block's own parts; or FreeSewing's `{ self, from, inherited }`. |
| `measurements` | Measurements it needs beyond what its operations declare. |
| `options` | The spec options it uses (a list), or `all`. |
| `let` | Named values for its operations, worked out in order (`ext: chest * buttonExtension`). |
| `ops` | Operations, run in order: `- <operation>: { arguments }`. Any operation takes `if:`. |

**Piece types** (`part: <type>`, with their own keys): `facing`, `backNeckFacing`, `sleeve`,
`raglanSleeve`, `pocket`, `flap`, `belt`, `backPanel`, `sideBody`, `library`, `welt`,
`weltBag`, `yokePiece`, `yokeSleeve`, `sleeveBand`, `placket`, `neckBand`, `legBand`,
`strip` (a rectangle: `length`, `width` expressions, `fold`, `cut`, `material`, `label`; e.g. a
waistband or fly shield; its size goes to `trousers.strips.<piece>`),
`sailorCollar` (a sailor collar on a yoke garment's V neck, the front's `vNeck` option: `depth` below the CB neck, `width` out from CB; store `yoke.sailorCollar`),
`culotte` (a divided skirt's `which: front` or `back` from a three-gore `skirtLayout`: the centre edge carried to `crotch` mm and out by `ext`, the inseam straight down; `zip`; store `skirt.culotte.<which>`),
`legInOne` (a trouser leg cut in one: the back and front, both drafted with `straightOutseam`, joined on the outseam line; store `trousers.leg`),
`polygon` (a straight-edged piece from its corners: `points` a list of [x, y] expressions, `allowance` per edge in seam allowances, `fold` the index of the edge on the fold, `notches`, `buttons`, `buttonholes`, `lines` (marks), `let` values first, `cut`, `material`, `label`; its edges' lengths go to `polygon.<piece>`),
`suitPiece` (a flat-cut suit's `piece`: `sleeve`, `armGusset`, `crotchGusset`, `facing`, `band`, `breastPocket`, `lowerPocket`, sized by `suitBody`),
`gore` (a gored skirt's gore from `skirtLayout`: `index` 0 is the front panel, on the fold; a gore past the design's count is left out; `zip` an expression, the CB zip's length, notched on the last gore),
`frontLining` and `backLining` (a Brian coat's lining, `from` the front or the back; the back
takes `width:`, its back-neck facing's, and `pleat:`; `sleeve` takes `lining:` too),
`frontPanel` (a front cut by `frontYokeCut`: `panel: yoke` or `lower`, `from` the hidden
whole front; `keep:` marks the lower panel keeps, e.g. `[handPocket]`; `lining:` an expression,
true cuts it again in lining, as `backPanel` takes too), `hood` (`lib/hood.mjs`: a two-piece hood
sewn to the neckline; `target`, `spring`, `height`, `lean`, `depth`, `corner`, `casing` are
expressions, `lining:` an expression), `jacketPanel` (`material:` lining to cut it from lining; `lining:` an expression, true cuts it
again in lining; `library` takes `lining:` too), `setInPocket` (a flap, jet or bag of a set-in
flap pocket from `boxLayout`'s or `jacketLayout`'s `pockets`). `welt` and `weltBag` take
`store:` for a store key other than `blouse.welts` (`jacket.welts`). A piece
type's `if:` is an expression over options; when it is false the piece is left out.

## Operations

| Operation | Does | Library |
|---|---|---|
| `coatBack` / `coatFront` | Coat body on Brian: hem, seat, side seam, waist shaping, stout figures; the front's button stand, front corner, dropped hem, V neck (`neckY`). Both take `armholeCut: { drop, shoulder }` (a sleeveless armhole: lowered, the shoulder shortened by that share) and `dart: { x, top, bottom, width, letOut }` (a waist dart, open at the hem if `bottom` is below it; the side seam let out by `letOut` at most to straight); the front takes `chamfer: true` (the corner `r` cut off straight). | `lib/coat.mjs` |
| `collar` | A turn-down or stand collar, cut on the fold. | `lib/coat.mjs` |
| `shawl` | A shawl collar cut in one with the front. | `lib/coat.mjs` |
| `lapel` | A notched lapel and gorge on a round-necked front (`breakY`, `rollOut`, `gorgeAt`, `width`); the facing then runs to the shoulder. | `lib/coat.mjs`, `lib/lapel.mjs` |
| `backVent` | A back vent and CB seam (`length`, `width`); the back is then cut in pairs. | `lib/coat.mjs` |
| `buttons` | Buttons in rows, evenly from `top` to `bottom`. | `lib/coat.mjs` |
| `zip` | A zip up the front edge, from `top` (the neckline) to `bottom` (the hem); coat checks take it in place of buttons. | `lib/coat.mjs` |
| `raglan` | Cut the back or front along a raglan line. | `lib/raglan.mjs` |
| `backYokeCut` | Mark a coat back's yoke line, to cut it into `backPanel`s (`yoke`, `middle`, `lower`, or `body`: yoke line to hem in one). | `lib/panels.mjs` |
| `frontYokeCut` | Mark a coat front's yoke seam, from the front edge `depth` down to the armhole at `armDepth` (shares of CF neck to the chest line), to cut it into `frontPanel`s. | `lib/panels.mjs` |
| `body3Back` / `body3Front` | A three-piece body (back, side body, forepart) on Bent; the back takes `vent: { length, width }`; the front takes `r` (a rounded front corner), `lapel: { breakY, rollOut, gorgeAt, width }` (a notched lapel) and, per welt, `flap` (a flap this share of the mouth deep, into `coat.pockets` for a `flap` piece). | `lib/body3.mjs` |
| `yokeSide` | A yoke garment's back or front, into the store. | `lib/yoke.mjs` |
| `jacketBase` / `jacketLayout` | A princess-seamed jacket on Breanna: each side read in, then cut along its darts into panels, flared below the waist, with a lap, lapel and gorge. Optional: `underarm: { back, front, backSuppression, frontSuppression }` (an under-arm panel in place of the side seam, its seams leaving the armholes `back`/`front` (0-1) of the way in, taken in at the waist), `cb: { waist, hip }` (a shaped CB seam, in at the waist and at the seat line), `shawl: { width, lapel }` (a shawl collar cut in one with the front, in place of the lapel and collar), `rows` (double-breasted: two rows of buttons this far either side of CF, holes on the outer row; `boxLayout` takes it too). `second: { at, suppression }` (with `underarm`): a second front seam from the side front's shoulder to the hem, splitting it into `middleFront` and `sideFront`. | `lib/jacket.mjs` |
| `boxLayout` | A box body on the same bases (`jacketBase` with `style: box`): back and front, side seams flared from the armholes, the bust dart pivoted into the front neck, lap, lapel, gorge. Optional: `patch: { <id>: { x, y, w, h, shape, topHem, flap } }`, patch pockets from CF and the waist (to `coat.pockets`, for the `pocket` and `flap` pieces), kept clear of the armhole, side seam and hem; `rows`, as `jacketLayout`'s. | `lib/jacket.mjs` |
| `gatheredLeg` | A full leg gathered into a band, elastic waist, on Titan; with `hem` (a depth), no band: a plain hem turned up at `hemY - hem`. | `lib/trousers.mjs` |
| `trouserLeg` | A tailored leg on Titan (`which: back` or `front`, `fitKnee` on): a waist dart (`dart`, `dartAt`, `dartLength`, `dartFrom: centre` to take it from Titan's CB shaping), the hem narrowed (`hemWidth`) and curved (`hemSag`), a fly (`fly`, `flyLength`), a side pocket (`pocketTop`, `pocketLength`, `pocketWidth`, `pocketDepth`), a jetted back pocket (`backPocket`, `backPocketBelow`, `backPocketWelt`); `matchOutseam` trues its outseam to the other leg's. Breeches (with `cuffBelow`): a thigh flare at the outseam (`thighFlare`, `thighAt`), fitted below the knee to `calfW` and `cuffW` round (`calfBelow`, `cuffBelow` under the knee; `share`, this piece's part), an opening at the lower outseam (`openingBelow`, `buttons`, `buttonInset`). `pleats`, `pleatSpacing` (front): the dart laid as pleats at a straight waist (with `dartLength: 0`). `straightOutseam`: the outseam a straight line out past the seat, for a `legInOne` leg; the paths go to `trousers.paths.<which>`. Store: `trousers.back` / `trousers.front`, `trousers.pockets`. | `lib/trousers.mjs` |
| `skirtLayout` | A gored skirt on Sarah's base (`gores`, odd; three is Mitchell's two-piece skirt, with `panelShare` the front's share of the half hip; `panelNarrowing`, `cbShaping`, `panelShaping` for five gores, less with more; `flare`; `frontDrop`): the gores laid on the seat line, the waist shaping as darts on the seams, the same flare at every seam edge. Store: `skirt.gores`, `skirt.count`, `skirt.waist`; the `gore` pieces add `skirt.seams`. | `lib/skirt.mjs` |
| `suitBody` | A flat-cut one-piece suit's body, no block: one piece round the figure, armhole slashes, a V leg slit up the back, neck, button stand, buttons, pocket marks (`width`, `length`, `crotch`, `taper`, `slit`, `neckWidth`, `neckDrop`, `ext`, `opening`, `buttons`, `hem`; maps `sleeve`, `crotchGusset`, `breastPocket`, `lowerPocket`; `facing`, `band`). Store: `suit.body`, `suit.pieces`; the `suitPiece` pieces add `suit.<piece>`. | `lib/flat.mjs` |
| `store` | Put a value in the store (`key: coat.pockets`), e.g. pocket sizes for later pieces. | |
| `markPocket` | Draw a pocket's place on the piece. | `lib/pockets.mjs` |
| `markLine` | Draw a marked line (a belt's place). | |
| `cutlist` | Change the piece's cutting: `cut`, `from` (e.g. `lining`), `onFold`. | |
| `hidePiece` | Leave the piece out (with `if:`); its later operations don't run. | |

## Expressions

Argument values are expressions: numbers, `'strings'`, `null`, `+ - * / ( )`, comparisons
(`== != < <= > >=`), `and`, `or`, `not`, and `min`, `max`, `abs`, `sqrt`, `if(cond, a, b)`. Names are
looked up in this order:

1. the piece's `let` values, then the operation's own earlier arguments (and, in a map, its
   earlier entries: `lower.x`);
2. measurements (`chest`, `waistToSeat`);
3. options (`buttonExtension`, already a fraction);
4. `coat.<key>`, `trousers.<key>`, `skirt.<key>` or `suit.<key>` from the store (`coat.frontEdge.ext`, `trousers.front.fly`, `skirt.waist`);
5. `<landmark>.x` / `.y`: points on the piece, by their standard name (`underarm`,
   `neckPoint`, `shoulderTip`, `sideSeat`, `sideHem`; mapped to the block's own names in
   `blocks/`) or the block's name (`cfNeck`, `cfWaist`, `armholeHollow`).

A value that comes out `null` is left out (so an operation sees it as not given). A map with
`if:` false is left out. A `_name` entry is a working value: later entries can use it, but it
isn't stored.

## Checking a change

`tools/snapshot.mjs <design> save` before, `compare` after: every point, path, snippet and
stored value at every test size and option variant (`tools/variants.json`) must match.
