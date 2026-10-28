# Mantle

**Source:** Simons, *Designing Overcoat Patterns for Men and Young Men* (The Clothing Designer
Co., New York, 1916), corpus `designingovercoa00simo` (tracked). "Mantel Overcoat", pp. 36–37
(PDF pp. 40–41). US 1916, public domain. Inches below are Simons', for a 36 breast.

**Block:** FreeSewing's Brian, through the balmacaan, overcoat, peacoat and mackinaw
(`lib/coat.mjs`, `lib/raglan.mjs`): the balmacaan's raglan sleeves and loose body, with Brian's
armhole lowered, the mackinaw's convertible collar and flapped patch pockets.

**Status:** draft. Not sewn.

## What the source shows
A loose overcoat whose back is cut in one with the whole sleeve:
- **Size:** breast 36 drafted on 20, two sizes up; length 42 in, the waist 17½ in down (B–F).
- **Back and sleeve in one piece** ("the combination of back and sleeve"): the back's top edge
  runs from the neck (R) out to the sleeve's top (2), the same length as the front's raglan
  line Q–3; the sleeve's over-arm edge (2–9–7) sews to its underarm edge (3–10–6); the cuff
  6–7 is 14½ in round (7¼ in each side of 5).
- **Front:** a raglan line from the neck (Q) to the underarm (3), which sits at P, 3 in below
  the chest line; gorge, lapel and front shaped to taste; a lap of about 2¼ in.
- **Three buttons**, from about 5 in below the chest line to 8 in below the waist (diagram).
- **A large patch pocket with a flap** each side below the waist, slanting (diagram).
- **Side seam** M–3 flared out from the underarm; no vent drawn.

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Ease | Two sizes up | `chestEase` 24%, as the overcoat |
| Length | 24½ in below the waist | `lengthBelowWaist` 230% of waist to seat |
| Underarm | 3 in below the chest line | Brian's `armholeDepth` 40% (its own 2%, plus 3 in at FreeSewing's 38) |
| Sleeve | In one with the back, wide | The balmacaan's two-piece raglan sleeve, set into the lowered armhole |
| Collar | Gorge and lapel | `collarStyle` convertible: it buttons up, or opens into lapels |
| Lap | About 2¼ in | `buttonExtension` 6% of the chest |
| Buttons | Three | `buttons` 3; the top `buttonTop` 214% of the lap below the chest line, the last `buttonBottom` 75% of waist to seat below the waist |
| Pockets | Large flapped patch pockets | `lowerPockets` on with `pocketFlaps`, `pocketShape` rounded; no hand welts |
| Flare | Side seam out from the underarm | `hemFlare` 6% of the seat at each side seam |
| Vent | None | `vent` off |

## Changes and what isn't modelled
- **The back isn't cut in one with the sleeve.** The raglan library makes a front and a back
  sleeve, each sewn to the body along a raglan line, with an over-arm seam. Merging the back
  body with both sleeve halves means turning the sleeve down over the underarm, as a kimono
  cut does, and isn't built. The look is the same from the front: a raglan line from the neck
  to the underarm.
- **The raglan line** runs from the neck to the armhole notch (`lib/raglan.mjs`), not to the
  underarm.
- **The pocket is straight**, not slanted.
- **The lapel** is the convertible collar worn open, not a separately shaped gorge and lapel.

## Pieces
Back (on the fold), front, facing, collar, front and back raglan sleeves (cut 2 each), lower
pocket and flap (cut 2 each; flaps also in lining).

## Construction
As the balmacaan, with patch pockets instead of hand welts and no vent:
1. Pockets and flaps on the fronts.
2. Each front sleeve to its back sleeve down the over-arm seam, then the sleeves into the
   raglan lines on the back and fronts.
3. Underarm and side seams in one, cuff to hem.
4. Facings and collar; hems; buttonholes on the right front (men's), buttons on the left.
