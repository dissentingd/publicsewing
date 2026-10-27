# Design specs

Every design is `<design>/spec.yaml`, built into a FreeSewing design by `lib/spec.mjs`
(`<design>/src/index.mjs` only loads it). A spec is data: a block, options, and pieces made
by named operations. [chore-coat/spec.yaml](chore-coat/spec.yaml) is the plainest example.

## Top level

| Key | What |
|---|---|
| `about` | The design's data: `id` (prefixes its piece names), `name`, `description`, `difficulty`, `tags`, `techniques`, `version`, `source` (book, figure, corpus folder id). |
| `block` | The FreeSewing block it starts from: `brian`, `bent`, `titan`, `breanna` (`blocks/`). |
| `options` | Every option, with the source's number as its default. `{ pct, min, max, of: chest, menu }` is a percentage (of a measurement with `of`); `{ count, min, max }`, `{ bool }` and `{ dflt, list }` as in FreeSewing. The pattern tool labels options from [labels.yaml](labels.yaml) by name (`npm test` checks every shown option has one); `title:` and `description:` on an option override that label for this design. |
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
| `jacketBase` / `jacketLayout` | A princess-seamed jacket on Breanna: each side read in, then cut along its darts into panels, flared below the waist, with a lap, lapel and gorge. | `lib/jacket.mjs` |
| `boxLayout` | A box body on the same bases (`jacketBase` with `style: box`): back and front, side seams flared from the armholes, the bust dart pivoted into the front neck, lap, lapel, gorge. | `lib/jacket.mjs` |
| `gatheredLeg` | A full leg gathered into a band, elastic waist, on Titan. | `lib/trousers.mjs` |
| `trouserLeg` | A tailored leg on Titan (`which: back` or `front`, `fitKnee` on): a waist dart (`dart`, `dartAt`, `dartLength`, `dartFrom: centre` to take it from Titan's CB shaping), the hem narrowed (`hemWidth`) and curved (`hemSag`), a fly (`fly`, `flyLength`), a side pocket (`pocketTop`, `pocketLength`, `pocketWidth`, `pocketDepth`), a jetted back pocket (`backPocket`, `backPocketBelow`, `backPocketWelt`); `matchOutseam` trues its outseam to the other leg's. Store: `trousers.back` / `trousers.front`, `trousers.pockets`. | `lib/trousers.mjs` |
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
4. `coat.<key>` or `trousers.<key>` from the store (`coat.frontEdge.ext`, `trousers.front.fly`);
5. `<landmark>.x` / `.y`: points on the piece, by their standard name (`underarm`,
   `neckPoint`, `shoulderTip`, `sideSeat`, `sideHem`; mapped to the block's own names in
   `blocks/`) or the block's name (`cfNeck`, `cfWaist`, `armholeHollow`).

A value that comes out `null` is left out (so an operation sees it as not given). A map with
`if:` false is left out. A `_name` entry is a working value: later entries can use it, but it
isn't stored.

## Checking a change

`tools/snapshot.mjs <design> save` before, `compare` after: every point, path, snippet and
stored value at every test size and option variant (`tools/variants.json`) must match.
