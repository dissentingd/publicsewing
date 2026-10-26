# Mitchell 1921: findings (source #3 for women's tailored)

*The New "Standard" Work on Designing and Pattern-Making of Ladies' Tailor-Made Garments*,
Mitchell Publications, New York, 1921 ("new revised edition"). Corpus `newstandardworko00mitc`,
144 PDF pages; book page = PDF page − 4. Started 2026-10-23.

## What the source is
- **Numbered-point drafts.** Each garment prints its measures ("The measures are as follows:
  39 Bust …"), then numbered steps ("16 from 12 is ½ bust on the 6ths"). Fractions are on the
  Mitchell divisional square: "N on the 6ths" is N/6 in.
- **Each draft has a full-page diagram drawn to scale.** The scale isn't printed, and pages are
  reduced differently: p. 17 is about 1/2.4, p. 19 about 1/4.3. Every point is marked by a target
  (a dot inside two rings) with its number beside it. Thin lines are construction; heavy lines are
  the pattern.
- **Contents:** box coat, kimono box coat, set-in kimono and balmacaan sleeves, semi-fitted and
  tight-fitted foundations, jackets on them (single and double dart, "Prince Albert", mannish,
  erect and stooping forms to special measures), cape, two-piece, raglan and bell sleeves, cuffs,
  collars I–IX, and skirts (foundation, 2-piece and 5/7/9/11/13/15-gore, pleated).
- **The text almost never prints a result.** The few "in this case" figures are inputs or the
  step's own arithmetic. Two exceptions: the five-gored skirt's "surplus in this case is 2½
  inches" (p. 90), and the stooping form's front waist length falling above the back waist line
  (p. 56). **The diagrams are the results:** a drawn point is where the drafter's own reading of
  the step put it.

## How it's checked (`recipes/mitchell/foundation.yaml` header)
The recipe constructs every point from the text. The diagram is fitted to the construction by a
similarity (scale, turn, shift) on the points the text places by printed measures alone (7 in,
½ in, half back width, blade, ½ bust). Then:
- **Gate checks:** every "N from M is <printed measure or printed inches>", the drawing's M→N
  against the printed value. These test the scan and our reading of the printed numbers. The
  PDF's text layer garbles fractions ("I0y Blade" is 10½), so the reading does need checking.
- **Reports:** points placed by a rule (divisional fractions, "less 2", half way, the front depth
  sweep), the drawing's against the construction's. The text is followed.

Fit quality: p. 17 rms 0.083 cm on 8 points; p. 19 rms 0.084 cm on 7 points (full scale).

## Source discrepancies (drawing vs text), as printed
1. **Shoulder width: drawn 5¾ in, text 6 in.** "26 from 9 is the shoulder width, which is 6
   inches in this case" (p. 16), and 27 from 20 the same. The drawing has 9→26 = 5.72 in and
   20→27 = 5.73 in on p. 17. The semi-fitted foundation (p. 36, same measures and the same "6
   inches") draws 5.74 and 5.78 on p. 37. Two diagrams agree with each other and differ from the
   text by ¼ in, so this looks systematic, not a slip. It may be the drafter's practice, or
   drawings kept from an edition with a 5¾ shoulder. **Ruled 2026-10-24: the text
   governs.** The coat is built with 6, and the drawn shoulders are reports (−0.71 and −0.69 cm),
   not checks. That applies to any printed value the drawings contradict systematically.
2. **Point 16 drawn ¼ in short on p. 17.** "16 from 12 is ½ bust on the 6ths" = 3.25 in; drawn
   3.02. 17 (16 + 1¼, drawn correctly from the drawn 16), and 20, 21 and 22, which hang from 17,
   inherit the shift: 20 is drawn 0.22 in behind its construction. On p. 37 the same step is drawn
   right (3.255). A slip on p. 17. Reports only; the text is followed.
3. **Dart length:** "about 6 inches long"; drawn 5.5 in (p. 19). Report; the recipe uses 6.
4. **Two-piece sleeve diagram (p. 61) slips; open for the maintainer.** The fit on 8 points has an rms of
   0.23 cm, looser than the coat pages (0.08). Against the printed values:
   - 10 and 11 are drawn 0.74 and 0.75 in from 9 ("1 inch" each);
   - 1→6 is 7.70 in ("the elbow, 7½ inches");
   - 1→2 is 3.93 in ("15 on the 4ths" = 3.75).

   Everything else is within ⅛ in: 1→7 is 19.03, 8→9 is 6.08, 7→12 is 4.56, and "15 on the ½"
   is 7.40. **The book's other diagram of the same construction disagrees with p. 61.** The
   large-size sleeve (text p. 66, diagram p. 67, its own measures) draws 9→10 at 1.02 in, 9→11 at
   0.99 and the elbow at 8.00 (printed 8), all as printed. So p. 61's are slips on one page, not a
   systematic difference. **Ruled 2026-10-24: the rule extends to them.** A one-page slip
   that another diagram of the same construction contradicts is followed as printed, and the four
   are reports, not checks.
5. **Skirts (pp. 84–91): the sweeps, and the five-gored skirt's surplus; open for the maintainer.**
   - Both skirt diagrams (pp. 85 and 91) place 7 squared 20 in from 4 and 4.15 in above it. That
     puts the sweeps' pivot about 43½ in above 1, where the text prints "one and one-half the waist
     measure, that is, 26½ and 13¼ added together" (39¾). This is systematic, so the text governs
     and the drawn 7, 8 and 9 are reports. p. 85 also draws 1→4 at 7.15 in where p. 91 draws it
     as printed: a one-page slip, also a report.
   - **The printed result "the surplus in this case is 2½ inches" (p. 90) isn't reproduced.** The
     surplus is the waist line 10 → 8 less ½ waist and the ⅞ and ¾ in darts:
     - 7 along the sweep gives 2.20 in;
     - 7 as a straight chord gives 2.35 in, the reading used;
     - 7 squared out, as drawn, gives 2.86 in;
     - the drawings' own waists give 2.98 (p. 85) and 2.80 (p. 91).

     2½ sits between the text's construction and its drawings. The nearest reading misses by
     0.15 in, more than the ⅛ in floor. The pattern takes the surplus it actually has into the side
     dart (½ in more toward the front), so the waist comes to ½ waist exactly.
   - **11 is drawn 3.77 in from 4 on p. 91**, against "1/5th of ½ hip less ½ inch" (3½). Only one
     diagram has it.
   - The seven-gored skirt's diagram (p. 93) repeats both: 1→4 is drawn at 7.13 and 11 lies 0.26
     in past its rule (along the hip sweep). Reports, under the same rulings.
   - So do the 9/11/13/15-gored diagrams (pp. 95, 97, 99, 101): 1→4 drawn 0.09–0.21 in long, and 11
     0.20–0.25 in past its rule. Their division points 13… lie 0.1–0.5 in from the constructed
     ones, growing toward the back (the drawn 7 is that far out, item 5). All reports.
   - **Ruled 2026-10-24: both are reports.** The text governs, the printed 2½ is taken as
     approximate ("in this case"), and the skirt is catalogued.
6. **Double-dart jacket (p. 47): slips only this diagram shows.** Followed as printed, reported
   (the 2026-10-24 rulings: a deviation only one diagram shows is a report).
   - 33 from 31 ("the same as 26 from 7", 1.49 as drawn) is drawn 0.24 in short; 36, 37 and 38
     follow it, about ¼ in behind the constructed ones (37–38 themselves are ½ in apart as printed).
   - 34 from 24 is drawn 1.52 in, ¼ of 6, not of this draft's 5½ (9→29 is drawn 1.45; 9→24 5.55).
   - 46, the top of dart, is drawn 0.36 in further from 20 than "top of dart less 9–2" (and 47 with
     it, 3 in toward 8, as printed). The other jackets draw their top of dart within 0.1 in.
   - 52 is drawn 0.39 in low and 59 0.45 in off (the front shoulder's points); 60 and 61 about ¼ in.

## Readings (interps)
- **"½ the bust measure on the 24ths less 2"** (2 from A) and "½ bust on the 8ths less 2" (9 from
  A) are read as ½(bust − 2) on the scale, so 18½ for bust 39: A→2 0.771 in, A→9 2.313 in. The
  other reading takes 2 off the half bust (17½: 0.729 and 2.188). The drawings don't settle it:
  - p. 17 draws 0.753 and 2.28, which favours ½(bust − 2) on 9;
  - p. 37 draws 0.748 and 2.24, which slightly favours the other.

  The two readings differ by at most 0.12 in. The erect form (p. 54, bust 51) could separate them,
  and isn't traced yet.
- **"the width of the back part of the neck, 9-2"** (taken off the front depth for 20): the
  straight 9–2. The drawn 20 can't separate this from the curve's length, because 17 is drawn off.
- **The cross "about 3 inches below 19":** 3 in down the front line 21–19 extended.
- **Box coat length "as desired":** the drawn 42.65 in at the centre back, taken as 42½ (a style
  value in `data/mitchell/box_coat.yaml`).
- **Front scye 15 → 12:** printed grey on both pp. 17 and 19, so the 1-bit ink layer loses it and
  it isn't traced. It's constructed instead as a quarter curve (down at 15, along the bust line at
  12), then straight along the bust line to the side seam at 28.
- **Lapel ("may be shaped to any size or style"):** p. 19's lapel point (put on the lapped edge)
  and notch. The gorge runs straight from the notch to the dart's leg at 22.
- **Neck dart "1¼ inches wide at 22":** centred on 22. The drawn legs are 1.14 in apart about the
  marker, and p. 19's apex gives the direction.

- **Two-piece sleeve (p. 60):**
  - It's drafted in the coat's own frame, so the coat's armhole is literally laid on it. The
    front notch is 15 (1¼ in above the bust line); the back notch is on the back scye 1¾ in above.
  - Working number = armhole − 2½ in: 13.18 for this coat (the book's example coat: 15).
  - The line 2–7 leans ½ in in 12; "square backward from 8" is square to 7–8, which the
    large-size sleeve's text spells out.
  - 12 from 7 (4½) is half the wrist (9).
  - The head runs 20 → 3 → 5 → 13 and the under head 19 → 14, traced from p. 61 and set onto
    the constructed points. The under head's last inch into 19 isn't traced (it merges with the
    drawn armhole copy), and the head pieces have ~1.2 cm junction gaps, bridged.
  - The head is 2.7 cm longer than the armhole.
- **Collar (32, p. 18):** the neck line runs from half way 20–22 straight through 20b (½ in
  behind 20), then turns up to 32 at p. 19's angle. "32 from 20 is ¼ inch more than 9 from 2"
  is measured from 20b along the upward line, with the back neck taken along its curve: drawn
  20b→32 is 2.81 in against 2.85. Constructed, 32 lands 0.2 cm from its marker; measured from 20
  with the 9–2 chord it would miss by 0.9 cm. The outer edges and the front end are p. 19's.

- **Semi-fitted jacket (pp. 36–39).** Its foundation (`semi_fitted_foundation.yaml`) is the box
  coat's with these differences: 7 from 4 is 1 in; the centre front line runs from 21 through 19;
  23 is half way 2–3; the shoulders are 24 and 25; the front shoulder runs from ⅜ above 20 to ¼
  below 25. **Misprint, as printed:** "18 from 19 is ½ bust" (p. 36) is read as 18 from 8 (the box
  coat's step; the drawing's 8→18 is 0.5% off ½ bust).
  - "The back measures from 7 to full length, 17 inches" is a result (32 less the back's 2→7):
    16.97 constructed.
  - Readings:
    - 39 lies 4 in behind the centre front line, measured square to it;
    - 42's "from the center front line" is along the hip line;
    - 43 sits on the front shoulder 20′–25′;
    - 45 is "⅝ below the line 20-23", with that line moved ⅝ in down.
  - Drawn-off points (reports): 28 (0.9 cm), 43 (1.0 cm) and 45 (1.6 cm). All three follow the
    drawn shoulder, which is short of the printed 6 again.
  - **The front scye doesn't pass through 15** on p. 39 (it passes beside it). Its bottom 14 → 34
    runs behind the markers and is bridged (2.8 cm).
  - The front seam 44 → 39 runs through 17 on p. 39. The pocket flap hides 17 → 39, which is
    bridged (3.9 cm).
  - The three seam pairs that sew together agree within 0.2 cm.
  - The collar's neck line (21 → 20, then 2¾ in up from 20) is 3.9 cm shorter than the neck it
    sews to (22 → 20′ + back neck). Mitchell's notched collar is set along 21–20, above the neck
    curve's dip to 22. Report.

- **Skirt foundation (p. 84):**
  - It's drafted on sweeps from a pivot 1½ waist above 1. Distances on a sweep are measured
    along it (rotations about the pivot), except 7 (½ hip, straight across; see item 5).
  - 8 is where the line squared up from 7 (square to 5–7) meets sweep 1.
  - The bottom is sweep 1 moved down by the back length. 9 is 0.01 in off that sweep.
  - **Misprint, as printed:** "10 from 2 is ⅜ inch" is read as 10 from 3.
  - The waist is p. 85's heavy line from 10 to 8.
  - The five-gored darts are laid off along it with the new `path_at` op.

- **Seven-, nine-, eleven-, thirteen- and fifteen-gored skirts (pp. 92–101).** One small recipe each
  on `skirt_foundation.yaml`, the same construction: 11 along the hip sweep, 12 along the bottom,
  the hip sweep 11–7 and the bottom 12–9 divided equally (by angle about the pivot), seams from
  each bottom point through its hip point. The darts are centred on their seam lines and their
  legs run straight to the hip points. The surplus (waist line less ½ waist and the printed
  panel and centre back darts) is split in the printed order and steps, which the test checks.
  - Eleven-gored: "a dart of ⅜ inch is taken at the front panel" is read as centred on the panel
    line. "At 13 the smallest" gives no amount; it is read as one more 3/16 step below 16.
  - Fifteen-gored: "decrease by a little less than ⅛ inch" is read as 3/32 a step.
  - Thirteen-gored: the ⅛ steps are printed; nine-gored: the ¼ steps are printed.
  - p. 101 inks the marker at 21 too faintly to find, so the fifteen-gored recipe has no report for
    21 (the others are reports anyway).
  - The 9/11/13/15 recipes were written from one generator (they differ only in counts and
    amounts); they're plain recipes and are edited as such.

- **Tight-fitted jacket, single dart (pp. 42–45).** The tight-fitted foundation (p. 42) is the
  semi-fitted one with 6 from 5 at 1½ in and 7 from 4 at 2 in. Those two are now data in
  `semi_fitted_foundation.yaml` (cb_hip, cb_waist), and its diagram is the drawing `fdn` (p. 43).
  - **No waist is printed** for this draft (pp. 36, 42), though its steps use one. The book's one
    standard figure is used: the skirt foundation's waist 26½ (with hips 40, as the coats). p. 45's
    7→26 is drawn 2.01 in, against 1.96 for 26½ (within the gate, so the check passes).
  - Five panels: back, side back, under-arm, side front, front. The scye's bottom from 32 meets the
    back scye at Q, 1⅓ in above 10, and the seam "35 through 10 upward" runs on to Q.
  - The shawl collar is cut in one with the front, with a neck dart (½ in behind 20, and 20′, to a
    point on the neck curve). Its outline is p. 45's: a chain of the drawn vertices, bridged
    where other lines cross it.
  - The text gives no length, lap or hem rule ("finish as represented"), so each seam ends where
    p. 45 draws its end. The semi-fitted jacket's even-bottom rule would dip the side front by
    about 0.6 in, because 47 lies lower than the other waist points.
  - The front princess seam's halves differ by 1.0 cm, from those drawn hem heights. The other seam
    pairs agree within 0.5 cm.
  - Drawn-off points (reports): 28 (1.1 cm), 46 (0.9 cm), 43 (0.6 cm). All follow the short drawn
    shoulder.

- **Tight-fitted jacket, double dart (pp. 46–47).** Seven body parts and the sleeve, 49/49.
  - **Foundation:** the text says "constructed as described on page 36", but the title is
    tight-fitted and p. 47 draws p. 42's centre back (4→7 2.00 in, 5→6 1.51). Read as the
    tight-fitted foundation (p. 42 is p. 36's with only those two values changed).
  - **Shoulder width "in this case 5½"**, against p. 36's "in this case 6": a style value printed for
    this garment, and p. 47 draws 9→24 at 5.55. Used as printed (data `shoulder_width: 5.5`).
  - **Misprint, as printed:** "draw a line from 52 through 65" is read as from 42: 42–65 is the
    under-arm's front seam, crossing 43–64 below the waist (p. 47), and 52 is on the shoulder.
  - The two "darts" are the seams 52–46 and 57/58–47: above 46 and 47 they're seams over the
    shoulder (57–58 opens 1¼ in at the shoulder), below they open into the waist suppression.
  - 53, "2¼ inches on a sweep" about 46, is laid off as a chord; 60 is the sweep about 47's crossing
    with ¼ waist less the two front parts from 43, on the waist side.
  - The scye's bottom passes ¾ in above 39; the seams 44–39 and 45–39 run up to it (as the
    single-dart jacket's Q). The markers at 12 and 41 blank the last inch of the curves into 41,
    closed straight.
  - No length, lap or hem is printed ("finish as represented"): the back parts end at p. 47's level
    hem, each front part at its own drawn end, the front edge at its drawn corner. The lap is 1¼ in
    (the semi-fitted jacket's printed lap); p. 47 draws the edge 1¼ at the neck, 1.54 at the hem.
  - No collar is drawn or described.

## Not built yet
The kimono jackets, the "Prince Albert" jacket, the two-piece skirts (they reuse
`skirt_foundation.yaml`; every gored skirt, 5 to 15 gores, is built). The fitted foundations number their points differently from p. 36 on
(18 from 19, 24 = shoulder), so each needs its own recipe. The shared steps 2–19 can extend
`foundation.yaml` where they match.
