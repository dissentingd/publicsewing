# Girl's coat

**Source:** N. S. Sheifer, *System of Designing and Grading Ladies', Misses' & Children's
Garments* (New York, 1908), corpus `nssheiferssystem00shei` (laptop; PDF pp. 32–33 box coat,
84–85 children's garments, 96 grading children's patterns). US 1908, public domain. Inches
below are Sheifer's.

**Block:** FreeSewing's Breanna, through Mitchell's box coat (`extends: ../box-coat/spec.yaml`,
`lib/jacket.mjs`), whose construction Sheifer's box coat shares: two body pieces with the side
seams flared from the armhole and crossing below the waist, a small dart at the front neck, a
notched lapel and collar, a two-piece sleeve. Drafted from the child's own measurements (the
USDA sets in `designs/sizes/`), so it fits any size, adults included.

**Status:** draft. Not sewn.

## What the source shows
- **Children's garments** (p. 84, size 8, bust 26½): the same foundation as the ladies', drafted
  "in proportion the same as Ladies". "Dotted lines show the box coat which is drafted in
  proportion the same as Ladies": ¾ in taken out between back and front at the armhole, ¼ in
  added at the top of the back neck. Hip line 4 in below the waist.
- **Box coat** (p. 32, diagram p. 33):
  - the back let out ½ to 2 in at the waist "according to fullness of back";
  - side seams flared and crossing below the waist;
  - 1 in added at the neck point; a small notch (dart) at the front neck;
  - length "according to style";
  - lap 2½ in single-breasted, 3½–4 double-breasted;
  - "Pocket 3 inches below waist line", one each side, a slanted mouth.
  - For a full-length loose coat, the back at least 18 in and the front 27 in at the hem.
- **Grading** (p. 96): children's sizes ½ in apart in height and 1 in in waist length, the back's
  waist width the same for all.

## How it maps onto the block
| Feature | Sheifer | Here (option default) |
|---|---|---|
| Ease, flare, neck dart, collar, sleeve | As the ladies' box coat | The box coat's: `chestEase` 18%, `flare` 4.4% of the seat each side, the neck dart, notched lapel and collar, two-piece sleeve |
| Length | By style | `lengthBelowWaist` 58% of waist to floor: just below the knee |
| Lap | 2½ in on a 36 bust | `buttonExtension` 6.9% of the chest |
| Buttons | Not given | `buttons` 4 |
| Pocket | 3 in below the waist, one each side | `pocketBelow` 30% of waist to seat; flap pockets; `ticketPocket` off |
| Children's figure | ¾ in out at the armhole, ¼ in up at the back neck | Not applied: Breanna is drafted from the child's own measurements |
| Sizes | Graded from size 8 | Every FreeSewing adult set and all 75 USDA children's sets |

## Changes and what isn't modelled
- **The pocket is a straight flap pocket**, the box coat's, not Sheifer's slanted mouth.
- **Double-breasted** (3½–4 in lap) isn't built.
- Sheifer's adjustments for a child's figure aren't applied by hand; the measurements carry the
  child's proportions.

## Pieces
As the box coat, without the ticket pocket: back, front, facing, collar, top and under sleeves,
and each hip pocket's flap, jet and bag.

## Construction
As the box coat's brief: neck darts, pockets, side and shoulder seams, facings and collar, then
the sleeves, hems and buttons.
