# Norfolk jacket

**Source:** Simons, *Designing Boys' and Juveniles' Clothing* (1922), corpus `designingboysjuv00simo`
(tracked). Diagram 7, "Bulgarian Norfolk Sack Coat", pp. 34-35; Diagram 6, "Button-to-the-Neck
Semi-Norfolk Sack Coat", pp. 32-33 (PDF pp. 38-41). US 1922, public domain. Inches below are Simons',
for a size 6 boy (26 in chest).

**Block:** FreeSewing's Brian, through the hunting coat (`extends: ../hunting-coat/spec.yaml`):
its yoke, pleated middle and lower back (`lib/panels.mjs`), belt, flapped patch pockets, collar and sleeve.
Added for this jacket: a front cut at the waist with pleats (`frontPanel` panels `middle` and `skirt`),
several back pleats (`pleats`, `spacing`), and a vent on the lower back (`vent`).

**Status:** draft. Not sewn.

**Threadloop:** no free Norfolk jacket (searched 2026-11-03).

## What the source shows
- **Diagram 7** (p. 34): drafted like the previous sack coats, "with the exception that a yoke is placed
  on the forepart", the back and the forepart both cut through at the waist, and an allowance made for
  pleats, "illustrated by the straight lines" from the yoke to the waist: three on the back. A body
  of front and back only, with a side seam.
- **Front yoke:** cut 1¼ in up from T (the armhole at the chest line) and ½ in from Y (the front edge).
- **Belt:** 1½ in wide, running parallel with the pocket.
- **Pocket:** "6 inches down from point T", drawn as a flap below the belt.
- **Buttons:** 2½ in apart. Three on the front and one more on the belt in the diagram.
- **Vent:** from the waist down to the bottom, "or a novelty pleat".
- **Neck:** a lapel turned back (the diagram's shaded corner).
- **Diagram 6** (p. 32): a back yoke and inverted pleat, buttoned to the neck under a collar, belted.

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Front yoke | ½ in above the chest line at the edge, 1¼ in at the armhole, of about 4½ in from the neck | `frontYokeDepth` 89%, `frontYokeArm` 73% |
| Back yoke | About halfway, measured off Diagram 7 | `yokeDepth` 50% |
| Pleats | Three lines on the back and three on the forepart | `pleats` 3 on each front and each side of the back |
| Pleat spacing | About ¾ in, measured off Diagram 7 | `pleatSpacing` 2.2% of the chest |
| Pleat place | Back from about 46% of the yoke line, from CB | `pleatAt` 46%; the front `frontPleatAt` 55% (ours) |
| Pleat depth | Not given | `pleatDepth` 1% of the chest (ours) |
| Belt | 1½ in | `beltWidth` 5.8% of the chest |
| Buttons | 2½ in apart | `buttons` 4, the last `buttonBottom` 40% of waist to seat below the waist: 2½ in apart at size 6 |
| Vent | Waist to bottom | `backVent` on, lapping `backVentWidth` 4% of the chest (ours) |
| Length | 9½ in below the waist at size 6 (Diagram 2) | `lengthBelowWaist` 150% of waist to seat |
| Front hem | About 1 in lower, measured off Diagram 7 | `frontDrop` 15% |
| Chest ease | Not stated | `chestEase` 17%, as the boys' suit jacket |

## Changes and what isn't modelled
- **Any size:** Simons drafts for boys. The proportions apply to any figure; men's sizes are ours to check.
- **The lapel sits on the yoke.** Simons' yoke seam crosses the lapel; here the lapel breaks just above the
  seam, so no seam shows on it.
- **The pleats' direction and amount:** the book gives neither. Each is drawn as the hunting coat's pleat, three
  lines brought together. A traditional Norfolk's box pleats are a different arrangement and aren't offered.
- **The front pleats sit further from the armhole** than Diagram 7's, so they clear it at every size.
- **Pleat spacing closes up** on figures where the last pleat would reach the armhole.
- **Pocket:** a flap is all Diagram 7 draws. It's put on a plain patch pocket (our choice). Its level is set from the
  belt, not 6 in from T, which falls about 1½ in below the waist at size 6.
- **Belt:** level, not sloping parallel with a slanted pocket, and without the belt's buttons; the belt is cut
  as the hunting coat's. A button can fall under the belt: move it to the belt when sewing.
- **Breast pockets:** none, as the diagram. The front pleats run through that place.
- **Waist seam:** nothing shaped; the belt covers it.

## Pieces
Front yoke, front middle, front lower (cut 2 each); back yoke (fold), back middle (fold), back lower (cut 2,
or on the fold with the vent off); collar, facing, sleeve, pockets and flaps, back belt, front belt.

## Construction
1. Fold each pleat on its dashed lines and baste it at the top and bottom.
2. Sew each front yoke, middle and lower together; the same for the back. The pleats close to the yoke's width.
3. Sew the vent's lap at the waist, under the belt's place. Patch pockets and flaps on the front lower.
4. Shoulders, side seams, sleeves.
5. Facing and collar, turning the lapel at the break.
6. Belt pieces, faced, centred on the waist seams and stitched at the back and sides, buttoned at the front.
7. Hem, buttons and buttonholes.

## Checks
`test/norfolk-jacket.test.mjs`: every size, with lapels, buttoned to the neck, no pleats or vent, and four
deep pleats. The coat checks, and the waist seams with the pleats folded out, the pleated panels' widths, the
pleats clear of the armhole, the lapel above the yoke seam, and every button on a panel.
