# Service shirt

**Sources:**
- W. D. F. Vincent, *The Cutter's Practical Guide to Cutting and Making Shirts, Undergarments,
  Collars…* (London, 1890), corpus `vincentmakingshirts18xx` (laptop). "Coat Shirts", the S.B.
  front, Diagrams 1–2 and 4, pp. 12–13. Public domain (published 1890, Vincent died 1926).
- Simons, *Drafting Cotton Garments and Mackinaws* (1918), corpus `draftingcottonga00simo`
  (tracked). The convertible collar, Diagram XX (as the mackinaw's). US 1918, public domain.

Inches below are Vincent's.

**Block:** FreeSewing's Brian, through the pyjama jacket and the barber's coat (`extends:
../pyjama-jacket/spec.yaml`, `lib/coat.mjs`): a loose, unlined button-through body, facings and
plain sleeves. From the other coats: the back cut at a yoke (`lib/panels.mjs`, as the
windbreaker), the convertible collar and flapped patch pockets (as the mackinaw). The shoulder
straps are `polygon` pieces.

**Status:** draft. Not sewn.

## What the source shows
Vincent's coat shirts open "all down the front", "easier to put on as a coat than by struggling
through them over the head", and are "a good deal worn in the States".
- **Back:** sac or yoked; the side seam a quarter breast plus 1¼ to 2½ in from CB, hollowed 1 in
  at the waist, 1 in of spring over the seat; 4 in shorter than the full length, the bottom
  rounded.
- **Front (S.B.):** the side seam a quarter breast less 1 in from the breast line; 1¾ in added for
  the button stand; the front 2 in shorter than the back; an extra button and hole below to keep
  it closed.
- **Finish:** turn-down collar, out-breast pocket (his athletic shirt, p. 14, finished the same
  way).
- **Simons' convertible collar** (Diagram XX): runs the whole neckline to just short of the front
  edge; worn up and buttoned, or turned down with the fronts open.

## How it maps onto the block
| Feature | Source | Here (option default) |
|---|---|---|
| Ease | About 4 in over the chest | `chestEase` 11%, as the pyjama jacket |
| Length | Rounded tails, to below the seat | `lengthBelowWaist` 110% of waist to seat, `hemCurve` 40% (the front corner rounded) |
| Front | Button-through, 1¼–1¾ in stand | `buttonExtension` 3.5% of the chest, `buttons` 6, neck to below the waist |
| Back | Yoked | `yokeDepth` 35% of CB neck to the chest line |
| Collar | Turn-down; Simons' convertible | The convertible collar, `collarWidth` 20% of the neck |
| Pockets | Out-breast pocket | Two breast patch pockets, `pocketShape` pointed, with `pocketFlaps` |
| Shoulder straps | Not in the sources | `shoulderStraps`: 85% of the shoulder seam long, 10% of the neck wide, pointed and buttoned at the neck end |

## Changes and what isn't modelled
- **Shoulder straps and the second pocket are ours**: the service-shirt look, not in Vincent.
- **The front isn't 2 in shorter than the back**; front and back hems are level.
- **Long sleeves only**, plain at the wrist as the pyjama jacket's (`cuffEase` 75% over the
  wrist); no cuffs or short sleeves.
- **No extra button below the front**.

## Pieces
Front (cut 2), back yoke and back body (on the fold), collar, facing (cut 2), sleeves, breast
pockets and flaps (cut 2 each; flaps also as facings), shoulder straps (cut 4).

## Construction
1. Pockets: hem, press and topstitch on their marks; make the flaps, sew each above its pocket.
2. Back to the yoke; fronts to the yoke at the shoulders.
3. Shoulder straps: sew each pair round, turn; buttonhole at the point; tack the square end into
   the armhole seam, button at the neck end.
4. Facings to the fronts; collar to the neckline, between the facings.
5. Sleeves set in; underarm and side seams; hems; buttonholes on the right front (men's).
