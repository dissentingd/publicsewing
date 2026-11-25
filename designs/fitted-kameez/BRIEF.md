# Fitted kameez

**Source:** inspired by Central Board of Secondary Education with the National Institute of Fashion
Technology, *Basic Pattern Development: Students Handbook + Practical Manual, Class XII* (CBSE, Delhi,
2014), the maintainer's copy; not in the repository. In copyright: only its methods and proportions
are used. This text and the pattern are our own.

**Threadloop (2026-11-16):** not searched for this one (the kameez found no salwar either).

**Block:** FreeSewing's Bella, as the shell top uses it: its darted back and front (side bust dart,
waist darts) carried below the waist in one piece by `bodiceHip`. `lib/bodice.mjs` gained, opt-in:
`bodiceHip`'s tunic side seam (`seat`, `hipDepth`, `dartLength`, `slit`, `zip`), `bodiceSleeve` (Bella's
sleeve cut short, a turned hem) and `bodiceSlit` (a slit at the front neck). The shell top, fitted
dress, wrap dress and princess dress snapshot identical.

**Status:** draft. Not sewn.

## What we took
The dart placement, the waist and hip ease, the line of the hip, the side slits and the sleeve
proportions of a fitted kameez.

## How it maps onto the block
| Feature | Here (option default) |
|---|---|
| Bust ease | Bella's `chestEase`, 11% |
| Waist ease | `waistEase` 20%, Bella's most |
| Hip | `seatEase` 11%: the side seam let out to a quarter of it at the hip line |
| Hip line | The wearer's waist to seat |
| Below the hip | Straight; `hemFlare` 0%, up to 15% of the seat |
| Waist dart | Bella's waist darts, closing `lowerDart` 57% of waist to seat below the waist |
| Bust dart | Bella's side bust dart |
| Length | `skirtLength` 50% of waist to floor |
| Slits | `sideSlit` 50% of the waist to hem |
| Neck | Round, `neckDepth` 19% of neck point to front waist, `neckWiden` 5% |
| Back neck | Bella's own (`backNeckDepth` 0) |
| Opening | `neckSlit` 30% at centre front, and a zip in the left side seam, `zipLength` 100% of waist to seat below the waist, kept 40 mm above the slit |
| Sleeve | `sleeves` short, `shortSleeve` 46% of shoulder to wrist, turned hem |

## Changes and what isn't modelled
- **Bella's draft** makes the bodice: its armhole, shoulder, neck width and dart positions are Bella's,
  and its waist ease is capped at 20%.
- **The hip** is reached by each piece on its own: the side seam goes out from the waist to a quarter
  of the seat with ease. Front and back side seams are the same length; the second piece drafted
  matches the first's below the hip, so its hem's side end can sit up to 2.5% of the length off a
  line parallel to its waist (about 1 cm at the defaults on the smaller women's sizes). Level the
  hem at the fitting.
- **The hem** runs parallel to each piece's waist line (Bella's front waist dips at the side, the
  back's rises).
- **The openings** are our own: a fitted kameez needs a way over the head and a way over the bust and
  hips.
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

1. Sew the WD waist darts front and back through their lower points, and the BD front bust darts.
2. Cut and face or bind the NS neck slit; sew the A shoulders; bind the N neck.
3. Set in the sleeves flat at C, or bind the armholes if sleeveless.
4. Sew the right S side seam from the sleeve's hem to the slit's notch; sew the left from the zip's notch to the slit's, and from the sleeve's hem to just below the armhole. Set the zip.
5. Finish the slits; turn the H hems of the kameez and the sleeves.
