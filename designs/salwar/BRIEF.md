# Salwar

**Source:** Central Board of Secondary Education with the National Institute of Fashion Technology,
*Basic Pattern Development: Students Handbook + Practical Manual, Class XII* (CBSE, Delhi, 2014),
published free by CBSE; the maintainer's copy, not in the repository. Practical 3, "Salwar", book pp.
73–75 (PDF pp. 85–87; PDF = book + 12), and section 5.7.1, p. 39. In copyright: only its construction
and proportions are used here, as design references, in our own words; no text or figure is
reproduced. Inches below are the handbook's, for its sample: length 40, round hip 36, round bottom 12.

**Threadloop (2026-11-15):** "salwar" finds no free patterns.

**Block:** none. Cut flat from straight lines, as the handbook draws it (the `polygon` piece type,
as the jumpsuit and aprons): the queue's "start from the pyjama trousers" didn't fit, since the
handbook's salwar has no curved leg seams to take from a block. A hidden Titan part carries the
measurements. Drafted from the wearer's seat, waist to floor and ankle, so it fits any size.

**Status:** draft. Not sewn.

## What the source shows
- **The garment (p. 39):** the lower half of the salwar kameez, from North India and especially the
  Punjab; worn by women daily, roomy enough to sit or squat on the floor. Made of "basic geometric
  shapes" laid on the fabric's width with no waste; the traditional one gathered on a drawstring, the
  modern one on a belt cut to the hip. Its hem stiffened so it falls well. 2.5 m of fabric.
- **Belt (p. 73–74):** on the fold; "AB is 2"" (the casing) and "BC is 1/6th of round hip +1"" (or
  6–8 in); its width from the cutting layout's 10 in on a 36 in hip.
- **Centre panel:** a rectangle on the fold, "GH = Full length − BC + ¾"", "GI = ½ of the bottom hem
  + ¾""; cut two.
- **Side panel (kali):** a rectangle KMRQ, "KM = ½ round hip or ½ fabric width", "MN on fold, 1/3rd
  of length − BC", "NO = ¾"", "LP = ¾"", cut on the diagonal O–P "and separate into four panels":
  four long wedges, each as long as the centre panel on its straight side, half the hip wide at the
  top, ¾ in at the foot.
- **Assembly (p. 75):** each leg a centre panel with a kali each side; the kalis meet in the crotch
  seam (their top inner edges) and the inseam (their sloping edges); the tops gathered into the belt.
- **Variations:** a Patiala salwar's kali "is cut on fabric i.e. 45" in width"; a Peshawari salwar
  is cut twice as wide again.

## How it maps onto the block
| Feature | CBSE | Here (option default) |
|---|---|---|
| Length | 40 in, as measured | `salwarLength` 96% of waist to floor (to the ankle, ours) |
| Bottom | 12 in round, "as desired" | `bottomWidth` 140% of the ankle (12 on 8½), the centre panel's width |
| Belt | BC = hip/6 + 1 (7 on 36), AB 2 in casing, 10 in each half | `beltDepth` 19.4%, `casingDepth` 5.6%, `beltWidth` 27.8% of the seat |
| Kali | KM ½ hip; MN ⅓ of the length below the belt; NO, LP ¾ in | `kaliWidth` 50% of the seat, `crotchShare` 33.3%, `kaliPoint` 2.1% of the seat |
| Patiala | Kali on a 45 in width | the `patiala` variant: `kaliWidth` 62.5% (22½ on 36) |

## Changes and what isn't modelled
- **Seam allowances:** the handbook's ¾ in on GH and GI are left out; the pattern adds its own.
- **The belt's width** isn't in the handbook's text: it's read from its cutting layout.
- **The kali's ends** are straight lines; the handbook curves the sloping edge a little into each end.
- **The length** is a share of the wearer's waist to floor, not the handbook's "as measured".
- **The stiffened hem** is the hem allowance; interface it if wanted. No ankle opening or cuff: the
  bottom is wide enough to pass the foot.
- **The Peshawari salwar** (twice the Patiala's width) is past `kaliWidth`'s range.
- **No tradition marker** yet: which to show is the maintainer's choice.

## Pieces
Centre panels (two, on the fold), side panels (four), belt (two, on the fold: front and back).

## Construction
Sew a kali to each long side of each centre panel, straight edge to straight edge. Sew the two legs'
front kalis together along their top inner edges, and the back kalis, for the crotch seam; then each
leg's front kali to its back kali along the sloping edges for the inseams. Join the belt pieces at the
sides, gather the legs' tops into the belt's lower edge, fold the casing over and thread a drawstring
or elastic. Hem the bottoms. The handbook gives the assembly as a figure, not in steps.
