# Middy blouse

**Source:** Simons, *Designing Boys' and Juveniles' Clothing* (1922), corpus
`designingboysjuv00simo` (laptop, Cloudbox). "Sailor's Middy Blouse", Diagram 9, pp. 36–40. US
1922, public domain. Size 6: breast 24, waist 24, waist length 10½, full length 21½ (inches).

**Block:** FreeSewing's Brian, through the yoke template (`extends: ../templates/yoke.yaml`,
`lib/yoke.mjs`) with no yokes, as the shift dress: back and front each in one piece. Added for
the middy: a V neck on the front (`vNeck`) and the `sailorCollar` piece; the shield is a
`polygon` piece. Drafted from the wearer's measurements, so it fits any size, adults included.

**Status:** draft. Not sewn.

## What the source shows
"A regular sailor's middy blouse… made either with the open collar and shield or the short
collar laced."
- **Body:** a loose pullover, back and forepart straight from the armhole to the bottom, no
  waist shaping; the forepart ½ the breast from the back's line plus 4 in (S to T).
- **Neck:** a deep V on the forepart; the collar's neck edge follows it.
- **Collar:** the under collar 5¾ in wide at CB (22 from X), square across the back, its front
  running down to the V, "slightly rounded"; the top collar drafted on the shoulders (back
  placed on the forepart's shoulder).
- **Shield:** 6½ in long, 8½ in wide, filling the V.
- **Sleeve:** one piece, the inseam 11 in; the cuff 2½ in wide, 7⅞ in round open, leaving 5 in
  of fullness in the seam.
- **Yoke points** marked 2⅜ in below the shoulder on the forepart, 2½ in on the back.

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Ease | ½ breast + 4 in across the forepart | `chestEase` 25% |
| Length | 11 in below the waist of 21½ | `skirtLength` 35% of waist to floor below the waist |
| V neck | To about the chest line | `vNeck` 95% of the neck point to the chest line |
| Collar | 5¾ in at CB, square across the back | `collarDepth` 23% of the chest, `collarSpan` 95% of the way out to the shoulder point |
| Shield | 6½ × 8½ in | Across the V's neck points plus 4% of the chest, 70% of the V's depth; cut 2 |
| Cuff | 2½ in wide, 7⅞ in round | `sleeveBand` 25% of the wrist, `sleeveBandEase` 50% |

## Changes and what isn't modelled
- **No yoke seams**: Simons' yoke points are left off; the body is plain.
- **The collar's front edge is straight** from the back corner to the V, not rounded.
- **No laced short collar**, no tie, no trim.

## Pieces
Front and back (on the fold), sleeves, cuffs, sailor collar (on the fold, cut 2: collar and
facing), shield (cut 2).

## Construction
1. Shoulder seams; bind or face the V and back neck.
2. Collar and its facing: sew round the outer edge, turn, press; sew to the neckline from the V
   round the back.
3. Sleeves set in; underarm and side seams; the sleeve's fullness pleated into the cuffs.
4. Hem. Shield: sew the two pieces round, turn; buttonholes at the top corners, buttons inside
   the front at the V.
