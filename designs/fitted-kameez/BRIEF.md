# Fitted kameez

**Source:** Central Board of Secondary Education with the National Institute of Fashion Technology,
*Basic Pattern Development: Students Handbook + Practical Manual, Class XII* (CBSE, Delhi, 2014),
published free by CBSE; the maintainer's copy, not in the repository. Practical 9, "Kameez", book
pp. 90–92 (PDF pp. 102–104; PDF = book + 12), with section 5.8.1, p. 41, and Practical 10's slit,
p. 94. In copyright: only its construction and proportions are used here, as design references, in
our own words; no text or figure is reproduced. Inches below are the handbook's, for its sample:
bust 34¾, waist 27¾, hip 36, shoulder to waist 16, sleeve 10½, sleeve round 9¼.

**Threadloop (2026-11-16):** not searched for this one (the kameez found no salwar either).

**Block:** FreeSewing's Bella, as the shell top uses it: its darted back and front (side bust dart,
waist darts) carried below the waist in one piece by `bodiceHip`. `lib/bodice.mjs` gained, opt-in:
`bodiceHip`'s tunic side seam (`seat`, `hipDepth`, `dartLength`, `slit`, `zip`), `bodiceSleeve` (Bella's
sleeve cut short, a turned hem) and `bodiceSlit` (a slit at the front neck). The shell top, fitted
dress, wrap dress and princess dress snapshot identical.

**Status:** draft. Not sewn.

## What the source shows
- **The garment (p. 41, p. 90):** the long top of the salwar kameez; "closely fitted" in the 1960s,
  loose since. Practical 9 is the fitted one; the A-line kameez (Practical 10, built as `kameez`) is
  this traced without its darts.
- **Text (p. 91):** front and back on the fold, one draft. Armhole depth a quarter of the bust less
  1 in; bust a quarter plus 1 in; waist a quarter plus 2½ in at the shoulder-to-waist length; hip a
  quarter plus 1 in, 7 in below the waist; straight from the hip to the hem (BJ = EI). Jewel neck: a
  twelfth of the bust wide and deep at the front, ⅞ in deep at the back.
- **Darts (pp. 91–92):** a 1 in waist dart under the bust point, from 1½ in below the apex to 4 in
  below the waist, "marked on the back also"; a side bust dart from 5–6 in below the armhole towards
  the apex, ending 1½ in from it; the front hem dropped ½ in at the side for it.
- **Plate (p. 91, read from the image):** the side curves in to the waist and out to the hip, then
  runs straight down; the waist dart is a long diamond; no slit is drawn (Practical 10 adds one, 10 in
  "or as desired").
- **Sleeve (p. 92):** cap height 3 in, half the armhole plus ½ in; the hem half the arm round plus
  ½ in; 10½ in long.
- The table's kameez length, 14¾ in, is a misprint: the figures are below the knee.

## How it maps onto the block
| Feature | CBSE | Here (option default) |
|---|---|---|
| Bust ease | quarter + 1 in: 4 in on 34¾ | Bella's `chestEase` (11%, about 3.8 in) |
| Waist ease | quarter + 2½ in less the 1 in dart: 6 in on 27¾ (21.6%) | `waistEase` 20%, Bella's most |
| Hip | quarter + 1 in: 4 in on 36 (11%) | `seatEase` 11%: the side seam let out to a quarter of it at the hip line |
| Hip line | 7 in below the waist | the wearer's waist to seat |
| Below the hip | straight | straight; `hemFlare` 0% (ours, up to 15% of the seat) |
| Waist dart | 1 in, apex to 4 in below the waist (4/7 of the hip depth) | Bella's waist darts, closing `lowerDart` 57% of waist to seat below the waist |
| Bust dart | at the side, 1½ in short of the apex | Bella's side bust dart |
| Length | below the knee in the figures | `skirtLength` 50% of the waist to floor |
| Slits | Practical 10: 10 in "or as desired" | `sideSlit` 50% of the waist to hem |
| Neck | front a twelfth of the bust deep (2.9 in = 74 mm on the sample) | round, `neckDepth` 19% of neck point to front waist (73 mm on cisFemaleAdult32), `neckWiden` 5% |
| Back neck | ⅞ in | Bella's own (`backNeckDepth` 0) |
| Opening | not given | ours: `neckSlit` 30% at centre front, and a zip in the left side seam, `zipLength` 100% of waist to seat below the waist (kept 40 mm above the slit) |
| Sleeve | 10½ in, plain | `sleeves` short, `shortSleeve` 46% of shoulder to wrist (10½ / 22.8), turned hem |

## Changes and what isn't modelled
- **Bella's draft, not CBSE's**, makes the bodice: its armhole, shoulder, neck width and dart
  positions are Bella's, and its waist ease is capped at 20%.
- **The hip** is reached by each piece on its own: the side seam goes out from the waist to a quarter
  of the seat with ease. Front and back side seams are the same length; the second piece drafted
  matches the first's below the hip, so its hem's side end can sit up to 2.5% of the length off a
  line parallel to its waist (about 1 cm at the defaults on the smaller women's sizes). Level the
  hem at the fitting.
- **The hem** runs parallel to each piece's waist line (Bella's front waist dips at the side, the
  back's rises); CBSE's ½ in drop at the front side isn't drawn separately.
- **The openings** are ours: the practical gives none, and a fitted kameez needs both a way over
  the head and a way over the bust and hips.
- **The back** is cut on the fold, as the shell top's, though Bella's centre back curves in slightly
  at the waist.
- **Facings** for the neck, neck slit and slits aren't separate pieces: bind or face them.

## Variants
- **Kurti:** to mid-thigh (`skirtLength` 32%), shorter slits (30%).
- **Long sleeves:** Bella's sleeve to the wrist, hemmed.

## Pieces
1. Front, on the fold.
2. Back, on the fold.
3. Sleeve, cut two.

## Construction
1. Sew the waist darts front and back through their lower points, and the front bust darts.
2. Cut and face or bind the neck slit; sew the shoulders; bind the neck.
3. Set in the sleeves flat.
4. Sew the right side seam from the sleeve's hem to the slit's notch; sew the left from the zip's
   notch to the slit's, and from the sleeve's hem to just below the armhole. Set the zip.
5. Finish the slits; hem the kameez and the sleeves.
