# Bowl

Bibimbap Builder — pick a flavour and a protein, get a randomised bibimbap bowl, then swap or re-roll any segment. The shopping list and method rebuild to match.

Live at https://bowl.duncanwilcox.com.au

- Single static page: `index.html` (no build step).
- Recipe data lives in the `CUISINES` and `PROTEINS` blocks at the top of the script. Add a cuisine by copying one entry; each needs at least 5 toppings in `veg`.
- Ingredient format: `"qty unit|name|aisle"`, quantities for 2 serves. Aisles: P fruit & veg, M butcher, E fridge, R rice & grains, I specialty, S pantry. `{s}` in a name pluralises counted items.
- Deployed by Cloudflare Pages from `main` (no build command, output directory `/`).
