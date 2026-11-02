# Circular skirt

**Source:** Mitchell, *The New "Standard" Work on Designing Ladies' Tailor-Made Garments*
(1921), corpus `newstandardworko00mitc` (tracked). "Two-Piece Circular Skirt", text p. 110, diagram
p. 111, continued text p. 112, diagram p. 113 (PDF pp. 114-117); the foundation pp. 84-87. US 1921,
public domain. Inches below are Mitchell's, for a 40 in hip and 26½ in waist (p. 84).

**Block:** FreeSewing's Sarah, through the two-piece skirt (`extends: ../two-piece-skirt/spec.yaml`,
`lib/skirt.mjs`): its waistband and CB zip. Added for this skirt: the `circularLayout` operation and
the `circular` piece type.

**Status:** draft. Not sewn.

**Threadloop:** 98 free circle skirts (2026-11-02), among them FreeSewing's Sandy and a circle skirt
calculator. The first ten listed are circle skirts by name, cut from the waist; none of those listings
says it is fitted to the hip as this one is, though the listing page shows no descriptions.

## What the source shows
- **The garment** (p. 110): two pieces, "a tight waist and hip line and a very wide bottom".
- **The foundation** (p. 111): the plain skirt foundation, its side line drawn as for the two-piece
  skirt. Waist, hip line and bottom are arcs of a fan of straight lines (measured off the diagram:
  hip 20 in, bottom about 34 in, a half skirt).
- **The slashes** (p. 110): the back divided in three, giving two lines; a line on the front about as
  far from the side line as the first back line; those and the side line slashed to about 1 in above
  the hip line.
- **The spread** (p. 112): open at the bottom, folded out above the slash ends. The rule: least at the
  front, more at the side seam, most at the back. Here 2 in at the front, 3 in at the side seam, 4 in in
  each back cut, "either more or less" as desired. The half bottom comes to about 47 in (measured off
  p. 113, where the four openings measure in the ratio 4 : 4 : 3 : 2).
- **The waist** (p. 112): ¼ waist less ⅜ in for the front, ¼ waist plus ⅜ in for the back. A dart on
  the side seam takes up the rest (bold on p. 113).
- **The side seam** (p. 112): from the dart down the centre of the side opening.

## How it maps onto the block
| Feature | Mitchell | Here (option default) |
|---|---|---|
| Side line | ½ the hip line less 1 in, from the CF side (p. 86, point 11 from 4; p. 111 agrees) | `panelShare` 45% of the half seat to the front (9 of 20) |
| Foundation flare | Hip 20, bottom about 34, measured off p. 111 | `goreFlare` 70%, the half seat's added width at floor length |
| Slash ends | About 1 in above the hip line | `slashHinge` 14% of waist to seat (1 of 7) |
| Spread | 2, 3, 4 and 4 in | `spreadFront` 5%, `spreadSide` 7.5%, `spreadBack` 10% of the seat (of 40) |
| Waists | ¼ waist ∓ ⅜ in | `waistShift` 1.4% of the waist (⅜ of 26½) |
| Length | Near the floor (p. 84) | `length` 70% of waist to floor (below the knee), ours |
| Closure | Not given | The gored skirt's CB zip and waistband |

**Check at Mitchell's figure** (40 in hip, 26½ in waist, floor length): the half bottom drafts at 46.8 in
against the 47 measured off p. 113, the waists 6.2 and 7.1 in against his 6¼ and 7.

## Changes and what isn't modelled
- **Not a true circle.** The queue called this "a circle on the waist", but Mitchell's skirt fits to the
  hip and spreads below it. It is drafted as he does it. A skirt cut as a circle at the waist is a
  different cut, and FreeSewing's Sandy covers it.
- **The spread is a turn of each panel about its slash end**, as paper would move, and the rule isn't
  enforced: the options can be set against it.
- **A shorter skirt keeps the angles.** The spreads are stated at floor length, so a shorter skirt opens
  in proportion.
- **Text and diagram:** the text runs the side seam "between the third and fourth line". The diagram's
  dart and openings put it down the middle of the side opening, the third from the back. The diagram is
  followed.
- **The seat line isn't marked**, except by a notch on the side seam.
- **Waist curve:** one smooth curve for each piece, square to its edges, rather than through the folds.
  Mitchell's "finish as represented" leaves this open.
- **Dart:** when ¼ waist ∓ ⅜ would open one leg and lap the other, that leg stays closed and the other
  takes the whole dart. The longer leg comes down to the other's length, so they sew together.
- **A waist as wide as the seat** (the stout figures, some children, and the wide variant): the fan is
  narrower at the waist than the figure, so the side seams run outward above the hip line in place of a
  dart. Not checked on a body.
- **Grain:** the source gives none. The front's CF is on the fold; the back's grain is the middle of its
  middle panel (ours), so the CB and side seams fall on the bias, as the wide hem needs.
- **Hem allowance:** the block's. On this much curve a narrow hem is easier; set it with the hem option.

## Pieces
Front (on the fold), back (cut 2, CB seam), waistband.

## Construction
1. Let the pieces hang for a day: much of the seams and hem lies on the bias.
2. CB seam below the zip, then the zip.
3. Side seams, matching the notches.
4. Waistband.
5. Level the hem on the wearer if the bias has dropped, then hem, easing the fullness in.

## Checks
`test/circular-skirt.test.mjs`: every size; the default, the wide variant, no spread at a short length, and
floor length with equal front and back. Side seams within 3 mm, the waist within 2% of the measure, the
waistband fits it, the back's hem wider than the front's and the whole hem wide.
