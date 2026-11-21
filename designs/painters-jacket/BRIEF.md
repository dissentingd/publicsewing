# Painter's jacket

**Source:** Vincent, *The Cutter's Practical Guide to Cutting and Making Shirts, Undergarments* (1890),
p. 35 (PDF p. 39), `vincentmakingshirts18xx`. Drafted for a 36 in breast. Vincent died in 1926, so the
book is public domain in the US and wherever the term is life plus 70 or shorter.

**Block:** extends `barbers-coat` (Brian, `lib/coat.mjs`): body, stand collar, facing and patch pockets.
The sleeve opening, cuff and placket are the dress shirt's pieces.

**Threadloop:** no free painter's jacket ("painter jacket" finds one unrelated craft case). Work jackets are
plentiful, but nothing there matches this knee-length coat or says it's drafted from measurements.

**Status:** draft. Not sewn.

## What the source shows
- **Body:** easy fitting, covering the knees, with a level hem: 17½ in from neck level to the waist line
  and 34 in to the hem.
- **Front:** single-breasted, five buttons, a narrow facing.
- **Collar:** Prussian (a stand), about 1¾ in.
- **Pockets:** three patch pockets, the breast one about 5⅝ × 6⅝ in and each lower one about 7½ × 8 in.
- **Sleeve:** the cook's jacket sleeve, from the earlier diagram, with a button cuff, about 2½ in deep.
- **Plate:** back, forepart, collar and a cuff detail.

## How it maps onto the block
Reference size `cisMaleAdult38`; Vincent drafts a 36 breast.

| Feature | Vincent | Here (option default) |
|---|---|---|
| Fit | Easy | `chestEase` 18%, the barber's coat's |
| Length | 34 in neck to hem, 17½ in to the waist | `lengthBelowWaist` 210% of waist to seat |
| Hem | Level | `frontDrop` 0 |
| Buttons | Five | `buttons` 5 |
| Collar | Stand, about 1¾ in | `collarHeight` 11.5% of the neck |
| Pockets | Three patches | The barber's coat's breast and lower pockets, `pocketShape` rounded |
| Cuff | Button cuff, about 2½ in deep | `cuffDepth` 35% of the wrist |
| Cuff fit, opening, lap | Not given | `cuffFit` 35%, `sleeveSlit` 75%, `cuffLap` 15% of the wrist: ours |

**Variant:** `plain`: no pockets.

## Changes and what isn't modelled
- **Pocket sizes are the barber's coat's proportions,** not Vincent's 5⅝ × 6⅝ and 7½ × 8 in.
- **The collar is the shared stand collar,** not a new draft of his Prussian collar.
- **The sleeve is Brian's fitted sleeve** with the dress shirt's opening and cuff, not the cook's jacket
  sleeve.
- The sleeve opening, cuff fit and lap are ours: Vincent gives no dimensions.

## Pieces
Back (on the fold), fronts, facing, collar, sleeves, cuffs, sleeve plackets, breast pocket, lower pockets.

## Construction
1. If a breast pocket is selected, prepare and attach it at P7 to the front.
2. If lower pockets are selected, prepare and attach them at P8 to the fronts.
3. Join the A shoulders and B side seams; attach the E facings to the front edges.
4. Sew the G collar outer edge, turn it, then attach it at D to the neckline with its ends at the front edges.
5. Bind the sleeve openings, close the F underarm seams, set the sleeves at C and pleat their fullness into the cuffs.
6. Finish the H hem, then work the BH front buttonholes on the right and attach buttons on the left.
