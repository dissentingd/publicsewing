# Mackinaw: brief

**Status: draft.** Not sewn. Muslin testing comes at the end of the Simons series (2026-10-23).

## Source
Harry Simons, *Drafting Cotton Garments and Mackinaws* (1918), corpus `draftingcottonga00simo`:
- **Diagram XVII**, three-button double-breasted shawl-collar mackinaw (PDF pp. 34–35). Simons
  calls it "the foundation of the mackinaw drafts that follow". Breast 38, length 33".
- **Diagram XX**, convertible-collar mackinaw (pp. 38–39). Breast 36, length 34".
- **Diagram XXI**, military-collar mackinaw (pp. 40–41). Breast 38, length 34".
- **Diagram XVIII**, shawl collars (p. 36), and **XIX**, making a whole back (p. 37).
- **Diagram XXII**, stout mackinaw (pp. 42–43), and **XXIII**, shawl collar mackinaw with
  raglan sleeve (pp. 44–45).

All three are drafted "two sizes larger" than the sack coat (XXI: 3" over the breast), for
heavy wool worn over other layers. All are double-breasted with a sewn-on belt round the
waist and flapped patch pockets.

## Pieces
| Source | Ours | Cut |
|---|---|---|
| Back; whole back by taking ¼" off the CB seam (XIX) | `back`, on the fold | 1 |
| Forepart, double-breasted | `front` | 2 |
| (no facing drawn) | `facing`, wide enough to face the lapels | 2 |
| Collar (XX convertible, XXI military) | `collar` (`collarStyle`) | 2 on fold + interfacing |
| Shawl collar (XVII, XVIII, XXIII) | cut in one with `front` and `facing` (`collarStyle: shawl`) | — |
| Sleeve (regular coat sleeve) | `sleeve`, one piece | 2 |
| Raglan sleeve, top and under (XXIII) | `frontSleeve`, `backSleeve` (`sleeveStyle: raglan`) | 2 each |
| Lower pockets with flaps (XVII rounded, XXI pointed) | `lowerPocket`, `lowerFlap` | 2; flaps 2 + 2 lining |
| Breast pockets with flaps (XXI) | `breastPocket`, `breastFlap` | 2; flaps 2 + 2 lining |
| Belt round the waist (XVII, XX, XXI) | `backBelt` (on fold), `frontBelt` | 2 (self-faced); 4 |

## Proportions → option defaults
| What | Source | Our rule |
|---|---|---|
| Chest ease | CF at 22¾" (XX, breast 36), 23" (XXI, 38), 23½" (XVII, 38) from CB | `chestEase` 24% |
| Length | 15½–16¼" below the waist; waist to seat 6¼–7½" | `lengthBelowWaist` 210% of waist-to-seat |
| Front drop | hem sweeps down ~1¼" to the front edge (XVII Y–Z, XX 14–15) | `frontDrop` 17% of waist-to-seat |
| Button stand | 2½" (XVII T–U, "½ of button stand") to 3" (XX 7–8) past CF | `buttonExtension` 7% of chest |
| Buttons | 3 pairs, chest line to below the belt | `buttons` 3; rows ±0.62 × stand from CF |
| Belt | band ~1⅝" wide at the waist (XVII D, XX E–17) | `beltWidth` 4.2% of chest, top 0.2 × width above the waist |
| Lower pockets | ~7½" × 8½", rounded (XVII) or pointed (XXI), flap with button | 70% × 77% of front chest width, below the belt; `pocketShape` rounded |
| Breast pockets | pointed, flapped, at the chest line (XXI) | 42% × 48%; `breastPockets` on |
| Flap | ~2¼" deep, covering the mouth | 32% of pocket width, seamed 7% above the mouth |
| Convertible collar | stand 1¼" + fall 3" (XX 23–24, 25–26), pointed | `collarWidth` 27% of neck, spring 13% |
| Military collar | deeper, square ends (XXI) | 1.1 × width, spring 6%, no point |
| Collar length | to ⅜" short of the front edge (XX 28–30), so it buttons to the throat | back + front neckline + 0.9 × stand |
| Sleeve | regular coat sleeve, roomy | `bicepsEase` 30%, `cuffEase` 110%, `sleeveLengthBonus` 5% |

## Changes from the source (deliberate)
- **Shawl collar cut in one with the front.** Simons sews a separate shawl collar to a gorge
  (XVIII). We cut it in one with the front and its facing, the common modern method, with a
  CB seam in the collar:
  - the roll line runs from the break (just above the top button) through a point a stand's
    width (5% of the neck, Simons' ¾") beyond the neck point;
  - the collar's neck edge is the back neck's length;
  - the CB width is `collarWidth`;
  - the lapel at its widest is 1.15 × the button stand (about 3").
- **Raglan sleeve by the pivot method.** XXIII drafts the raglan sleeve in two pieces on the
  front. We draw a raglan line from 30% along the neckline to the armhole notch on back and
  front, move the shoulder sections onto FreeSewing's fitted sleeve split down its centre,
  and match them at the notches. The over-arm seam's two sides come within 1% and ease
  together.
- **Shawl collar and raglan together (XXIII's combination) isn't offered yet.** The shawl's
  neck edge starts at the neck point, which the raglan moves onto the sleeve. Raglan goes
  with the convertible and military collars.
- **Stout figures (XXII)** follow Simons' stout rule, built into the shared coat body (see the
  chore coat brief).
- **Back on the fold.** The source has a CB seam, plus a ¼" back plait (XVII 17–18) under the
  belt. Diagram XIX shows how to make it whole, which we do.
- **Side seam at the side** (the source wraps the forepart round), as on the chore coat.
- **Square front corner** by default (`hemCurve` 0). The source's fronts are square.
- **Pocket tops level**; the source's flaps slope.

## Construction (our words)
1. Make the flaps: sew outer to lining, turn, topstitch, buttonhole. Hem the pocket tops.
2. Sew the pockets on at the marks; sew each flap upside down just above its pocket mouth,
   then press it down and topstitch. Sew a button under each flap.
3. Shoulders and side seams; then the belts, self-faced, topstitched round the body at the
   marks.
4. Collar, facings, sleeves and hems as for the chore coat (see its BRIEF). Turn the lapels
   back above the top button when open.
5. Buttonholes on the overlapping front (right for men's wear, left for women's) on the outer
   row; one inside button on the inner row to anchor the underlap.

## Checks the tests run
`test/mackinaw.test.mjs` runs five option sets (default; shawl collar; raglan sleeves with
the military collar; military collar with pointed pockets; no belt, flaps or breast pockets) at every adult, stout and children's measurement set.
It applies the shared coat checks (`test/coat-checks.mjs`):
- the pattern drafts cleanly;
- seam allowances lie outside the seams;
- side seams, shoulders, collar to neckline, and sleeve cap to armhole all match;
- the pockets stay clear of the armhole, side seam and hem.
