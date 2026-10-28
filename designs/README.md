# designs/ (PublicSewing)

PublicSewing's made-to-measure designs on FreeSewing's MIT-licensed core and blocks (used as npm packages,
not copied), plus children's measurement sets. Node 22.

```bash
cd designs
npm install
npm test                                   # sizes + every design at every size
npm run sizes                              # re-parse and check the USDA transcription
NODE_PATH=$(npm root -g) node tools/render.mjs chore-coat cisMaleAdult38 usdaBoyC5 stoutMale48 --png
NODE_PATH=$(npm root -g) node tools/snap.mjs out/some.svg     # PNG preview of any SVG
NODE_PATH=$(npm root -g) node tools/preview.mjs chore-coat     # the site page's pattern-pieces preview (no args: all)
```

Converting a design to a spec (`<design>/spec.yaml`, built by `lib/spec.mjs`; the chore coat is
the first): save a snapshot before, compare after. The comparison must pass at every size.

```bash
node tools/snapshot.mjs chore-coat save --variants '{"default":{},"square":{"pocketShape":"square"}}'
node tools/snapshot.mjs chore-coat compare --variants '{"default":{},"square":{"pocketShape":"square"}}'
```

`tools/render.mjs` writes 1:1 SVGs (mm) to `out/` (gitignored). `--png` adds scaled previews and
needs a global Playwright with Chromium (hence `NODE_PATH`): the cloud container has it, and on
the laptop it's `npm install -g playwright` then `npx playwright install chromium`.

3D drapes (GarmentCode on Cloudbox): `tools/drape-export.mjs` exports a design's outlines,
`tools/drape_spec.py` stitches and places them, and `tools/drape_inside.py` (run in the
container) reports where the draped cloth goes inside the body. Configs, commands and results
are in [drape/README.md](drape/README.md).

FreeSewing's 4.10.2 packages import `@freesewing/config` and `@freesewing/plugin-transform`
without declaring them, so they are listed in our package.json.

