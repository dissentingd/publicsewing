# Jeans

**Source:** inspired by Helen Joseph-Armstrong, *Patternmaking for Fashion Design*, 5th ed. (Pearson,
2010), and Winifred Aldrich, *Metric Pattern Cutting for Women's Wear*, 6th ed. (Wiley, 2015), the
maintainer's own copies; not in the repository. Both are in copyright: only their methods and
proportions are used. This text and the pattern are our own.

**Threadloop (2026-11-15):** "jeans" finds 167 free patterns, about ten of them jeans (Mood Sewciety's
Calamint, Nolana, Honey, Ren, Forsythia and Obsidian; 1083's straight and bootcut; Initiative
Handarbeit's Weite Jeans; a jeans-making toolkit); whether any is drafted from measurements wasn't
checked.

**Block:** FreeSewing's Titan, through the suit trousers (`extends: ../suit-trousers/spec.yaml`): the
legs, fly, fly shield and belt loops. `trouserLeg` gained `keepOutline` (its seams kept for a later
operation); `lib/jeans.mjs` (new) cuts the legs into jeans pieces: the `jeanLeg` operation and the
`jeanPiece` and `jeanBand` piece types. Drafted from the wearer's measurements, so it serves women's,
men's and children's sizes.

**Status:** draft. Not sewn.

## What we took
The idea of a close contour fit, a shaped waistband cut from the legs' upper edge, a back yoke that
absorbs the dart, a scooped front pocket with its facing, bag and coin pocket, and pointed patch
pockets on the seat, at comparable proportions. The bootcut's flare was checked against Aldrich.

## How it maps onto the block
| Feature | Here (option default) |
|---|---|
| Seat and waist ease | `seatEase` 1.5%, `waistEase` 4% |
| Front | No dart: `frontDart` 0 |
| Back dart | `backDart` 15% of the waist shaping, its point moved to the yoke seam |
| Leg | `kneeEase` 15%, `hemWidth` 73% of the knee |
| Waistband | `waistbandHeight` 3.8% of waist to floor; the left side laps past centre front |
| Yoke | `yokeDepth` 37% at centre back, `yokeSide` 31% at the side, of waist to seat |
| Pocket opening | `pocketEntryWidth` 10.8% of the seat, `pocketEntryDepth` 34% of waist to seat |
| Pocket bag | `pocketBagWidth` 13.5% of the seat, `pocketBagDepth` 86% of waist to seat; the facing 71% of the bag's depth |
| Coin pocket | `coinPocketWidth` 7.4% of the seat, its depth 1.18 × its width |
| Back pocket | `backPocketWidth` and `backPocketDepth` 16.2% of the seat, `backPocketPoint` 12.5% of its depth |
| Fly | `flyWidth` 5.6% of the waist |
| Tapered leg | The `tapered` variant: `hemWidth` 60% |
| Bootcut leg | The `bootcut` variant: `kneeEase` 10%, `hemWidth` 115% |

## Changes and what isn't modelled
- **Pocket depths** are measured down from the waistband's lower edge.
- **The back dart** ends on the yoke seam, so it closes entirely inside the yoke.
- **The yoke seam** is straight. The back pocket sits centred on the dart and square to that seam.
- **The waistband** is a curved band whose edges follow the band lines on the legs. Where the waist is
  wider than the hips, it curves the other way.
- **The front pocket's opening** is our own curve.
- **Five belt loops** and the rivet positions are our choices.
- **Not modelled:** a roomier seat, lower-rise bands, topstitching lines and stitched pocket designs.

## Pieces
Front and back legs, contour waistband (cut four: two with the lap, two ending at centre front), back
yokes, pocket facings, pocket bags and pocket linings (lining fabric), coin pocket, back patch pockets,
fly shield and facing, belt loops.

## Construction
1. Stitch the coin pocket to the right facing, then each facing to its bag.
2. Join each pocket lining to the front along the curved opening. Turn it inside, topstitch the edge,
   and stitch the bag closed.
3. Attach the yokes to the back legs and topstitch. Position the back pockets below them and stitch.
4. Put in the zip with the fly facing and shield.
5. Close the inner leg seams, then the outer leg seams, then the seat seam in one pass.
6. Join the waistband sections at centre back. Stitch the band to the jeans, enclose the seam with its
   facing, and topstitch.
7. Add the belt loops and hem the legs. Finish with rivets at the pocket corners.
