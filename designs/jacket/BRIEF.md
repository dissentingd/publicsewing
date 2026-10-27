# Jacket

**Source:** ЕМКО СЭВ, vol. 3, *Base constructions of men's clothing* (Moscow, 1988), corpus
`emko` (a private copy, not in the repository). §1, the men's semi-fitted jacket: the model and
its description on p. 5 (Fig. 1), base construction Table 1.2 (pp. 6–12) with Figs. 2–3, model
construction Table 1.3 with Figs. 4–5. Still in copyright: only its proportions and construction
are used here, as design references, in our own words; no text or figure is reproduced. Lengths
below are the book's centimetres, for its 176-100-88 figure. The archived pipeline's reading is
`archive/recipes/emko/jacket.yaml`, `jacket_imk.yaml` and
`archive/data/emko/jacket_176-100-88.yaml`.

**Block:** FreeSewing's Bent, with the three-piece body from `lib/body3.mjs` (as the topcoat,
which this design extends), the notched lapel from `lib/coat.mjs` and Bent's two-piece sleeve.

**Status:** draft. Not sewn.

## What the source shows
- **Model (p. 5):** single-breasted, semi-fitted, lined, two buttons; a notched lapel with a
  turn-down collar on a separate stand; straight flap pockets and a breast welt; a CB seam with a
  vent; two-piece sleeves with two buttons on a closed sleeve vent; inside breast pockets.
- **Ease:** half the chest is 60.15 across, about 15% over the chest.
- **Waist shaping:** 8.65 per half, between CB (0.4), the back–side-panel seam, the
  side-panel–front seam, and a dart in the front.
- **Darts:** a chest dart running down into the flap pocket, and a belly dart from the side seam
  along the pocket's mouth (the pocket cut 87° to the vertical: almost level).
- **Length:** 77.35 from the nape, 29.55 below the waist.
- **Sleeve:** two pieces, the vent 8.0 long.

## How it maps onto the block
| Feature | ЕМКО (176-100-88) | Here (option default) |
|---|---|---|
| Chest ease | about 15% | `chestEase` 15% |
| Waist | 8.65 per half | `waistEase` 17%, taken in at the two body seams (`backShare` 55% at the back seam) |
| Length | 29.55 below the waist | `lengthBelowWaist` 154% of waist to seat |
| Buttons | Two | `buttons` 2, from the waist down 45% of waist to seat; `buttonExtension` 2% of chest |
| Lapel | Notched, turning at the top button | `lapelWidth` 22% of neck from the crease, the gorge `gorgeAt` 55% along the front neck |
| Collar | Turn-down, on a separate stand | A turn-down collar, `collarWidth` 19% of neck, cut in one |
| Front corners | Rounded | `hemCurve` 70%: a radius of 7% of chest |
| Lower pockets | Straight, with flaps | Level welts 58% of the front's chest width, 45% of waist to seat below the waist; `pocketFlaps` on, the flap 32% of the mouth deep |
| Breast pocket | A welt | `breastPockets` on |
| Vent | At CB | `vent` on, `ventLength` 110% of waist to seat |
| Sleeve | Two pieces, buttoned vent | Bent's two-piece sleeve |

## Construction order
1. Breast welt; lower pockets (flap, jets, bags).
2. Back CB seam and vent; back to the side panels; side panels to the fronts.
3. Shoulders.
4. Collar to the gorges and back neck; facings and the under collar; turn the lapels and front
   edges.
5. Sleeves: seams and vents, then set in.
6. Lining (cut from the body pieces), hems.
7. Buttonholes and buttons, the sleeve buttons on the vents.

## Changes and what isn't modelled
- **Geometry from Bent, not ЕМКО's tables**, so the jacket drafts at any size.
- **No chest or belly dart.** The three-piece body's two seams take the waist shaping; ЕМКО's
  darts into the pocket mouth aren't modelled (as on the topcoat).
- **The collar is cut in one**, not on a separate stand.
- **No lining pieces yet**, and no inside pockets (as on the topcoat).
- **Sleeve vent and buttons** are not drawn on Bent's sleeve.
