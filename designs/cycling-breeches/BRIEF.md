# Cycling breeches

**Source:** d'Alessio, *The Art of Designing, Cutting and Grading Gentlemen and Boys Clothes* (1906), Fig. 30, plate PDF p. 73, English and Italian instructions printed p. 68 / PDF p. 74, corpus `artofdesigningcu00ales`. US 1906, public domain. **Status:** draft; not sewn.

**Block:** FreeSewing's Titan through `boys-knickers`. The plate has a broad thigh and a straight lower leg gathered into a separate band. That is the knickers construction, while the existing riding breeches narrow to a fitted cuff. The back waist on Titan already rises 1.96 in above its side at the working size, matching d'Alessio's 2 in F rise without a library change.

**Threadloop:** [FreeSewing's Cornelius cycling breeches](https://threadloop.app/patterns/cornelius-cycling-breeches-by-freesewing-org) are free and draft from measurements (2026-11-05). They use the Keystone system; this design follows d'Alessio's Fig. 30. The overlap is deliberate.

## Source and defaults

The text works at proportion 40. The matching `cisMaleAdult40` set has a 16.69 in knee, 41.42 in seat, 10.98 in waist-to-seat and 20.55 in knee-to-floor. The plate confirms the back waist rise and a separate band with buttons.

| Source inch value | Pattern default |
|---|---|
| 21½ in circumference at the knee, including seams | `kneeEase` 29% over the model's knee (21.5 ÷ 16.69 − 1); `knickerFullness` 129% at the lower leg. The drafted lower leg is 21.53 in around before gathering. |
| 30½ in thigh circumference, including seams | `cycleThighWidth` 74% of the model's seat (30.5 ÷ 41.42), adapted to Titan's outseam flare. At the fullest drafted line the front and back total 28.85 in on seam lines; four 10 mm seam allowances bring the cut circumference to 30.42 in. `cycleThighAt` places the flare 25% of fork-to-knee down, ours for a smooth curve. |
| 23 in to knee, 27 in total, so 4 in below the knee | `knickerDrop` 19.5% of the model's knee-to-floor (4 ÷ 20.55). The pattern uses the wearer's knee line rather than forcing the example's 23 in, so the total length at this model is about 30 in. |
| 16 × 3 in band | `cycleBandLength` 96% of the model knee (16 ÷ 16.69); `cycleBandWidth` 27.3% of waist-to-seat (3 ÷ 10.98). A 30 mm overlap for the buttons is added beyond the source's 16 in. |
| F raised 2 in at the back waist | Titan's existing rise is 1.96 in at this model. |

The English text incorrectly pairs 27 in with 62½ cm (27 in is 68.58 cm). The German column gives a different conversion. The inch measurements and plate control this draft.

## Changes and construction

- Titan's fly, pockets, waist darts and waistband are retained. d'Alessio says to start from a usual trouser draft and does not specify their finished construction here.
- The source's band has buttons drawn at one end. The inherited knickers provide a short side opening and a cut strip with 30 mm of button overlap. Button positions on the band are not marked; place them when fitting the band around the wearer's knee.
- The plain variant reduces thigh flare and removes pockets. It is our variant, not another source figure.
- Size scaling follows each wearer's knee and seat. The source's absolute 23 and 27 in vertical stations are not imposed on every body.

**Pieces:** front and back legs, knee bands, waistband, fly pieces, optional pocket pieces and belt loops.

**Sewing order:** sew the fly and pockets, close the inseams and outseams above the short side opening, sew the crotch and waistband, gather each lower leg into its band, then finish the opening and button the band. Check band circumference around the bent knee before fastening.

**Checks:** `test/cycling-breeches.test.mjs` drafts the default, plain and long versions across the size sets, matching the leg seams and waistband and checking the gathering marks, band size and source-size thigh width. The pattern was rendered beside Fig. 30 and at child and stout sizes.
