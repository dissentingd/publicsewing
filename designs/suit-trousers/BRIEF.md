# Suit trousers

**Source:** ЕМКО СЭВ, vol. 3, *Base constructions of men's clothing* (Moscow, 1988), corpus
`emko` (a private copy, not in the repository). §7, men's semi-fitted trousers: base construction
Table 7.2 (p. 112) with Fig. 34 (p. 113), model construction Table 7.3 (p. 115) with Fig. 35
(p. 116), and the graded values for eight figures in Table 7.4 (pp. 117–118). Still in copyright:
only its proportions and construction are used here, as design references, in our own words; no
text or figure is reproduced. Lengths below are the book's centimetres, for its 176-100-88
figure (height 176, chest 100, waist 88; hip girth 103.8). The archived pipeline's reading of
the base construction is `archive/pilot/emko/emko_trousers.py` and `trousers_table74.yaml`.

**Block:** FreeSewing's Titan, fitted at the knee, with the leg from `trouserLeg`
(`lib/trousers.mjs`).

**Status:** draft. Not sewn.

## What the source shows
Straight, semi-fitted men's trousers:
- **Ease:** half the hip is 54.7 across, 2.8 over the half hip girth (5%); the waist 47.1, 3.1
  over the half waist (7%). The back takes 53% of the hip width, the front 47%.
- **Knee and hem:** 48.4 round the knee (25% over the knee girth), the back 55% of it; 44.9 at
  the hem, so the leg narrows 7% from the knee down. The hem is 4.05 above the floor.
- **Waist shaping:** the half hip less the half waist (7.6) is taken out at the waist: 40% in one
  back dart, 20% at the back side, 20% at the front side, 20% in a front dart.
- **Back dart:** at 0.4 of the back waist from CB, square to the waist, 9.0 long (half the waist
  to hip, plus 1.0).
- **Front dart:** on the crease line, 10.85 long (0.6 of the waist to hip at the crease).
- **Hem:** curved 1.0 down at the back crease and 1.0 up at the front crease.
- **Waistline:** the trousers' top edge sits 3.0 below the waist; a waistband goes on above.
- Table 7.3 also marks points 4.7 in from CB and CF on the waist (0.1 of the waist). Fig. 35
  doesn't say what they are for; they aren't used here.

The tables give no pockets, fly or waistband sizes: those are this design's, below.

## How it maps onto the block
| Feature | ЕМКО (176-100-88) | Here (option default) |
|---|---|---|
| Seat ease | 5% over the hip girth | `seatEase` 5% of the seat |
| Waist ease | 7% over the waist | `waistEase` 7% of the waist |
| Knee | 25% ease, back 55% | `fitKnee` on, `kneeEase` 25%, `legBalance` 55% |
| Hem width | 44.9 against 48.4 at the knee | `hemWidth` 93% of the knee's width |
| Hem shape | 1.0 down at the back crease, 1.0 up at the front | `hemShaping` 1% of waist to floor |
| Length | Hem 4.05 above the floor | `lengthBonus` -4% of waist to floor |
| Back dart | 0.4 of the shaping, at 0.4 of the waist from CB, 9.0 long | `backDart` 40% of the half seat-waist difference (with ease), at 40% of the back waist, `backDartLength` 56% of waist to seat; taken out of Titan's CB shaping |
| Front dart | 0.2 of the shaping, at the crease, 10.85 long | `frontDart` 20%, at 55% of the front waist from CF (about the crease), `frontDartLength` 68% of waist to seat; let out at the side seam |
| Waistband | Top edge 3.0 below the waist | Titan lowers the top edge by its `waistbandWidth`; the band (`waistbandHeight` 3.75% of waist to floor, about 4 cm) goes on above it |
| Crotch | Its own crotch extensions (13.9 back, 7.15 front) | Titan's crotch seam, fitted to the wearer's cross-seam measurement |

## Added here
- **Fly:** a zip fly on the left front, its stitching line `flyWidth` 3.5% of the waist in from
  CF, 1.05 × waist to seat long (stopping short of the fork); a fly facing and a folded fly
  shield cut to its length.
- **Side pockets** (`sidePockets`): in the side seams, from 18% of waist to seat below the waist,
  85% of it long; one bag piece pair per side.
- **Back pocket** (`backPocket`): one jetted pocket per back, 13% of the seat long, centred under
  the dart 40% of waist to seat below the waist.
- **Waistband** in two halves joined at CB (so it can be let out), the left half running past CF
  over the fly shield; **belt loops** (`beltLoops`, 7) cut from one strip.

## Construction order
Letters are the seam and placement codes on the pattern map; numbers are printed on the pieces. **SS** straight seam pressed open, **TS** topstitch, **HS** hem stitch.

1. Sew the darts **M** in the backs **2** and fronts **1**; press the back darts toward CB, the front darts toward CF.
2. Back pockets at the mouth **BP** on the backs **2**: welt **8** and bags **9**, made as a welt pocket with two jets.
3. Side pockets: sew the bag pieces **7** to the front **1** and back **2** side seams at the mouth **SP**; sew the side seams **O** above and below the mouth, then round the bags. Without side pockets, sew **O** straight through.
4. Sew the inseams **I** of the fronts **1** and backs **2**.
5. Fly: the facing **5** to the left front **1**, the shield **4** to the right; the zip between them; topstitch the fly line **Z** with **TS**; then sew the crotch seam **X** from the fly's end to CB through the fronts **1** and backs **2**.
6. Sew the belt loops **6**; the waistband **3** halves to the waist **W** of the fronts **1** and backs **2**, the CB seam through the band; fold, and finish the ends over the fly.
7. Turn up the hems **H** of the fronts **1** and backs **2** on the curved line with **HS**.

## Changes and what isn't modelled
- **Turn-ups** (off; `turnUps`, and the variant): Simons, *Drafting Pants and Overalls* (1916), `draftingpantsove00simo`,
  Diagrams F and G, p. 26. Below the hem line 2 in for the cuff, 2 in folded under and 1 in of hem, 5 in in all, the sides
  going out ¼ in at the cuff's fold and at the raw edge. `turnUpDepth` 5% of waist to floor, 2 in on about 41 in (our
  reckoning for his 34 waist); the ¼ in is an eighth of the depth, whatever the depth. The hem is straight with them, as his.
- **Geometry from Titan, not ЕМКО's tables.** ЕМКО drafts its own base from its own
  measurements; here its proportions sit on Titan's back and front, so the trousers draft at
  any size, children included.
- **Waist shaping split differently.** Titan takes all of its waist shaping at CB and CF. Here
  the back dart comes out of Titan's CB shaping (straightening the crotch seam above the seat),
  and the front dart is let out at the side seam (the CF stays straight for the fly). ЕМКО's
  0.2 at each side seam isn't separately modelled. When the waist is as large as the seat
  (stout figures) the darts come out at 0 width.
- **Outseams trued.** Titan's back and front outseams can differ by a few millimetres; the back's
  waist corner moves up or down to match the front.
- ЕМКО's figure-type grading (Table 7.4) isn't used; the eases above apply at every size.
