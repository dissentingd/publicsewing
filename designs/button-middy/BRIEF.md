# Button-on middy

**Source:** Simons, *Designing Boys' and Juveniles' Clothing* (1922), corpus
`designingboysjuv00simo` (tracked). "Button on Middy Blouse", Diagram 10, pp. 41–42; the sleeve and
cuff are Diagram 9's, p. 40, as the text says it's "drafted similar to the previous diagrams". US
1922, public domain. Size 6: breast 24, waist 24 (inches).

**Block:** FreeSewing's Brian, through the pyjama jacket and barber's coat (`lib/coat.mjs`), with
the dress shirt's sleeve opening and cuff. Not on `middy-blouse`, as the queue had it: that's a
pullover cut on the fold, and this opens all down the front on a cut-on stand. `coatBack` and
`coatFront` gained `hemSa`, because this hem is sewn to the belt and not turned up. Drafted from the
wearer's measurements, so it fits any size, adults included.

**Threadloop:** no free pattern under "middy blouse". "Sailor blouse" gives 21 free results, mostly
sailor dresses, collars and hats; none is this garment, and nothing in those listings says it's
drafted from measurements.

**Status:** draft. Not sewn.

## What the source shows
"Made shorter and is made button-to-the-neck style, with a snug fitting belt at the waist."
- **Length:** E is 4 in below the waist, and 3 to 4 adds 1½ in at CF. The line 2, 4, 5 runs straight
  from the side seam down to the front edge.
- **Side seams:** O to P and O to 2 are 1½ in each, a straight flare from the armhole, so the hem is
  about 36 in round on a 24 breast.
- **Stand:** S to T is 1 in, with a row of five marks on the CF line from the neck to level with E
  (the plate; the text doesn't give a count).
- **Belt:** 13 in the half, "½ of waist plus 1 inch, which is allowed for the button stand"; about 2
  in wide (18 to 19, read from the plate). "The extra fullness at the bottom of the middy is
  distributed equally at the forepart and back and should be equalized when sewed in the belt." Four
  narrow lens shapes above the hem on each of front and back are read as the tucks that do this.
- **Collar:** the half 6 in (8 to 9). The neck edge 8, 13, 11 rises ¾ in at the front end (9 to 11),
  with 9 to 14 of 2½ in below; 8 to 10 is 1 in and 10 to 15 is 2½ in, so about 3¼ in deep at the front
  and 3⅞ in at CB. 14 to 17, the point past the end of the neck edge, is about 1½ in from the plate.
- **"⅙ of breast"** in Simons' neck (W to X, X to Y) means a sixth of the half breast: the plate's
  scale confirms 2 and 2¼ in, not 4 and 4¼.

## How it maps onto the block
Size 6 on USDA `usdaBoyC6`: chest 26 in, seat 26, neck 12¼, wrist 5½, waist to seat 6¼.

| Feature | Simons | Here (option default) |
|---|---|---|
| Ease | ½ breast + 4 in across the forepart | `chestEase` 25% |
| Hem round | About 36 in | `seatEase` 45%: 36⅔ in at C6 |
| Below the waist | 4 in | `lengthBelowWaist` 64% of waist to seat |
| Front drop | 1½ in, straight | `frontDrop` 24% of waist to seat, `straightHem` |
| Stand | 1 in on a 24 breast | `buttonExtension` 4% of the chest |
| Buttons | Five (plate), neck to level with E | `buttons` 5; the last 1½ stands above the front hem |
| Belt | ½ waist + 1 in, the half; about 2 in wide | The waist plus both stands; `beltWidth` 7.5% of the chest |
| Collar depth | 3¼ to 3⅞ in | `collarWidth` 30% of the neck |
| Collar point | About 1½ in (plate) | `collarPoint` 13% of the neck |
| Collar spring | ¾ in over the 6 in half | `collarSpring` 12.5% of the half neckline |
| Cuff | 7⅞ in round, 2½ in wide | `cuffFit` 45% over the wrist, `cuffDepth` 46% of the wrist |

## Changes and what isn't modelled
- **The collar's depth is even**: 30% of the neck at CB and at the front, between Simons' two. Its
  outer edge is the builder's curve, not his.
- **Less fullness in the sleeve:** Simons leaves 5 in over the cuff, on a sleeve much wider than
  Brian's fitted one. `cuffEase` 100% (about 11 in at the hand at size 6, against 12⅞) stays close to
  the biceps.
- **A sleeve opening and a buttoned cuff** are ours (`sleeveSlit`, `cuffLap`), as the dress shirt's:
  Simons says only "when the cuff is open", and a closed 7⅞ in band is tight over a hand.
- **The belt is one piece on a lengthwise fold**, not a half on a CB seam, and it's sized from the
  chest, so it comes to about 3 in at an adult's size. Reduce `beltWidth` for a narrower one.
- **Tucks aren't marked:** the fullness is distributed by hand, tucked or gathered, at sewing time.
- **The collar ends just past CF** (a quarter of the stand), read from 6 in against a half neck of
  about 5½, so the two points meet when the neck is buttoned.
- **No trim, tie or shield.**

## Pieces
Front (cut 2), back (on the fold), facing, collar (on the fold, cut 2), sleeves, cuffs, sleeve
plackets, belt.

## Construction
1. Shoulder seams. Sew the facing to the front edge, turn and press.
2. Collar and its top: sew round the outer edge, turn, press; sew to the neckline, the ends just past
   CF.
3. Bind the sleeve openings. Set in the sleeves; underarm and side seams in one.
4. Pleat the sleeve's fullness into the cuffs; buttons and buttonholes.
5. Button the front. Tuck or gather the hem evenly into the belt, front and back alike, with the belt's
   ends lapping by the stands. Sew the belt on, turn it over its fold and finish inside.
6. Buttonholes down the right front and at the belt's end; buttons on the left.
