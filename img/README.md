# Ingredient photos

Any ingredient can use a real photo instead of the drawn version.

1. Save a square, top-down photo with the food filling the frame as `img/<id>.webp` (about 800 × 800 is plenty).
2. Add the id to `PHOTOS` in `js/data.js`, e.g. `new Set(['korean-kimchi'])`.

Ids are `<cuisine>-<name slug>`, e.g. `jamaican-fried-sweet-plantain`. Hover a row in the "In the bowl" tab to see its id.
The photo fills that segment, appears in thumbnails, and gets chopped into pieces when the bowl is mixed.
Only use photos you have the rights to.
