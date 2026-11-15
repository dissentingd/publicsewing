# Child's dress

**Source:** Pivnick, *How to Design Beautiful Clothes* (1949), corpus `pivnickdesignclothes1949`
(not tracked; a copy on the laptop and on the home server). Chapter XXII, "Designing an Entire Dress":
Pattern 105, "A Child's Dress", book pp. 296–299 (PDF pp. 304–307; PDF = book + 8), Figures 29–39;
Pattern 106, pp. 300–302 (PDF pp. 308–310), Figures 40–48. Both are drafted on her children's
foundation, chapter XXI, which is the shift dress here. US 1949, not renewed: public domain in the US.
Her figures carry no numbers: the proportions below are read from them, as the brief says where.

**Threadloop (2026-11-15):** "girls dress" finds 97 free patterns (Violette Field Threads' Maeve, a high
yoke girls' dress, Life Sew Savory's Sweet Rose, Lou and Me's Poppy, an A-line dress); whether any is
drafted from measurements wasn't checked.

**Block:** FreeSewing's Brian, through the yoke template and the shift dress (`extends:
../shift-dress/spec.yaml`). `lib/yoke.mjs` gained three design options, each off unless a design
declares it: `frontPleats` (pleats laid at the front fold, their take-up added to the front's width),
`openFull` (the opening buttoned from the neck to the hem, the piece cut in two with its stand, and
a facing strip) and `sleevePuff` (the sleeve spread wider and its cap raised, so both edges gather).
All eleven yoke designs snapshot identical. Drafted from the wearer's measurements, so it fits any size.

**Status:** draft. Not sewn.

## What the source shows
- **Pattern 105 (Figures 29–39):** the foundation front and back, each in one piece. Three pleats each
  side of the centre front, marked on the foundation and added (Figures 30–32), the front cut on the
  fold; the shoulders marked "gather". The back with "an extension added at the center back for
  buttons and facing" (Figure 33), buttoned from the neck to near the hem, ten buttonholes marked
  (Figure 34). The sleeve slashed and "spread to the desired width, and top curve rounded off", its
  top gathered into the armhole and its lower edge "gathered in and finished with a binding"
  (Figures 35–37). A flat collar (Figures 38–39). "The sash is simply a straight piece of fabric cut
  to the desired width."
- **Pattern 106 (Figures 40–48):** a yoke front and back, the front yoke curved, the skirt sections
  below "widened for gathers by drawing it as wide as may be desired"; buttoned down the front, a centre
  front panel; "the flat collar and short puffed sleeves are constructed in the same way as for the
  dress in Pattern 105"; the sash "starts either side of the center front panel". All cut on a fold
  except the opening.

## How it maps onto the block
| Feature | Pivnick | Here (option default) |
|---|---|---|
| Front pleats | Three each side of CF (Figure 31) | `frontPleats` 3; `pleatDepth` 1.2% of the chest (about ¼ in on a 24 in chest), `pleatSpacing` 1.8% (about ⅜ in), read from the figure |
| Back opening | Extension for buttons and facing, neck to near the hem, ten buttonholes | `opening` back, `openFull`, `buttons` 10; a facing strip three stands wide |
| Collar | Flat collar | `neckFinish` collar (the shift dress's flat collar) |
| Sleeves | Short, spread "to the desired width", gathered, bound | `sleeves` short, `sleevePuff` 40% (ours), `sleeveBand` 10% of the wrist (a narrow binding) |
| Sash | Straight, "the desired width" | `sash`, `sashWidth` 15% of the back length (about 1½ in, read from Figure 29), `sashLength` 2½ waists (ours) |
| Pattern 106 | Yokes to about the chest line, skirt gathered, front buttoned | the `yoked` variant: `frontYoke`, `backYoke`, `opening` front; `yokeDepth` 90%, `gathers` 140% |

## Changes and what isn't modelled
- **The shoulder gathers** of Pattern 105's front aren't added: the pleats take the fullness.
- **The pleats** run from the neck to the hem as marked lines; Pivnick's Chapter Six method (how far
  they're stitched down) isn't given on these pages, so stitch them down as far as liked.
- **Pattern 106's yoke line is straight**, at the same depth front and back (the template's yoke),
  not her curved front yoke or her higher back yoke; there's no separate centre front panel.
- **The puff** is our 40%: Pivnick spreads the sleeve "to the desired width".
- **The facing** is a straight strip; Pivnick's is part of the extension.

## Pieces
Front and back (or, in the yoked variant, front and back yokes and skirts), sleeves, sleeve bindings,
collar, opening facing, sash.

## Construction
Lay and press the front pleats and tack them at the neck. Sew the shoulders and side seams. Face the
opening, make the buttonholes. Gather the sleeve caps into the armholes and the hems into the
bindings. Make the collar and sew it on. Hem; make the sash. Pivnick gives no making-up order.
