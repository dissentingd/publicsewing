# Jodhpurs

**Source:** Simons, *Drafting Trousers for Men, Boys, Women* (The Garment Technical Institute,
Morris Plains, N.J., 1945), corpus `simonsdraftingtrousers1945` (not tracked; a copy on the laptop and
on the home server). Men's jodhpurs, Diagram 18, text pp. 70–73, plate p. 71 (PDF pp. 78–81); ladies'
jodhpurs, Diagram 45, text pp. 133–136 (PDF pp. 141–144). US 1945, not renewed (NYPL renewal records
for 1972–73, checked 2026-11-11): public domain in the US. Inches below are Simons': men's waist 34,
seat 40, rise 11 including a 2 in band, inseam 31, knee 15, calf 14½, bottom 15; ladies' waist 28,
seat 38, rise 13 including the band, inseam 28, knee 13½, below knee 12, calf 13, bottom 14.

**Threadloop (2026-11-15):** "jodhpurs" finds no free patterns, and "riding breeches" none either (nine
unrelated results: riding hoods, a riding corset, stirrup leggings).

**Block:** FreeSewing's Titan, through the breeches (`extends: ../breeches/spec.yaml`), whose
`trouserLeg` breeches mode gives the thigh flare and the fitted knee and calf. `trouserLeg`'s turn-up
now works on a breeches leg too (it was off for them; no existing design passes one, and the
breeches family snapshots identical). The side opening is the women's trousers' `sideZip`. Drafted
from the wearer's measurements, so it serves men, women and children.

**Status:** draft. Not sewn.

## What the source shows
- **Men's (Diagram 18):** "drafted somewhat similar to the riding breeches", "not an extreme style
  jodhpur with very full wide extended sides". The knee line an inch below the regular trousers' "to
  give more play and length when riding"; the calf line 5 in below that. The forepart's side out
  1¼ in at the thigh ("S is 1¼ inches from B"), the back's 1½ in past it ("16 is 1½ inches from S").
  Forepart ¼ the knee, calf and bottom each side of the crease; the back ⅝ in wider each side.
  "From the calf down the bottom is drafted almost straight", and "finish off at the bottom like a
  regular pair of trousers", "generally made with a 1½ inch cuff". A 2 in band, a fly, a side pocket
  6 in down, a back pocket 5 in long.
- **Ladies' (Diagram 45):** "a combination of riding breeches and regular trousers": close at the knee,
  below the knee and the calf, "the bottoms a trifle fuller". The forepart's side 1½ in out at the
  thigh, the back's 3 in past that; the back an inch wider each side below the knee; a 1-inch vee across
  the back at the knee "to get the fullness for the knee cap"; a 1¼ in cuff; a side opening with a 1½ in
  facing; the knee 12 in below the crotch line, the calf 5½ in below it.

## How it maps onto the block
| Feature | Simons (men's, on `cisMaleAdult38`) | Here (option default) |
|---|---|---|
| Knee | 7½ + 8¾ = 16¼ on a 16.1 knee | `kneeEase` 5%, `legBalance` 54% |
| Thigh flare | Forepart 1¼ in on a 40 seat; back 1½ past it, ⅝ of that its extra width | `thighFlare` 3.1% of the seat, `backFlare` 170% (2⅛ in), at most 15% of the seat |
| Calf | 7¼ + 8½ = 15¾ on the 16.1 knee, 6 in below the knee | `calfWidth` 98% of the knee, `calfAt` 29% of knee to floor |
| Bottom | 7½ + 8¾ = 16¼ on a 9¼ ankle | `cuffWidth` 176% of the ankle |
| Length | To the instep, like trousers | `breechesLength` 93% of knee to floor |
| Cuff | 1½ in on about 40 waist to floor | `turnUps` on, `turnUpDepth` 3.75% |
| Band | Finished 2 in | `waistbandHeight` 5% |
| Opening | Fly | `opening: fly` |
| Ladies' | Flare 1½ on 38, the back 3½ from its own line; knee 15½ on 14.4; calf 15 on the knee; calf 5½ below the knee on 17.6; 1¼ in cuff; side opening, 1½ in facing | the `ladies` variant: `thighFlare` 3.9%, `backFlare` 230%, `kneeEase` 8%, `legBalance` 56%, `calfWidth` 104%, `calfAt` 31%, `turnUpDepth` 3.2%, `opening: side` (`sideUnderlap` 5.4%) |

## Changes and what isn't modelled
- **The knee fits at Titan's knee line**, not an inch below it.
- **The back's flare is capped** at 15% of the seat: past about 16% the back's outseam can't be
  matched to the front's. Simons' drafts are well inside it.
- **The ladies' knee-cap vee** across the back isn't drawn; nor the men's knee vee carried over from
  his riding breeches (the curved lines at the knee on the plate).
- **The below-knee measurement** isn't used: the leg runs from the fitted knee to the calf and on.
- **The ladies' bottom** (14 round) comes out as the men's share of the ankle (176%), a little fuller
  than her 14 in on a 9 in ankle (156%).
- **No buttoned leg opening:** the bottom is wide enough to go on over the foot. The breeches'
  button stand and facing aren't cut.
- **Pockets, belt loops and the waist dart** are the breeches' (the trousers').

## Pieces
Front and back legs, waistband (with a fly: two halves; with a side opening: one strip), fly shield
and facing, belt loops, side pocket bags, back welt and bag.

## Construction
As the trousers: darts, pockets, the fly (or the side zip in the left outseam), outseams, inseams,
the seat seam, waistband and loops. Turn up the cuffs on the marked lines, as the trousers' turn-ups.
Simons gives no making-up order.
