# Breeches

**Source:** Simons, *Drafting Pants and Overalls* (The Clothing Designer Co., New York, 1916),
corpus `draftingpantsove00simo` (tracked). "Riding Breeches", Diagram XV, p. 30 (PDF p. 34). US
1916, public domain. Inches below are Simons', for a 34 waist, 40 seat, 16 knee, 12½ calf, 10½
shank, 10 rise.

**Block:** FreeSewing's Titan, through ЕМКО's trousers (`extends: ../trousers/spec.yaml`,
`lib/trousers.mjs`): their waist darts, zip fly, side and back pockets, waistband and loops. Added
for the breeches: a breeches leg on the `trouserLeg` operation (thigh flare, a leg fitted from the
knee to a cuff, a buttoned opening at the lower outseam).

**Status:** draft. Not sewn.

## What the source shows
- **Seat and thigh:** the forepart's outseam flares out 2 in past the seat line (C to T) and the
  back's 2¼ in (T to 22), the widest at the thigh, curving back in to the knee.
- **Knee and below:** fitted. The forepart is ½ the knee at the knee line (Z to 5, Z to 6, ¼ each
  side), ½ the calf at the calf line (2 to 7, 2 to 8) and ½ the shank at the bottom (V to 9, V
  to 10); the back is ½ in wider each side at the knee and calf, ¾ in at the bottom.
- **Lengths:** the thigh line 20 in below the waist, the fitted knee 7 in below that, the calf
  11½ in and the bottom (shank) 19 in.
- **Waist:** a waistband 1½ in wide; small Vees out of the forepart and back.
- **Front buttoning** (an alternative): 2¼ in taken off the forepart's lower edge and added to
  the back, so the buttons run down the front of the shin.

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Seat | Roomy | `seatEase` 8% (the trousers' 5%) |
| Thigh flare | 2 in front, 2¼ back | `thighFlare` 5% of the seat (2 in on 40), the back ⅛ more; widest `thighAt` 40% of the way from the fork to the knee |
| Knee | Forepart ½ knee, back ½ in wider each side (17 round a 16 knee) | Titan's knee with `kneeEase` 6%, the back's share `legBalance` 53% (9 of 17) |
| Calf | ½ calf, the back wider; 12½ calf on a 16 knee (78%) | `calfWidth` 88% of the knee, `calfAt` 40% of knee to floor below the knee |
| Bottom | Shank 10½ | `cuffWidth` 118% of the ankle, `breechesLength` 80% of knee to floor below the knee |
| Opening | Down the outseam below the knee (or the front) | From `openingTop` 8% of knee to floor below the knee to the hem; `breechesButtons` 7, holes on the front |
| Waist, fly, pockets | Waistband, Vees | The trousers' waist darts, zip fly, side and back pockets, waistband, belt loops |

## Changes and what isn't modelled
- **The calf is wider than Simons'.** His calf is 78% of his knee; drafted from a knee
  measurement alone that would be tighter than most calves at the calf line, so the default is
  88%. Lower it for a close fit (`calfWidth`).
- **The knee fits at the knee**, Titan's knee line, not 7 in below the thigh line.
- **Front buttoning** isn't built; the opening is at the outseam.
- **No strappings** (the reinforcing patches inside the knee of riding breeches).

## Pieces
Front, back, waistband, fly shield and facing, belt loops, side and back pocket pieces (as the
trousers), button stand (back, cut 2, folded), opening facing (front, cut 2).

## Construction
1. Darts, pockets and fly as the trousers.
2. Opening: the facing to the front's lower outseam edge, turned in; the folded stand to the
   back's.
3. Outseams from the waist down to the opening's notch; inseams; crotch seam.
4. Waistband and loops; cuff edges turned; buttonholes on the front edge, buttons on the stand.
