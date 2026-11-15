# Jeans

**Source:** Helen Joseph-Armstrong, *Patternmaking for Fashion Design*, 5th ed. (Pearson, 2010), the
maintainer's own copy; not in the repository. Chapter "Pants": the jean foundation, book pp. 673–675
(PDF pp. 680–682; PDF = book + 7), and the jean with a V-yoke, Variation 1, book pp. 700–703 (PDF pp.
707–710), with their figures. Checked against Winifred Aldrich, *Metric Pattern Cutting for Women's
Wear*, 6th ed. (Wiley, 2015), the maintainer's own copy: basic jeans, book pp. 56–57, and hipster
jeans, p. 58 (PDF = book + 4). Armstrong's children's jeans (book p. 888) were looked at for their
proportions. Both books are in copyright: only their construction and proportions are used here, as
design references, in our own words; no text or figure is reproduced. Inches below are Armstrong's,
for her size 10 (about our `cisFemaleAdult30`: waist 26.6, seat 37, waist to seat 9.1); Aldrich's are
centimetres.

**Threadloop (2026-11-15):** "jeans" finds 167 free patterns, about ten of them jeans (Mood Sewciety's
Calamint, Nolana, Honey, Ren, Forsythia and Obsidian; 1083's straight and bootcut; Initiative
Handarbeit's Weite Jeans; a jeans-making toolkit); whether any is drafted from measurements wasn't
checked.

**Block:** FreeSewing's Titan, through the suit trousers (`extends: ../suit-trousers/spec.yaml`): the
legs, fly, fly shield and belt loops. `trouserLeg` gained `keepOutline` (its seams kept for a later
operation); `lib/jeans.mjs` (new) cuts the legs into jeans pieces: the `jeanLeg` operation and the
`jeanPiece` and `jeanBand` piece types. Drafted from the wearer's measurements, so it serves women's,
men's and children's sizes, as Armstrong's jean foundation does for her women's and children's drafts.

**Status:** draft. Not sewn.

## What the source shows
- **Fit (the jean foundation, pp. 673–675):** a contour fit. Front and back hip each "plus 1/8 inch
  (ease)"; the waist arcs plus 1 in at the back and ¾ in at the front, "dart and ease included", with a
  ¾ in back dart 3½ in long and a ½ in front dart; a relaxed fit adds an inch to the back crotch. A
  dartless version moves the darts' excess to the side and centre seams.
- **Waistband (Variation 1):** a contour band from the waist down 1½ in, cut off the top of the legs,
  the darts and side seam closed to join its parts. Cut twice for each side and interfaced; the left
  side's runs on 1¼ in past CF. Variations 2 and 3 set it lower.
- **Legs:** the knee measurement plus 2 in, the ankle plus 3 in; tapered and flared leglines drawn
  from the knee down.
- **Back yoke:** its seam 3 in down the CB from the waist and an inch below the band at the side;
  the yoke cut off and its dart closed; "Trim remaining dart excess at center back." Aldrich: 7 cm at
  CB and 3 cm at the side below the band.
- **Back pocket ("Western pocket"):** 6 in across the top, 6 in deep to the point, 5 in across the
  lower corners, the point ¾ in below them; set an inch and 1¼ in below the yoke; rivets at its top
  corners.
- **Front pocket:** the mouth from 4 in along the top from the side to 2¾ in down it, curved; a pocket
  backing 5 in across and 7 in deep with a rounded corner; a self-facing "2 inches shorter than the
  lining"; a lining with the mouth cut out; an item (coin) pocket on the facing, 2¾ in wide, an inch
  from the side and from the top, rivets at its corners. Aldrich draws the same pieces, the side piece
  carrying the pocket line.
- **Fly:** 1½ in wide; the shield 2½ in wide, an inch longer than the zip. ½ in seams, ¼ in at the
  pocket mouth.

## How it maps onto the block
| Feature | Armstrong | Here (option default) |
|---|---|---|
| Hip ease | ⅛ in on each quarter: ½ in on 37 | `seatEase` 1.5% |
| Waist ease | 1 in round, less the darts | `waistEase` 4% |
| Front | Dartless | `frontDart` 0 |
| Back dart | ¾ in of about 5 in half waist shaping | `backDart` 15%, its point moved to the yoke seam |
| Knee | Knee + 2 in, on about 13.8 | `kneeEase` 15% |
| Hem | Ankle + 3 in over the knee's 15.8 | `hemWidth` 73% |
| Band | 1½ in, on her waist to floor of about 39.4 | `waistbandHeight` 3.8%; the left side's lap 1¼ in on a 26½ waist |
| Yoke | 3 in at CB, 2½ in at the side, from the waist | `yokeDepth` 33%, `yokeSide` 27.5% of waist to seat |
| Pocket mouth | 4 in along the top, 2¾ in down the side | `pocketEntryWidth` 10.8% of the seat, `pocketEntryDepth` 30% of waist to seat |
| Pocket bag | 5 in across, 7 in deep | `pocketBagWidth` 13.5% of the seat, `pocketBagDepth` 77% of waist to seat; the facing 5/7 of it |
| Coin pocket | 2¾ in wide, about 3¼ in deep (read from the figure), an inch in and down | `coinPocketWidth` 7.4% of the seat, its depth 1.18 × its width |
| Back pocket | 6 × 6 in, 5 in across the lower corners, point ¾ in, about 1⅛ in under the yoke | `backPocketWidth`, `backPocketDepth` 16.2% of the seat, `backPocketPoint` 12.5% |
| Fly | 1½ in on a 26½ waist | `flyWidth` 5.6% |
| Tapered leg | About an inch in each side at the hem | the `tapered` variant: `hemWidth` 60% |
| Flared leg | Armstrong's broken lines; Aldrich about 1 cm in at the knee, 4 cm out at the hem | the `bootcut` variant: `kneeEase` 10%, `hemWidth` 115% |

## Changes and what isn't modelled
- **The pocket depths are measured from the leg's top** (the band's lower edge), as Armstrong's X is
  marked after the band is cut off.
- **The back dart** is moved so its point falls on the yoke seam and closes wholly in the yoke; Armstrong's
  dart runs a little below it and she trims the rest at CB.
- **The yoke seam** is straight, as Armstrong's; Aldrich's is too. The back pocket is centred on the
  dart and square to the yoke seam.
- **The waistband** is drawn as a curved band whose edges are the legs' band lines (the parts joined
  with the darts closed come to the same curve); where the waist is wider than the hips it curves the
  other way.
- **The front pocket's mouth** is our curve between Armstrong's two points.
- **Five belt loops and rivets** are ours (she marks rivets only at the pocket corners: so do we).
- **Not modelled:** the relaxed fit's deeper back crotch, the lower bands (Variations 2 and 3),
  topstitching lines, and the back pocket's stitched design.

## Pieces
Front and back legs, contour waistband (cut four: two with the lap, two trimmed at CF), back yokes,
pocket facings, pocket bags and pocket linings (lining fabric), coin pocket, back patch pockets, fly
shield and facing, belt loops.

## Construction
Following Armstrong's order in outline: sew the pocket facing to the bag, the coin pocket to the right
facing; sew the lining to the pocket mouth, turn and topstitch, and close the bag. Sew the yokes to the
backs and the back pockets on below them. Put in the fly zip. Sew the inseams, then the outseams, then
the seat seam in one. Join the band pieces at CB, sew the band on, face it, and topstitch. Loops, hem,
then rivets at the pocket corners.
