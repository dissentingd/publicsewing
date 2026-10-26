# 3D drapes

Drapes of the designs in GarmentCode's cloth simulator (run in a `garmentcode` container on a
GPU machine), as a check that the pieces sew into the garment and of gross fit. Not a fit
result: the simulator's body and fabric are approximations.

## Running one (one command)
```bash
node tools/drape.mjs box-coat
```
[`tools/drape.mjs`](../tools/drape.mjs) drafts the design at the size in [runs.yaml](runs.yaml)
with the drape body's measurements, exports the outlines, builds the GarmentCode
specification, simulates it on the GPU host, fetches the front and back renders to
`out/drape/<name>/`, and reports where the cloth goes inside the body
([`tools/drape_inside.py`](../tools/drape_inside.py)), with `result.json` beside the renders.

- **Verdict:** OK, or REVIEW if the cloth is more than 1 cm inside the body anywhere other than
  the wrists and hands. Sleeve hems resting on the wrists are expected: the simulator's body
  stands with its arms out and its hands flared. GarmentCode's own count of body-cloth
  intersections (its limit 35) is printed too, but almost every coat passes 35 at the wrists, so
  it isn't the verdict.
- **The GPU host:** an NVIDIA GPU with Docker, the image built from [`docker/`](../../docker/)
  (GarmentCode and its Warp fork), a host folder mounted at `/data`. Give the runner
  `DRAPE_HOST` (ssh destination) and `DRAPE_DATA` (that folder), as environment variables or in a
  gitignored `drape/local.json` (`{ "host": ..., "data": ..., "container": "garmentcode" }`).
  It can't run in GitHub's CI, which has no GPU.
- **Adding a design:** an entry in `runs.yaml` (which config, size, pieces, cuts). The three
  configs cover a Brian coat's shell (`coat-shell.yaml`), a princess-seamed jacket
  (`jacket.yaml`) and a box body (`box.yaml`); the yoke garments, dresses and trousers need
  configs of their own.

The steps it runs, by hand:
```bash
node tools/drape-export.mjs hunting-coat cisMaleAdult38 out/drape/hc.json --pieces backBase,front,sleeve --clip front=0 --split sleeve=0 --m chest=1000,waist=800,seat=1000
python tools/drape_spec.py out/drape/hc.json drape/coat-shell.yaml out/drape/specs hc --back backBase
# copy out/drape/specs/hc into the container's /data/ps/, then in the container:
python /data/ccat_sim.py -p /data/ps/hc/hc_specification.json -b m_smpl_average_A40   # (in /opt/garmentcode)
python /data/drape_inside.py /data/Logs/<run>/hc_sim.obj /opt/garmentcode/assets/bodies/m_smpl_average_A40.obj
```
The export takes the drafted seam outlines (cm). `drape_spec.py` stitches them and places
them on the body by a config ([coat-shell.yaml](coat-shell.yaml)), using `tools/gcspec`, the
archived pipeline's tested builder (copied out of `archive/ccat/`). Its check that sewn edges run opposite ways caught a
sleeve placed upside down on the first run.

`coat-shell.yaml` drapes a Brian coat's shell: back (on the fold), two fronts closed at CF
(the button stand cut off, so the coat's girth is the closed girth), and the one-piece sleeve
split into front and back halves. It leaves off the collar, facings, pockets, flaps, belt, and
any back panels (the hunting coat drapes its whole back, `backBase`, not the yoke/middle/lower
pieces).

Bodies: GarmentCode's `m_smpl_average_A40` (height 178, chest 100, waist 80, hips 100; its
yaml gives wrist 25) and `f_smpl_average_A40` (height 165, bust 90, waist 80, hips 107). Draft
at a FreeSewing set changed to match (`--m chest=…,waist=…,seat=…`). `drape-export.mjs`
exports only the design's own parts.

## Hunting coat, 2026-10-25: current ease vs the brief's
The hunting coat's spec keeps Brian's chest/biceps/cuff ease (15/15/20%) because the old code
never applied the brief's 20/25/100% (see its spec). Both drafted and draped:

| | current (15/15/20%) | brief (20/25/100%) |
|---|---|---|
| Drafted chest / biceps / sleeve hem | 115 / 44.7 / **21.0** cm | 120 / 48.6 / 35.0 cm |
| Draped girth below the arms (body 93–99) | 113 cm | 118 cm |
| Body–cloth intersections (GarmentCode's limit 35) | **46: fails** | 7 |
| Self-intersections | none | 4 (not a fail) |
| Frames / time | 348 / 32 s | 364 / 35 s |

Renders: current [front](hunting-coat/current-front.png), [back](hunting-coat/current-back.png);
brief [front](hunting-coat/brief-front.png), [back](hunting-coat/brief-back.png).

- Both sew into a closed coat: every seam joins, shoulders, side seams and sleeves line up, no
  gaps or twisted panels. The converted geometry assembles.
- The torso has plenty of ease either way. The difference is the sleeve: the current 21 cm
  hem is narrower than this body's wrist and than a hand, and the sleeve sits close on the
  arm; the brief's sleeve hangs as a coat sleeve. Simons' work coat sleeve hem is 12 3/4" (32
  cm) at breast 36, which the brief's value matches (the chore coat uses the same).
