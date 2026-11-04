# designs/ (PublicSewing)

PublicSewing's made-to-measure designs on FreeSewing's MIT-licensed core and blocks (used as npm packages,
not copied), plus children's measurement sets. Node 22.

```bash
cd designs
npm install
npm test                                   # sizes + every design at every size
npm run test:robust                        # every menu option at its extremes, core settings, each part alone
npm run sizes                              # re-parse and check the USDA transcription
NODE_PATH=$(npm root -g) node tools/render.mjs chore-coat cisMaleAdult38 usdaBoyC5 stoutMale48 --png
NODE_PATH=$(npm root -g) node tools/snap.mjs out/some.svg     # PNG preview of any SVG
NODE_PATH=$(npm root -g) node tools/preview.mjs chore-coat     # the site page's pattern-pieces preview (no args: all)
NODE_PATH=$(npm root -g) node tools/compare.mjs chore-coat --pages 12,13   # the source's PDF pages above the pieces at 3 sizes
NODE_PATH=$(npm root -g) node tools/page-check.mjs chore-coat  # the built page in a browser: drafts, variants, downloads, PDFs
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
| `norfolk-jacket/` | Norfolk jacket (any size): the hunting coat with a yoke and waist seam on the front too, three pleats a side, front and back, a belt, lapels, a vent from the waist, Simons 1922 Diagram 7. [BRIEF.md](norfolk-jacket/BRIEF.md) | draft (not sewn) | not draped |
| `military-tunic/` | Fitted three-piece body on Bent, two-piece sleeve, standing collar, welt pockets, Simons 1918. [BRIEF.md](military-tunic/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `boys-work-coat/` | The chore coat with Simons' boys' details (5 buttons, pointed collar), for children's sizes. [BRIEF.md](boys-work-coat/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `barbers-coat/` | White service coat, standing collar or open neck, Simons 1918. [BRIEF.md](barbers-coat/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `shop-coat/` | Long flared work overcoat (grocers' gown, lab coat, duster), pencil pocket, Simons 1918. [BRIEF.md](shop-coat/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `bar-vest/` | Short waisted white jacket, pointed fronts, standing collar, sleeves optional, Simons 1918. [BRIEF.md](bar-vest/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `nightshirt/` | Long nightshirt: back yoke, front placket, neck band, side slits, Walker 1909. [BRIEF.md](nightshirt/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `dressing-gown/` | Dressing gown (any size): the overcoat's body made long, a wide overlap, a shawl collar, hip patch pockets, a girdle and loops, Vincent 1890 p. 27; his bath robe as a variant. [BRIEF.md](dressing-gown/BRIEF.md) | draft (not sewn) | not draped |
| `nightgown/` | Long yoked nightgown, gathered, front placket, Walker 1909. [BRIEF.md](nightgown/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `childrens-smock/` | Yoked smock / child's overall, back opening, Walker 1909. [BRIEF.md](childrens-smock/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `frock/` | Bodice and gathered skirt dress, Walker 1909. [BRIEF.md](frock/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `pinafore/` | Sleeveless gathered pinafore, Walker 1909. [BRIEF.md](pinafore/BRIEF.md) | draft (not sewn) | REVIEW (pose), 2026-10-26 |
| `shirtwaist-dress/` | Buttoned work dress: easy bodice, turn-down collar, full sleeves into cuffs, gathered skirt, Woman's Institute *Pattern Drafting* §2. [BRIEF.md](shirtwaist-dress/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `tailored-jacket/` | Women's semi-fitted jacket: princess seams flared below the waist, peak or notched lapel, collar, breast welt, set-in flap pockets, back-neck facing, lining, two-piece sleeves, on Breanna, Mitchell 1921. [BRIEF.md](tailored-jacket/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `kimono-jacket/` | Kimono jacket: the tailored jacket's body and princess seams, the sleeve cut in one with the side back and side front, Mitchell 1921 pp. 40-41. [BRIEF.md](kimono-jacket/BRIEF.md) | draft (not sewn) | not draped |
| `fitted-jacket/` | Women's tight-fitted jacket: the tailored jacket's princess seams with an under-arm panel in place of the side seam, a shaped CB seam, and a shawl collar cut in one with the front, on Breanna, Mitchell 1921 pp. 42–45. [BRIEF.md](fitted-jacket/BRIEF.md) | draft (not sewn) | not draped |
| `double-dart-jacket/` | Mitchell's tight-fitted jacket with a double dart: the fitted jacket with a second front seam from the shoulder to the hem, no pockets, Mitchell 1921 pp. 46–47. [BRIEF.md](double-dart-jacket/BRIEF.md) | draft (not sewn) | not draped |
| `princess-coat/` | Pivnick's fitted princess coat: the women's peacoat long and flared, with a flared CB seam, two rows of six buttons to the waist, a convertible collar, banded slash pockets and a half belt, Pivnick 1949 pp. 274-279. [BRIEF.md](princess-coat/BRIEF.md) | draft (not sewn) | not draped |
| `womens-peacoat/` | Women's peacoat: the tailored jacket double-breasted (a 4" lap, two rows of three buttons), hip length, Merz's storm collar (buttoned to the neck; notched or peaked lapels as options), hip flap pockets, lined, Merz 1911 Diagram XXI. [BRIEF.md](womens-peacoat/BRIEF.md) | draft (not sewn) | not draped |
| `field-jacket/` | Women's field jacket: the box coat at hip length, small lapels, five buttons on CF, four flapped patch pockets, Merz 1911 Diagram XX. [BRIEF.md](field-jacket/BRIEF.md) | draft (not sewn) | not draped |
| `raincoat/` | Simons' raincoat: the overcoat loose and very full at the hem, buttoned to the neck under a stand and leaf collar, slanted pockets, unlined, Simons 1922 Diagram 36. [BRIEF.md](raincoat/BRIEF.md) | draft (not sewn) | not draped |
| `overcoat/` | Single-breasted overcoat to below the knee: the peacoat's notched lapel, collar, vent, pockets and lining with a single-breasted front, drafted two sizes up, Simons 1916 pp. 6–7. [BRIEF.md](overcoat/BRIEF.md) | draft (not sewn) | not draped |
| `surtout/` | Surtout: the suit jacket's three-piece body cut off at a high waist, double-breasted, on one flared skirt with flap pockets, lined, Simons 1916 pp. 38-39. [BRIEF.md](surtout/BRIEF.md) | draft (not sewn) | not draped |
| `fitted-overcoat/` | Fitted overcoat: the suit jacket's body made long and flared, three buttons, slanted pockets, a long back vent, lined, Simons 1916 pp. 18-19. [BRIEF.md](fitted-overcoat/BRIEF.md) | draft (not sewn) | not draped |
| `box-overcoat/` | Loose, straight single-breasted overcoat flared to a 66" sweep: the overcoat three sizes up, Simons 1916 pp. 14–15. [BRIEF.md](box-overcoat/BRIEF.md) | draft (not sewn) | not draped |
| `ulster/` | Long double-breasted ulster-collar overcoat: the peacoat at 50" and four sizes up, Simons 1916 pp. 28–30. [BRIEF.md](ulster/BRIEF.md) | draft (not sewn) | not draped |
| `balmacaan/` | Loose raglan-sleeved overcoat: the overcoat four sizes up with the mackinaw's two-piece raglan sleeves and military collar, buttoned to the throat, flared to a 66" sweep, Simons 1916 pp. 32–35. [BRIEF.md](balmacaan/BRIEF.md) | draft (not sewn) | not draped |
| `mantle/` | Loose overcoat: the balmacaan two sizes up with the armhole 3" lower, a convertible collar, three buttons, flapped patch pockets, no vent, Simons 1916 pp. 36–37 (the back cut in one with the sleeve isn't built). [BRIEF.md](mantle/BRIEF.md) | draft (not sewn) | not draped |
| `cape/` | Cape (any size): a quarter circle on the shoulders, two pieces with a flared seam or one with a shoulder dart, a collar and a folded-back facing, Mitchell 1921 pp. 58-59. [BRIEF.md](cape/BRIEF.md) | draft (not sewn) | not draped |
| `dolman-cape/` | Dolman cape: Breanna's body with the shoulder run out and curved over the arm into a straight side seam, a bust dart, small darts on the back, Pivnick 1949 ch. XIX. [BRIEF.md](dolman-cape/BRIEF.md) | draft (not sewn) | not draped |
| `peacoat/` | Hip-length double-breasted coat: the mackinaw with Simons' D.B. overcoat stand, three-button rows, notched lapel and deep ulster collar, slanted hand-warmer welt pockets, back vent and lining, no belt, on Brian, Simons 1916. [BRIEF.md](peacoat/BRIEF.md) | draft (not sewn) |
| `womens-box-coat/` | Women's loose box coat: straight body flared from the arms, shaped CB seam, neck dart, notched lapel, collar, buttons near the lapped edge, set-in flap pockets (hip and ticket), two-piece sleeves, on Breanna, Mitchell 1921. [BRIEF.md](womens-box-coat/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `girls-coat/` | Girls' coat: the box coat at Sheifer's proportions, to below the knee, a 2½" lap, four buttons, hip flap pockets 3" below the waist, for any size, Sheifer 1908. [BRIEF.md](girls-coat/BRIEF.md) | draft (not sewn) | not draped |
| `gored-skirt/` | Flared skirt of 5 to 15 gores: a front panel on the fold, gores in pairs, the waist shaping in darts on the seams, flared below the seat, CB zip, waistband, on Sarah, Mitchell 1921 pp. 84–101. [BRIEF.md](gored-skirt/BRIEF.md) | draft (not sewn) | not draped |
| `pleated-skirt/` | Pleated skirt: the gored skirt with a pleat underlay below the seat line on each gore, side pleats (one edge) or box pleats (both), Mitchell 1921 pp. 102–107. [BRIEF.md](pleated-skirt/BRIEF.md) | draft (not sewn) | not draped |
| `circular-skirt/` | Circular skirt: a fan slashed and spread from just above the hip, the waist folded away above the slashes, the rest in a side seam dart, front on the fold, back with a CB seam and zip, Mitchell 1921 pp. 110-113. [BRIEF.md](circular-skirt/BRIEF.md) | draft (not sewn) | not draped |
| `jumpsuit/` | One-piece suit cut flat, no block: one body piece round the figure with armhole slashes and a leg slit up the back, rectangular sleeves, square underarm and diamond crotch gussets, buttoned front, collar band, patch pockets; Thayaht's TuTa (1920) via Open+Pattern (CC BY 4.0). [BRIEF.md](jumpsuit/BRIEF.md) | draft (not sewn) | not draped |
| `bloomers/` | Full knickers gathered into knee bands, elastic waist, on Titan, Walker 1909. [BRIEF.md](bloomers/BRIEF.md) | draft (not sewn) | OK, 2026-10-26 |
| `pyjama-jacket/` | Loose, unlined pyjama jacket: the barber's coat with Vincent's ease, a 1½" stand, five buttons to the throat under a stand collar, a left breast pocket, Vincent 1890 p. 25. [BRIEF.md](pyjama-jacket/BRIEF.md) | draft (not sewn) | not draped |
| `pyjama-trousers/` | Full pyjama trousers: the bloomers' gathered legs run to the ankle, tapered, with a plain hem and a drawstring or elastic waist, Vincent 1890 p. 26. [BRIEF.md](pyjama-trousers/BRIEF.md) | draft (not sewn) | not draped |
| `service-shirt/` | Button-through camp-collar shirt: the pyjama jacket opened all down the front with a back yoke, Simons' convertible collar, two flapped breast pockets and shoulder straps; Vincent 1890 coat shirt. [BRIEF.md](service-shirt/BRIEF.md) | draft (not sewn) | not draped |
| `dress-shirt/` | Classic button-through shirt: the service shirt with a collar on a stand, cuffs buttoned over a bound sleeve opening, one plain breast pocket; Vincent 1890 yoked shirt, collars and cuffs. [BRIEF.md](shirt/BRIEF.md) | draft (not sewn) | not draped |
| `anorak/` | Pullover anorak: the yoke template with a deep front yoke, a buttoned neck placket, the windbreaker's hood, a flapped chest pocket in the yoke seam and a kangaroo pocket; the US tactical smock via Open+Pattern (CC BY 4.0). [BRIEF.md](anorak/BRIEF.md) | draft (not sewn) | not draped |
| `work-shirt/` | Roomy pullover work shirt: Vincent's working-man's shirt on the yoke template, a back yoke with the back's fullness gathered in, a buttoned fly, neck band or turn-down collar, wristbands, a left breast pocket, Vincent 1890 p. 17. [BRIEF.md](work-shirt/BRIEF.md) | draft (not sewn) | not draped |
| `t-shirt/` | Plain crew-neck T-shirt with short set-in sleeves, redrafted from the wearer's measurements using Open+Pattern's graded Standard T-shirt (CC BY 4.0). [BRIEF.md](t-shirt/BRIEF.md) | draft (not sewn) | not draped |
| `bib-overall/` | Bib-and-brace work overall: the work pants two sizes up, no waistband or fly, a bib and a raised back on the waist, crossed straps, buttoned side openings, bib, hip and seat patch pockets, Simons 1916 Diagram XII. [BRIEF.md](bib-overall/BRIEF.md) | draft (not sewn) | not draped |
| `field-trousers/` | Combat field trousers: the trousers loose and straight, two front pleats, flapped bellows cargo pockets on the thighs, a flapped seat pocket; the British CS95 trouser via Open+Pattern (CC BY 4.0). [BRIEF.md](field-trousers/BRIEF.md) | draft (not sewn) | not draped |
| `peg-pants/` | Peg-top pants: the trousers full over the hips, the extra waist in two front pleats, a wide knee tapering to a narrow bottom, Simons 1916 Diagram VIII. [BRIEF.md](peg-pants/BRIEF.md) | draft (not sewn) | not draped |
| `overall-pants/` | Overall trousers with no side seam: the work pants two sizes up, back and front drafted on one straight outseam line and cut as one piece per leg, fly, waistband, Simons 1916 Diagram XIII. [BRIEF.md](overall-pants/BRIEF.md) | draft (not sewn) | not draped |
| `sailor-pants/` | Sailor pants (any size): the overall pants with a bell bottom and a drop front, opening at side slits and folding down, Simons 1922 Diagram 46. [BRIEF.md](sailor-pants/BRIEF.md) | draft (not sewn) | not draped |
| `two-piece-skirt/` | Plain fitted skirt: the gored skirt's layout with three gores (front on the fold, back with a CB seam), the waist shaped at the side seams and CB, Mitchell 1921 p. 86. [BRIEF.md](two-piece-skirt/BRIEF.md) | draft (not sewn) | not draped |
| `middy-blouse/` | Sailor's middy blouse (any size): the yoke template with no yokes, a deep V neck, a square sailor collar and a shield, sleeves into cuffs, Simons 1922 Diagram 9. [BRIEF.md](middy-blouse/BRIEF.md) | draft (not sewn) | not draped |
| `prince-albert-jacket/` | Mitchell's "Prince Albert" cut: the fitted jacket cut through at the waist, the skirt in one piece from the front to the back seam, which curves into the armhole; back pleats and vent, a wide lap, peaked lapels, no pockets, Mitchell 1921 pp. 48–51. [BRIEF.md](prince-albert-jacket/BRIEF.md) | draft (not sewn) | not draped |
| `shift-dress/` | Shift dress (any size): the yoke template with no yokes, front and back each in one piece from shoulder to hem, flared a little, a CB neck placket, short sleeves; Pivnick 1949's one-piece dress foundation. [BRIEF.md](shift-dress/BRIEF.md) | draft (not sewn) | not draped |
| `kimono-dress/` | Kimono dress: a bodice to the waist with a short sleeve cut in one, no gusset, a collar, buttoned down the front, a slightly gathered skirt; Pivnick 1949 Pattern 101. [BRIEF.md](kimono-dress/BRIEF.md) | draft (not sewn) | not draped |
| `kilt/` | A wrap kilt: flat front aprons, pleated lengths round the sides and back, tapering to the waist, a waistband and buckled straps, flat-cut on `lib/kilt.mjs`; Simons 1922 for its hem and length, the rest ours. [BRIEF.md](kilt/BRIEF.md) | draft (not sewn) | not draped |
| `culottes/` | Divided skirt: the two-piece skirt carried down at CF and CB into crotch extensions, the inseams straight to the hem, flared, CB zip; Pivnick 1949 ch. XVIII. [BRIEF.md](culottes/BRIEF.md) | draft (not sewn) | not draped |
| `gathered-skirt/` | Full skirt: straight breadths on the fold gathered into a waistband, a left side placket, Walker 1909's frock skirt. [BRIEF.md](gathered-skirt/BRIEF.md) | draft (not sewn) | not draped |
| `knee-pants/` | Boys' knee pants (any size): the trousers ended at the knee with a turn-up, Simons 1922 Diagram 40. [BRIEF.md](knee-pants/BRIEF.md) | draft (not sewn) | not draped |
| `boys-knickers/` | Boys' knickerbockers (any size): the knee pants fuller and 4 in longer, gathered into a buckled strap, Simons 1922 Diagram 41. [BRIEF.md](boys-knickers/BRIEF.md) | draft (not sewn) | not draped |
| `breeches/` | Riding breeches: the trousers flared out at the side of the thigh, fitted from the knee to a narrow cuff, the lower side seam buttoned, Simons 1916 Diagram XV. [BRIEF.md](breeches/BRIEF.md) | draft (not sewn) | not draped |
| `work-pants/` | Full straight work trousers for cotton and khaki: the trousers with Simons' work-pants proportions (fuller seat, knee and bottom, rise 1 in deeper, no darts, straight hem, his pocket placings), Simons 1916 Diagram IX. [BRIEF.md](work-pants/BRIEF.md) | draft (not sewn) | not draped |
| `windbreaker/` | Hooded zip-front jacket: back and front yokes, two-piece hood with a drawstring (or a stand collar), slanted welt pockets, on Brian, ЕМКО 1988 §4. [BRIEF.md](windbreaker/BRIEF.md) | draft (not sewn) | not draped |
| `quilted-jacket/` | The windbreaker buttoned to the throat, front yoke seam sloping up to the armhole, cut again in quilted lining, ЕМКО 1988 §5. [BRIEF.md](quilted-jacket/BRIEF.md) | draft (not sewn) | not draped |
| `winter-coat/` | Straight knee-length coat on the windbreaker's body: shallow back yoke, deep front yoke, near-level hip welts, turn-down collar, lining (hood optional), ЕМКО 1988 §3. [BRIEF.md](winter-coat/BRIEF.md) | draft (not sewn) | not draped |
| `topcoat/` | Semi-fitted knee-length coat on the military blouse's three-piece body: back vent, slanted welts, turn-down collar, two-piece sleeves, ЕМКО 1988 §2. [BRIEF.md](topcoat/BRIEF.md) | draft (not sewn) | not draped |
| `suit-jacket/` | Single-breasted two-button jacket on the topcoat's three-piece body: notched lapel and collar, rounded front corners, flap pockets, breast welt, back vent, two-piece sleeves, ЕМКО 1988 §1. [BRIEF.md](jacket/BRIEF.md) | draft (not sewn) | not draped |
| `smoking-jacket/` | Vincent's smoking jacket: the dressing gown short, a wide overlap with three frogs, a wide roll collar, gauntlet cuffs, slanted set-in hip pockets, lined, Vincent 1890 p. 28. [BRIEF.md](smoking-jacket/BRIEF.md) | draft (not sewn) | not draped |
| `eton-jacket/` | Simons' English Eton coat: the boys' suit jacket cut off 3 in below the waist, a wide lapel rolling to the waist, a square front corner, no pockets or vent, Simons 1922 Diagram 13. [BRIEF.md](eton-jacket/BRIEF.md) | draft (not sewn) | not draped |
| `golf-pants/` | Simons' boys' golf pants: the breeches short, full at the thigh, fitted through the knee to a straight hem 2 in below it, a buttoned side vent, Simons 1922 Diagram 43. [BRIEF.md](golf-pants/BRIEF.md) | draft (not sewn) | not draped |
| `boys-suit-jacket/` | Boys' suit jacket: the suit jacket at Simons' boys' proportions, three buttons from a break above the waist, flap pockets, no vent or breast welt, for any size, Simons 1922 Diagram 2. [BRIEF.md](boys-jacket/BRIEF.md) | draft (not sewn) | not draped |
| `waistcoat/` | Lined V-neck waistcoat on Brian: cutaway points, back fish dart and front dart, cut-in armholes, chest and waist welts, ЕМКО 1988 §6. [BRIEF.md](waistcoat/BRIEF.md) | draft (not sewn) | not draped |
| `suit-trousers/` | Semi-fitted straight trousers on Titan: back and front waist darts, legs narrowing to a curved hem, zip fly, side pockets, jetted back pocket, waistband, ЕМКО 1988 §7. [BRIEF.md](trousers/BRIEF.md) | draft (not sewn) | not draped |
| `lib/yoke.mjs` | Shared yoke-garment drafting (Walker designs); a bodice's blousing and waist shaping, a bound sleeve opening with a lapped cuff, the sleeve placket strip (shirtwaist dress); a kimono sleeve cut in one with the bodice (kimono dress) | |  |
| `lib/coat.mjs`, `raglan.mjs`, `panels.mjs` | Coats on Brian: body (stout, waisted, flared), fronts (V neck, shawl collar, notched lapel), facings, collars, sleeves, back vent, lining, zip, raglan sleeves (in two pieces or one), back panels, front yokes; sleeveless armholes, waist darts, cutaway points (waistcoat); a collar on a stand, a cuffed sleeve with a slit, cuffs (shirt) | |
| `lib/hood.mjs` | A two-piece hood sewn to the neckline, drawstring casing optional (ЕМКО designs) | |  |
| `lib/lapel.mjs` | The notched or peaked lapel shared by the coats and the women's jackets | |  |
| `lib/body3.mjs` | Three-piece body on Bent, back vent, welt pockets and flaps, rounded front corners, notched lapel, lining and inside breast pocket, buttoned sleeve vent (military blouse, topcoat, jacket) | |  |
| `lib/kilt.mjs` | A wrap kilt, flat-cut: `kiltLayout` and the `kiltApron` and `kiltPleats` pieces, with pleat folds and placement lines marked. |
| `lib/jacket.mjs` | Women's jackets and coats on Breanna: princess panels (optionally an under-arm panel, a shaped CB seam, a shawl collar, a back seam into the armhole, a waist seam with a one-piece skirt, a hem flare with a flared CB, a front seam kept clear of the buttons), or a box body with a pivoted neck dart; lapels, CB seam, buttons near the edge, double-breasted, a front closed to the neck (storm collar), a fly-front strip | |  |
| `lib/pockets.mjs` | Patch pockets, flaps, belts, set-in flap pockets (flap, jet, bag) | |  |
| `lib/trousers.mjs` | Legs on Titan: gathered into bands (bloomers) or to a plain hem (pyjama trousers), or tailored with darts, fly and pockets (trousers), breeches buttoned at the side or the front; strips (waistband, fly, belt loops) | |  |
| `lib/cape.mjs` | A cape: the block's neck and shoulder laid out as a quarter circle, two pieces or one | |  |
| `lib/skirt.mjs` | Gored skirts on Sarah: gores laid on the seat line, waist darts on the seams, equal flare at every seam edge (gored skirt); side or box pleat underlays below the seat line (pleated skirt); a fan slashed and spread from above the seat line (circular skirt) | |  |
| `lib/flat.mjs` | Flat-cut garments, no block: pieces as straight-edged shapes from measurements, a mitred allowance offset (jumpsuit); the `polygon` piece type (bib overall) | |  |
| `lib/load-spec.mjs` | Reads a `spec.yaml` (resolving `extends`) and builds it (Node only) | |  |
| `lib/spec.mjs`, `expr.mjs` | Builds a spec into a FreeSewing design ([SPEC.md](SPEC.md)); no file access, so the site runs it in the browser. Adds a `testSquare` piece (a scale box) to every design | |  |
| `lib/export/` | Files for other pattern software, from a drafted pattern (Node and browser): `pieces.mjs` (pieces as flattened outlines, notches, grain, fold), `dxf.mjs` (AAMA DXF: CLO3D, Marvelous, Browzwear, Style3D, Optitex, Gerber, Lectra; LibreCAD), `seamly.mjs` (Seamly2D `.sm2d`, schema 0.7.6, fixed geometry), `smis.mjs` (SeamlyMe measurements, both ways), `svg.mjs` (full-size SVG, an Inkscape layer per piece), `pdf.mjs` (projector PDF: one 1:1 page, heavy lines, light-on-dark option; no dependencies), `layout.mjs` (their shelf layout), `index.mjs` (all of them, with source credits). Checked by `test/export.test.mjs` (every DXF reads back as its pattern; SVG layers and PDF structure) and `tools/seamly-check.mjs` (Seamly2D itself loads each file and its seams keep their length) | |  |
| `test/declared-measurements.test.mjs` | Every design and variant drafts with only the measurements it declares, as the site's size picker gives it. The other tests pass a whole set, so they can't see a design that uses one it doesn't declare. |
| `test/grade.test.mjs` | Grade checks: dimensions grow with the chest at about the rate Open+Pattern's graded DXFs do (`test/grade/openpattern.json`, from `tools/grade-reference.mjs`); known differences listed with the reason | |  |
| `drape/` | 3D drape configs (`runs.yaml`: one per draped design), renders and results ([README](drape/README.md)); `node tools/drape.mjs <design>` runs one | all 18 designs draped |  |
| `tools/` | `dxf-aama.mjs` (reads AAMA DXF pattern files, ours or CLO's: pieces, sizes, notches; `--svg`), `export.mjs` (a design as DXF, `.sm2d`, `.smis`, layered SVG and projector PDF at named sets), `seamly-check.mjs` (+ `docker/seamly`), `grade-reference.mjs`, `render.mjs`, `snap.mjs`, `snapshot.mjs` (+ `variants.json`), `drape.mjs` (a whole drape), `drape-export.mjs`, `drape_spec.py` (+ `gcspec/`), `drape_inside.py` | |  |

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
