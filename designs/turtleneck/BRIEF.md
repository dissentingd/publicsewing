# Turtleneck

**Source:** none. Our own design (2026-11-11), the first on the Bibi block: a plain long-sleeved knit
top with a tall collar that folds in half and turns down when worn. No book: the proportions below
are ours, chosen from the block's defaults and common ready-to-wear turtlenecks, and every one is an
option.

**Block:** FreeSewing's Bibi (knit top and dress block, on Brian), through `blocks/bibi.mjs`: back,
front and sleeve as Bibi drafts them, its optional rib cuffs and hem band, and a collar cut by the
`rib` piece type (`lib/rib.mjs`) from the whole neck opening Bibi stores. Drafted from the wearer's
measurements, so it fits any size, children's included.

**Status:** draft. Not sewn.

**Threadloop (2026-11-11):** 41 free patterns for "turtleneck" (So Sew Easy, Tessuti's Monroe,
Mood Sewciety's Crimson, Katia, White Water Dress and others): graded and copyrighted, none made to
measure or openly licensed. None was used.

## The design

| Element | Default | Option | Why |
|---|---|---|---|
| Neck width | Bibi's neckline widened 0% (its own default 15%) | `necklineWidth` | Close to the neck, so the collar stands round it |
| Neck depth | 20% (Bibi's least; its default 25%) | `necklineDepth` | Raised as far as Bibi allows |
| Sleeve length | 100% (to the wrist) | `sleeveLength` | A turtleneck is usually long-sleeved |
| Collar height, finished | 30% of the neck (about 11 cm on a 36 in figure); cut twice that and folded | `collarHeight` | Turns down once when worn; 10–15% is a mock neck |
| Collar length | the neck opening less 10% | `collarStretch` | Sewn on slightly stretched so it hugs the neck |
| Cuffs, hem band | off | Bibi's `useCuffRibbing`, `useWaistRibbing` | Plain hems by default |
| Fit, length, ease | Bibi's | Bibi's | Bibi's knit ease (2% at the chest), to the seat |

## Changes and what isn't modelled

- **Over the head.** The collar and the neck edge it's sewn to both pass over the head. At the
  defaults an adult's collar stretches 21–54% to do it (Women 28 the most) and a child's up to 83%
  (Girls 1B), whose head is big for the neck; the body's neck edge then stretches up to 65%. So
  cut the collar from rib (1x1 rib stretches about 100%) and the body from a jersey with good
  stretch; for small children, a wider neck (`necklineWidth`) lowers both. The test holds the
  collar to 100% and the neck edge to 75% at every size.
- Bibi's own neck binding is left out: the collar replaces it.
- No shoulder snaps or back-neck zip for small children (see above).

## Pieces

1. Front, on the fold.
2. Back, on the fold.
3. Sleeve, cut 2 (none with `sleeves` off).
4. Collar: a straight strip of rib, the neck opening less `collarStretch` long and twice
   `collarHeight` wide, with quarter notches.
5. Cuff, cut 2 (with `useCuffRibbing`).
6. Hem band (with `useWaistRibbing`).

## Construction

1. Sew the shoulder seams.
2. Set in the sleeves flat, then sew each side seam and sleeve seam in one.
3. Join the collar's short ends into a ring and fold it in half lengthwise, wrong sides together.
4. Pin it to the neck edge at the quarter notches (centre back, the shoulders, centre front),
   stretch the collar to fit between them, and sew with a stretch stitch or overlocker.
5. Hem the sleeves and body with a twin needle or coverstitch, or sew on the cuffs and hem band
   as the collar.
