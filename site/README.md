# site: publicsewing.org

A Docusaurus site: a page per design with the pattern tool, plus the measuring, muslin, report
and sources pages. Static, deployed to GitHub Pages by `.github/workflows/site.yml` on push to
`main`. No accounts, no server, no cookies, no analytics.

```bash
npm install          # also applies patches/ (patch-package)
npm start            # generate + dev server on :3000
npm run build        # generate + static build in build/
```

Needs `../designs` installed (`npm install` there): the site builds the designs from it.

## How it fits together
- **`scripts/generate.mjs`** runs before every start/build. From `../designs` it writes
  `src/generated/` (specs with `extends` resolved, size sets, measurements per design),
  `docs/designs/*.mdx` (a page per design from its `BRIEF.md`, with the drape verdict from
  `designs/drape/README.md`) and `static/img/drape/`. All gitignored.
- **The pattern tool** is FreeSewing's editor (`@freesewing/react` `components/Editor`, MIT),
  in `src/components/PatternEditor.jsx`: backend off, our views only, a picker for our size sets,
  and FreeSewing's pattern stylesheet (`patternStyle.mjs`). Its FedEx Office export creates a
  full-scale, tiled ARCH E (36 × 48 in) PDF without a cover or cut-layout pages; users upload it
  themselves to FedEx Office's blueprint printing product and print at 100%.
- **`src/lib/collection.mjs`** replaces `@freesewing/collection` (webpack alias in
  `docusaurus.config.js`), so the editor sees our designs and not FreeSewing's 73.
- **`patches/@freesewing+react+4.10.2.patch`** (patch-package; FreeSewing's MIT notice
  applies to the patched files): editor state in localStorage, one key per design (4.10.2
  ignores `stateBackend` and keeps state, measurements included, in the URL); no share links in
  the export view; the PDF cover page says PublicSewing, without FreeSewing's logo; a dedicated
  FedEx Office ARCH E export; exported files are named `publicsewing-<design>`.
- `@freesewing/react` imports packages it doesn't declare (`utils`, `i18n`, `plugin-i18n`,
  `plugin-svgattr`, `plugin-timing`, `react-markdown`), hence their place in `package.json`.
  Keep every `@freesewing/*` package at the designs workspace's version.
- **Adding a design:** nothing to do here, except adding it to the dropdown in
  `.github/ISSUE_TEMPLATE/muslin-report.yml`.