## Contents
| Folder | What | Status | 3D drape ([how](drape/README.md)) |
|---|---|---|---|
| `sizes/` | 75 children's sets (USDA 1939: 39 boys', 36 girls'); `usdaBoyC5` etc. Measurement map and derived rules in `children.mjs` | transcribed + checked |  |
| `chore-coat/` | Work coat from Simons 1918, on Brian. [BRIEF.md](chore-coat/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `mackinaw/` | Double-breasted belted mackinaw (convertible, military or shawl collar; raglan option), Simons 1918. [BRIEF.md](mackinaw/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `hunting-coat/` | Belted field coat, three-piece action-pleated back, box-pleated flap pockets, Simons 1918. [BRIEF.md](hunting-coat/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `military-blouse/` | Fitted three-piece body on Bent, two-piece sleeve, standing collar, welt pockets, Simons 1918. [BRIEF.md](military-blouse/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `boys-work-coat/` | The chore coat with Simons' boys' details (5 buttons, pointed collar), for children's sizes. [BRIEF.md](boys-work-coat/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `barbers-coat/` | White service coat, standing collar or open neck, Simons 1918. [BRIEF.md](barbers-coat/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `shop-coat/` | Long flared work overcoat (grocers' gown, lab coat, duster), pencil pocket, Simons 1918. [BRIEF.md](shop-coat/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `bar-vest/` | Short waisted white jacket, pointed fronts, standing collar, sleeves optional, Simons 1918. [BRIEF.md](bar-vest/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `nightshirt/` | Long nightshirt: back yoke, front placket, neck band, side slits, Walker 1909. [BRIEF.md](nightshirt/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `nightgown/` | Long yoked nightgown, gathered, front placket, Walker 1909. [BRIEF.md](nightgown/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `smock/` | Yoked smock / child's overall, back opening, Walker 1909. [BRIEF.md](smock/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `frock/` | Bodice and gathered skirt dress, Walker 1909. [BRIEF.md](frock/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `pinafore/` | Sleeveless gathered pinafore, Walker 1909. [BRIEF.md](pinafore/BRIEF.md) | draft (not sewn) | REVIEW (pose), 2026-10-26 |
| `shirtwaist-dress/` | Buttoned work dress: easy bodice, turn-down collar, full sleeves into cuffs, gathered skirt, Woman's Institute *Pattern Drafting* §2. [BRIEF.md](shirtwaist-dress/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `tailored-jacket/` | Women's semi-fitted jacket: princess seams flared below the waist, peak or notched lapel, collar, breast welt, set-in flap pockets, back-neck facing, lining, two-piece sleeves, on Breanna, Mitchell 1921. [BRIEF.md](tailored-jacket/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `fitted-jacket/` | Women's tight-fitted jacket: the tailored jacket's princess seams with an under-arm panel in place of the side seam, a shaped CB seam, and a shawl collar cut in one with the front, on Breanna, Mitchell 1921 pp. 42–45. [BRIEF.md](fitted-jacket/BRIEF.md) | draft (not sewn) | not draped |
| `womens-peacoat/` | Women's peacoat: the tailored jacket double-breasted (a 4" lap, two rows of three buttons), hip length, a wide notched lapel and deep collar, hip flap pockets, lined, Merz 1911 Diagram XXI. [BRIEF.md](womens-peacoat/BRIEF.md) | draft (not sewn) | not draped |
| `field-jacket/` | Women's field jacket: the box coat at hip length, small lapels, five buttons on CF, four flapped patch pockets, Merz 1911 Diagram XX. [BRIEF.md](field-jacket/BRIEF.md) | draft (not sewn) | not draped |
| `overcoat/` | Single-breasted overcoat to below the knee: the peacoat's notched lapel, collar, vent, pockets and lining with a single-breasted front, drafted two sizes up, Simons 1916 pp. 6–7. [BRIEF.md](overcoat/BRIEF.md) | draft (not sewn) | not draped |
| `box-overcoat/` | Loose, straight single-breasted overcoat flared to a 66" sweep: the overcoat three sizes up, Simons 1916 pp. 14–15. [BRIEF.md](box-overcoat/BRIEF.md) | draft (not sewn) | not draped |
| `ulster/` | Long double-breasted ulster-collar overcoat: the peacoat at 50" and four sizes up, Simons 1916 pp. 28–30. [BRIEF.md](ulster/BRIEF.md) | draft (not sewn) | not draped |
| `balmacaan/` | Loose raglan-sleeved overcoat: the overcoat four sizes up with the mackinaw's two-piece raglan sleeves and military collar, buttoned to the throat, flared to a 66" sweep, Simons 1916 pp. 32–35. [BRIEF.md](balmacaan/BRIEF.md) | draft (not sewn) | not draped |
| `mantle/` | Loose overcoat: the balmacaan two sizes up with the armhole 3" lower, a convertible collar, three buttons, flapped patch pockets, no vent, Simons 1916 pp. 36–37 (the back cut in one with the sleeve isn't built). [BRIEF.md](mantle/BRIEF.md) | draft (not sewn) | not draped |
| `peacoat/` | Hip-length double-breasted coat: the mackinaw with Simons' D.B. overcoat stand, three-button rows, notched lapel and deep ulster collar, slanted hand-warmer welt pockets, back vent and lining, no belt, on Brian, Simons 1916. [BRIEF.md](peacoat/BRIEF.md) | draft (not sewn) |
| `box-coat/` | Women's loose box coat: straight body flared from the arms, shaped CB seam, neck dart, notched lapel, collar, buttons near the lapped edge, set-in flap pockets (hip and ticket), two-piece sleeves, on Breanna, Mitchell 1921. [BRIEF.md](box-coat/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `girls-coat/` | Girl's coat: the box coat at Sheifer's proportions, to below the knee, a 2½" lap, four buttons, hip flap pockets 3" below the waist, for any size, Sheifer 1908. [BRIEF.md](girls-coat/BRIEF.md) | draft (not sewn) | not draped |
| `gored-skirt/` | Flared skirt of 5 to 15 gores: a front panel on the fold, gores in pairs, the waist shaping in darts on the seams, flared below the seat, CB zip, waistband, on Sarah, Mitchell 1921 pp. 84–101. [BRIEF.md](gored-skirt/BRIEF.md) | draft (not sewn) | not draped |
| `jumpsuit/` | One-piece suit cut flat, no block: one body piece round the figure with armhole slashes and a leg slit up the back, rectangular sleeves, square underarm and diamond crotch gussets, buttoned front, collar band, patch pockets; Thayaht's TuTa (1920) via Open+Pattern (CC BY 4.0). [BRIEF.md](jumpsuit/BRIEF.md) | draft (not sewn) | not draped |
| `knickerbockers/` | Full knickers gathered into knee bands, elastic waist, on Titan, Walker 1909. [BRIEF.md](knickerbockers/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `pyjama-jacket/` | Loose, unlined pyjama jacket: the barber's coat with Vincent's ease, a 1½" stand, five buttons to the throat under a stand collar, a left breast pocket, Vincent 1890 p. 25. [BRIEF.md](pyjama-jacket/BRIEF.md) | draft (not sewn) | not draped |
| `pyjama-trousers/` | Full pyjama trousers: the knickerbockers' gathered legs run to the ankle, tapered, with a plain hem and a drawstring or elastic waist, Vincent 1890 p. 26. [BRIEF.md](pyjama-trousers/BRIEF.md) | draft (not sewn) | not draped |
| `service-shirt/` | Button-through camp-collar shirt: the pyjama jacket opened all down the front with a back yoke, Simons' convertible collar, two flapped breast pockets and shoulder straps; Vincent 1890 coat shirt. [BRIEF.md](service-shirt/BRIEF.md) | draft (not sewn) | not draped |
| `work-shirt/` | Roomy pullover work shirt: Vincent's working-man's shirt on the yoke template, a back yoke with the back's fullness gathered in, a buttoned fly, neck band or turn-down collar, wristbands, a left breast pocket, Vincent 1890 p. 17. [BRIEF.md](work-shirt/BRIEF.md) | draft (not sewn) | not draped |
| `bib-overall/` | Bib-and-brace work overall: the work pants two sizes up, no waistband or fly, a bib and a raised back on the waist, crossed straps, buttoned side openings, bib, hip and seat patch pockets, Simons 1916 Diagram XII. [BRIEF.md](bib-overall/BRIEF.md) | draft (not sewn) | not draped |
| `field-trousers/` | Combat field trousers: the trousers loose and straight, two front pleats, flapped bellows cargo pockets on the thighs, a flapped seat pocket; the British CS95 trouser via Open+Pattern (CC BY 4.0). [BRIEF.md](field-trousers/BRIEF.md) | draft (not sewn) | not draped |
| `peg-pants/` | Peg-top pants: the trousers full over the hips, the extra waist in two front pleats, a wide knee tapering to a narrow bottom, Simons 1916 Diagram VIII. [BRIEF.md](peg-pants/BRIEF.md) | draft (not sewn) | not draped |
| `overall-pants/` | Overall trousers with no side seam: the work pants two sizes up, back and front drafted on one straight outseam line and cut as one piece per leg, fly, waistband, Simons 1916 Diagram XIII. [BRIEF.md](overall-pants/BRIEF.md) | draft (not sewn) | not draped |
| `breeches/` | Riding breeches: the trousers flared out at the side of the thigh, fitted from the knee to a narrow cuff, the lower side seam buttoned, Simons 1916 Diagram XV. [BRIEF.md](breeches/BRIEF.md) | draft (not sewn) | not draped |
| `work-pants/` | Full straight work trousers for cotton and khaki: the trousers with Simons' work-pants proportions (fuller seat, knee and bottom, rise 1 in deeper, no darts, straight hem, his pocket placings), Simons 1916 Diagram IX. [BRIEF.md](work-pants/BRIEF.md) | draft (not sewn) | not draped |
| `windbreaker/` | Hooded zip-front jacket: back and front yokes, two-piece hood with a drawstring (or a stand collar), slanted welt pockets, on Brian, ЕМКО 1988 §4. [BRIEF.md](windbreaker/BRIEF.md) | draft (not sewn) | not draped |
| `quilted-jacket/` | The windbreaker buttoned to the throat, front yoke seam sloping up to the armhole, cut again in quilted lining, ЕМКО 1988 §5. [BRIEF.md](quilted-jacket/BRIEF.md) | draft (not sewn) | not draped |
| `winter-coat/` | Straight knee-length coat on the windbreaker's body: shallow back yoke, deep front yoke, near-level hip welts, turn-down collar, lining (hood optional), ЕМКО 1988 §3. [BRIEF.md](winter-coat/BRIEF.md) | draft (not sewn) | not draped |
| `topcoat/` | Semi-fitted knee-length coat on the military blouse's three-piece body: back vent, slanted welts, turn-down collar, two-piece sleeves, ЕМКО 1988 §2. [BRIEF.md](topcoat/BRIEF.md) | draft (not sewn) | not draped |
| `jacket/` | Single-breasted two-button jacket on the topcoat's three-piece body: notched lapel and collar, rounded front corners, flap pockets, breast welt, back vent, two-piece sleeves, ЕМКО 1988 §1. [BRIEF.md](jacket/BRIEF.md) | draft (not sewn) | not draped |
| `boys-jacket/` | Boy's jacket: the jacket at Simons' boys' proportions, three buttons from a break above the waist, flap pockets, no vent or breast welt, for any size, Simons 1922 Diagram 2. [BRIEF.md](boys-jacket/BRIEF.md) | draft (not sewn) | not draped |
| `waistcoat/` | Lined V-neck waistcoat on Brian: cutaway points, back fish dart and front dart, cut-in armholes, chest and waist welts, ЕМКО 1988 §6. [BRIEF.md](waistcoat/BRIEF.md) | draft (not sewn) | not draped |
| `trousers/` | Semi-fitted straight trousers on Titan: back and front waist darts, legs narrowing to a curved hem, zip fly, side pockets, jetted back pocket, waistband, ЕМКО 1988 §7. [BRIEF.md](trousers/BRIEF.md) | draft (not sewn) | not draped |
| `lib/yoke.mjs` | Shared yoke-garment drafting (Walker designs) | |  |
| `lib/coat.mjs`, `raglan.mjs`, `panels.mjs` | Coats on Brian: body (stout, waisted, flared), fronts (V neck, shawl collar, notched lapel), facings, collars, sleeves, back vent, lining, zip, raglan sleeves, back panels, front yokes; sleeveless armholes, waist darts, cutaway points (waistcoat) | |
| `lib/hood.mjs` | A two-piece hood sewn to the neckline, drawstring casing optional (ЕМКО designs) | |  |
| `lib/lapel.mjs` | The notched or peaked lapel shared by the coats and the women's jackets | |  |
| `lib/body3.mjs` | Three-piece body on Bent, back vent, welt pockets and flaps, rounded front corners, notched lapel (military blouse, topcoat, jacket) | |  |
| `lib/jacket.mjs` | Women's jackets and coats on Breanna: princess panels (optionally an under-arm panel, a shaped CB seam, a shawl collar), or a box body with a pivoted neck dart; lapels, CB seam, buttons near the edge | |  |
| `lib/pockets.mjs` | Patch pockets, flaps, belts, set-in flap pockets (flap, jet, bag) | |  |
| `lib/trousers.mjs` | Legs on Titan: gathered into bands (knickerbockers) or to a plain hem (pyjama trousers), or tailored with darts, fly and pockets (trousers); strips (waistband, fly, belt loops) | |  |
| `lib/skirt.mjs` | Gored skirts on Sarah: gores laid on the seat line, waist darts on the seams, equal flare at every seam edge (gored skirt) | |  |
| `lib/flat.mjs` | Flat-cut garments, no block: pieces as straight-edged shapes from measurements, a mitred allowance offset (jumpsuit); the `polygon` piece type (bib overall) | |  |
| `lib/load-spec.mjs` | Reads a `spec.yaml` (resolving `extends`) and builds it (Node only) | |  |
| `lib/spec.mjs`, `expr.mjs` | Builds a spec into a FreeSewing design ([SPEC.md](SPEC.md)); no file access, so the site runs it in the browser. Adds a `testSquare` piece (a scale box) to every design | |  |
| `drape/` | 3D drape configs (`runs.yaml`: one per draped design), renders and results ([README](drape/README.md)); `node tools/drape.mjs <design>` runs one | all 18 designs draped |  |
| `tools/` | `dxf-aama.mjs` (reads AAMA DXF pattern files: pieces, sizes, notches; `--svg`), `render.mjs`, `snap.mjs`, `snapshot.mjs` (+ `variants.json`), `drape.mjs` (a whole drape), `drape-export.mjs`, `drape_spec.py` (+ `gcspec/`), `drape_inside.py` | |  |

## Adding a design
1. Write `<design>/BRIEF.md` from the source pages: the pieces, each style line as a
   proportion of the body or block, ease, closures, pockets, construction order and the
   source's page numbers (see WARDROBE_GAPS.md, "Per-garment workflow").
2. Write `<design>/spec.yaml` ([SPEC.md](SPEC.md)) on the nearest block, and a
   `<design>/src/index.mjs` that loads it. A construction no operation covers yet becomes a new
   operation in `lib/` (usable by any design), not code in the design.
3. Add `test/<design>.test.mjs`: drafts cleanly at every set; seams that sew together match.
   Add its option variants to `tools/variants.json`.
4. Render, compare with the source figure, update WARDROBE_GAPS.md.
