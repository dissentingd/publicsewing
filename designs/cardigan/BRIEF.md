# Cardigan

**Source:** none. Our own design (2026-11-11), on the Bibi block: a buttoned knit cardigan with a V
neck, one band up the fronts and round the neck, long sleeves, rib cuffs and a rib hem band. No
book: the proportions below are ours, from common ready-to-wear, and every one is an option.

**Block:** FreeSewing's Bibi (knit top and dress block, on Brian), through `blocks/bibi.mjs`: back
and sleeve as Bibi drafts them, its rib cuffs and hem band. The `openFront` operation
(`lib/knit.mjs`) opens Bibi's front at centre front with a straight V neck and gives it allowance
all round; the `frontBand` piece type (`lib/placket.mjs`) cuts the band with its buttonholes and
buttons. Drafted from the wearer's measurements, so it fits any size, children's included.

**Status:** draft. Not sewn.

**Threadloop (2026-11-11):** 70 free patterns for "cardigan" (Mood Sewciety's Garnet, Willow and
Hyssop, Hot Patterns' Aspen, Dress Developer's Lily and others): graded and copyrighted, none made to
measure or openly licensed. None was used.

## The design

| Element | Default | Option | Why |
|---|---|---|---|
| V neck | 55% of the neck point to the front waist, measured down from the neck point (about 24 cm on a 36 in figure) | `vNeckDepth` | Ends above the bust; at most 85%, so always above the waist |
| Chest ease | 8% | `chestEase` (Bibi's) | Worn over a top: Bibi's knit default is 2% |
| Front band, finished | 7% of the neck (about 2.5 cm) | `frontBandWidth` | Room for a 15–20 mm button |
| Band round the neck | the V and back neck less 8% | `collarStretch` | Stretched there so it hugs the neck; flat along the fronts so they don't pucker |
| Buttons | 5, from two band-widths above the hem to just below the V | `buttons` | As many as fit a band-width apart: a short front takes fewer |
| Cuffs, hem band | rib, on | `useCuffRibbing`, `useWaistRibbing` | The plain variant hems them |
| Sleeve length | 100% (to the wrist) | `sleeveLength` | |
| Fit, length, ease otherwise | Bibi's | Bibi's | |

## Variants

- **Plain hem:** no rib cuffs or hem band; the sleeves and body hemmed, the front band running to
  the hem.

## Changes and what isn't modelled

- Bibi's front is cut on the fold with a curved neck and no allowance at the neck; here it's cut
  twice, open at centre front, with a straight V and allowance all round.
- Bibi's hem band is drafted as a ring for a closed top. Here don't join its ends: they lie under
  the front band, which runs past it to its foot.
- No pockets.
- Buttonholes are marked on one end of the band and buttons on the other: sew the buttonhole end up
  the right front for women's (right over left), the left for men's.

## Pieces

1. Front, cut 2.
2. Back, on the fold.
3. Sleeve, cut 2 (none with `sleeves` off).
4. Front band: up one front, round the neck and down the other, folded lengthwise; notches at the
   V points, the shoulders and centre back.
5. Cuff, cut 2 (with `useCuffRibbing`).
6. Hem band (with `useWaistRibbing`), not joined.

## Construction

1. Sew the shoulder seams.
2. Set in the sleeves flat, then sew each side seam and sleeve seam in one.
3. Fold the hem band in half lengthwise and sew it to the hem, its ends at the front edges. Sew on
   the cuffs as rings.
4. Interface the buttonhole end of the front band. Fold it in half lengthwise and sew it on from the
   foot of one front, up it, round the neck and down the other, matching the notches: flat along the
   fronts, stretched between the V points.
5. Make the buttonholes and sew on the buttons.
