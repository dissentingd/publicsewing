# Boys' work coat: brief

**Status: draft.** Not sewn. Muslin testing comes at the end of the Simons series.

## Source
Harry Simons, *Drafting Cotton Garments and Mackinaws* (1918), corpus `draftingcottonga00simo`,
**Diagram XV, Boys' Work Coat (Age 12)**, PDF pp. 30–31 (book pp. 26–27). Breast 29, waist
27, neck 13.

Simons: "Made similar to the men's work coat ... except that it is drafted by boys'
proportions. The identical idea as the men's coat is carried out in every detail." The
figure 41–47 on the diagram is the collar drawn on the draft, not a pocket. He adds a rule
for "the front waist measure ... especially on smaller sizes" (51–52 is half the waist), so
the coat clears a boy's tummy.

## How we build it
- **The chore coat's parts**, with the boys' draft's details as defaults. Simons scales the
  men's draft by boys' proportions; we draft from the child's own measurements, via the USDA
  1939 children's sets in `designs/sizes/`.
- **Simons' front-waist rule** holds automatically. The body is boxy and straight from the
  chest down, and children's waists are smaller than their chests (USDA: about 24½" waist on
  a 29" chest at age 12), so the front never pinches the waist.
- **Girls too.** Nothing in it is boys-only; the girls' sets draft the same.

## Defaults changed from the chore coat
| What | Diagram XV | Option |
|---|---|---|
| Buttons | 5, neck to below the waist | `buttons` 5 |
| Breast pocket | none drawn | `breastPocket` off |
| Front hem | drops about ¾" at the front (35–39) | `frontDrop` 10% of waist-to-seat |
| Collar spring | 42–43 is 1" over 7" | `collarSpring` 15% |
| Collar point | 46–47 is 1½" on a 13" neck | `collarPoint` 11.5% of neck |
| Collar width | 43–44 is 3" | `collarWidth` 23% of neck |

## Compared with Simons' age-12 draft
At the USDA boys' set nearest his breast 29 (B10/C9: 29–29¼" chest):
| | Simons | Ours |
|---|---|---|
| Garment chest | 34½" (CF 17¼" from CB) | 35.0" |
| Length, neck point to hem | 26½" | 25.7" (C9) |
| Half collar | 7" | 7.7" (includes half the button stand) |

`test/boys-work-coat.test.mjs` keeps chest within 5% and length within 8% of these. It's a
sanity check that the sizing lands where Simons' did, not a requirement to match him.

## Open point
- **A slanted line above the lower pocket position** (near 51) isn't explained in the text.
  It may mark a slanted pocket mouth. We keep the chore coat's lower patch pockets.

## Checks the tests run
At all 75 children's sets:
- the shared coat checks (`test/coat-checks.mjs`);
- five buttons, no breast pocket, a dropped front hem;
- the comparison above.
