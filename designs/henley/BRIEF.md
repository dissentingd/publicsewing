# Henley

**Source:** none. Our own design (2026-11-11), on the Bibi block: a knit top with a short buttoned
placket down the front of a round neck finished with a knit band. Polo and rugby shirts are the
same top with a flat knit collar in place of the band, so they're its variants. No book: the
proportions below are ours, from common ready-to-wear, and every one is an option.

**Block:** FreeSewing's Bibi (knit top and dress block, on Brian), through `blocks/bibi.mjs`: back,
front and sleeve as Bibi drafts them at its crew neck, its optional rib cuffs and hem band. The
`placketBox` operation (`lib/knit.mjs`) marks the placket on the front; the `knitPlacket` piece
type (`lib/placket.mjs`) cuts the strips with their buttonholes; the band or collar is a `rib`
piece (`lib/rib.mjs`) cut from the neck opening Bibi stores. Drafted from the wearer's measurements,
so it fits any size, children's included.

**Status:** draft. Not sewn.

**Threadloop (2026-11-11):** one free pattern for "henley" (Lowland Kids' Lowland Hoodie, which has a
henley neck); 11 for "polo shirt" (La Maison Victor's Milano and Aspen, sisterMAG and dresses). All
graded and copyrighted; none made to measure or openly licensed. None was used.

## The design

| Element | Default | Option | Why |
|---|---|---|---|
| Placket length | 30% of back neck to waist (about 14 cm on a 38 in figure) | `placketDepth` | A three-button henley; the rugby shirt's is 40% |
| Placket width, finished | 8% of the neck (about 3 cm) | `placketWidth` | Room for a 15 mm button |
| Buttons | 3, from a placket's width below the neck to a width above its foot | `buttons` | As many as fit half a placket-width apart: a child's short placket takes fewer |
| Neck finish | a band | `neckFinish` (`band`, `collar`) | The collar makes it a polo |
| Band height, finished | 5% of the neck (about 2 cm) | `bandHeight` | A narrow knit band |
| Collar height, finished | 20% of the neck (about 8 cm) | `collarHeight` | A polo collar |
| Band or collar length | the neck opening less 8% | `collarStretch` | Sewn on slightly stretched so it lies flat round the neck |
| Sleeve length | 100% (to the wrist) | `sleeveLength` | Short (20%) for the polo |
| Cuffs, hem band | off | `useCuffRibbing`, Bibi's `useWaistRibbing` | Rib cuffs on the rugby shirt |
| Fit, length, neckline, ease | Bibi's | Bibi's | Bibi's crew neck and knit ease |

## Variants

- **Polo shirt:** the knit collar, a shorter two-button placket (25%), short sleeves.
- **Rugby shirt:** a deeper collar (22%), a long, wide placket (40%, 10%), rib cuffs, long sleeves.
  A real rugby shirt's collar is often woven cotton twill: cut the collar piece from that instead
  (it isn't shortened for stretch then; set `collarStretch` to 0).

## Changes and what isn't modelled

- **Over the head.** With the placket open, the neck opens by twice the placket's length: at the
  defaults that is at least 89% of the head (Girls 1B), so the knit stretches at most 12%. The test
  allows 25%.
- The band and collar run round the whole neck, over the plackets' tops, and end at the placket's
  edges, turned in: they aren't joined into a ring.
- The placket strips are cut the same; buttonholes are marked on both. Sew the buttonhole strip on
  the side the wearer prefers (women's right over left, men's left over right).
- Bibi's own neck binding is drafted but not cut: the band replaces it.

## Pieces

1. Front, on the fold, with the placket box marked at centre front.
2. Back, on the fold.
3. Sleeve, cut 2 (none with `sleeves` off).
4. Placket, cut 2: twice the placket width by its length, folded lengthwise, buttonholes marked.
5. Neckband (with `neckFinish: band`): the neck opening less `collarStretch`, twice `bandHeight`
   wide, folded.
6. Collar (with `neckFinish: collar`): as the band, twice `collarHeight` wide.
7. Cuff, cut 2 (with `useCuffRibbing`).
8. Hem band (with `useWaistRibbing`).

## Construction

1. Interface the plackets' buttonhole halves. Fold each placket in half lengthwise and press.
2. Cut the front down the marked placket box (centre front) and across its foot, snipping into the
   corners.
3. Sew a placket to each side of the opening, right sides together, and turn them to the inside so
   they meet at centre front, the buttonhole one on top. Stitch across the foot through both
   plackets and the front's triangle.
4. Sew the shoulder seams. Fold the band or collar in half lengthwise and sew it to the neck edge,
   matching the quarter notches to the centre back and shoulders, stretching it to fit; turn in its
   ends at the placket edges.
5. Set in the sleeves flat, then sew each side seam and sleeve seam in one.
6. Hem, or sew on the cuffs and hem band. Make the buttonholes and sew on the buttons.
