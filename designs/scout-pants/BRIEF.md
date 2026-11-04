# Scout pants

**Source:** Simons, *Designing Boys' and Juveniles' Clothing* (1922), corpus
`designingboysjuv00simo`, Diagram 44, text on book pp. 122 and 124, plate p. 125
(PDF pp. 128, 130 and 131). US 1922, public domain. The stated size 14 is waist
28, seat 33, rise 8, regular inseam 28, finished inseam 23, above knee 11,
calf 12 and shank 9½ inches.

**Block:** FreeSewing's Titan through `suit-trousers`, for the fly, pockets and
waistband. The queue's `knee-pants` ends at the knee; this plate reaches the
shank and has a back knee tuck. `trouserLeg`'s fitted lower leg supplies the
three shaping stations, with independent front and back shares at calf and hem.

**Status:** draft. Not sewn.

**Threadloop:** Searches for "scout pants" and "tapered trousers" did not establish a free equivalent drafted from measurements. The available search results were inconclusive; this is not a claim that none exists.

## What the source states and shows

The text puts D 12 inches down the inseam (half the regular 28 inch inseam,
less 2), G 23 inches down, and F halfway between them. On the plate, D is the
upper knee, F the calf and G the shank hem. The forepart uses a quarter of
the stated circumference on each side of its crease. The back adds ⅝ inch
at calf on each side and 1¼ inch at shank on each side. A ½ inch V is taken
across the back near the knee, and a ½ inch pleat at the back hem. The text
says these shorten the back while retaining room at the knee.

The plate shows the V crossing the back leg above the lower calf and the
hem pleat centred behind the shin. No front crease pleat or lower leg
opening is shown.

## Mapping to options

| Source | Default | Calculation at size 14 |
|---|---|---|
| Upper knee 11 plus the back's extra ¾ inch at each side | `kneeEase` 14%, `legBalance` 56% | 12½ / 11 = 114%; back 7 / 12½ = 56% |
| Calf 12 plus ⅝ inch each back edge | `scoutCalfWidth` 106%, `scoutCalfBalance` 55% | 13¼ / 12½ = 106%; back 7¼ / 13¼ = 55% |
| Shank 9½ plus 1¼ inch each back edge | `scoutHemWidth` 96%, `scoutHemBalance` 60% | 12 / 12½ = 96%; back 7¼ / 12 = 60% |
| D at 12, F at 17½, G at 23 on a regular 28 inch inseam | `scoutCalfAt` 34%, `scoutLength` 69% | (17½ - 12) / (28 - 12) = 34%; (23 - 12) / 16 = 69% |
| ½ inch V and hem pleat | `backKneeV`, `backHemPleat` 4.5% each | ½ / 11 = 4.5% |

## Pieces and construction

Front and back legs, waistband, fly shield and facing, belt loops and pocket
pieces. Sew the marked V tuck across each back knee and fold the pleat at each
back hem, then sew the legs and finish as the suit trousers.

## Changes and limits

- The back V and hem pleat are marked for sewing, leaving their intake in the
  cut piece. The two legs of the V start at the inseam and meet at the outseam.
  Simons' plate shows the V removed by slashing and closing before
  cutting. The resulting finished shaping is similar; the unsewn back is longer.
- The waistband, zip fly and pockets come from the parent trousers. Diagram
  44 does not detail them.
- There is no `usdaBoyC14` model. The preview uses `cisMaleAdult32` because
  its waist is closest among the available sets (27.6 versus 28 inches),
  although its seat is larger (36.3 versus 33 inches). The source's dimensions
  above calibrate the proportions; the preview is a grading check, not a
  recreation of the book's size 14.
