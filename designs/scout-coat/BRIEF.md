# Scout coat

**Source:** Simons, *Designing Boys' and Juveniles' Clothing* (1922), corpus `designingboysjuv00simo`. "Boy Scout Jacket", Diagram 11, pp. 43-45 (PDF pp. 49-51), and its sleeve and collar, Diagram 12,
pp. 46-47 (PDF pp. 52-53). US 1922, public domain. Inches below are Simons': breast 31, waist length 14¾, seat length 21, full length 26½.

**Block:** FreeSewing's Bent, through the military tunic (`extends`, `lib/body3.mjs`), for its three-piece body and two-piece sleeve. No library changes. Drafted from the wearer's measurements, so it fits men too.

**Status:** draft. Not sewn.

**Threadloop:** 2 free results for "scout jacket" (2026-11-04), a hat and a bag; no free equivalent.

## What the source shows
- **Body:** a back with a CB seam, a side body and a forepart, the seams shaped in at the waist, with front darts at 20 (from the neck) and 22 (down the forepart).
- **Front:** a lap of 1½ in (11 to 12), hollowed ¼ in at the waist, five buttons as drawn, up to the neck.
- **Pockets:** "The top pocket is 4½ inches wide and 5 inches deep. The bottom pocket is 5½ inches wide and 7½ inches deep. Style flaps as illustrated": patch pockets with a pointed flap and a button.
- **Collar:** "should finish 13 inches", 1¾ in up to the fold line and 1¾ in on, ½ in of spring at the back: a turned-down collar.
- **Sleeve:** made so that part of the under sleeve is added to the top sleeve, the seam meeting the forepart's and side body's seam under the arm.

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Length | 11¾ in below the waist | `lengthBelowWaist` 188% of waist to seat (of 6¼) |
| Lap | 1½ in of 31 | `buttonExtension` 4.8% of the chest |
| Buttons | Five, the last 2¾ in below the waist | `buttons` 5; `buttonBottom` 43% of waist to seat |
| Top pocket | 4½ by 5 in | `topPocketWidth` 14.5%, `topPocketDepth` 16% of the chest, flap included, kept 22% in from the seam |
| Bottom pocket | 5½ by 7½ in, 3 in below the waist | `bottomPocketWidth` 17.7%, `bottomPocketDepth` 24% of the chest; `pocketBelowWaist` 50% of waist to seat |
| Collar | 3½ in on a 13 in neck, ½ in of spring | `collarHeight` 27% of the neck; `collarPoint` 8%; the spring as ½ in of 6½ |
| Ease, body, sleeve | "Similar" | Inherited from the military tunic |

## Pieces
Front, back, side body, facing, collar, top and under sleeves, and a pocket and flap of each size.

## Construction
As the military tunic, with patch pockets in place of its welts: hem each pocket's top, press its edges under, and sew it on at the marks; sew the flap on above it, with a buttonhole at its centre and a button on the pocket.

## Changes and what isn't modelled
- **The forepart is narrower than Simons',** about a quarter of the chest at the waist, not a third, so the bottom pocket is usually narrower than 5½ in in proportion: about 6 in on a 39 in chest, where Simons' proportion is 7. Its width is limited to fit, and moved nearer CF.
- **The neck and forepart darts (20, 22) aren't drafted.** The body's seams take the waist in; the bust on Bent is a man's.
- **The waist's ¼ in hollow** in the front edge isn't drafted.
- **The sleeve is the tunic's** two-piece, not Simons' with its seam moved to meet the body's.
- **The pockets are square-cornered and the flaps plain,** where Simons' have lightly rounded corners and a pointed flap with a button. The button's place isn't marked.
- **A scout badge or belt** isn't part of the draft.
