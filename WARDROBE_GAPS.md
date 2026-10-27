# Wardrobe gaps vs FreeSewing (2026-10-23; status updated 2026-10-27)

Direction (2026-10-23): build on FreeSewing's MIT code as a separate catalog (a fork,
not upstream contributions) and backfill it with practical garments drawn from public-domain
sources, with Claude writing the design code. From 2026-10-27, sources still in copyright are
also used, as far as copyright law permits: their methods and proportions as design references,
never their text or figures (ЕМКО СЭВ 1988, below).

The wardrobe list is the style table in [SOURCING.md](SOURCING.md) (styles 1–5 plus knits).
The FreeSewing list is `@freesewing/collection` 4.10.2 (npm, 2026-09-13, MIT): 73 designs.
Status codes:
- **Have**: an existing design covers it.
- **Variant**: an existing design plus new options or parts.
- **Gap**: needs a new design.

## The biggest gap: children's sizes

`@freesewing/models` ships measurement sets for adults (women 28–46, men 32–50), dolls and
giants only. **It has no children's sizes.** Every design is drafted from measurements, so
children's measurement sets would open much of the catalog to children in one step. Adult ease
and proportions still need checking at child sizes.

Source: USDA, Ruth O'Brien et al.
- *Children's Body Measurements for Sizing Garments and Patterns* (1939,
  `childrensbodymea365obri`).
- The survey report *Body Measurements of American Boys and Girls* (also held).

These are US government works, so they are public domain (17 USC §105). Some FreeSewing
measurements (e.g. shoulder slope, HPS to waist) aren't in the survey. They would be derived,
and marked as derived.

## Men

