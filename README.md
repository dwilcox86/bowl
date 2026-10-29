# Bowl

Bibimbap Builder. Pick a flavour and a protein, get a randomised bibimbap in a stone bowl, then swap, re-roll or lock any segment. The shopping list and method rebuild to match, and "Mix it" stirs the bowl.

Live at https://bowl.duncanwilcox.com.au

## Structure
- `index.html` – app shell
- `css/styles.css` – styles (light and dark)
- `js/data.js` – cuisines, proteins, ingredients, photo manifest
- `js/bowl.js` – canvas renderer: shaded ingredient sprites, rice bed, stone dolsot on a wooden trivet, animations, thumbnails, celadon side dishes and brass cutlery
- `js/app.js` – state, annotated labels and leader lines, swap card, locks, market list, method, keyboard shortcuts (S shuffle, M mix), shareable links (`#c=…&p=…`)
- `img/` – optional ingredient photos (see `img/README.md`)

No build step. Cloudflare Pages: build command blank, output directory `/`.

## Adding recipes
Copy an entry in `CUISINES`. Each cuisine needs at least 5 toppings in `veg`. Ingredient strings are `"qty unit|name|aisle"` for 2 serves; aisles are P fruit & veg, M butcher, E fridge, R rice & grains, I specialty, S pantry. `{s}` pluralises counted items; `{f/ves}` gives singular/plural endings. Textures (`t`): strip, leaf, chunk, meat, cube, dot, slice, shred, sprout, mush, curl, mash.

Each cuisine also has `styles`: how the protein is seasoned and cooked (e.g. Thai: lemongrass, red curry, green curry, satay, larb, garlic pepper, krapow). The protein segment's colour comes from the style's `glaze`.
