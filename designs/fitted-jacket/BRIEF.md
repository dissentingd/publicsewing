# Fitted jacket (tight-fitted)

**Source:** Mitchell, *The New "Standard" Work on Designing and Pattern-Making of Ladies'
Tailor-Made Garments* (1921), corpus `newstandardworko00mitc` (book page = PDF page − 4).
Tight-fitted jacket foundation p. 42 (diagram p. 43), tight-fitted single-breasted jacket with a
shawl collar p. 44 (diagram p. 45), two-piece sleeve pp. 60–61. US 1921, public domain. Inches
below are Mitchell's (his standard figure: bust 36, waist 26½, hips 40). The archived pipeline's
reading is `archive/recipes/mitchell/tight_fitted_jacket.yaml`, with
`archive/recipes/mitchell/FINDINGS.md` ("Tight-fitted jacket, single dart").

**Block:** FreeSewing's Breanna, through the tailored jacket's library (`lib/jacket.mjs`): its
princess seams and flare, with three additions made for this jacket: an under-arm panel in place
of the side seam, a shaped CB seam, and a shawl collar cut in one with the front.

**Status:** draft. Not sewn.

## What the source shows
"A tight-fitted, single-breasted jacket, with a shawl collar."
- **Foundation (p. 42):** the semi-fitted one with the centre back taken in more: 2 in at the
  waist (against 1) and 1½ in at the hip line, 7 in below it (against ½).
- **Five body panels a side:** back, side back, under-arm, side front, front. The back and front
  seams run as on the semi-fitted jacket (shoulder to waist).
- **The under-arm panel** takes the bottom of the armhole, from the back width line (10, the
  back armhole's innermost point) to ½ in in front of the blade (32, about ½ in in front of
  where a side seam would be). Its back seam is taken in 1¼ in at the waist (35–36, ⅝ each
  side); its front seam isn't (33).
- **Below the waist the seams cross**, as on the semi-fitted jacket.
- **Shawl collar** cut in one with the front, with a small neck dart behind the neck point.
- **No length, lap or hem is printed** ("finish as represented").

## How it maps onto the block
| Feature | Mitchell | Here (option default) |
|---|---|---|
| Ease | Drafted from body measures | As the tailored jacket, but `waistEase` 20%: Breanna's waist is drafted looser and the CB and under-arm seams take the rest in (6–11% over the waist when sewn, at the women's 28–44 and men's 40 sets) |
| CB seam | In 2 in at the waist, 1½ at the hip line | `cbSuppression` 30% of (half seat − half waist, with ease): 2 of 6¾ in; `cbSeat` 62% of that still in at FreeSewing's seat line (1¼ in at 10½ in down, on the line from 2 in at the waist to 1½ in at 7 in). The back is then cut in pairs |
| Under-arm panel | From the back width line to ½ in in front of the side | `underarmBack` 90% of the way from the side to the back armhole's innermost point; `underarmFront` 25% of the way to the front's |
| Under-arm back seam | In 1¼ in at the waist | `underarmSuppression` 18% of (half seat − half waist): 1¼ of 6¾ |
| Small figures | — | The CB and under-arm shaping are scaled down where they would leave the waist with less than about 6% ease (FreeSewing's smallest women's sets have a bigger seat-to-waist drop than Mitchell's figure) |
| Flare below the waist | Seams cross | Each of the 8 seam edges (no side seam now) out by an equal share of what the seat needs, the CB shaping counted |
| Shawl collar | Cut in one with the front | The neck edge runs on up the crease from the neck point for the back neck's length; `collarWidth` 22% of the neck at CB (3 in), `lapelWidth` 26% (3½ in), sewn to the back neck, joined at CB |
| Length, lap, crease, buttons, pockets, sleeve, facing, lining | As the semi-fitted jacket | As the tailored jacket; the facing and the lining run up into the shawl |

## Construction order
1. Back to side backs, front to side fronts (princess seams); CB seam; the under-arm panel to
   the side backs and side fronts.
2. Pockets, as the tailored jacket.
3. Shoulders; the two shawl collars' CB seam, then their neck edges to the back neck. The same
   for the facings, then the facings to the fronts and shawl.
4. Sleeves: the two pieces together, then set into the armhole, the under-arm panel taking the
   bottom of it.
5. Lining, hems and buttons as the tailored jacket.

## Changes and what isn't modelled
- **No neck dart in the shawl.** Mitchell's ½ in neck dart behind the neck point shapes the
  shawl round the neck; here the shawl's neck edge is a straight line up the crease, as on the
  mackinaw's shawl.
- **The under-arm panel** is made from the tailored jacket's side back and side front: the
  front part turned so the side seams above the waist meet, the side seam dropped, and the
  panel's two edges below the waist flared down its middle. The back seam's 1¼ in is taken in
  at the waist; Mitchell's ⅝ in crossing at the hip on the front seam comes from the flare.
- **The waist is looser than Mitchell's** at his proportions: his figure is corseted (waist
  26½ on hips 40), and the same shaping on FreeSewing's sets would leave no ease.
- **Mitchell's double-dart tight-fitted jacket** (pp. 46–47: seven parts, two front seams over
  the shoulder, no collar) isn't built.
