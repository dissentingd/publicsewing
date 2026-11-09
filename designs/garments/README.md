# The garment family tree

A map of garment types and of the elements they're built from, checked against what the library can
build. It turns "what should we make next?" from a survey into a lookup. [COVERAGE.md](COVERAGE.md) is
the generated view: start there.

## The two files
- **[tree.yaml](tree.yaml): garment types, by descent.** A zone (upper body, lower body, whole body,
  outerwear, sleepwear and underwear, accessories), then classes, families and named types. Each type
  lists its **traits**: the elements it needs. Types we've built list their designs and variants.
- **[elements.yaml](elements.yaml): the traits.** Body structures, sleeves, cuffs, necklines,
  collars, closures, pockets, yokes, shaping, skirts, legs, waists, hems and finishes. Each has a
  status (covered, partial or gap), the library operations or piece types that build it, and the
  designs it's **seen** in.

Garments aren't a pure tree: a yoke turns up on shirts, jeans and jackets. So the tree gives descent,
and the traits cut across it.

## Coverage
`node tools/garments.mjs` works out each type's coverage and writes COVERAGE.md:
- **built:** we have a design or variant of it;
- **buildable:** every trait is covered, so it needs a spec, sources and tests, but no new library code;
- **partly buildable:** a trait is partial;
- **blocked:** a trait is missing, or it's cut from knit cloth, which our blocks don't handle.

The top table ranks missing elements by how many unbuilt types each blocks. Build those first: each one
unlocks a branch.

"Buildable" means the library has the parts, not that the proportions are known. Proportions still come
from a source where there is one. Otherwise they come from the designs an element is **seen** in, whose
defaults are sourced and tested, and the brief says so.

## Using it
- **Planning a garment:** find its type, read its traits, and open the designs each trait is seen in.
  Those are the specs to copy from and the defaults to reuse.
- **Filling a gap:** build the element as an option or operation, add it to a design as a variant so
  it's tested, then set its status to `covered` with `lib` and `seen`.
- **Finishing a design:** add it to its type's `designs` (the test fails until every design is in the
  tree), and regenerate: `node tools/garments.mjs`.
- **Adding types:** add nodes under the right parent with their traits, then regenerate.

`test/garments.test.mjs` checks that every covered element names real operations and designs, that
every design is in the tree, and that COVERAGE.md is current.

## Sources
The organisation and vocabulary were cross-checked against two open datasets; the entries, traits and
coverage are ours.
- This dataset contains information from the [Art & Architecture Thesaurus (AAT)®](https://www.getty.edu/research/tools/vocabularies/aat/),
  which is made available under the [ODC Attribution License](https://opendatacommons.org/licenses/by/1-0/).
- [Fashionpedia](https://fashionpedia.github.io/home/) (Jia et al., ECCV 2020): its ontology of
  apparel categories, parts and attributes, under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Also worth consulting: Wikidata's clothing classes (CC0), and GarmentCode's component model (MIT)
for how types map onto draped parts.