| Garment | Style | FreeSewing | Status | PD source for the style |
|---|---|---|---|---|
| Dress shirt | 1 | Simon | Have | — |
| Sack/suit jacket | 1 | Jaeger (on Bent) | Have; **drafted 2026-10-27** (`designs/jacket`: two-button, notched lapel, side panels, flap pockets, vent; not sewn) | ЕМКО 1988 §1 |
| Waistcoat | 1 | Wahid | Have; **drafted 2026-10-27** (`designs/waistcoat`: V neck, cutaway points, darts, welts, lined; not sewn) | ЕМКО 1988 §6 |
| Dress trousers (pleats, cuffs) | 1 | Titan, Charlie (Theo dropped in v4) | Variant; **darted trousers drafted 2026-10-27** (`designs/trousers`, on Titan: fly, pockets, waistband; no pleats or cuffs yet; not sewn); ЕМКО 1988 §7 | Simons *Pants and Overalls* 1916 `draftingpantsove00simo` |
| Overcoat (Chesterfield) | 1 | Carlton is a belted long coat | Variant | Simons *Overcoat Patterns* 1916 `designingovercoa00simo` |
| Work shirt | 2 | Simon | Variant (patch pockets, plain yoke) | Simons *Cotton Garments* 1918 `draftingcottonga00simo` |
| Work trousers / dungarees | 2 | Titan, Charlie | Variant | Simons 1916 |
| Overalls | 2 | Opal | Have | — |
| **Chore / work coat** | 2 | — | **Drafted 2026-10-23** (`designs/chore-coat`, not sewn) | Simons 1918 (work coat) |
| **Peacoat / reefer** | 3 | — | **Drafted 2026-10-26** (`designs/peacoat`: the mackinaw at hip length with Simons' D.B. overcoat details: ulster collar and notched lapel, hand-warmer pockets, vent, lining; not sewn) | Simons 1916 D.B. overcoats (no reefer as such) |
| Trench / ulster | 3 | Carlton | Variant | Simons 1916 |
| **Overcoat, straight, yoked** | 1, 3 | Carlton is a belted long coat | **Drafted 2026-10-27** (`designs/winter-coat`: deep front and back yokes, hip welts, turn-down collar, lining; not sewn) | ЕМКО 1988 §3 |
| **Topcoat, semi-fitted** | 1 | Carlton | **Drafted 2026-10-27** (`designs/topcoat`: side panels, back vent, slanted welts, two-piece sleeves; not sewn) | ЕМКО 1988 §2 |
| **Hooded windbreaker** | 3, 5 | — (Jett is a bomber) | **Drafted 2026-10-27** (`designs/windbreaker`: zip, yokes, hood or stand collar, slanted welts; not sewn) | ЕМКО 1988 §4 |
| **Quilted / insulated jacket** | 3 | — | **Drafted 2026-10-27** (`designs/quilted-jacket`: the windbreaker buttoned to the throat, sloped front yoke, quilted lining; not sewn) | ЕМКО 1988 §5 |
| **Field jacket / military blouse** | 3 | — (Jett is a bomber) | **Military blouse drafted 2026-10-23** (`designs/military-blouse`, not sewn) | Simons 1918 (military blouse) |
| **Hunting / field coat** (belted, action back, bellows pockets) | 3 | — | **Drafted 2026-10-23** (`designs/hunting-coat`, not sewn) | Simons 1918 (hunting coat) |
| **Mackinaw** | 3 | — | **Drafted 2026-10-23** (`designs/mackinaw`, not sewn; convertible, military or shawl collar; set-in or raglan sleeves) | Simons 1918 |
| **Shop coat / lab coat / duster** (unisex) | 2 | — | **Drafted 2026-10-23** (`designs/shop-coat`, not sewn) | Simons 1918 (grocers' gown) |
| **Service coat** (barber's, white jacket; stand collar or open neck) (unisex) | 2 | — | **Drafted 2026-10-23** (`designs/barbers-coat`, not sewn) | Simons 1918 (barber's coats) |
| **Bar jacket / short white vest** (unisex) | 2 | Wahid is a dress waistcoat | **Drafted 2026-10-23** (`designs/bar-vest`, not sewn) | Simons 1918 (bar vest) |
| Breeches | 3 | Cornelius (cycling) | Variant | Simons 1916 |
| Service / camp-collar shirt | 3, 5 | Simon | Variant (camp collar, epaulettes) | Simons 1918 |
| Slacks | 5 | Charlie | Have | — |
| **Nightshirt** | 4 | — | **Drafted 2026-10-23** (`designs/nightshirt`, not sewn) | Walker 1909 `krl00366374` |
| **Pyjamas** | 4 | — (Paco is summer pants) | **Gap** | Walker 1909 / WI underwear 1928 |
| Drawstring trousers | 4 | Paco, Waralee | Have | — |
| Tee, sweatshirt, hoodie | 6 | Teagan, Sven, Hugo, Hannah, Huey | Have | — |
| Underwear, swim | — | Bruce, Shin | Have | — |

## Women

| Garment | Style | FreeSewing | Status | PD source for the style |
|---|---|---|---|---|
| **Tailored jacket** | 1 | — (Jaeger is menswear) | **Semi-fitted drafted 2026-10-25** (`designs/tailored-jacket`, on Breanna, not sewn) | Mitchell 1921 `newstandardworko00mitc` |
| Skirt: pencil, circle, block | 1, 4 | Penelope, Sandy, Sarah | Have | — |
| A-line / gored skirt | 5 | Sarah | Variant | Mitchell 1921 (gored skirts) |
| Gathered skirt | 4 | Sarah, Sandy | Variant (trivial) | — |
| Button-down blouse | 1 | Simone | Have | — |
| Soft blouse (bust darts, other collars) | 1, 5 | Simone, Bella block | Variant | Rosenfeld 1911/1918, WI *Pattern Drafting* 1920 |
| Coat | 1 | Carlita | Have | — |
| **Loose coat** (box coat) | 1 | — (Carlita is fitted) | **Drafted 2026-10-25** (`designs/box-coat`, on Breanna, not sewn) | Mitchell 1921 `newstandardworko00mitc` |
| **Shirtwaist / work dress** | 2, 5 | — | **Drafted 2026-10-25** (`designs/shirtwaist-dress`, not sewn) | WI *Pattern Drafting* §2 |
| **Shift dress** | 4 | — (Sasha is fitted) | **Gap** | WI 1920 |
| **Smock** (any size) | 4 | — | **Drafted 2026-10-23** (`designs/smock`, not sewn) | Walker 1909 (child's overall) |
| Apron / pinafore apron | 2 | Albert | Have / Variant | Goldsberry 1888 (aprons) |
| Slacks / overalls | 2, 5 | Titan, Opal | Variant | — |
| **Peacoat, field jacket (women's cut)** | 3 | — | **Gap** | on the men's gaps + Bella |
| **Nightgown** | 4 | Jane (1790s shift) | **Drafted 2026-10-23** (`designs/nightgown`, not sewn) | Walker 1909 (night-dresses) |
| Knits | 6 | Teagan, Bibi, leggings ×3 | Have | — |

## Children

| Garment | FreeSewing | Status | PD source |
|---|---|---|---|
| **Measurement sets, age 4–14** | — | **Done 2026-10-23** (`designs/sizes`: 39 boys', 36 girls') | USDA O'Brien 1939 |
| Baby romper / one-piece | Otis, Onyx | Have | — |
| Bib | Bob | Have | — |
| Shirt, tee, trousers, overalls | adult designs | Variant (need child sizes, then a check) | Simons *Boys' and Juveniles'* 1922 `designingboysjuv00simo` |
| **Pinafore** | — | **Drafted 2026-10-23** (`designs/pinafore`, not sewn) | Walker 1909 |
| **Knickers / bloomers** (any size) | — | **Drafted 2026-10-23** (`designs/knickerbockers`, on Titan, not sewn) | Walker 1909 |
| **Boy's work coat** | — | **Drafted 2026-10-23** (`designs/boys-work-coat`; the chore coat with Simons' boys' details, all children's sizes) | Simons 1918 (boys' work coat) |
| **Boy's suit jacket** | — | **Gap** | Simons 1922 |
| **Girl's dress** (any size) | — | **Drafted 2026-10-23** (`designs/frock`, not sewn) | Walker 1909 (frocks) |
| **Girl's coat** | — | **Gap** | Rosenfeld 1911/1918 |

**Count** (2026-10-26, by the tables above):
- **18 rows drafted or done:** the children's measurement sets and 17 designs (the loose-coat
  row was added with the box coat; it wasn't one of the original gaps).
- **6 gaps open** in 5 rows (the women's peacoat/field jacket row counts as two): pyjamas,
  shift dress, women's peacoat and field jacket, boy's suit jacket, girl's coat.
- **12 variants.** These are options on existing designs, the cheapest wins.
- **15 rows already covered** (the apron row counted here).

## Progress
- 2026-10-23: children's measurement sets (USDA 1939 Tables 8–9, heights 40–69 in, roughly
  ages 4–14) and the chore coat (Simons 1918), both in `designs/`. The survey has no
  sizes under 40 in (about age 4), so toddlers and babies are still a gap.
- 2026-10-23: **Simons 1918 done.** Every garment in *Drafting Cotton Garments and Mackinaws*
  is now a design or an option. Each was tested at 20 adult, 3 stout and 75 children's sizes;
  none has been sewn.
  - **Designs:** chore coat, boys' work coat, hunting coat, military blouse, mackinaw (with
    shawl collar and raglan sleeve), barber's coat (both necks), shop coat (grocers' gown),
    bar vest.
  - **Stout figures** (Diagrams VI, XI, XXII) are built into every coat.
  - **Longs and shorts, and mail-order changes** (XXIV, D, E): drafting from each person's
    measurements covers these.
  - **The conservative sack coat** (I–V) is covered by FreeSewing's Jaeger.

## Walker 1909: done (2026-10-23)
`krl00366374`. Six designs:
- nightshirt, nightgown, smock, frock, pinafore, on a new shared yoke library
  (`designs/lib/yoke.mjs`);
- knickerbockers, on FreeSewing's Titan.

All are tested at 20 adult, 3 stout and 75 children's sizes; none has been sewn. Not drafted:
- chemise, petticoats, combinations and the cooking apron. FreeSewing's Albert covers the
  apron; the rest are underwear of their era rather than gaps.
- the child's overall's plate. It's listed in the contents but not found among the scanned
  plates, so the smock follows Walker's making-up directions.

## Woman's Institute, *Pattern Drafting*: done (2026-10-25)
`patterdraftingpicken`. **The held scan is one lesson (§2, printed "Copyright, 1915"), not
the whole book**: a loose foundation waist, a plain and a shirtwaist sleeve, a collar and a
cuff (pp. 24–42). It has no jacket, shift dress or skirt, so it covers only the shirtwaist.
- **Design:** `shirtwaist-dress`: the shirtwaist (easy bodice, turn-down collar, full sleeves
  into cuffs) joined to a gathered skirt as a work dress, on the yoke template. Tested at 20
  adult, 3 stout and 75 children's sizes; not sewn.
- **Still open from the women's list:** tailored jacket, shift dress, soft blouse variants,
  the women's peacoat/field jacket.

## Mitchell 1921: in progress (2026-10-25)
- **Semi-fitted jacket** (pp. 36–39, 60–61): `designs/tailored-jacket`, the first design on
  Breanna. A new library, `designs/lib/jacket.mjs`, cuts Breanna along its darts into four
  princess panels a side, flared below the waist, with a lap, peak or notched lapel, collar
  and facing; FreeSewing's two-part sleeve fitted to the armhole. Tested at every size;
  draped (`designs/drape/README.md`); not sewn. Princess seams smoothed 2026-10-26.
  Completed 2026-10-26: a breast welt cut across the front princess seam, set-in flap pockets
  (hip and ticket) sloping on the side front, a back-neck facing, and a lining (front and
  back lining pieces, a CB pleat; side panels and sleeves cut again in lining). Pockets and
  lining aren't draped.
- **Box coat** (pp. 16–19, 60–61): `designs/box-coat`, on the same library (`draftBoxLayout`):
  back and front, side seams flared from the armholes, Breanna's bust dart pivoted into a 1¼"
  front neck dart, a 3" lap, notched lapel, collar, two-part sleeve. CB seam shaped ½" out at
  the hip line, buttonholes near the lapped edge, set-in flap pockets on the hip line with a
  smaller one above, the back hem squared off the CB (2026-10-26). Tested at every size;
  re-draped after these changes (pockets left off the drape): it assembles and hangs level,
  and the only real body contact is the sleeve hems at the wrists, as on the tailored jacket
  (`designs/drape/README.md`); not sewn.
- **Next from Mitchell:** the tight-fitted single- and double-dart jackets (an under-arm panel,
  more front seams, a shawl collar, on the same library), then the gored skirts (5–15 gores;
  a skirt library on FreeSewing's Sarah or our own).

## ЕМКО СЭВ vol. 3 (1988): done (2026-10-27)
Corpus `emko`, a private copy, untracked: still in copyright, used only for its methods,
proportions and construction (CLAUDE.md, Copyright). All seven of its men's garments are
drafted. The archived pipeline had read six of them (`archive/recipes/emko/`), so most briefs
take their numbers from there, and it still computes any point of them (`python -m ccat run
--source emko-garment ...`); the trousers' model construction (Table 7.3) was read from the scan
for the brief. Seven designs, each tested at 20 adult, 3 stout and 75 children's sizes; none
sewn, none draped yet:
- `windbreaker` (§4 summer jacket): new shared pieces, `lib/hood.mjs` (a two-piece hood),
  `frontYokeCut` / `frontPanel` and the back `body` panel (`lib/panels.mjs`), `zip`
  (`lib/coat.mjs`);
- `quilted-jacket` (§5 insulated jacket), on the windbreaker: buttons to the throat, a sloping
  front yoke, quilted lining cuts;
- `winter-coat` (§3), on the windbreaker's yoked body: knee length, turn-down collar, lining;
- `topcoat` (§2 demi-season coat), on the military blouse's three-piece body, with a new back vent
  (`lib/body3.mjs`);
- `jacket` (§1), on the topcoat: two buttons, a notched lapel on the three-piece body, rounded
  front corners, flap pockets (`lib/body3.mjs`: `r`, `lapel`, welt `flap`);
- `waistcoat` (§6), on Brian: V neck, cutaway points, back fish dart and front dart, cut-in
  armholes, welts (`lib/coat.mjs`: `armholeCut`, `dart`, `chamfer`);
- `trousers` (§7), on Titan: back and front waist darts, legs narrowing to a curved hem, zip fly,
  side and back pockets, waistband (`lib/trousers.mjs`: `trouserLeg`, `strip`).

FreeSewing has a jacket (Jaeger), a waistcoat (Wahid) and the Titan block; ЕМКО's versions are
added anyway, as our own designs at every size.
Left out (each brief says so): ЕМКО's belly and chest darts, the summer jacket's
yoke ease, the two-piece and inner-seam sleeves on the Brian designs, the winter coat's side-seam
shift, the jacket's darts, lining and collar stand, the waistcoat's CB shaping. Vols. 2, 5 and 6 (women's, girls', boys') were located but never obtained.

## After Mitchell: Simons' overcoats (1916), then later Woman's Institute volumes
- Mitchell's remaining garments are listed above; the archived pipeline's readings of it are in
  `archive/recipes/mitchell/FINDINGS.md` (style lines and proportions).
- **Simons, *Designing Overcoat Patterns* (1916, `designingovercoa00simo`, tracked):** it has
  no reefer; the peacoat (2026-10-26) takes its D.B. overcoat and ulster details onto the
  mackinaw. Still to use: its regular, box and ulster overcoats (the overcoat row is a
  Variant of Carlton).
- **Later Woman's Institute volumes**, held but not tracked: `gb_wi1924_draftingpatterndesigning`
  and `gb_wi1928_patterndesigningdraping` (US 1924, 1928; public domain). Check what each scan
  actually holds before planning on it.

## How this differs from what was built before

| | Before (`archive/ccat/`, 2026-10-16 to 22) | Now |
|---|---|---|
| Role of the old book | Data to reproduce: every point, at the book's own sizes | A design reference: which pieces, where the style lines fall, proportions, ease, construction |
| Where the geometry comes from | The book's drafting arithmetic, re-implemented in Python | FreeSewing's existing blocks (Brian, Bent, Bella, Breanna, Titan, Sarah), driven by the wearer's measurements |
| Sizes | Only the sizes the book prints (ЕМКО: 176 cm men's figures) | Any measurements, including children's once those sets exist |
| Reading the source | OCR, cell repair, a glyph classifier for engraved numerals, one adapter per book | Claude looks at the page and writes a short design brief; no OCR, no adapter |
| What "checked" means | Matches the book's printed numbers to 1% | Sews together: seam pairs match, sleeve cap fits the armhole, it drafts cleanly at every size; then a tester's muslin |
| Claude's role | To be removed from the loop | Writes each design; that's where an LLM is useful |

**Per-garment workflow:**
1. **Brief.** Claude reads the source page(s) and writes a one-page brief:
   - the pieces;
   - each style line as a proportion of the body or block (e.g. yoke depth as a share of armhole depth);
   - ease, closures, pockets and construction order.

   The book's figures become option defaults (percentages the wearer can change), not fixed numbers.
2. **Code.** A FreeSewing design that inherits the nearest block (`from: brian`). FreeSewing's
   Simon builds its yoke from Brian's back this way.
3. **Automatic checks.**
   - Draft at every adult size and the children's sets, and at extreme measurements.
   - Seams that sew together must have equal lengths (a test we add; FreeSewing doesn't check this).
   - No self-intersecting outlines.
   - Snapshot SVGs.
4. **One visual comparison.** The source figure next to our draft at the book's worked size. It's a sanity look, not a gate.
5. **Tester muslin.** The design is "draft-only" until someone sews it.

From `archive/ccat/` we keep the corpus, the rights research and the trace of the night-shirt as a
reference. The gate, OCR, glyph reader and adapters stop.

## Test source: Simons, *Drafting Cotton Garments and Mackinaws* (1918)

`draftingcottonga00simo`: Library of Congress scan, 300–400 ppi, one diagram per page, US
1918 so public domain, held in the corpus. **First design: the work (chore) coat.**

**Why this one:**
- **Real gap.** FreeSewing has no chore coat. It's a practical, unisex, widely worn jacket.
- **Easy to build.** The nearest block already exists: Bent (menswear, two-part sleeve), which
  FreeSewing's Devon denim jacket already extends. The new work is the boxy body, the shirt-type
  collar, patch pockets and the button front.
- **Reusable.** One book then feeds four more gaps: military blouse, mackinaw, boys' work coat,
  and work shirt variants. Simons' other books cover overcoats/peacoat, work trousers and
  boys' sizes in the same system, so later briefs come faster.
- **Easy to read.** The page is a full diagram with lettered points, so the brief can be read
  from the figure.

**Runner-up:** Walker's night-shirt. It's simpler and already traced, but less useful to most
people. It's a good second design, as a Simon variant with gussets.

**Parallel data task:** the children's measurement sets from USDA 1939. These are tables, not
drawings, so the work is mechanical, and they unlock children's sizes across the catalog.

(Both were done 2026-10-23: `designs/chore-coat` from the work-coat pages, and `designs/sizes`.)

## Fork notes
- **Licence.** MIT: keep FreeSewing's copyright and licence notice in anything copied.
- **Name.** Use our own name, not "FreeSewing".
- **Start lean.** Depend on the npm packages (`@freesewing/core` and the blocks) and publish our
  designs as our own packages. Copy their code only where we must change it. A website or
  front-end fork can wait until there are designs to show.
- **Upstream.** Their code is upstream's; ours is ours. Track their releases (4.x).
