# Quilted jacket

**Source:** ЕМКО СЭВ, vol. 3, *Base constructions of men's clothing* (Moscow, 1988), corpus
`emko` (a private copy, not in the repository). §5, the men's insulated jacket: the model on
p. 81, model construction Table 5.3 with Figs. 27–28 (base construction Table 5.2). Still in
copyright: only its proportions and construction are used here, as design references, in our
own words. Lengths below are the book's centimetres, for its 176-100-88 figure. The archived
pipeline's reading: `archive/recipes/emko/jacket_insulated_imk.yaml`.

**Block:** FreeSewing's Brian, through the windbreaker (`designs/windbreaker`, ЕМКО §4), whose
yoked body, hood, welt pockets and sleeve it shares. The quilted jacket is the windbreaker's spec
with these changes.

**Status:** draft. Not sewn.

## What the source shows
The summer jacket's winter sibling:
- **Back:** the summer jacket's back yoke (16.75 down CB) and one-piece lower back.
- **Front:** a yoke whose seam slopes from the front edge (17.0 below the front neck) up to the
  armhole 15.0 above the underarm, taking the chest dart; buttoned to the top on a sewn-on
  placket 5.0 wide, the front cut back by half of it.
- **Hood:** with a CB seam and a drawstring in the face edge.
- **Insulation:** quilted yokes (and a quilted body), elastic at the hem.
- **Sleeves:** two pieces, seams at the front and back of the arm.
- **Pockets:** slanted welts.
- **Ease:** half the chest is 64.55 across: 29% over the chest.
- **Length:** 77.7 from the nape, 29.1 below the waist (as the summer jacket).

## How it maps onto the block
| Feature | ЕМКО (176-100-88) | Here (option default) |
|---|---|---|
| Ease | 29% over the chest | `chestEase` 27%, `bicepsEase` 34% |
| Back yoke | 16.75 of the 30.5 from the nape to the underarm | `yokeDepth` 55% |
| Front yoke | Front edge 17.0 below the front neck; armhole end 15.0 above the underarm, so the seam rises toward the armhole | `frontYokeDepth` 72% and `frontYokeArm` 36% of CF neck to the chest line |
| Closure | Buttoned to the top on a 5.0 placket | `buttonExtension` 2.6% of chest each side of CF (half the placket); `buttons` 7 on CF, from just below the neck to above the hem |
| Hood | CB seam, drawstring | As the windbreaker, `hoodDrawstring` on |
| Quilting | Quilted body and yokes | `quilted` on: the yokes, body pieces, sleeves and hood cut again in quilted lining |
| Facing | (not tabulated) | `facingWidth` 8% of chest |

## Construction order
1. Quilted lining: cut from ready-quilted lining, or quilt lining and wadding together first.
2. Welt pockets in the lower fronts (the windbreaker's order), through the outer fabric only.
3. Outer shell: yokes to the fronts and back; shoulders; side seams; sleeves made up and set in;
   the hood's crown seam, its casing, and the hood to the neckline.
4. Lining: the same, in quilted lining, without pockets.
5. Lining to shell along the facings and hood; turn through the hem; topstitch the front edges.
6. Hem and cuffs as casings, elastic at the sides of the hem; buttonholes on the right front.

## Changes and what isn't modelled
- **The placket is cut in one with the front** (`buttonExtension`), not sewn on as ЕМКО's is.
- **The sleeve** is FreeSewing's one-piece sleeve, not ЕМКО's two-piece sleeve.
- **No chest or belly dart.** ЕМКО turns the chest dart into the sloping yoke seam; Brian's front
  has no dart to move.
- **Quilting** is a lining cut list, not a quilting pattern: quilt lines aren't drafted.
- Everything else (hood, pockets, elastic) as the windbreaker's brief says.
