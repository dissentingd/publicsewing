# Pattern maps and construction instructions

The chore coat is the first annotated design page. Its seven existing piece numbers, matching seam codes, pocket marks, and construction steps provide a reviewable example. The overlay is positioned for one default preview image; the next implementation must derive labels from pattern geometry so that each size and variant stays aligned.

## Design-local pilot records

The skirt coat and pantry jacket now have draft `construction.yaml` records. They currently use `design`, `shellDrape`, `pieceSources`, `seams`, `placements`, and `finishing`. Treat these as source data for the shared schema or migrate them explicitly; do not silently rename fields in one design. Their `seams` entries reference existing drape seam IDs and proposed stitch/finish methods. `placements` records pocket and closure sources. The pantry jacket identifies buttonholes whose draft marks are still missing. The 3D drape inputs currently cover shell joins, while pocket mark paths and stitch types still need an export path. Add structured `steps` and stable displayed piece numbers when the shared pipeline is implemented.

## 1. Define the shared data

- Give every visible cut piece a stable number in the design spec. Record its name, cut quantity, material, fold, and option conditions. Check numbers against the titles printed by the draft.
- Define named seam segments on the drafted pieces. Each seam code identifies the joining edges on both pieces, its notches, stitch type, and any special finish. Mark placement lines separately from joining seams, as the chore coat does with P6 and P7.
- Record pocket mouths and flaps, button and buttonhole positions, and other closure marks as drafted geometry with stable IDs. The skirt coat and pantry jacket need these records for future 3D renders as well as page instructions.
- Keep this metadata with the design rather than in page CSS or pixel coordinates. Validate unique piece numbers and seam codes, and reject references to missing or option-disabled pieces.

## 2. Generate the map from the draft

- Extend the preview/export pipeline to place labels on the actual seam paths and placement marks after the pieces are laid out. Resolve collisions with cut lines, notches, grain arrows, and the existing title block.
- Render the same labels in the page preview and in the exported SVG and PDF. Carry seam joins, pocket placements, buttonholes, and stitch/finish codes into the 3D render input. Include a text key and a compact stitch legend beside the preview and in print-friendly instructions. Keep the diagram readable when scaled to a phone.
- Rebuild maps for the default and each published variant. Do not reuse coordinates from another size or option set. Show only active pieces and marks.

## 3. Connect construction text

- Store construction steps in structured data, with explicit piece-number, seam-code, and stitch-type references, while keeping explanatory prose in each design's brief. Generate the page steps and key from that data.
- Review the sewing order against the source and the drafted pieces. Identify proposed methods when the source does not specify assembly. Include preparation, joins, closures, and finishing in the order they are performed.
- Handle optional parts with conditional steps: a pocket, lining, sleeve, or closure appears only when its option is enabled. Keep the default page clear and provide variant-specific changes near each variant.
- Add a validation check that every referenced piece, seam, and stitch code exists and that each required joining seam is accounted for. Review stitch choice and finish for the fabric and garment; geometric checks alone cannot establish a workable assembly sequence.

## 4. Roll out by garment family

1. Refine the chore coat after review. Use it to establish the data schema, label placement rules, and page component.
2. Apply the schema to related work coats and jackets that reuse its body, sleeve, collar, and facing. Reuse shared seam definitions where their geometry is the same.
3. Continue with skirts and trousers, then dresses, shirts, outerwear, and other constructions. Audit each design's source brief before writing steps; do not infer a missing closure or finish as a source fact.
4. For every garment, inspect a default adult size, a child or stout size where supported, and option variants that change pieces. Compare the map with the exported cut pieces and check it at desktop and phone widths.

## 5. Page cleanup and completion criteria

- Keep the pattern map readable at full page width; let users enlarge it without losing the label key. Separate the finished-garment illustration, cut-piece map, construction, pattern editor, variants, and source notes with consistent headings and spacing.
- Test navigation anchors, keyboard access, screen-reader text for each code, light and dark themes, and print layout. Remove unrelated editor prompts from the map area only if they obscure the page in normal use.
- A design is complete when its preview, cut exports, and 3D render input agree on piece, seam, placement, closure, and stitch codes; every construction reference resolves; applicable variants regenerate correctly; the site builds; and a reviewer can follow the sequence on a test garment.
