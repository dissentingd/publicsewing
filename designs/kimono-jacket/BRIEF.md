# Kimono jacket

**Source:** Mitchell, *The New "Standard" Work on Designing Ladies' Tailor-Made Garments* (1921), corpus
`newstandardworko00mitc` (tracked). "Semi-Fitted Kimona Jacket", text p. 40, diagram p. 41 (PDF pp. 44-45); the kimono
box coat, pp. 20-21, for its sleeve width. US 1921, public domain. Inches below are Mitchell's.

**Block:** FreeSewing's Breanna, through the tailored jacket (`extends: ../tailored-jacket/spec.yaml`, `lib/jacket.mjs`):
its body, princess seams, lapel, collar, pockets. Added for this jacket: `jacketLayout`'s `kimono`.

**Status:** draft. Not sewn.

**Threadloop:** free kimono-sleeve patterns exist, for dresses and tees (see the kimono dress's brief); not searched for a
tailored jacket with princess seams.

## What the source shows
- **The foundation** (p. 40): the semi-fitted jacket's, up to point 21.
- **Seams:** the back's from the shoulder 3 in from the neck (29) to the waist; the side part from there; the front's from
  the shoulder 3 in from the neck (42), with the side front's top 1¼ in on (43), through a dart at the bust.
- **The sleeve** goes on the side back and side front: "a line from a point ¼ inch in front of 29 through 37, thus
  giving the sleeve line of the back part"; "a line from 43 through 46, thus giving the sleeve line of the front part".
- **Length** (p. 40): 29 in, from the neck point to 42 and on from 43 along the sleeve line. The same on the back.
- **The sleeve's end** is squared from the sleeve line, and its width connected with 36.
- **The underarm** (36): 3 in below the chest line on the side seam.

## How it maps onto the block
| Feature | Mitchell | Here (option default) |
|---|---|---|
| Sleeve line, back | 21½° below level, measured off p. 41 | `kimonoAngleBack` 21.5° |
| Sleeve line, front | 33° below level, measured off p. 41 | `kimonoAngle` 33° |
| Length | 29 in from the neck | `kimonoLength` 100% of shoulder to wrist plus a third of shoulder to shoulder (about the shoulder seam) |
| Underarm | 3 in below the chest line | `kimonoDepth` 7.9% of the chest (3 of 38) |
| Sleeve's end | About 6 in each part, measured off p. 41 | `kimonoHem` 100% of the upper arm, about 12 in round |
| Body, lapel, collar, flap pockets | The semi-fitted jacket's | The tailored jacket's options |

## Changes and what isn't modelled
- **The hem's split isn't half and half.** The two underarm seams must sew together, and the sides differ, so the sleeve's end is
  shared to make them equal. On most sizes that's near the middle; on children and stout figures one part can be far the wider
  (a stout 44 about 52 and 297 mm, a girl's size 8 about 149 and 57), so the seam moves round the arm. Whatever the split, it
  sews. Angles much steeper than these on a stout figure can leave the seams unequal: the shared range has limits.
- **Shoulder tip:** Mitchell draws no armhole here, and neither does this. The sleeve runs straight from the top of each princess
  seam, without his reshaping at the shoulder (42 to a point ⅜ in above 19).
- **The underarm corner is sharp**, as p. 41 draws it, not rounded as on the box coat (p. 21). Clip it when sewing, and stay it.
- **No lining:** the book gives none. No breast or ticket pocket: none drawn.
- **Arm movement:** a kimono sleeve set at these angles, without a gusset, limits how far the arm lifts. Not checked on a body.

## Pieces
Front, back (fold), side back and side front with their sleeves (cut 2 each), facing, back-neck facing, collar, pocket flap, jet and bag.

## Construction
1. Princess seams, back and front. Pockets.
2. Shoulder and overarm seams, from the neck to the sleeve's end.
3. Side and underarm seams in one, clipped at the corner.
4. Facings, collar.
5. Sleeve hem, jacket hem, buttons and buttonholes.

## Checks
`test/kimono-jacket.test.mjs`: every size, with peak and notched lapels, a short wide sleeve, and steeper angles. The jacket checks,
and in place of a sleeve cap the underarm seams (within 1 mm) and the neck to the wrist on both sides.
