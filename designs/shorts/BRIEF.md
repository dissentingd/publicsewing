# Shorts

**Source:** Simons, *Drafting Trousers for Men, Boys, Women* (The Garment Technical Institute,
Morris Plains, N.J., 1945), corpus `simonsdraftingtrousers1945` (not tracked; a copy on the laptop and
on the home server). Men's shorts, Diagram 21, text p. 78, plate p. 79 (PDF pp. 86–87); boys' shorts,
Diagram 35 (pp. 104–105); ladies' shorts, Diagram 41 (pp. 121–123). US 1945, not renewed (NYPL renewal
records for 1972–73, checked 2026-11-11): public domain in the US. Inches below are Simons', for waist
34, seat 40, rise 11½ including a 2 in waistband, on a 32 inseam (men's).

**Block:** FreeSewing's Titan, through the suit trousers (`extends: ../suit-trousers/spec.yaml`): front
and back legs, darts, fly, side pockets, jetted back pocket, waistband and belt loops. `trouserLeg`
gained `shortInseam` and `cutFlare` (the leg cut off above the knee, the inseam flaring at the hem)
and `matchInseam` (the back's cut moved so its inseam is the front's length). Drafted from the
wearer's measurements, so one design serves men, women and children, which is what Simons' three
drafts show: the same construction at three sizes.

**Status:** draft. Not sewn.

**Threadloop (2026-11-11):** "men's shorts" finds 90 free patterns, a few of them shorts (Xavier, sweat
shorts, pyjama shorts, a minishort); whether any is drafted from measurements wasn't checked.

## What the source shows
- **Men's (Diagram 21):** "generally used for sports wear or beach wear". A plain front: "M and N are
  each ¼ of 17 from L", no pleat or dart. The back with a ½ in vee. The leg 11 in below the fork line
  ("C is 11 inches from B"), the hem 1⅛ in below that; the inseam flaring out: "S is 1½ inches from R".
  "For every inch increase in inseam of the normal leg length the shorts should be lengthened ¼ inch."
  A 2 in waistband; a back pocket 5 in long, 1½ in from the side seam.
- **Boys' (Diagram 35):** size 6, waist 24, seat 26, rise 6, inseam 5; drafted as the plus fours at the
  top, with an optional 1½ in front pleat and a ½ in back vee under a 4½ in pocket.
- **Ladies' (Diagram 41):** waist 28, seat 38, rise 13 including the band, inseam 9, "3 inches less
  than the knee length", "made with a continuous waistband"; a front vee 1½ in wide and 5 in long, a
  1 in vee in the back, the bottom 23 in round, a 1½ in hem.

## How it maps onto the block
| Feature | Simons | Here (option default) |
|---|---|---|
| Front | Plain, no pleat or dart (men's) | `frontDart` 0 |
| Back vee | ½ in (men's), of about 3⅜ in waist shaping at 34/40 | `backDart` 15% |
| Leg | 11 in below the fork on a 32 inseam | `shortsInseam` 34% of the wearer's inseam |
| Flare | 1½ in (R to S) on a 40 seat | `shortsFlare` 3.75% of the seat, on the front; the back's cut set so its inseam matches |
| Band | 2 in, separate (men's) | `waistbandHeight` 4.8% of waist to floor; `continuousBand` off |
| Ladies' | 9 in leg (30% of a 30 in inseam), cut-on band, 1½ in × 5 in front vee, 1 in back vee | the `banded` variant: `shortsInseam` 30%, `continuousBand`, `frontDart` 44%, `frontDartLength` 49%, `backDart` 30% |
| Boys' | 5 in leg, a 1½ in pleat | sizes: the USDA children's sets; no pleat (see below) |

## Changes and what isn't modelled
- **One length rule:** the leg is a share of the wearer's inseam, not Simons' ¼ in per inch of inseam.
  At his size they agree; on a child the shorts come out a little longer than his age-6 draft's 5 in.
- **The back's flare:** Simons flares the back ⅝ in more than the front. Here the back's cut height
  is set so its inseam matches the front's, since their forks and floors differ by a few millimetres.
- **The hem** is cut straight across; Simons' 1⅛ in (men's) and 1½ in (ladies') hems are the
  trousers' hem allowance.
- **The boys' pleat** isn't offered: these legs take darts. The pleated slacks have pleats.
- **The ladies' bottom** (23 in round) comes from the leg's own width at the cut plus the flare.
- **Pockets and belt loops** are the suit trousers'.

## Pieces
Front and back legs, waistband (unless cut on), fly shield and facing, belt loops, side pocket bags,
back welt and bag.

## Construction
As the suit trousers, with a plain turned hem at the leg. With the band cut on, as the slacks: sew
the darts up to the band's top and face it. Simons gives no making-up order.
