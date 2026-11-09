# Women's Inverness coat

**Source:** Merz, *Practical Cutting System for Ladies' Jackets and Cloaks* (1911), Diagram XXIV, text
p. 58 (PDF p. 60), plate p. 59 (PDF p. 61), `merzspracticalcu00merz`. The tight back, transferred
shoulder and loose front it refers to are Diagrams XVIII, XXII and XXIII. US 1911, public domain.

**Block:** extends `womens-box-coat` (Breanna, `boxLayout` in `lib/jacket.mjs`): a shaped back, a loose
front with a neck dart, long flared side seams, facing and buttons. For it, `boxLayout` gained
`armholeDrop` and a `closed` front, and `lib/cape.mjs` gained `jacketCapeBase` and the cape's two shoulder
darts.

**Threadloop:** no free Inverness. "Cape coat" finds 60 free patterns (Mood's Coleus Cape Coat and others);
none is a coat with a separate shoulder cape, and nothing says it's drafted from measurements.

**Status:** draft. Not sewn.

## What the source shows
- A loose-fronted, tight-backed, three-quarter Inverness, the turn collar closed in front.
- **Armhole:** lowered 1 in (the line S–T).
- **Cape:** a separate shoulder cape reaching 2 in past the shoulder (point 30 to A), with two ¾ in
  shoulder darts 2 in apart and 2⅝ in long. Its length is to taste. Its front sits ½ in from point 25
  and ¾ in from point 9.
- **Collar:** 3¼ in high, ¼ in spring at its outer edge, its front end 2½ in.
- **Plate:** a long shaped body under the cape.
- **Not given:** pockets, buttons or a sleeve.

## How it maps onto the block
Reference size `cisFemaleAdult36` (Merz drafts a 36 in bust).

| Feature | Merz | Here (option default) |
|---|---|---|
| Armhole | 1 in deeper | `armholeDrop` 2.8% of the chest, the shoulder point fixed |
| Cape past the shoulder | 2 in | `capeShoulderExtension` 5.6% of the chest |
| Cape darts | Two, ¾ in wide, 2 in apart, 2⅝ in long | `capeDartWidth` 2.1%, `capeDartGap` 5.6%, `capeDartLength` 7.3% of the chest |
| Cape length | To taste; the plate's to the upper hip | `capeLength` 57% of the coat's neck to hem, from the plate |
| Coat length | Three-quarter | `lengthBelowWaist` 66% of waist to floor, about 26 in, from the plate |
| Front | Closed, no lapel | `lapelStyle` closed |
| Cape front edge | ¾ in past centre | `buttonExtension` 2.1% of the chest |
| Collar | 3¼ in high, ¼ in spring | `collarWidth` 24% of the neck, `collarSpring` 2% |
| Body flare | Long side seams spreading to the hem | `flare` 4%, `cbFlare` 1.5%, from the plate |
| Ease | Not given | `chestEase` 16%, `seatEase` 12%: ours |
| Buttons | Not given | `buttons` 5, on CF: ours |
| Neck dart | — | `neckDartWidth` 1.8%: ours, to shape the loose front |
| Pockets, sleeves | None | Left out |

**Variant:** `shorter` (Shorter shoulder cape): `capeLength` 42%. Ours.

## Changes and what isn't modelled
- **The body keeps the box coat's side seams.** It doesn't transfer the shoulder as Merz instructs, and
  doesn't reproduce his tighter waist and hip divisions at the back.
- **The lowered armhole** deforms Breanna's curve smoothly, rather than redrawing it from Merz's points.
- **The cape is circular,** an approximation of his sweep. Its darts are marked on the cut piece but don't
  reshape the outer edge.
- **The collar is an even width** with a simple spring, not his separate front and back heights.
- **No sleeves or pockets:** neither is on the plate. The parent's sleeve and pocket pieces are overridden
  with empty pieces, which draft nothing.

## Pieces
Fronts and backs (each cut 2), facings, collar, cape (on the fold). Add a cape facing and interfacing as
preferred.

## Construction
1. Body shoulder and side seams; close the front neck dart; facings to the front edges.
2. Sew the cape's two shoulder darts; finish its hem and front edges.
3. Baste the cape to the neckline, and sew the collar over both.
4. Hem the body; buttons on CF.
5. In a muslin, check the cape's clearance over the arm, and adjust its length and shoulder extension.
