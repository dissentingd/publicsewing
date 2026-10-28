# Work shirt

**Source:** W. D. F. Vincent, *The Cutter's Practical Guide to Cutting and Making Shirts,
Undergarments, Collars…* (London, 1890), corpus `vincentmakingshirts18xx` (laptop). "The
working-man's shirt", Diagrams 1–3, p. 17; "How to cut and make a workman's shirt", p. 34. Public
domain (published 1890, Vincent died 1926). Inches below are Vincent's.

**Block:** FreeSewing's Brian, through the yoke template (`extends: ../templates/yoke.yaml`,
`lib/yoke.mjs`), as the nightshirt: a back yoke, the body below it, a placket, a neck band or
collar, sleeves into bands. Added for this shirt: a breast pocket's place on the yoke body
(`yoke.frontPocket` in the store), the pocket a `polygon` piece.

**Status:** draft. Not sewn.

## What the source shows
- **Back (Diagram 1):** a yoke across the shoulders, its depth to taste, 1 in overlap; 2 in added
  at CB "for fulling into yoke"; the side seam a quarter of the chest plus 2½ in from CB; length
  to measure (Vincent's shirts are at least 34 in from the collar seam).
- **Forepart (Diagram 2):** no yoke; the side seam a quarter chest plus 2½ in from CF; the front
  2 in shorter than the back; 2½ in added down the centre "for pleat, etc." (the fly).
- **Sleeve (Diagram 3):** set in plain, with a 3 in gusset under the arm; the wristband 2½ in
  wide and 1½ in longer than the wrist.
- **Workman's shirt (p. 34):** a stand collar (the neck band cut 3 in wide, doubled), the fly 14½
  in long, one hole and button at the cuff, drill or Harvard shirting, often lined across the
  shoulders.
- An outside breast pocket on the left is "now generally added" (the night shirt's notes, p. 16).

## How it maps onto the block
| Feature | Vincent | Here (option default) |
|---|---|---|
| Ease | Quarter chest + 2½ in at the side seam | `chestEase` 26% (10 in on a 38 chest) |
| Yoke | Back only, depth to taste | `frontYoke` off, `yokeDepth` 35% of neck point to chest line |
| Back fullness | 2 in at CB into the yoke | `gathers` 118% |
| Length | 34 in from the collar seam | `skirtLength` 38% of waist to floor below the waist |
| Fly | 14½ in, buttoned | `opening` front, `placketDepth` 80% of HPS to waist, `buttons` 4 |
| Neck | Stand, the band cut 3 in, doubled | `neckFinish` band, `bandHeight` 9.5% of the neck; or a turn-down `collar` (`collarWidth` 18%, `collarSpring` 10%) |
| Wristband | 2½ in, 1½ in over the wrist | `sleeveBand` 17% of the wrist, `sleeveBandEase` 21% |
| Pocket | Left breast, outside | `breastPocket`: 13% of the chest wide, 15% deep, 5% of the chest from CF |
| Tails | Side seams to the bottom, or slit | `sideSlit` 20%, `hemCorner` 50% (rounded) |

## Changes and what isn't modelled
- **No underarm gusset**: the yoke sleeve has the room in its cap and width instead.
- **The front isn't 2 in shorter**: front and back hems are level, the tails rounded at the
  side slits.
- **The back fullness is gathered**, spread along the yoke seam, rather than laid as a pleat at CB.
- **No shoulder lining.**

## Pieces
Front (on the fold), back (on the fold), back yoke (cut 2), sleeves, wristbands, placket, neck band
(or collar), breast pocket.

## Construction
1. Pocket: hem the top, press the edges under, topstitch to the left front on its mark.
2. Placket at the front slit.
3. Back gathered into the yoke, the yoke lining over; fronts to the yoke at the shoulders.
4. Neck band (or collar).
5. Sleeves set in; underarm and side seams to the slits.
6. Wristbands; hem; buttonholes and buttons.
