# Kameez

**Source:** Central Board of Secondary Education with the National Institute of Fashion Technology,
*Basic Pattern Development: Students Handbook + Practical Manual, Class XII* (CBSE, Delhi, 2014),
published free by CBSE; the maintainer's copy, not in the repository. Practical 10, "A-line Kameez",
book pp. 93–94 (PDF pp. 105–106; PDF = book + 12), traced from Practical 9, "Kameez", pp. 90–92, and
section 5.8.1, p. 41. In copyright: only its construction and proportions are used here, as design
references, in our own words; no text or figure is reproduced. Inches below are the handbook's, for
its sample: bust 34¾, waist 27¾, hip 36, shoulder to waist 16, sleeve 10½, sleeve round 9¼.

**Threadloop (2026-11-15):** not searched for this one ("salwar" found none).

**Block:** FreeSewing's Brian, through the yoke template and the shift dress (`extends:
../shift-dress/spec.yaml`), as the A-line kameez is the basic kameez traced without its darts: front
and back each in one piece. `lib/yoke.mjs` gained `sleeveFinish` (a design option): `hem`, a plain
sleeve turned up at the hem with no band. All eleven yoke designs snapshot identical.

**Status:** draft. Not sewn.

## What the source shows
- **The garment (p. 41):** the long top of the salwar kameez, worn over a salwar, churidar or modern
  trousers; its silhouette has followed fashion, close and short in the 1960s, a loose tent in the
  1990s.
- **Basic kameez (Practical 9):** front and back on the fold; the bust a quarter plus 1 in each
  (4 in of ease), the waist a quarter plus 2½ in, the hip a quarter plus 1 in; a "jewel" neck from a
  twelfth of the bust; a 1 in waist dart front and back and a side bust dart in the front. The sleeve:
  its cap from half the armhole, the hem half the arm round plus ½ in.
- **A-line kameez (Practical 10):** "the basic kameez without darts", "extend 3" from the hemline",
  "join straight with the armhole level", the hem raised ½ in at the side; "side slit 10" or as
  desired"; the same sleeve. Neckline variations "as for a saree blouse".
- The table's kameez length, 14¾ in, is a misprint: the figures and drawings are below the knee.

## How it maps onto the block
| Feature | CBSE | Here (option default) |
|---|---|---|
| Ease | 4 in at the bust on 34¾ | `chestEase` 12% |
| Flare | 3 in at the hem from the armhole, on a 36 hip | `hemFlare` 8.3% of the seat |
| Length | "As measured", below the knee in the figures | `skirtLength` 50% of the waist to floor below the waist |
| Slits | 10 in "or as desired" | `sideSlit` 50% of the waist to hem (about 10 in) |
| Neck | Jewel neck | the shift dress's round neck, bound |
| Opening | Not given | ours: `opening` front, `placketDepth` 45% (about 7 in), one button or hook |
| Sleeve | 10½ in long, plain | `sleeves` short, `shortSleeve` 46% of shoulder to wrist, `sleeveFinish` hem |
| Straight kameez | The basic kameez's side seams | the `straight` variant: `hemFlare` 4% (the foundation's) |

## Changes and what isn't modelled
- **The darted, fitted kameez** (Practical 9) needs a fitted block: a queue item of its own (on Bella).
- **The kalidar kurta** (Practical 11, panels like the salwar's) is a queue item of its own.
- **The hem's ½ in rise at the side** isn't drawn: the hem is straight.
- **The opening** is ours: the practicals don't give one.
- **Neckline variations** are the shift dress's options (scoop, square, boat, V), not CBSE's.
- **No tradition marker** yet: which to show is the maintainer's choice.

## Pieces
Front and back (each on the fold), sleeves, neck placket.

## Construction
Sew the shoulders. Bind the neck and make the front opening. Set in the sleeves flat. Sew the side
seams from the underarm to the top of the slits, through the sleeves; hem the slits and the hem;
hem the sleeves. The handbook gives the assembly as a figure.
