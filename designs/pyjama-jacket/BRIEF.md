# Pyjama jacket

**Source:** Vincent, *The Cutter's Practical Guide to Cutting and Making Shirts, Undergarments,
Collars, Cuffs, Aprons, and Specialité Clothing for Various Occupations* (London, 1890), corpus
`vincentmakingshirts18xx` (Cloudbox; PDF p. 29). "Pyjama Jackets", p. 25, Diagrams 1–3. Public
domain (published 1890; Vincent died 1926). Inches below are Vincent's.

**Block:** FreeSewing's Brian, through the barber's coat (`extends: ../barbers-coat/spec.yaml`):
its loose body, stand collar buttoned to the neck, facings and patch pockets. Worn with the
pyjama trousers (`designs/pyjama-trousers`).

**Status:** draft. Not sewn.

## What the source shows
"The pyjama sleeping suit has taken the place of the night shirt": a jacket and trousers.
- **Loose-fitting**, buttoned (or fastened with cord frogs) up to the throat, with a stand
  ("Prussian") collar.
- **Width:** 9–20 is half the chest plus 2 in, 4 in over the chest.
- **Length:** the full length taken on the customer; the front ¾ in longer than the back.
- **Button stand** 1½ in. Diagram 1 shows five fastenings, from the neck to the waist.
- **Side seam** a quarter of the breast from the back, the forepart overlapping the back ¾ in at
  the waist: almost no shaping.
- **Sleeve:** a two-piece coat sleeve, roomy; cuff ⅙ breast less ½ in, elbow ⅙ breast plus 1¼.
- **Collar** (Diagram 2): half the neck plus ½ to 1 in long, about 1½ in wide.
- **A patch pocket on the left breast** (Diagram 3).
- **Making:** unlined except a narrow facing down the front, seams turned in and stitched for
  washing, edges single-stitched.

## How it maps onto the block
| Feature | Vincent | Here (option default) |
|---|---|---|
| Ease | Half chest plus 2 in | `chestEase` 11% |
| Length | Full length (about 11 in below the waist at breast 38) | `lengthBelowWaist` 105% of waist to seat |
| Front drop | ¾ in | `frontDrop` 7% of waist to seat |
| Button stand | 1½ in | `buttonExtension` 3.9% of the chest |
| Fastenings | Five, neck to waist | `buttons` 5, from the neck to just below the waist (the barber's coat's placing) |
| Collar | About 1½ in, stand | `collarHeight` 10% of the neck; the barber's coat's stand collar |
| Cuff | About 11¾ in round | `cuffEase` 70% of the wrist |
| Pocket | Left breast, patch | `breastPocket` on (cut 1), `lowerPockets` off, `pocketShape` square |

## Changes and what isn't modelled
- **A one-piece sleeve** (Brian's), not Vincent's two-piece coat sleeve.
- **Cord frogs** aren't drawn; buttons are marked where they'd go.
- **The last button** sits a little below the waist, as on the barber's coat, rather than at it.
- The barber's coat's open-neck option still works (`neckStyle: open`), as do its lower pockets.

## Pieces
Back (on the fold), front (cut 2), facing (cut 2), stand collar (cut 2 + interfacing), sleeve
(cut 2), breast pocket (cut 1).

## Construction
1. Breast pocket: turn the top hem, press the edges under, topstitch to the left front.
2. Shoulders and side seams, felled or turned in and stitched.
3. Facings to the fronts; the collar to the neck, its ends at the front edges.
4. Sleeves: underarm seam, then set in.
5. Hems; buttonholes on the right front (men's), buttons on the left.
