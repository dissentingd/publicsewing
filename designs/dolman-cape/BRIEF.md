# Dolman cape

**Source:** Esther Pivnick, *How to Design Beautiful Clothes* (1949), corpus `pivnickdesignclothes1949` (untracked). Chapter XIX,
"The Dolman Cape", book pp. 254-258, Figures 2-6 (PDF pp. 262-266). US 1949, copyright not renewed (see the shift dress's brief). Inches
are Pivnick's.

**Block:** FreeSewing's Breanna, read by `jacketBase`, standing in for her French lining (Chapter V), which isn't drafted here. Added:
`dolmanLayout` in `lib/cape.mjs`; the pieces are the cape's.

**Status:** draft. Not sewn.

**Threadloop:** 68 free results for "cape" (2026-11-03); not searched for a dolman in particular.

## What the source shows
- **The garment** (p. 254): "fitted over the shoulders and arms", "a straight, coat-like appearance". A smooth shoulder, unlike the circular cape.
- **The front** (Figure 3): the lining's two sections traced so bust notches and hip lines meet, leaving a shoulder dart. A line squared from CF through
  the underarm for 2½ in, "for all sizes", to point 2. The hip line carried out 3 in to point 3. The side seam through 2 and 3. The shoulder line
  extended, and a smooth curve from its end to point 2.
- **The back** (Figure 4): the same, CB straight.
- **The hem** (Figure 5): the two laid together at the notches, and a line drawn from the middle of one hem to the middle of the other.
- **Fitting:** the back's shoulder eased if it's longer, or "small darts may be stitched along the shoulder curve" (Figure 6).
- **Length:** measured to the floor, less the same amount all round.

## How it maps onto the block
| Feature | Pivnick | Here (option default) |
|---|---|---|
| Past the underarm | 2½ in | `dolmanArm` 6.9% of the chest (of 36) |
| Past the hip | 3 in | `dolmanHip` 7.9% of the seat (of 38) |
| Length | To taste; about 24 in below the waist in Figures 3-4 | `dolmanLength` 60% of waist to floor |
| Bust dart | In the shoulder | Breanna's, in the shoulder |

## Changes and what isn't modelled
- **Breanna in place of her lining.** Same pieces of information, a different draft, so the numbers are hers but the shoulders aren't.
- **The back's darts.** Hers has a shoulder dart (Figure 4), and if the back's shoulder is longer she eases it or stitches small darts along the curve (Figure 6). Here the back's seam
  above the notch comes out longer than the front's by about 57 mm at a women's 36, up to 90 at the smallest women's and a man's 38: too much to ease. So a shoulder dart takes the first
  `dolmanShoulderDart` 2% of the chest, and small darts on the curve take the rest, as many as keep each to `dolmanCurveDart` 1.8%, at most four. The sizes are ours. Tried and dropped: moving the side seam's
  arm point instead (the curve gains what the seam below loses, so it does little) and closing Breanna's waist dart into the shoulder (it makes the difference worse).
- **The hem** is square at each side seam and level at the centres, not ruled from hem to hem.
- **The closure, collar and facing are ours**, as on the cape. She doesn't give them. No arm slits, which she doesn't draft.
- **Sizes:** "for all sizes" becomes a share of the figure, so children's capes aren't over-wide.

## Pieces
Front (cut 2), back (fold), collar.

## Construction
1. Bust darts; the back's shoulder and curve darts.
2. Shoulder and side seams in one, from the neck to the hem, matching the notches.
3. Fold the facing back. Collar to the neck, with the facing's top.
4. Hem, buttonholes, buttons.

## Checks
`test/dolman-cape.test.mjs`: every size, the default, long, short with no hip extension, and wide. Side seams above and below the
notch with the back's darts sewn, each dart small, the bust dart's legs, the collar, the hem past the seat.
