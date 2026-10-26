# Tailored jacket (semi-fitted)

**Source:** Mitchell, *The New "Standard" Work on Designing and Pattern-Making of Ladies'
Tailor-Made Garments* (1921), corpus `newstandardworko00mitc` (book page = PDF page − 4).
Semi-fitted jacket foundation pp. 36–37, semi-fitted jacket pp. 38–39 (diagram p. 39),
two-piece sleeve pp. 60–61. US 1921, public domain. Inches below are Mitchell's (measures for
a 39" bust).

**Block:** FreeSewing's Breanna (women's bodice block), its bust dart split between the
shoulder and the waist, so the princess seams follow the darts.

**Status:** draft. Not sewn.

## What the source shows (p. 38, diagram p. 39)
"A single-breasted, semi-fitted jacket with a peak lapel and a mannish collar."
- **Four body panels a side:** back, side back, side front, front. The back seam runs from
  half way along the back shoulder (28) to 3½" from CB at the waist (26); the side seam from
  under the arm (34) to the waist, 1" taken in there (35–36); the front seam from the
  shoulder (44, 1¼" past half way, toward the arm) through the top of the dart (39, 4" from
  CF at the bust's depth) to the waist (41–46).
- **Below the waist the seams cross:** each panel's edges continue straight from the waist
  past the hip line (7" below), so the panels flare over the hips (26–27, 30–31, 35–38,
  36–37, 41–42, 46–47).
- **Length:** 32" from the nape; the back 17" from the waist; an even bottom.
- **Front:** a 1¼" lap. The lapel's crease runs from about 3" below the bust line on the front
  edge through a point ½" in front of the neck point (20). Peak lapel.
- **Collar:** "mannish", stand 1¼", 2¾" from the neck point up.
- **CB:** a seam, in 1" at the waist and ½" at the hip line (7, 6).
- **Pockets** (drawn only; read off p. 39 at its scale, 7" waist to hip line):
  - a breast welt about 3⅝" × ¾", its front end about 2⅜" behind CF and ⅞" below the bust
    line, rising about 16° toward the side; it crosses the front seam (17–39), about 2" in
    front of it and 1½" behind;
  - on the side front, two flaps one above the other, both starting at the front seam and
    sloping down about 11° toward the side: the larger about 3 15/16" × 1½", its mouth about
    3⅞" below the waist, ending about ⅞" short of the side seam; the smaller about
    2 5/16" × 1", its mouth about 2¼" below the waist.
- **Sleeve:** two-piece (pp. 60–61).

## How it maps onto the block
| Feature | Mitchell | Here (option default) |
|---|---|---|
| Ease | Drafted from body measures; the panels give the fit | `chestEase` 14% (Breanna's is 10%), `waistEase` 14%, `seatEase` 10%, `bicepsEase` 25% (Breanna's 15% drapes too tight a sleeve) |
| Front seam | Shoulder → top of dart → waist | Breanna's bust dart split: `secondaryBustDart` 12:00 (shoulder) and `primaryBustDart` 06:00 (waist); the seam runs down one dart, through both tips, down the other |
| Back seam | Half way along the shoulder → waist dart | `backSeamAt` 50% along the shoulder from the neck point, down to Breanna's back waist dart and through it |
| Side seam | In 1" at the waist | Breanna's side seam (its waist ease) |
| Flare below the waist | Seams cross; edges straight through the hip line | Each of the 6 seam edges moves out by an equal share of (seat with `seatEase` − waist), at the seat line (`waistToSeat` below), and runs straight on to the hem |
| Length | 17" waist to hem on a 32" jacket | `lengthBelowWaist` 42% of waist-to-floor (17" of about 40") |
| Lap | 1¼" | `buttonExtension` 3.2% of chest (1¼/39) |
| Crease | From 3" below the bust line, through ½" in front of the neck point | `breakBelowBust` 14% of HPS-to-waist-front (3/22), `rollOut` 3.7% of neck (½/13½) |
| Lapel | Peak | `lapelStyle` peak (or notch), `lapelWidth` 26% of neck (about 3½", as p. 39 draws it), `gorgeAt` 55% along the front neck from the neck point |
| Collar | Stand 1¼", 2¾" from the neck point up | `collarWidth` 20% of neck (2¾/13½), `collarSpring` 14%, `collarPoint` 5% of neck |
| Buttons | (not printed) | `buttons` 3, from the break to below the waist |
| Sleeve | Two-piece | FreeSewing's two-part sleeve, fitted to the jacket's armhole |
| Facing | (not drafted) | Front facing, lapel included, `facingWidth` 8% of chest; back-neck facing `backFacingDepth` 9% of chest down the CB, meeting the front facing on the shoulder |
| Breast pocket | A welt across the front seam | `breastPocket` on: a welt pocket, `weltFromCF` 6.2% of chest behind CF, `weltBelow` 4% of HPS-to-waist-front below the bust line, `weltLength` 9.2% of chest, `weltRise` 16°, `weltDepth` 22% of its length; cut across the princess seam where it reaches it, the rest of its length on the side front; shortened to clear the underarm |
| Hip pockets | Two flaps on the side front, sloping to the side | `pockets` on: set-in flap pockets with a jet. Hip pocket mouth `pocketBelow` 37% of waist-to-seat below the waist, `pocketFromSeam` 1% of chest behind the princess seam, `pocketWidth` 81% of the side front's width there, `pocketAngle` 11°, `flapDepth` 38% of the mouth. `ticketPocket` on: `ticketAbove` 16% of waist-to-seat higher, `ticketWidth` 58% of `pocketWidth`, `ticketFlapDepth` 46%. Bags `bagDepth` 120% of each mouth |
| Lining | (not drafted) | `lining` on: front lining from the facing's inner edge to the princess seam; back lining below the back-neck facing, on the fold with `liningPleat` 1.4% of chest extra at the CB (a pleat); side back, side front and both sleeve pieces cut again in lining |

## Construction order
1. Back to side backs, front to side fronts (princess seams); CB.
2. Pockets (marked on the panels):
   - breast welt, across the front seam: interface the welt, fold it lengthwise, lay it below
     the mouth line (raw edges up), a bag piece above; stitch both, cut between, turn the bag
     through, press the welt up over the mouth, sew its ends down, then the bags together;
   - hip and ticket pockets on the side fronts: make up each flap (fabric and lining, round
     three sides; turn); flap above the mouth line, the folded jet below; stitch, cut, turn the
     jet to a single piping and the flap down; a bag piece to each, then the bags together.
3. Shoulders, side seams.
4. Collar to the neckline up to the gorge; front facings and the back-neck facing joined at
   the shoulders, then to the fronts, lapels and back neck, the collar's under side to the
   facings' gorge.
5. Sleeves: the two pieces together, then set into the armhole, easing the cap.
6. Lining: front linings, side fronts, side backs and back lining together (the back's CB
   pleat folded and tacked at the neck and waist); sleeve linings made up and set in; the
   lining sewn to the facings' inner edges.
7. Hem the jacket and sleeves; hem the lining to the jacket's hem allowance, leaving an ease
   fold. Buttonholes on the right front, buttons on the left.

## Changes and what isn't modelled
- **CB on the fold.** Mitchell's CB is a seam, shaped 1" at the waist. The waist shaping here
  comes from the princess and side seams; the CB is straight.
- **Princess seams** are smooth curves from the shoulder through the bust (half way between
  the two dart tips, on the back through the waist dart's tip) to the waist, each pair the
  same length; they turn at the waist into the straight flare below. (Before 2026-10-26 they
  were straight segments, which drape showed as a step at the bust.)
- **Pockets** are our reading of the drawing: Mitchell's text has none. The two side front
  rectangles are taken as set-in flap pockets (the smaller a ticket pocket), the slanted one at
  the bust as a welt. Heights are set from the waist as shares of FreeSewing's waist-to-seat,
  which is deeper than Mitchell's hip line (about 10½" against 7" at bust 38–39), so that at
  that size they come where he draws them in inches. The hip pocket's mouth is a share of the
  side front's width, as drawn; this side front is wider than Mitchell's, so at FreeSewing's
  38 set the mouth is about 6" (he draws 4"). The breast welt keeps his length, but this front
  panel is narrower at the bust, so more of it lies on the side front (about 1⅛" in front of
  the seam and 2⅝" behind, against his 2" and 1½").
- **Lining and back-neck facing** are ours (Mitchell drafts neither). The front lining is a
  strip between the facing and the princess seam, as in any princess-line jacket. The lining
  is cut to the jacket's finished length and hemmed to its hem allowance.
- **Mitchell's front seam starts 1¼" past half way along the shoulder;** Breanna's 12:00 dart
  lands at half way, and no other Breanna position keeps it on the shoulder (12:30 is the
  shoulder tip). Moving it needs a dart rotation of our own.
