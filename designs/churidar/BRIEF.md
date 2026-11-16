# Churidar

**Source:** Central Board of Secondary Education with the National Institute of Fashion Technology,
*Basic Pattern Development: Students Handbook + Practical Manual, Class XII* (CBSE, Delhi, 2014),
published free by CBSE; the maintainer's copy, not in the repository. Practical 4, "Churidar
Payjama", book pp. 76–78 (PDF pp. 88–90; PDF = book + 12), and section 5.7.2, p. 40. In copyright:
only its construction and proportions are used here, as design references, in our own words; no text
or figure is reproduced. Inches below are the handbook's, for its sample: length 50¾ (waist to ankle
"and add 7"–10""), round hip 36, round ankle over the heel 12, round knee 15.

**Threadloop (2026-11-15):** "churidar" finds no free patterns.

**Block:** none. Cut flat from straight lines, as the salwar (the `polygon` piece type), on the
queue's suggestion; a hidden Titan part carries the measurements. The `polygon` piece type gained an
optional `grain` line, here at 45° for the bias; all seventeen designs using polygon pieces snapshot
identical. Drafted from the wearer's seat, waist to floor, knee and heel, so it fits any size.

**Status:** draft. Not sewn.

## What the source shows
- **The garment (p. 40):** traditionally the cloth was folded and sewn into a bag so that all of it
  lay on the bias, making a churidar "very close fitted and yet give ease of movement"; the modern
  one is cut from cloth folded in half lengthwise and then diagonally. "The Churidar is always cut on
  bias."
- **Belt (pp. 76–77):** on the fold; "AB is 2"" (the casing), "BC = 1/6th of round hip + 1" (or
  6–8 in), "AD = ½ round hip + 2½"".
- **Leg:** on the fold, "GH = length of the Churidar minus BC"; "GI = 1/3 of round hip" (the top);
  "IJ = 1/3rd of length − BC" (the crotch); "GL = ½ length of the Churidar − 1"" (the knee level);
  "LM = ½ knee + ¾""; "HN = ½ round ankle measured over the heel + ½""; "Join JM with a straight line
  and curve it inwards by 1½"", the figure's curve bowing out away from the fold; "Join MN". Cut two.
- **Length:** the waist to the ankle "and add 7"–10"": the extra length rucks up round the ankle.
- 2½ m of fabric, folded in half lengthwise and then diagonally, the pattern laid on it.

## How it maps onto the block
| Feature | CBSE | Here (option default) |
|---|---|---|
| Length | Waist to ankle + 7–10 in (50¾ in the sample) | `churidarLength` 120% of the waist to floor (about the ankle + 9 in) |
| Top | ⅓ hip each half | `topWidth` 33.3% of the seat |
| Crotch | ⅓ of the length below the belt | `crotchShare` 33.3% |
| Thigh | JM curved 1½ in | `thighCurve` 4% of the seat (1½ on 37), drawn as three points |
| Knee | ½ knee + ¾ in, at half the length less 1 in | `kneeWidth` 111% of the knee round |
| Ankle | ½ round over the heel + ½ in | `ankleWidth` 108% of the heel |
| Belt | BC hip/6 + 1, AB 2 in, AD ½ hip + 2½ | `beltDepth` 19.4%, `casingDepth` 5.6%, `beltWidth` 56.9% of the seat (never wider than the legs' tops) |
| Grain | On the bias | the grainline at 45° to the fold |

## Changes and what isn't modelled
- **The thigh curve** is three straight segments, not a smooth curve: true it when cutting.
- **The knee level** is measured from the top of the leg, as the handbook's GL.
- **The ankle** has no opening: its round is over the heel, so the foot passes. Many churidars have
  a short slit with hooks or buttons at the ankle; not here.
- **The fabric folding and lay** are the handbook's; this pattern is laid at 45° to the selvedge by its grainline.
- **No tradition marker** yet: which to show is the maintainer's choice.

## Pieces
Legs (two, each on the fold, on the bias), belt (one, on the fold).

## Construction
Sew each leg's inseam, from the ankle up to the crotch notch. Sew the two legs together along their
crotch edges, front and back. Sew the belt's ends, gather the legs' tops into its lower edge, fold the
casing over and thread a drawstring or elastic. Hem the ankles. Let the extra length ruck up round the
ankles when worn. The handbook gives the assembly as a figure.
