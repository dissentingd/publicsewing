# Smock: brief

**Status: draft.** Not sewn.

## Source
Walker, *Manual of Needlework and Cutting Out* (1909), corpus `krl00366374`: "Overall for
Child of 6 Years", and "Directions for Making up a Child's Overall" (book pp. 267–268). The
contents list the overall's diagram, but we haven't found it among the scanned plates
(PDF pp. 245–270). The design follows the making-up directions:
- the skirt is straight breadths, "gathered or pleated up to fit the blouse";
- the yoke or blouse is "single or double";
- the "back-opening or placket-hole ... from 6 to 9 inches long", with "two button-holes";
- the sleeves are gathered "into a band ... so as to leave a frill beneath", or into a plain
  band, or are short;
- the hem is 2–2½" deep, with tucks above it.

Made for any size: a child's overall, or an adult's smock.

## Pieces
| Ours | Cut |
|---|---|
| `frontBody`, `backBody` (on fold, gathered into the yoke; the back has the placket slit) | 1 each |
| `frontYoke` (on fold), `backYoke` (opening at CB, buttons) | 2 each (double yoke) |
| `sleeve`, `sleeveBand` | 2 each |
| `placket` (bound slit) | 1 |
| `neckBand` (`neckFinish: band`; by default the neck is bound) | 2 on fold |

## Defaults (lib/yoke.mjs, `yokeOptions`, and the smock's own)
| What | Walker | Ours |
|---|---|---|
| Length | child's overall to just above the knee | `skirtLength` 40% of waist-to-floor |
| Fullness | breadths gathered into the yoke | `gathers` 150% of the yoke seam |
| Yoke | shoulder yoke | `yokeDepth` 45% of neck point to chest line |
| Opening | back, 6–9" | `opening` back, `placketDepth` 45% of HPS-to-waist from the neck |
| Buttons | two | `buttons` 2 |
| Sleeves | gathered into wristbands | `sleeves` long; `sleeveBand` 15% of wrist wide, 25% easy round the wrist |

## Checks (test/smock.test.mjs, test/yoke-checks.mjs)
At every adult, stout and children's set, default and a variant (front opening, short
sleeves, neck band, shallow yoke, double fullness):
- drafts cleanly, and the allowances lie outside;
- side seams and shoulders match; the yoke seam is level front and back;
- the body is at least as wide as the yoke seam;
- the sleeve cap fits the armhole, and the sleeve hem gathers into its band;
- the neck band fits the neckline.