- The hem falls just above the knee (55 cm off the floor), from `lengthBelowWaist` 190%.
- Outcome: the hunting coat now uses the brief's 20/25/100% (2026-10-25).

## Tailored jacket, 2026-10-25: biceps ease 15% vs 25%
`jacket.yaml` on the female average body (`f_smpl_average_A40`: bust 90, waist 80, hips
107), drafted at `cisFemaleAdult34` with chest 900, waist 800, seat 1070. Back, side back,
front, side front and the two-piece sleeve; collar, lapel (cut off at CF) and facings left off.

| | `bicepsEase` 15% (Breanna's) | 25% (now the jacket's default) |
|---|---|---|
| Body–cloth intersections (limit 35) | 187: fails | 49: fails narrowly |
| Self-intersections | 168 (not a fail) | 9 |
| Frames / time | 769 / 57 s | 393 / 34 s |

Renders: 15% [front](tailored-jacket/biceps15-front.png), [back](tailored-jacket/biceps15-back.png);
25% [front](tailored-jacket/biceps25-front.png), [back](tailored-jacket/biceps25-back.png).
- The body panels assemble: princess seams, side seams and shoulders join, the fronts close
  at CF, the back is smooth, and the panels flare below the waist as Mitchell's do. Draped
  girth over the hips is 107–111 cm on a 101–102 cm body (`seatEase` 10%).
- At 15% the two-piece sleeves can't close round this arm: their seams gape and the arm
  shows through. At 25% they close and hang as jacket sleeves. (35% gave 48 intersections
  and more self-intersection, no better.)
- A ridge across the front at the bust, where the princess seam turned sharply at the two
  dart tips (straight segments): fixed 2026-10-26, below.
