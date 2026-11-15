# Women's trousers

**Source:** Simons, *Drafting Trousers for Men, Boys, Women* (The Garment Technical Institute,
Morris Plains, N.J., 1945), corpus `simonsdraftingtrousers1945` (not tracked; a copy on the laptop and
on the home server). Ladies' regular trousers, Diagram 39, text pp. 116–119, plate p. 117 (PDF pp.
124–127); ladies' pleated slacks, Diagram 40, text p. 119, plate p. 120 (PDF pp. 127–128). US 1945, not
renewed (NYPL renewal records for 1972–73, checked 2026-11-11): public domain in the US. Inches below
are Simons', for waist 28, seat 38, rise 13 including the waistband, inseam 28, knee 21, bottom 22:
"an average female, waist 28". Checked against Pivnick, *How to Design Beautiful Clothes* (1949),
ch. XX "Trousers, Slacks or Shorts", pp. 261–267 (`pivnickdesignclothes1949`, not renewed).

**Block:** FreeSewing's Titan, through the suit trousers (`extends: ../suit-trousers/spec.yaml`): front
and back legs, darts or pleats, fly, side pockets, jetted back pocket, waistband and belt loops.
`trouserLeg` gained `sideZip`: the end of a side-seam zip notched on both outseams. Drafted from the
wearer's measurements, so it serves women's, girls' and any other sizes.

**Status:** draft. Not sewn.

**Threadloop (2026-11-15):** "women's trousers" finds 165 free patterns, a handful of them trousers
(Madras, Stream Ray, Fashion Freaks' women's pants, lounge pants); whether any is drafted from
measurements wasn't checked.

## What the source shows
- **Purpose (p. 114):** for "women, misses and girls", "especially adapted for heavy cotton fabrics";
  "drafting measurements and not finished measurements": ease and seams are in the draft.
- **Fit (p. 116):** "fully proportioned", "enough rise and stride", "large enough over the hips so
  that the garment does not bind or constrict in any way"; extra width for a cloth with no give,
  spread through the garment.
- **Front (Diagram 39):** plain, no pleat or dart: "Shape the front, N-P-J". Front waist "one-half the
  waist on the square plus 1 inch". "Q is ½ inch from B, this is an extra allowance in the seat for
  fullness."
- **Back:** "Take out a 1-inch vee at points 10-11. From 11 to 12 is 5 inches, the length of the vee.
  If a pocket is desired, it should be placed at point 12."
- **Leg:** knee 21, bottom 22: straight, the bottom a little wider than the knee; the bottom drawn
  straight across ("Draw a line 9-8").
- **Waistband:** "M is 2¼ inches from L, the allowance for the waistband." The band piece: "A to B is
  15 inches, 1 inch longer than one-half of waist ... for an outlet in the seat. B to C is 2 inches,
  the allowance for facing the side of the waistband." The front draft has no fly: the opening is at
  the side, the band lapping past it.
- **Pleated slacks (Diagram 40):** "practically the same", with the knee an inch wider (22) and the
  bottom 21. At the waist "A to B and A to C is 1 inch each", a 2 in pleat on the crease, then a
  second 1 in fold (E–F) 1½ in toward the side, sewn 5½ in down as a dart on the plate; "3 inches ...
  taken up for the two pleats".
- **Pivnick (checked, not followed):** "fitted trousers, with a high crotch and a straight, narrow leg":
  a plain front at a quarter of the waist, the back reduced to the waist by one dart of half the
  excess, 5 in long; a belt. The same construction, closer over the hips.

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Hips | Front and back at the seat line about 22 in on his 19 in half seat, seams in | `seatEase` 12% (max raised to 16%) |
| Front | Plain | `frontDart` 0, `pleats` 0 |
| Back vee | 1 in wide, 5 in long, of about 6½ in half waist shaping with this ease at 28/38 | `backDart` 16%; `backDartLength` 49% of waist to seat (5 in on about 10) |
| Knee | 21 in on a knee of about 15 in | `kneeEase` 40% (max raised to 50%) |
| Bottom | 22 / 21, straight across | `hemWidth` 105%, `hemShaping` 0 |
| Length | Inseam 28 on a woman's about 30 | `lengthBonus` −5% of waist to floor |
| Band | 2¼ in, on his waist to floor of 38¾ in (rise 13 less the band, inseam 28) | `waistbandHeight` 5.8% |
| Opening | At the side, the band's 2 in "facing the side" | `opening: side`, `zipLength` 75% of waist to seat (ours), `sideUnderlap` 7% of the waist (2 / 28) |
| Pockets | Optional, at the vee's end | `sidePockets`, `backPocket` off; no belt loops |
| Pleated slacks | Knee 22, bottom 21, 3 in in two front folds | the `pleated` variant: `pleats` 2, `frontDart` 46% (3 of about 6½ in), `kneeEase` 47%, `hemWidth` 95% |

## Changes and what isn't modelled
- **The sewn waist is Titan's**, with the suit trousers' waist ease. Simons' front and back waists add
  up to more than half the waist (8 + 10 − 1 on a 14 in half), the rest presumably his seams and an
  easing into the band; here the plain front takes its shaping at the side seam and crotch.
- **The zip's length is ours**: Simons doesn't give one. A 7 in zip below the band at his size.
- **The waistband** is one strip round the whole waist, from the back edge of the opening round to
  its front edge and on by the underlap; Simons cuts it in halves with a 1 in outlet at CB, which isn't
  added here. With a fly it's the suit trousers' band, in halves joined at CB.
- **The pleated slacks' second fold** is a dart on Simons' plate (E–F to H); here both are pleats,
  spaced by `pleatSpacing` (his 1½ in, as on the slacks).
- **A fly** is offered as the `fly` variant, for those who want one; it's not in either source.
- **Pocket at the vee's end:** not drawn. The side and back pockets of the suit trousers can be
  switched on; with a side opening, sew the side pocket on the right leg only.

## Pieces
Front and back legs, waistband; with a fly, the fly shield and facing; side pocket bags, back welt
and bag and belt loops when switched on.

## Construction
Sew the back darts (or lay the front pleats and tack them at the waist). Sew the outseams, leaving the
left one open from the waist to the zip notch, and put in the zip. Sew the inseams, then the crotch
seam in one from CF round to CB. Sew on the waistband from the back edge of the opening round to the
front edge, the underlap running on past it, fold it, and close it with a button or hook. Hem the legs.
Simons gives no making-up order.
