# Shirt

**Source:** W. D. F. Vincent, *The Cutter's Practical Guide to Cutting and Making Shirts,
Undergarments, Collars…* (London, 1890), corpus `vincentmakingshirts18xx` (tracked). "The
System" and "Yoked and Fronted Shirts", Diagrams 1–12, book pp. 4–7 (PDF pp. 8–11); the collar
and cuff, Diagrams 4–5, p. 5; "Various Styles of Collars and Cuffs", p. 23 (PDF p. 27). Public
domain (published 1890, Vincent died 1926). Inches below are Vincent's.

**Block:** FreeSewing's Brian, through the service shirt and the pyjama jacket (`extends:
../service-shirt/spec.yaml`, `lib/coat.mjs`): its button-through body, back yoke, facing and
fitted sleeve. Added for the shirt: a collar on a stand (two `collar` operations, the stand
stored as `coat.collarStand`), a cuffed sleeve with a slit (`sleeve` with `slit`), a `cuff`
piece and the sleeve placket strip (`sleevePlacket`, from `lib/yoke.mjs`).

**Status:** draft. Not sewn.

**Threadloop:** free classic shirts exist (FreeSewing's own Simon is one, drafted from
measurements); this one stays because it is Vincent's proportions on our coat library, and it
gives the catalog its plain everyday shirt.

## What the source shows
- **Yoked back** (Diagram 8): the yoke 3 in deep at CB (pointed there) and 2 in at the scye;
  the back's extra width gathered or pleated into it "just above the blades", 1½ in plain
  either side of the point. The side seam a quarter breast plus 1½–2½ in from CB, hollowed 1 in
  at the waist, 1 in of spring over the seat.
- **Forepart** (Diagram 9): a quarter breast less 1 in, plus 1½–2½ in at the side; 8½ to 33½
  "about 2 inches less" than the back's 9 to 36. Vincent's forepart is a pullover with an
  inserted front (a bib) opening part way down; the queue's classic shirt opens all the way.
- **Bottom:** the side seams left open 3–4 in, the top of each slit finished with a gusset;
  every seam felled.
- **Collar** (p. 5): half neck plus 1 in long; "1¼ deep at back and 1 inch deep at front". The
  p. 23 models: the stand-up styles (Diagrams 1, 3) and the stand-and-fall styles (4, 10–12),
  the fall about 2–2½ in deep at the back.
- **Cuff** (Diagram 4, p. 5): half the cuff desired plus 1 in long (each half), the depth
  desired plus 1 in; p. 23 shows 11 × 5 and 9½ × 4 barrel and link cuffs. "The slit of the
  sleeve should be faced so as to take buttons"; the sleeve's fullness at the hand pleated or
  gathered into the cuff.

## How it maps onto the block
| Feature | Vincent | Here (option default) |
|---|---|---|
| Ease | About 4 in over the chest | `chestEase` 11%, the service shirt's |
| Length | To the thigh; front 2 in shorter | `lengthBelowWaist` 130% of waist to seat, front and back level; `hemCurve` 100% of the stand (the corner rounded) |
| Front | Inserted front, ¾ in stand, 3 holes | Button-through: `buttonExtension` 2.6% of the chest (1 in at 38), `buttons` 7 |
| Back | Yoke 2 in at the scye, 3 in at CB (pointed) | The service shirt's straight yoke, `yokeDepth` 30% of CB neck to the chest line |
| Collar stand | 1¼ in at the back, 1 in at the front | `standHeight` 8.6% of the neck (1¼/14½), front edge to front edge, rising 6% of its length to the front |
| Collar (fall) | 2–2½ in at the back, points | `collarWidth` 15.5% of the neck (2¼/14½), sewn to the stand's top from CB to CF, `collarPoint` 6% of the neck past the stand's end |
| Cuff | Half cuff + 1 in; depth + 1 in | `cuffFit` 30% over the wrist, `cuffDepth` 36% of the wrist (2½ in on 7), `cuffLap` 15% (1 in), one button |
| Sleeve | Slit faced to take buttons; fullness pleated in | `sleeveSlit` 90% of the wrist up from the hem, in the middle of the sleeve's back half, bound by a continuous placket; the hem (`cuffEase` 75% over the wrist) pleated into the cuff |
| Pocket | (the coat shirt's out-breast pocket) | One plain breast pocket, left front, `pocketShape` square |

## Changes and what isn't modelled
- **Button-through, not fronted.** Vincent's yoked shirt is a pullover with an inserted front;
  the classic shirt opens all the way down.
- **The yoke is straight**, not pointed at CB, and **the back isn't gathered into it**: the
  service shirt's back is cut at the yoke as it is. The gathers above the blades would need a
  fullness option on `lib/panels.mjs`.
- **No side slits or gussets**, and front and back hems are level.
- **The stand's depth is constant** (1¼ in), not 1 in at the front.
- **The pocket mark is on both fronts** (the front is cut 2); the pocket is cut once, for the
  left.

## Pieces
Front (cut 2), back yoke and back body (on the fold), facing (cut 2), collar stand and collar
(on the fold, cut 2 each, interfaced), sleeve (cut 2), cuff (cut 2, interfaced), sleeve
placket (cut 2), breast pocket (cut 1).

## Construction
1. Pocket on the left front.
2. Back to the yoke; fronts to the yoke at the shoulders. Facings to the front edges.
3. Collar: make the fall, sew it between the two stand pieces, then the stand to the neckline.
4. Sleeves: bind each slit with the placket strip; set the sleeves; underarm and side seams in
   one, felled.
5. Pleat each sleeve's hem into its cuff, the cuff lapping past the opening.
6. Hem; buttonholes on the right front (men's) and the cuffs, buttons opposite.

## Checks
`test/shirt.test.mjs`: the coat checks at every size, plus the stand against the neckline, the
fall against the stand's top edge, and the sleeve's hem against the cuff.
