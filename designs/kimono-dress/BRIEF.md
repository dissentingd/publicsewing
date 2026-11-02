# Kimono dress

**Source:** Esther Pivnick, *How to Design Beautiful Clothes* (Wm. H. Wise, New York, 1949),
corpus `pivnickdesignclothes1949` (untracked). Pattern 101, "A Kimono Sleeve Dress", book
pp. 290–295, Figures 15–28 (PDF pp. 298–303); the kimono sleeves, Chapter XIV, from p. 183 (PDF
p. 191). US 1949, copyright not renewed (HathiTrust-cleared; see the shift dress's brief).
Inches are Pivnick's.

**Block:** FreeSewing's Brian, through the yoke template (`extends: ../templates/yoke.yaml`,
`lib/yoke.mjs`) with `yokeAt` waist, as the shirtwaist dress: a bodice to the waist and a
gathered skirt. Added for this dress: a kimono sleeve cut in one with the bodice (`kimonoLength`,
`kimonoAngle`, `kimonoDepth`, design options read by `kimonoSleeve` in `lib/yoke.mjs`).

**Status:** draft. Not sewn.

**Threadloop:** free kimono-sleeve dresses and tees exist, mostly graded rather than drafted from
measurements; this one drafts from the wearer's.

## What the source shows
- **The method:** the sleeve is laid on the bodice at the shoulder and the two traced as one
  piece. How far the bodice is swung away from the sleeve sets the fit: close (Figures 32–33)
  needs an underarm gusset for the arm to lift; swung well out (Figure 2's end of the range), no
  gusset is needed. The overarm is a smooth curve from the middle of the shoulder to the sleeve.
- **Pattern 101** is the loose kind: no gusset. The bodice front and back each take the sleeve in
  one piece, the underarm curving out from the side seam (Figures 16, 18).
- **The sleeve** "is not full length", worn pushed up on the arm.
- **Neck:** a slit at CF with facings and a collar (Figures 17, 18, 20, 21).
- **Waist:** a waist seam to a skirt, slight gathers at the front waist, waist pleats slashed into
  the back (Figures 15–16, 23).
- **Pockets:** a patch on the skirt, its opening a buttonhole in the patch (Figures 26–27).

## How it maps onto the block
| Feature | Pivnick | Here (option default) |
|---|---|---|
| Sleeve | In one with the bodice, no gusset | `kimonoLength` 35% of shoulder to wrist past the shoulder point; `kimonoAngle` 25° below level, about the shoulder's own slope (Figures 16, 18); the hem half the biceps with `bicepsEase` 45% on each of front and back |
| Overarm | A smooth curve from mid-shoulder | The same: a curve from the middle of the shoulder onto the sleeve's line |
| Underarm | Curved out from the side seam | A rounded corner from `kimonoDepth` 9% of the chest below the armhole |
| Ease | Fitted in cloth | `chestEase` 14%; `waistShaping` 2% of the chest at each side |
| Neck | CF slit, facings, collar | A front opening buttoned to the waist seam, `buttons` 5; `neckFinish` collar, `collarWidth` 22% of the neck |
| Skirt | Slight gathers | `gathers` 125%, `hemFlare` 8% of the seat, `skirtLength` 62% of waist to floor |

## Changes and what isn't modelled
- **Buttoned down the front bodice**, not a CF neck slit with facings: the template's front
  opening, so the dress goes on without pulling over the head.
- **No gusset.** Pivnick's fitted, gusseted kimono (pp. 183–192) isn't built; `kimonoDepth` and
  `bicepsEase` give the arm its room.
- **The back's waist pleats and the front's gathers** are one thing here: the skirt is gathered
  into a plain bodice.
- **The patch pockets** aren't drafted.
- **The sleeve lengthens if it must.** On any figure or setting where a short, steep sleeve's under
  corner wouldn't clear the side seam, the overarm is carried on until it does. Front and back
  keep the same overarm length; the front's hem width is trued so the underarm seams match.

## Pieces
Front bodice with sleeve (cut 2), back bodice with sleeve (on the fold), front and back skirt (on
the fold), collar.

## Construction
1. Shoulder and overarm seams, in one; underarm and bodice side seams, in one, clipping the
   rounded corner.
2. Collar to the neckline, faced by the front stand.
3. Skirt side seams; gather the top and sew it to the bodice at the waist.
4. Sleeve hems; skirt hem; buttons and buttonholes down the front.

## Checks
`test/kimono-dress.test.mjs`: the yoke checks at every size (shoulder, side and underarm seams,
collar against neckline), plus the overarm seam, a hem that goes round the arm, and the hem's
under corner clear of the side seam, on default, long and short back-opening variants.
