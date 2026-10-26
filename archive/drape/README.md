# 3D drapes (GarmentCode)

Drapes of catalog garments in the `garmentcode` container on Cloudbox, as a check that
the pieces sew into the garment. Not a fit result unless the body matches the size.
How to rerun: `scripts/drape_export.py` writes the spec; `docker/ccat_sim.py` drapes it
(see CLAUDE.md, "GarmentCode drape").

## emko-jacket-imk-176-100-88 (2026-10-20, commit ecfc15b)
- Body: `m_smpl_average_A40` (GarmentCode's male average: height 178, chest 100,
  **waist 80**). The jacket is drafted for 176-100-88, so the waist doesn't match.
- 10 panels (ИМК back, side panel, front, top and under sleeve, right and left),
  664 stitches, 15,063 mesh vertices. 540 frames in 35 s; 4 body–cloth
  intersections (GarmentCode's limit is 35); no self-intersections.
- Renders: [front](emko-jacket-imk-176-100-88/render_front.png),
  [back](emko-jacket-imk-176-100-88/render_back.png). The pieces sew into a jacket:
  centre back, shoulder darts, side panels between seams A and B, two-piece sleeves
  reaching the wrist, hem at hip level.
- Not modelled: the collar and lapel (not built), fastening (the front hangs open),
  and the pocket dart, which is closed on the drape panel because its bent legs
  cross in the flat drawing.
- **Fit not assessed.** Waist cross-sections show ~122 cm of jacket around a 91–95 cm
  body, but those hulls include the open front's chord and the jacket's hang, and the
  body's waist is 8 cm under the size's. Next: drape on a body matched to 176-100-88
  (GarmentCodeData v2 has 5,000 bodies with measurements), with the front closed.
