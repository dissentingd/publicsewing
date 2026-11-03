# Golf pants

**Source:** Simons, *Designing Boys' and Juveniles' Clothing* (1922), corpus `designingboysjuv00simo`. "Boys' Golf Pants", Diagram 43,
pp. 120-123 (PDF pp. 126-129). US 1922, public domain. Size 6, in inches: seat 26, waist 24, rise 6, inseam 8, drop 4, above knee 10½,
knee 11½, below knee 10½.

**Block:** FreeSewing's Titan, through the breeches (`extends`), for `trouserLeg`'s breeches mode: a thigh flare, a fitted knee, a straight
hem and a buttoned side opening. `lib/trousers.mjs` gained `openingLength`. Drafted from the wearer's measurements, so they fit men too.

**Status:** draft. Not sewn.

**Threadloop:** 2 free results for "golf pants" (2026-11-03), a towel and a vest; no free equivalent.

## What the source shows
"The top of these trousers is made similar to that of the knickerbocker trousers." They aren't plus-fours: nothing is gathered and there's
no strap.
- **Leg lines:** N is 8 in down the inseam, P is 4 in below N, O half way. Each is a quarter of its own measure either side of the forepart's
  centre (above knee at N, knee at O, below knee at P), the back ¾ in wider each side. So 12 round at N, 13 at O and 12 at P: fitted.
- **Thigh:** the forepart ½ in out at the fork line (B to 10), the back 2 in past that (10 to 11), shaped by a single heavy line from the
  waist through 11 to 12.
- **Hem:** straight across at P.
- **Vent:** "allow 1 inch for vent" on the back's side seam at 12, 13 and 14, from V to the hem.
- **Not given:** buttons, pockets or a waistband here; those come from the knickerbockers and knee pants.

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Knee | 13 round on 11½ | `kneeEase` 13% |
| Half way to the hem | 12½ | `calfAt` 7% of knee to floor; `calfWidth` 109% of the knee |
| Hem | 2 in below the knee line; 12 round | `breechesLength` 14% of knee to floor (2 of the USDA boy C6's 14¼); `cuffWidth` 104% of the knee |
| Back and forepart | 7¼ and 5¾ at the knee | `legBalance` 56% |
| Thigh | ½ in on the forepart, 2 in more on the back: 2½ in | `thighFlare` 3.2% of the seat (⅞ in on 26), `backFlare` 200% of that (1¾ in): 2⅝ in. `thighAt` 35% of fork to knee |
| Vent | From V, 2 in above the knee line | `openingTop` -14% of knee to floor; the back's measured to match (`openingLength`) |
| Vent width | 1 in | `ventStand` 8.7% of the knee; the facing 1.3 times that |
| Buttons | Not drawn | `breechesButtons` 3: ours |
| Seat | As the knickerbockers | `seatEase` 5%, the trousers' |
| Waist, fly, pockets, waistband | As the knickerbockers | Inherited from the trousers |

## Pieces
Front, back, waistband, fly pieces, side and back pocket pieces, belt loops, as the trousers; a button stand and a facing for the vent.

## Construction
As the breeches: outseam from the pocket down to the top of the vent; stand on the back's edge and facing on the front's; inseam; crotch;
waistband; hem; buttonholes on the front's edge, buttons on the stand.

## Changes and what isn't modelled
- **The thigh's fullness is placed differently.** Simons puts it almost all on the back, widest at the fork line. Titan's back stays at the
  seat there, so the same 2 in made a hollow in the side seam just above it. Here it's shared one to two between forepart and back, and is
  widest about a third of the way down the thigh. The total is close to Simons'; the seam's a smooth curve, as the plate's is, in a slightly
  different place.
- **The vent is a stand and a facing,** the breeches' pieces, in place of Simons' 1 in cut on with the back.
- **The vent's length is matched along the seam,** as the two outseams differ above the knee: the back's top is a little off the front's height.
- **Option `breechesOpening` front** stays on the menu from the breeches. Simons doesn't draw it.
- **The name:** the queue called these plus-fours, fuller and longer than the knickers. The plate doesn't show that, so these follow the plate.
  `boys-knickers` is the full, gathered leg.
