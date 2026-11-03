# Kilt

**Source:** Simons, *Designing Boys' and Juveniles' Clothing* (1922), corpus `designingboysjuv00simo`. "Boys' Scotch Kilt Suit", Diagram 14,
pp. 50-52 (PDF pp. 56-58). US 1922, public domain. Size 6, in inches: breast 24, waist 24, length of kilt 10½. **Only the hem and a
length come from Simons. The kilt itself is ours,** chosen by the maintainer (2026-11-03): the source doesn't describe one.

**Block:** none in effect: FreeSewing's Sarah supplies the measurements, and `lib/kilt.mjs` draws the pieces, flat-cut.

**Status:** draft. Not sewn.

**Threadloop:** 1 free result for "kilt" (2026-11-03): Thistle Kilt, Mood Sewciety. Its listing doesn't say it's drafted from measurements, and it wasn't used.

## What the source shows
The suit's "SKIRT" is one flared foundation piece, drawn sideways. Its text says nothing of pleats, a wrap or a fastening; "pleat" doesn't
appear in the section at all.
- **22 to 23:** "the length of skirt, 10½ inches".
- **23 to 24:** "the hem, 2¼ inches".
- **25 from 22:** "½ of waist", then 3 in more to 26; **27 from 23:** 8 in, then 3 in more to 28; 29 and 32 another 2 in each.
- **Discrepancy:** the text and plate disagree. On the plate 22 to 25 measures about 6¼ in by the scale of 22 to 23, near a *quarter* of the
  24 waist, and 25 to 26 and 27 to 28 about 2 and 1½ in, not 3. Since none of this is used, it isn't resolved here.
- **Elsewhere:** the book's history (p. 7) only says Scottish boys once dressed like adult highlanders, in "kilters".

## How it maps
| Feature | Source | Here (option default) |
|---|---|---|
| Hem | 2¼ in | `kiltHem` 36% of waist to seat (2¼ of the USDA boy C6's 6¼) |
| Length | 10½ in on a six-year-old | The `short` variant, `kiltLength` 57% of waist to knee. The default is ours: 95%, to the knee |
| Flare | Slight | None: knife pleats hang straight |
| Ease | Not given | `waistEase` 3%, `seatEase` 6%: ours |
| Aprons | None | `apronShare` 45% of the seat, `apronShaping` 30% of seat less waist, `wrapLap` 70% of the apron's width, `apronEdge` 7% of the seat: ours |
| Pleats | None | `pleatFace` 3.6% of the seat showing, `pleatDepth` 100% of that folded back either side, so three times the cloth: ours |
| Waistband, straps | None | `kiltBand` 3.5% of waist to knee, `strapWidth` 4% and `strapLength` 22% of the waist: ours |

## How it fits
Across the back half, a whole number of pleats shows the back's width at the seat. Above that, each takes in a little more (`take`), so the
top closes to the back's waist with no shaping cut. Marked on the piece: each fold, where it's brought to at the hem, its placement line
running up to the hip and on to the top, and the line it's stitched down to.

## Pieces
Apron (cut 2), pleated length (cut 2), waistband, straps (cut 4).

## Construction
1. CB seam of the two pleated lengths, hidden in the last fold.
2. Fold each pleat to its placement line and press. Stitch each down from the top to the hip line, close to its fold. Baste the top.
3. Side seams, aprons to the pleated length. Hem. Turn back and stitch each apron's front edge.
4. Waistband on, round the waist and past each center front by the wrap.
5. Straps at the marks on the front edges. Buckles at the side, through a slit in the under apron's seam for the one that crosses it.

## Changes and what isn't modelled
- **Nearly everything is ours,** as above. It's a usable kilt, not a reconstruction of Simons' or of a traditional one.
- **The pleats aren't all one way.** The two lengths are cut as a pair, so their pleats lie toward CB from each side and meet there. A
  traditional kilt's all lie one way, from one long length of cloth.
- **The tartan isn't matched.** A kilt's pleats are usually folded to the pattern of the cloth, to the sett. Here they're even.
- **No canvas or stabilising under the aprons,** no fringe, and no pleat-stitching beyond the hip line.
- **The buckles' place isn't marked,** only the straps'. It depends on how the wrap sits.
- **Very full figures:** where the waist passes the seat, the seat is taken as the waist, and the pleats don't taper.
