# Archive: the earlier reproduction pipeline (not maintained)

**Nothing here is used by the designs, and nothing here is maintained.** If you're here to
work on PublicSewing's patterns, go to [`../designs/`](../designs/) instead.

From 2026-10-16 to 2026-10-24 the project tried a different approach: a Python pipeline
(`ccat`) that re-implemented each drafting book's arithmetic point by point, at the sizes the
book prints, and accepted a catalog entry only if it matched the book's printed numbers to
within 1%. It drafted only the book's own sizes and needed a source adapter per book. The
current approach (2026-10-23 on) uses the books as design references and gets the geometry
from FreeSewing's blocks, so every design fits any measurements; see the root
[README](../README.md) and [WARDROBE_GAPS.md](../WARDROBE_GAPS.md).

It's kept because its readings of the books are still useful as references:
`recipes/mitchell/FINDINGS.md` (Mitchell 1921's style lines and proportions), the Walker
night-shirt traces, and `pilot/` (what worked and what didn't in reading old diagrams).

| Folder | What it was |
|---|---|
| `ccat/` | The pipeline: recipes, geometry, checks, exports, source adapters |
| `recipes/` | Drafting recipes per book (ЕМКО СЭВ 1988, Walker 1909, Mitchell 1921) |
| `data/` | Tables transcribed from the books, by source |
| `catalog/` | Built catalog entries (entry.json, pattern.svg) |
| `pilot/` | Pilot runs and their findings (OCR, figure reading, grids) |
| `drape/` | Its 3D drape trials (the current ones are in `../designs/drape/`) |
| `tests/`, `pyproject.toml` | Its pytest suite: `cd archive && python -m pytest` |
| `scripts/` | Its build, OCR, trace and search scripts (the live corpus scripts stay in `../scripts/`) |
| `sourcing/` | A Google Books search sweep and its hits |
| `PIPELINE.md` | The pipeline's design and rules |

Links inside these files were written for their old places at the repository root, so some
point nowhere now. The suite still passes as of the move (2026-10-26); the scripts that read
`corpus/` expect it at `archive/corpus` and won't find it without a path change.

ЕМКО СЭВ (1988) is still in copyright. Only its formulas, sizing tables and the pipeline's own
readings and output are here; its text and scans are not.
