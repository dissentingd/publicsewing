# Box coat

**Source:** Mitchell, *The New "Standard" Work on Designing and Pattern-Making of Ladies'
Tailor-Made Garments* (1921), corpus `newstandardworko00mitc` (book page = PDF page − 4).
Box coat foundation pp. 16–17, box coat pp. 18–19 (diagram p. 19), two-piece sleeve pp.
60–61. US 1921, public domain. Inches below are Mitchell's (measures for a 39" bust, 40"
hips).

**Block:** FreeSewing's Breanna, its bust dart pivoted from the waist into the front neck.

**Status:** draft. Not sewn.

## What the source shows (p. 18, diagram p. 19)
"A loose hanging effect. Only a medium amount of looseness or fullness is allowed at the bottom."
- **Two body pieces:** back and front, a CB seam. No waist shaping.
- **Side seam:** from under the arm (28, half way between 13 and 10), straight down through
  points 1¾" either side of it on the hip line (30, 31): the back and front each flare from the
  armhole.
- **CB:** from the neck through a point ½" behind 5 (hip line): the back widens a little.
- **Length "as desired":** p. 19 draws 42½" at the CB.
- **Front:** a 3" lap ("less may be taken"). "Box coat fronts are long": shortened with a dart
  in the neck, 1¼" wide at 22 (the front neck's CF end), about 6" long.
- **Lapel** "to any size or style"; crease from about 3½" below the bust line through ½" in
  front of the neck point (20). Collar shaped "to harmonize with the shape of the lapel".
- **Buttons:** three, drawn about ¾" in from the lapped edge: the first just below the break,
  one about 2" below the waist line, one just below the hip line.
- **Pockets** (drawn only; the text doesn't mention them): two flaps on the front, one above the
  other. The larger, about 6½" × 2⅝", has its mouth about 1⅝" above the hip line; the smaller,
  about 3⅞" × 2", has its mouth about 3⅜" higher. Both start about 3⅛" behind CF. The hip
  pocket ends about ¾" short of the side seam.
- **Sleeve:** two-piece.
- More fullness: "cut through wherever fulness is desired and spread".

## How it maps onto the block
| Feature | Mitchell | Here (option default) |
|---|---|---|
| Ease | Drafted loose from body measures | `chestEase` 18%, `seatEase` 12%, `bicepsEase` 25% |
| Body | Back and front, no waist shaping | Breanna's back and front above the armhole; below it the side seam is ours |
| Side seam | Straight from the armhole through 1¾" either side at the hip line | Each side flares from the armhole by `flare` 4.4% of seat (1¾/40) at the seat line, more if the seat needs it |
| Neck dart | 1¼" at 22, about 6" long | Pivoted about Breanna's bust point from its waist dart into the front neck, `neckDartWidth` 3.2% of chest (1¼/39) at `neckDartAt` 88% along the neck from the neck point, `neckDartLength` 60% of the way to the bust point |
| Length | 42½" from the nape | `lengthBelowWaist` 70% of waist-to-floor (27½" of ~40" below the waist) |
| Lap | 3" | `buttonExtension` 7.7% of chest (3/39) |
| Crease | 3½" below the bust line, through ½" in front of the neck point | `breakBelowBust` 16% of HPS-to-waist-front, `rollOut` 3.7% of neck |
| Lapel and collar | "to any size or style" | notched lapel, `lapelWidth` 24% of neck; collar `collarWidth` 22% of neck, `collarSpring` 14%, `collarPoint` 5% |
| CB | From the neck through ½" behind 5 (hip line), on down | A CB seam straight from the neck, out by `cbFlare` 1.25% of seat (½/40) at the seat line; 0 cuts the back on the fold |
| Buttons | Three, ¾" in from the lapped edge | `buttons` 3; buttonholes `buttonInset` 25% of the lap (¾/3) in from the edge, each button as far behind CF as its hole is in front, so it sits under the lap. 100% puts both on CF |
| Pockets | Two flaps, one above the other (read off the diagram at bust 39) | `pockets` on: set-in flap pockets with a jet. Hip pocket mouth `pocketBelow` 55% of waist-to-seat below the waist, `pocketFromCF` 8% of chest behind CF, `pocketWidth` 16.7% of chest, `flapDepth` 40% of its width. `ticketPocket` on: `ticketAbove` 32% of waist-to-seat higher, `ticketWidth` 60% of the hip pocket, `ticketFlapDepth` 50% of its width. Bags `bagDepth` 110% of each width. Each mouth is shortened if it would come within 2% of chest of the side seam, each bag if it would reach the hem |
| Sleeve | Two-piece | FreeSewing's two-part sleeve, fitted to the armhole |
| Facing | (not drafted) | Front facing, lapel included, `facingWidth` 10% of chest |

Inches above are read off p. 19 at its scale (the 3" lap measures 3"), to about ⅛".

## Construction order
1. Neck darts. Pockets, on each front (marked: the mouth line, the flap below it):
   - make up each flap (fabric and lining, right sides together, round three sides; turn, press);
   - lay the flap upside down above the mouth, its raw edge on the line; fold the jet in half
     lengthwise and lay it below the line, raw edges meeting; stitch both to the mouth's length;
   - cut along the mouth between the stitch lines, snipping into the corners; turn the jet
     through to make a single piping and the flap down over it;
   - sew one bag piece to the flap's seam allowance and one to the jet's, then the bags
     together round their edges; secure the ends of the mouth.
2. CB seam; shoulders; side seams.
3. Collar to the neckline up to the gorge; facings to the fronts and lapels.
4. Sleeves: the two pieces together, then set in, easing the cap.
5. Hem; buttonholes near the front edge (on the right front over the left), buttons behind CF
   on the other front.

## Changes and what isn't modelled
- **The neck dart is pivoted from Breanna's waist dart**, not drafted as Mitchell's 22: it
  opens 1¼" at the neck and points at Breanna's bust point. Breanna's front waist dart is the
  bust dart and the waist suppression together (its width is set from the front waist's excess
  over the back's), so no share of it is the bust dart alone; the rest isn't sewn. Each side
  seam is the same length as the back's, from its own armhole; the front hem comes out level
  within a few mm.
- **Buttons.** Mitchell draws them on the outside of the lap, near its edge, where nothing laps
  over them. We read the drawn places as the buttonholes, with each button under its hole on
  the other front: from outside the buttons show where Mitchell draws them. The front is cut 2
  from one piece, so both marks are on it.
- **Pockets** are our reading of the drawing: Mitchell's text has none, and draws plain
  rectangles. We take them as set-in flap pockets, the smaller a ticket pocket. Both fronts get
  both (the pattern is cut in pairs); leave off the ticket pocket for a plainer coat. The
  heights are set from the waist as shares of FreeSewing's waist-to-seat, which is deeper
  than Mitchell's hip line (about 10½" against 7⅜" at bust 38–39), so that at that size the
  mouths come where he draws them in inches. The coat has more ease than Mitchell's, so the
  hip pocket ends further from the side seam than drawn (about 3¾" at FreeSewing's 38 set).
- **The CB seam runs on to the hem** past the hip line, as Mitchell's line does, so the back
  widens about 1" a side at the hem on a 42" coat. The hem leaves the CB square and curves on
  to the side seam, so the backs meet level at CB (a straight hem made a point there in the
  drape, `drape/README.md`).
