# Peg-top pants

**Source:** Simons, *Drafting Pants and Overalls* (The Clothing Designer Co., New York, 1916),
corpus `draftingpantsove00simo` (tracked). "Full Peg Pants", Diagram VIII, pp. 14–15 (PDF pp.
18–19). US 1916, public domain. Inches below are Simons', for a 34 waist, 40 seat, 22 knee, 16
bottom, 9 rise.

**Block:** FreeSewing's Titan, through ЕМКО's trousers (`extends: ../trousers/spec.yaml`,
`lib/trousers.mjs`): their legs, back dart, zip fly, side and back pockets, waistband and loops.
Added for these: front pleats on `trouserLeg` (`pleats`, `pleatSpacing`).

**Status:** draft. Not sewn.

## What the source shows
"For full peg trousers… the inseam construction line is squared straight down from point J on
the seat line. This gives you the extra length on the outside seam that is required."
- **Waist:** the forepart's waist ½ the waist (L–N), but the back's and forepart's together are
  ½ the seat plus 2¼ in (22¼ for a 34 waist), so 5¼ in more than the half waist goes into the
  front as fullness (pleats) over the hips.
- **Leg:** the knee 22 (C to V, ½ each side), the bottom 16 (P to U); the outseam N–R–V–U swept
  out over the hip and in to the bottom; the inseam straight down from the seat.
- **Back:** the seat 3–S–9 as the regular pants; ⅜ in added at the knee and bottom.
- Simons' regular peg pants (Diagram VII, young men's) are the same idea, less full: knee 19,
  bottom 15.

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Hip fullness | 5¼ in over the half waist, in the front | `frontDart` 100% of half the seat less half the waist, laid as `pleats` 2, `pleatSpacing` 3% of the seat apart; the outseam curves out above the seat to take it |
| Knee | 22 | `kneeEase` 37.5% (the trousers' 25%) |
| Bottom | 16 on a 22 knee | `hemWidth` 73% of the knee |
| Seat | As the regular pants | `seatEase` 8% |
| Back | Regular | The trousers' back dart |

## Changes and what isn't modelled
- **The fullness is laid in pleats**, two each side, folded toward the side seam; Simons leaves the
  finish (pleats or gathers) to the maker.
- **The inseam isn't squared straight down from the seat**; it's Titan's.
- **No turn-ups**; Simons' cuff bottoms (Diagrams F, G) aren't built.

## Pieces
As the trousers: front, back, waistband, fly shield and facing, belt loops, pocket pieces.

## Construction
As the trousers, the pleats basted at the waist before the waistband goes on.
