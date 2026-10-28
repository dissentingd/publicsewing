# Balmacaan

**Source:** Simons, *Designing Overcoat Patterns for Men and Young Men* (The Clothing Designer
Co., New York, 1916), corpus `designingovercoa00simo` (tracked). "One Piece Sleeve Balmacaan",
pp. 32–33, and "Split Sleeve Balmacaan with Hinge", pp. 34–35 (PDF pp. 36–39). US 1916, public
domain. Inches below are Simons', for a 38 breast.

**Block:** FreeSewing's Brian, through the overcoat, peacoat and mackinaw (`lib/coat.mjs`,
`lib/raglan.mjs`): the overcoat's single-breasted front, slanted pockets and vent, with the
mackinaw's raglan sleeves and military collar.

**Status:** draft. Not sewn.

## What the source shows
A loose overcoat to below the knee with raglan sleeves:
- **Size:** "made 4 sizes larger than the sack breast measurement, so that the garment will be
  full" (p. 33): a 38 breast drafted on 21 (half of 42).
- **Length:** 44 in (p. 32); the split-sleeve one 42 in (p. 34).
- **Raglan sleeves**, the shoulder cut in one with the sleeve, in two versions: one piece
  (pp. 32–33, a dart over the shoulder), or split down the over-arm line into a front and back
  sleeve (pp. 34–35), with a "hinge" (a notch, R–41, 1¼ in) where the sleeve meets the armhole.
- **Collar:** "a military collar Balmacaan. The collar is drafted the same as ... Military
  Collar Mackinaw" (p. 33).
- **Front:** a 2 in lap (Y–Z), buttons from the throat down (the diagram shows three, the top
  one about 2 in below the neck, the last about 2 in below the hip line).
- **Pocket:** a slanted welt between the waist and hip lines (diagram).
- **Back:** a CB seam let out 1½ in at the hem (F–G); the side seams flare widely (2–3 is ¼ of
  21 out from the armhole's centre line). Measured off the diagram, the sweep is about 66 in.

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Ease | Four sizes up | `chestEase` 29%, as the ulster (also four sizes up) |
| Length | 44 in | `lengthBelowWaist` 250% of waist to seat, as the overcoat (26½ in below the waist at FreeSewing's 38) |
| Sweep | About 66 in (diagram) | `hemFlare` 10% of the seat at each side seam: about 66 in at FreeSewing's 38, as the box overcoat |
| Sleeve | Raglan, one piece or split | `sleeveStyle` raglan: the split sleeve, front and back pieces (`lib/raglan.mjs`) |
| Collar | Military, as the mackinaw's | `collarStyle` military, `collarWidth` 27% of the neck (the mackinaw's) |
| Lap | 2 in | `buttonExtension` 5.3% of the chest |
| Buttons | Throat to below the hip line | `buttons` 4, evenly; the top `buttonTop` −320% of the lap from the chest line (2 in below the neck), never nearer the neck than 15% of the neck; the last `buttonBottom` 78% of waist to seat below the waist |
| Pocket | Slanted welt | The overcoat's hand pockets |
| Back | CB seam | The overcoat's CB seam and vent |
| Lining | Not given | `lining` off. The lining (from the peacoat) goes only with the ulster and shawl collars |

## Changes and what isn't modelled
- **The one-piece raglan sleeve isn't built.** Simons gives both; the split sleeve is his second
  version and is what the raglan library makes. Its "hinge" notch is the library's armhole
  notch, where the raglan line meets the armhole.
- **The raglan line** runs from the neck to the armhole notch (`lib/raglan.mjs`, from the
  mackinaw's Diagram XXIII), not down to the underarm as in Simons' balmacaan diagram, so less of
  the body goes onto the sleeve.
- **Buttons are evenly spaced.** The diagram's three are uneven (throat, below the waist, below
  the hip line); four even ones close the front between the same two ends.
- **A clamp on the top button** (added to the overcoat's front, 2026-10-28): it stays at least
  15% of the neck below the neck point. The children's sets have a short neck-to-chest depth,
  where a top button set from the lap rose above the neck. It doesn't change the overcoat or
  box overcoat, whose top buttons are below the chest line.
- **The sweep comes from the side seams** (`hemFlare`), not also from the CB seam as in the
  source; the CB seam keeps the overcoat's line.

## Pieces
As the overcoat with raglan sleeves and the military collar: back (CB seam, vent), front,
facing, front and back raglan sleeves (cut 2 each), military collar, hand-pocket welts and
bags.

## Construction
1. CB seam and vent; hand pockets on the fronts.
2. Each front sleeve to its back sleeve down the over-arm seam, then the sleeves into the
   raglan lines on the back and fronts, matching the armhole notches.
3. Underarm and side seams in one, from the cuff to the hem.
4. Facings to the fronts; the collar to the neck, its ends at the front edges, so it buttons to
   the throat.
5. Hems; buttonholes on the right front (men's), buttons on the left.