- The drape config's seam check caught the two-part sleeve placed mirrored on the first run
  (its front is at -x, the one-piece sleeve's at +x).

## Tailored jacket, 2026-10-26: smoothed princess seams
The princess seams are now smooth curves through the bust (half way between the dart tips),
each pair the same length (worst 0.044 mm over every test size). Re-draped as above.

| | before (straight segments) | smoothed |
|---|---|---|
| Body–cloth intersections (limit 35) | 49 | 49–50 (two runs) |
| Self-intersections | 9 | 4 |

Renders: [front](tailored-jacket/smooth-front.png), [back](tailored-jacket/smooth-back.png);
[the bust before and after](tailored-jacket/bust-before-after.png), same crop.
- **The step at the bust is gone.** Before, the front panels stepped where the seams turned
  at the dart tips; now the seams run through smoothly.
- **A soft line remains at the bust's underside.** A profile down the front (x 5–11 cm)
  shows the cloth 0.4–1 cm off the body over the bust, following it in underneath (1–2.5 cm
  off at 112–116 cm up), then out over the stomach: the cloth meeting the body under the
  bust, as a semi-fitted jacket does. The profile is the same before and after smoothing,
  and with the drafting measurements matched to the body (front and back waist lengths, bust
  height and span, underbust), so it isn't the seams.
- **The intersections are at the wrists.** Cloth vertices inside the body (nearest body
  vertex, against its normal): 14–21 per run, all at the wrists and hands (x ±52–55 cm,
  101–105 cm up): the sleeve hems resting on the wrists, where the hands flare in the A-pose.
  Not changed by the smoothing, the matched measurements or a 3% shorter sleeve. A wider hem
  (`cuffEase` 60%) clears the wrists but presses the sleeve into the upper arm instead (126),
  so the two-part sleeve's 40% stays.

## Box coat, 2026-10-26
`box.yaml` on the female average body, drafted at `cisFemaleAdult34` with chest 900, waist
800, seat 1070: back, front (cut at CF, the neck dart sewn), two-piece sleeve; collar, lapel
and facings left off.

| | sleeves started at z 7 / -9 (the jacket's) | at z 10 / -12 (now in `box.yaml`) |
|---|---|---|
| Body–cloth intersections (limit 35) | 152 | 65 |
| Self-intersections | 83 | – |
| Cloth vertices inside the body | 65: 48 upper arm, 17 wrists | 22: all at the wrists |

Renders: [front](box-coat/front.png), [back](box-coat/back.png).
- The two pieces and the sleeves assemble; the neck darts sew; the coat hangs straight from
  the shoulders, loose all round, the hem level, at mid-calf (Mitchell's 42½" from the nape).
- The box coat's sleeve is bigger than the jacket's (armhole 479 mm against 431), and started
  as close to the arm it began inside the upper arm. Started further out, the only contacts
  left are the sleeve hems at the wrists, as on the jacket.

## Box coat, 2026-10-26: CB seam, buttons, pockets
Re-draped as above after the CB seam (`cbFlare` 1.25%), buttonholes near the edge and set-in
pockets were added. `box.yaml` unchanged: its `centre_back` seam sews the back to its mirror
copy, which suits a CB seam as well as a fold. Pockets, flaps and buttons are left off.

| | before (CB on the fold) | CB seam, straight hem | CB seam, hem squared off CB |
|---|---|---|---|
| Body–cloth intersections (limit 35) | 65 | 54 | 54 |
| Self-intersections (not a fail) | – | 23 | 40 |
| Frames / time | – | 492 / 47 s | 399 / 40 s |

Renders: [front](box-coat/cbseam-front.png), [back](box-coat/cbseam-back.png) (hem squared);
[back with the straight hem](box-coat/cbseam-pointed-back.png).
- The CB seam sews and the back flares out more below the hip, as Mitchell's line does.
- **With a straight hem the back dipped to a shallow point at CB:** the slanted CB met the
  hem at less than a right angle, so the two backs made a V. The hem now leaves the CB
  square and curves on to the side seam (`draftBoxLayout`), and the back hangs level again.
- The front is unchanged: it closes at CF, the neck darts sew, and the hem is level.
- **Where the 54 are:** still only the wrists, as far as anything goes in.
  [`tools/drape_inside.py`](../tools/drape_inside.py) (cloth vertices against the nearest
  body vertex's normal; a proxy for GarmentCode's count, not the same measure):

  | | sleeves at z 10 / -12, CB on the fold | CB seam, hem squared |
  |---|---|---|
  | Wrists and hands | 33, deepest 1.8 cm | 25, deepest 1.8 cm |
  | Front of the thighs (~75 cm up) | 17, deepest 0.1 cm | 19, deepest 0.1 cm |
  | Upper arm by the shoulder | 2, under 0.1 mm | 3, under 0.1 mm |

  The only real penetration is the sleeve hems on the wrists (x ±52–54 cm, 102–105 cm up),
  where the hands flare in the A-pose, as on the tailored jacket. The thigh and shoulder
  points are cloth resting on the body, under a millimetre "in", within the method's noise.
  The CB seam and squared hem changed nothing here. (The first box coat entry's "22: all at
  the wrists" was counted with a depth cut-off; this tool counts every vertex behind the
  surface.)

## All coats with the runner, 2026-10-26
`node tools/drape.mjs <design>` on each design in [runs.yaml](runs.yaml); the three first
drapes of Brian coats, and the three earlier ones re-run.

| Design | Body | Verdict | GarmentCode intersections (limit 35) | Deepest inside, outside the wrists | At the wrists |
|---|---|---|---|---|---|
| chore coat | male | OK | 7 | 0.16 cm (thighs) | 0.26 cm |
| mackinaw | male | OK | 6 | 0.12 cm (thighs) | 0.16 cm |
| peacoat (vent closed) | male | OK | 7 | 0.11 cm (thighs) | 0.13 cm |
| hunting coat | male | OK | 11 | 0.11 cm (thighs) | 0.19 cm |
| tailored jacket | female | OK | 49 | 0.12 cm (thighs) | 1.73 cm |
| box coat | female | OK | 54 | 0.10 cm (thighs) | 1.91 cm |

Renders: [chore coat](chore-coat/front.png) ([back](chore-coat/back.png)),
[mackinaw](mackinaw/front.png) ([back](mackinaw/back.png)), [peacoat](peacoat/front.png)
([back](peacoat/back.png)); the others as above.
- Every one assembles (renders looked at for the three new ones; the others as recorded
  above): seams join, no gaps or twisted panels.
- The Brian coats' one-piece sleeves clear the wrists; the women's two-piece sleeves rest on
  them (the female body's hands flare more in its pose), which is what puts those two over
  GarmentCode's 35. Everywhere else the cloth only touches the body, by about a millimetre.
- Not draped yet: the yoke garments (nightshirt, nightgown, smock, frock, pinafore, shirtwaist
  dress), the barber's and shop coats, the bar vest, the boys' work coat, the military blouse
  and the knickerbockers. The Brian coats among them can use `coat-shell.yaml` once their
  pieces are listed in `runs.yaml`; the others need configs.
