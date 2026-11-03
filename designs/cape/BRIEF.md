# Cape

**Source:** Mitchell, *The New "Standard" Work on Designing Ladies' Tailor-Made Garments* (1921), corpus
`newstandardworko00mitc` (tracked). "The Cape", text p. 58, diagram p. 59 (PDF pp. 62-63). US 1921, public domain. Inches below are
Mitchell's. Compared with Pivnick, *How to Design Beautiful Clothes* (1949), corpus `pivnickdesignclothes1949` (untracked), the circular
cape, pp. 259-260.

**Block:** FreeSewing's Brian, only for the neck and shoulder. Added for this cape: `lib/cape.mjs` (`capeBase`, `capeLayout`, the `cape`
piece type).

**Status:** draft. Not sewn.

**Threadloop:** 68 free results for "cape" (2026-11-03); the first five are capes by name. Their listings don't say any is drafted from measurements.

## What the source shows
- **The method** (p. 58): a plain box coat is drafted first and cut out. Its back is laid with CB on line A-2, its front with CF on line A-3
  square to it, the shoulder points ¼ in apart. The neck and shoulders are copied.
- **The arc:** 4 from 3 is ½ the line 2-3 less ½ in. 5 from 2 is the cape's length. 6 from 5 is ⅝ in. A sweep from 6 pivoted at 4, and 5 connected to it.
- **One piece:** a dart on the shoulder only.
- **Two pieces:** 7 halfway between the neck points, 8 halfway between the shoulder points, a line through them. 9 from 8 is 6 in. Each side shaped from
  8 through 9 and on down, the two pieces crossing past the line (p. 59).
- **The front:** a lap past CF, about 2 in as drawn. **Not given:** a collar, fastenings, a hem.

Pivnick's circular cape lays the bodice patterns so the shoulder lines meet, without a dart, and hangs the bottom from three length measures.
Her dolman cape is fitted on a French lining foundation we don't have, and isn't built.

## How it maps onto the block
| Feature | Mitchell | Here (option default) |
|---|---|---|
| Pieces | One or two | `capePieces` two |
| Length | About 29 in as drawn | `capeLength` 50% of nape to floor (about 29 of 58) |
| Shoulder tips | ¼ in apart | `capeGap` 0.66% of the chest (¼ of 38) |
| Arc's centre | ½ of 2-3 less ½ in | `capePivot` 1.3% of the chest (½ of 38) |
| Back's hem | ⅝ in | `capeDrop` 2.2% of the length |
| Seam | 6 in below the tip | `capeSeamDrop` 25% of shoulder to wrist (6 of about 24) |
| Flare | About 15° each side, measured off p. 59 | `capeFlare` 15° |
| Lap | About 2 in, measured off p. 59 | `buttonExtension` 5.3% of the chest |

## Changes and what isn't modelled
- **No box coat is drafted.** Brian's neck and shoulder stand in for it, so the cape draws from any figure, men's and children's too.
- **The one thing the book leaves free:** laying the back on one line and the front on another, tips ¼ in apart, doesn't fix both.
  Here the tips sit apart on the diagonal, square to the line 2-3.
- **The collar, three buttons and a folded-back facing are ours**: `collarWidth` 22%, `capeButtonSpacing` 8%, `facingWidth` 8%. Buttonholes are
  worked on the other front, on CF.
- **Hem allowance:** two seam allowances, narrow because it's curved.
- **Fit over clothes:** only the neck and shoulders fit. The chest is whatever the circle gives.
- **Pivnick's dolman cape**, named in the queue, isn't built.

## Pieces
Two pieces: front (cut 2), back (fold), collar. One piece: the cape (fold), collar.

## Construction
1. Two pieces: sew each side from the neck over the shoulder to the hem, easing at the tip. One piece: sew the shoulder darts.
2. Let it hang for a day, as most of the hem is on the bias.
3. Fold the facing back along the marked line. Collar to the neck, with the facing's top.
4. Level the hem on the wearer if it has dropped, and hem it, easing the fullness in.
5. Buttonholes and buttons.

## Checks
`test/cape.test.mjs`: every size, two pieces and one, long, short and unflared, and fully flared. The side seams, the shoulders, the dart's
legs, the front and back about as long as each other, the collar, the hem well round the figure.
