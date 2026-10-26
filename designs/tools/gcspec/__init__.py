"""GarmentCode specification builder for the 3D drapes (tools/drape_spec.py).

Copied 2026-10-26 from the archived pipeline (archive/ccat: garmentcode.py, geom.py), so the
drape tools don't depend on the archive. Seams are stitched and pieces placed by a drape
config (designs/drape/*.yaml); points are named "<piece>.<point>".
"""


class RecipeError(ValueError):
    """A drape config that doesn't match the outlines (unknown piece or point, bad seam)."""
