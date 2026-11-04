# Cape overcoat

**Source:** Simons, *Designing Overcoat Patterns* (1916), corpus
`designingovercoa00simo`, "Shoulder Cape Overcoat", book pp. 30–31
(PDF pp. 34–35). Cross-checked with Simons, *Designing Boys' and Juveniles'
Clothing* (1922), corpus `designingboysjuv00simo`, "Cape Overcoat",
Diagram 38, book pp. 110–112 (PDF pp. 116–118). Both US public domain.
The queue's p. 21 and p. 126 references point to other drafts.

**Block:** FreeSewing's Brian through the existing `cape` design. The source
shows a whole back, two foreparts and a separate collar, without an overcoat
body or sleeves under the cape. The parent cape already draws two long pieces
from the neck and shoulders; this design is separate because the Simons
drafts have their own source and collar construction.

**Status:** draft. Not sewn.

**Threadloop:** Searches for "cape overcoat" and "military cape" did not
identify a free equivalent drafted from measurements. This does not establish
that none exists.

## What the sources state and show

The 1916 draft is for a 38 in breast and a 42 in length. Its text says to
use a whole back and a military collar. The forepart has a 7 in button
stand, and the collar stands 1½ in at the back. The plate shows the long
front spreading from the neck to a broad swept hem, with the back on a fold.
It does not mark a button count.

The boys' Diagram 38 confirms the cape shape: its size 12 is 35 in long,
with a whole back and a separate curved collar. It says the chest draft is
3 in larger than the actual breast. A small rectangle on that plate might be
an arm opening, but the text does not explain it, so it is not copied.

## How the source maps onto the block

| Feature | Source | Here |
|---|---|---|
| Length | 42 in from the nape, 1916 p. 30 | `capeLength` 65.5% of nape to floor: 42 / (18.50 + 45.67) in at `cisMaleAdult38` |
| Pieces | Whole back and two foreparts, p. 30 and plate p. 31 | `capePieces: two` |
| Button stand | 7 in across the forepart, p. 31 | `buttonExtension` and `facingWidth` 9% of chest each, together about 7 in on a 38 in chest |
| Military collar | 1½ in stand at back, p. 31 | `collarWidth` 10% of the 14.96 in model neck; `collarSpring` and `collarPoint` zero |
| Hem | Broad sweep at about one level on plate p. 31 | `capeDrop` zero; the parent cape's arc |

## Changes and limits

- Simons' point-by-point draft is replaced by the parent cape's circular
  layout. Its neck and shoulders come from Brian, and its pivot, seam line
  and flare remain Mitchell-derived parent values. The shape is close to the
  plate, but the drafting method and exact sweep are different.
- The 1916 stand is marked as a cut-on extension and facing using the parent
  cape's front. The source does not specify three buttons: that default is
  inherited and is ours.
- The `collar` operation gives a straight standing collar at zero spring and
  zero point. It does not reproduce every curved point in the 1916 collar
  diagram. The 1922 boys' collar has a different curved shape.
- The 1922 draft's 3 in chest oversize is not a fitted chest measurement on
  this circular block. The cape's actual sweep is checked at every size.
- At `cisMaleAdult38`, the available model's chest is 39.37 in, not the
  source's exact 38 in. The length default is calibrated to this stand-in.

## Pieces and construction

Cut two foreparts, one back on the fold, and the collar on the fold.
Sew the shoulder and side seams, finish the front stand and facing, attach
the collar, level and hem the swept edge, then work buttonholes and buttons.
