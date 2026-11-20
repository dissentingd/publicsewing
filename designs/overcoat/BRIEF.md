# Overcoat

**Source:** Simons, *Designing Overcoat Patterns for Men and Young Men* (The Clothing Designer
Co., New York, 1916), corpus `designingovercoa00simo` (tracked). Men's Regular Overcoat, pp. 6–7,
after the construction lines (p. 5) and the sizing note ("Designing Overcoats"). US 1916, public
domain. Inches below are Simons', for a 38 breast.

**Block:** FreeSewing's Brian, through the peacoat and the mackinaw (`lib/coat.mjs`): the
peacoat's notched lapel and collar, slanted pockets, vent and lining, with a single-breasted
front (one row of buttons on CF) and the side seams let out at the hem.

**Status:** draft. Not sewn.

## What the source shows
"A conservative overcoat, with no under arm Vee", single-breasted:
- **Size:** "a size 38 breast is drafted on a basis of 40": two sizes up, for a regular overcoat
  (three for a box coat, four for an ulster or extreme box).
- **Length:** 44 in from the nape (B–G); the waist 17½ in down (B–E).
- **CB seam** A–I–H, in ¾ in at the waist and at the hem.
- **Side seam** let out ½ in at the hem (L–20).
- **Front:** a gorge and notched lapel (5–12–10–9–13), single-breasted.
- The draft gives no pockets, buttons or lining.

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Ease | Two sizes up | `chestEase` 24% (the peacoat's 22% is a hip-length coat) |
| Length | 44 in from the nape | `lengthBelowWaist` 250% of waist to seat: 26½ in below the waist at FreeSewing's 38 |
| Side seam | ½ in out at the hem | `hemFlare` 1.3% of the seat at each side seam |
| Front | Single-breasted, notched lapel | `buttonExtension` 3.3% of the chest (a 1¼ in lap); `buttons` 4 on CF, the top `buttonTop` 160% of the lap below the chest line (2 in; the lapel breaks there), the last `buttonBottom` 57% of waist to seat below the waist |
| Collar | Notched lapel and collar | The peacoat's notched lapel and collar (`collarStyle` ulster), smaller: `collarWidth` 24% of the neck, `lapelWidth` 22% |
| CB | A seam | The peacoat's CB seam and vent (`vent`) |
| Pockets, lining | Not drafted | As the peacoat: slanted welt pockets, a lining |

## Construction
Proposed making-up order for this unsewn draft; the source does not draft pockets or lining:

1. Make the slanted welt pockets on the fronts: interface and fold each welt, stitch it and a bag piece at the marked mouth, cut and turn the opening, then close the bag and secure the welt ends.
2. Sew the centre-back seam, leaving the vent open. Fold and finish the vent lap, then join the shoulder and side seams.
3. Sew the collar to the neckline and join the front facings to the front edges and lapels. Join the back-neck facing to the front facings at the shoulders and finish the collar gorge.
4. Sew each sleeve seam and set the sleeves into the armholes, easing the caps.
5. Assemble the body and sleeve linings with a centre-back ease pleat. Finish the lining around the vent and attach it to the facings.
6. Finish coat and sleeve hems, allowing an ease fold in the lining. Work one row of buttonholes on the overlapping front at centre front and sew the corresponding buttons to the underlap.

## Changes and what isn't modelled
- **No CB shaping:** Simons' CB comes in ¾ in at the waist and the hem; here it's straight, as
  on the peacoat, its vent below.
- **Pockets and lining** are the peacoat's: Simons' regular draft has none.
