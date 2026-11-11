# Fitted dress

**Source:** none. Our own design (2026-11-11), the first on the Bella block: a dress with a fitted,
darted bodice joined at the waist to a skirt, closed by a zip down centre back. The neckline, the
sleeves and the skirt are options, so the sundress, the sheath and the jumper dress are its
variants. No book: the proportions below are ours, from common ready-to-wear, and every one is an
option.

**Block:** FreeSewing's Bella (bodice block with a side bust dart and waist darts front and back),
through `blocks/bella.mjs`. The `bodiceNeck` operation (`lib/bodice.mjs`) reshapes its neckline
and rebuilds its outline; `bodiceWaist` records its waist seam; the `dressSkirt` piece type cuts the
skirt to that seam. Drafted from the wearer's measurements, so it fits any size, children's
included.

**Status:** draft. Not sewn.

**Threadloop (2026-11-11):** 19 free patterns for "sheath dress" (Tiana's Closet's Staple and V-neck
sheaths, Shkatulka, Mood Sewciety's Ginger and others) and 29 for "sundress" (Modern Sewing
Patterns, The Sewing Birdie, Peppermint, Oliver + S and others): graded and copyrighted, none made
to measure or openly licensed. None was used.

## The design

| Element | Default | Option | Why |
|---|---|---|---|
| Neck shape | round | `neckShape` (`round`, `square`, `v`) | |
| Neck width | moved out 5% of the neck along each shoulder, back and front alike | `neckWiden` | A little wider than the block's jewel neck; the same on both so the shoulders still match |
| Front neck depth | 25% of the neck point to the front waist (about 11 cm on a 36 in figure) | `neckDepth` | Below the block's jewel neck; at most 60%, so always above the waist |
| Back neck depth | 5% of the neck point to the back waist | `backNeckDepth` | |
| Sleeves | none | `sleeves` (Bella's long fitted sleeve) | |
| Skirt | A-line | `skirtStyle` (`gathered`, `straight`, `aline`) | |
| Skirt length | 45% of waist to floor (to the knee) | `skirtLength` | |
| Straight and A-line skirts | the seat's quarter plus 4% at the hip line; the waist taken in to the bodice's by a dart under the bodice's dart and up to 2 cm at the side | `seatEase` | |
| A-line flare | 6% of the seat more at each side of the hem | `hemFlare` | |
| Gathered skirt | 1.8 times the waist, never narrower than the seat plus 10% | `gathers` | |
| Zip | from the neck to 60% of waist to seat below the waist | `zipLength` | |
| Bodice fit | Bella's | Bella's | Bella's chest and waist ease |

## Variants

- **Sundress:** a wide square neck front and back, no sleeves, a gathered skirt below the knee.
- **Sheath:** a high round neck and a straight, darted skirt to just above the knee. A true sheath
  has no waist seam; ours keeps it.
- **Jumper dress:** a deep square neck to wear over a blouse, and a flared A-line skirt (a jumper is
  often gored; ours isn't).

## Changes and what isn't modelled

- Bella eases its back shoulder onto the front by about 4.6 mm at every size; widening the neck
  keeps that, so on a narrow shoulder it's more than 5%.
- The skirt's darts take what its waist exceeds the bodice's, under the bodice's darts, so they
  line up at the waist seam; their width differs from the bodice's.
- The skirt's waist edge is straight; the bodice's front waist drops toward the side. Pin them at
  the darts and side seams.
- No facings or lining are drafted: finish the neck and armholes with bias binding, or line the
  bodice by cutting it twice.
- No pockets. The wrap dress and the shell top are other constructions (BUILD_QUEUE K4).

## Pieces

1. Front bodice, on the fold.
2. Back bodice, cut 2 (centre back seamed for the zip).
3. Skirt front, on the fold.
4. Skirt back, cut 2, the zip's end notched on centre back.
5. Sleeve, cut 2 (with `sleeves`).

## Construction

1. Sew the bodice darts: the waist darts front and back, the bust dart at the side. Sew the skirt
   darts.
2. Sew the shoulder seams. Finish the neck (and armholes, if sleeveless) with bias binding or a
   lining.
3. Sew the bodice and skirt side seams. Gather a gathered skirt's waist to the bodice's.
4. Sew the skirt to the bodice at the waist, matching side seams and darts.
5. Sew the centre back seam below the zip's notch, and put in the zip from the neck to the notch.
6. Set in the sleeves, if any. Hem.
