// Recipe data for Bibimbap Builder.
// Ingredient strings: "qty unit|name|aisle" for 2 serves. {s}/{es} pluralise counted items.
// Aisles: P fruit & veg, M butcher, E fridge, R rice & grains, I specialty, S pantry.
// Textures (t): strip, leaf, chunk, meat, cube, dot, slice, shred, sprout, mush, curl, mash.

export const AISLES = { P: 'Fruit & veg', M: 'Butcher & seafood', E: 'Fridge & eggs', R: 'Rice & grains', I: 'Specialty aisle', S: 'Pantry' };
export const AISLE_ORDER = ['P', 'M', 'E', 'R', 'I', 'S'];

// Option ids that have a photo at img/<id>.webp (top-down, square, food filling the frame).
// Example: 'korean-kimchi'. Ids are "<cuisine id>-<option name slug>"; the Bowl tab shows each id on hover.
export const PHOTOS = new Set([]);

const O = (n, c, t, p, i, x = {}) => Object.assign({ n, c, t, p, i }, x);
const eggFried = () => O('Fried egg', '#fbf7ec', 'egg', 'Fry sunny-side up in a little oil until the white is set and the edges crisp.', ['2|egg{s}|E']);
const eggJammy = () => O('Jammy soft egg', '#fbf7ec', 'jammy', 'Boil 6½ minutes, cool in iced water, peel and halve.', ['2|egg{s}|E']);

export const PROTEINS = {
  beef: { n: 'Beef', w: 'beef', c: '#6e3524', t: 'meat', i: ['300 g|beef scotch fillet|M'], cut: 'Slice the beef as thinly as you can across the grain (15 minutes in the freezer helps).', cook: 'Sear in batches over high heat, about a minute a side, until caramelised.' },
  chicken: { n: 'Chicken', w: 'chicken', c: '#c4874a', t: 'chunk', i: ['350 g|chicken thigh fillets|M'], cut: 'Cut the thighs into bite-size pieces.', cook: 'Cook over medium-high heat for 6–8 minutes, turning, until cooked through and charred at the edges.' },
  pork: { n: 'Pork', w: 'pork', c: '#b4684a', t: 'meat', i: ['300 g|pork neck|M'], cut: 'Slice the pork thinly.', cook: 'Sear 2–3 minutes a side until caramelised and cooked through.' },
  prawns: { n: 'Prawns', w: 'prawns', c: '#ef8a5d', t: 'curl', i: ['300 g|raw peeled prawns|M'], cut: 'Devein the prawns and pat them dry.', cook: 'Sear over high heat 1–2 minutes a side until just pink.' },
  tofu: { n: 'Tofu', w: 'tofu', c: '#e6c487', t: 'cube', plant: true, i: ['300 g|firm tofu|E'], cut: 'Press the tofu for 15 minutes, then cut into 2 cm cubes.', cook: 'Pan-fry the tofu in a little oil until golden on all sides.' },
  mushrooms: { n: 'Mushrooms', w: 'mushrooms', c: '#a07a52', t: 'mush', plant: true, i: ['300 g|king oyster mushrooms|P'], cut: 'Tear or thickly slice the mushrooms.', cook: 'Sear the mushrooms in a hot, dry pan until well browned.' }
};

export const CUISINES = [
{ id: 'korean', n: 'Traditional', sub: 'Korean classic', style: 'Bulgogi', glaze: '#6a2414', palette: ['#c8381f', '#2f6b2f', '#efe3ae'],
  mar: { how: 'Grate the pear and garlic into the soy, brown sugar and sesame oil.', i: ['2 tbsp|soy sauce|S', '1 tbsp|brown sugar|S', '2 tsp|sesame oil|S', '2|garlic clove{s}|P', '0.25|nashi pear{s}|P'] },
  base: [
    O('Short-grain white rice', '#f4f1e8', 'rice', 'Rinse until the water runs clear, then cook with 1.1 parts water. Rest 10 minutes covered.', ['1 cup|short-grain rice|R']),
    O('Multigrain japgokbap', '#e2d6c4', 'rice', 'Soak the rice and grains 30 minutes, then cook with a splash more water than usual.', ['0.75 cup|short-grain rice|R', '0.25 cup|mixed grains (barley, black rice)|R'], { fleck: '#4b2338' }),
    O('Crispy dolsot rice', '#efdcb8', 'rice', 'Cook the rice, press into an oiled very hot pan or stone bowl and leave 5 minutes until a golden crust forms.', ['1 cup|short-grain rice|R', '1 tbsp|sesame oil|S'], { fleck: '#c58a3c', crust: true })],
  veg: [
    O('Seasoned spinach', '#2f6b2f', 'leaf', 'Blanch 30 seconds, squeeze dry, toss with sesame oil, garlic and a pinch of salt.', ['1 bunch|English spinach|P', '1 tsp|sesame oil|S', '1|garlic clove{s}|P']),
    O('Soybean sprouts', '#efe3ae', 'sprout', 'Boil 5 minutes with the lid on, drain, dress with sesame oil and salt.', ['150 g|soybean sprouts|P', '1 tsp|sesame oil|S'], { head: '#e3c94a' }),
    O('Sautéed carrot', '#e8742a', 'strip', 'Julienne and stir-fry 1 minute with a pinch of salt.', ['1|carrot{s}|P']),
    O('Zucchini half-moons', '#6e9a3a', 'slice', 'Slice thinly, salt 10 minutes, pat dry and sauté until just soft.', ['1|zucchini|P'], { flesh: '#e4ecc0' }),
    O('Shiitake', '#5e3b26', 'mush', 'Slice and stir-fry with a splash of soy and sugar until glossy.', ['6|fresh shiitake mushroom{s}|P', '1 tsp|soy sauce|S']),
    O('Kimchi', '#c8381f', 'shred', 'Snip into bite-size pieces. Fry 2 minutes if you like it softer.', ['120 g|cabbage kimchi|E'], { core: '#f2d9b8' }),
    O('Gosari', '#6b4a2b', 'strip', 'Rehydrate, simmer 15 minutes, then stir-fry with soy, garlic and sesame oil.', ['30 g|dried gosari (fernbrake)|I', '1 tsp|soy sauce|S', '1|garlic clove{s}|P']),
    O('Cucumber namul', '#4f8a3a', 'slice', 'Slice thinly, salt 10 minutes, squeeze, then dress with gochugaru and sesame.', ['1|Lebanese cucumber{s}|P', '0.5 tsp|gochugaru|I'], { flesh: '#d9ebbf' }),
    O('Spicy radish', '#e7b4a2', 'strip', 'Julienne the daikon and toss with gochugaru, vinegar, sugar and salt.', ['150 g|daikon|P', '1 tsp|gochugaru|I', '1 tsp|rice vinegar|S'])],
  centre: [eggFried(),
    O('Raw egg yolk', '#f2a51b', 'yolk', 'Separate a very fresh egg and slip the yolk onto the hot rice just before serving.', ['2|egg{s}|E']),
    eggJammy()],
  sauce: [
    O('Gochujang sauce', '#b8261b', 's', 'Whisk gochujang, sesame oil, sugar, vinegar and a little water until smooth.', ['2 tbsp|gochujang|I', '1 tsp|sesame oil|S', '1 tsp|sugar|S', '1 tsp|rice vinegar|S']),
    O('Ssamjang', '#7a4a22', 's', 'Mix doenjang, gochujang, sesame oil and a little crushed garlic.', ['1 tbsp|doenjang|I', '1 tsp|gochujang|I', '1 tsp|sesame oil|S'], { fleck: '#f1e4c0' }),
    O('Soy-sesame yangnyeom', '#3b2414', 's', 'Stir soy, gochugaru, sliced spring onion, sesame and a pinch of sugar.', ['2 tbsp|soy sauce|S', '0.5 tsp|gochugaru|I', '1|spring onion{s}|P'], { fleck: '#6aa34a' })],
  garnish: [
    O('Sesame and gim', '#1d271d', 'g', 'Snip roasted seaweed into strips and scatter with toasted sesame.', ['5 g|roasted seaweed (gim)|I', '1 tsp|toasted sesame seeds|S'], { mix: [['nori', '#1d271d'], ['seed', '#f1e4c0']] }),
    O('Spring onion', '#5a9a3a', 'g', 'Slice finely on the diagonal.', ['2|spring onion{s}|P'], { mix: [['ring', '#5a9a3a'], ['ring', '#9cc96a']] }),
    O('Gochugaru and sesame', '#b32a16', 'g', 'Mix chilli flakes with toasted sesame seeds.', ['0.5 tsp|gochugaru|I', '1 tsp|toasted sesame seeds|S'], { mix: [['flake', '#b32a16'], ['seed', '#f1e4c0']] })] },

{ id: 'chinese', n: 'Chinese', sub: 'Cantonese-leaning', style: 'Char siu', glaze: '#8c1f14', palette: ['#8c1f14', '#2e6b3a', '#f1d98c'],
  mar: { how: 'Whisk hoisin, soy, honey, Shaoxing wine, five spice and crushed garlic.', i: ['2 tbsp|hoisin sauce|S', '1 tbsp|soy sauce|S', '1 tbsp|honey|S', '1 tbsp|Shaoxing wine|I', '0.5 tsp|Chinese five spice|S', '2|garlic clove{s}|P'] },
  base: [
    O('Steamed jasmine rice', '#f5f2ea', 'rice', 'Rinse twice and cook with 1.25 parts water. Rest 10 minutes.', ['1 cup|jasmine rice|R']),
    O('Ginger-scallion rice', '#ecebd0', 'rice', 'Cook the rice, then fold through ginger and spring onion sizzled in hot oil.', ['1 cup|jasmine rice|R', '20 g|ginger|P', '2|spring onion{s}|P'], { fleck: '#6aa34a' }),
    O('Egg fried rice', '#f1d98c', 'rice', 'Use day-old rice. Scramble an egg in a smoking wok, add rice and soy, and toss until smoky.', ['1 cup|jasmine rice|R', '1|egg{s}|E', '1 tbsp|soy sauce|S'], { fleck: '#f3b21e' })],
  veg: [
    O('Garlic gai lan', '#2e6b3a', 'leaf', 'Blanch 1 minute, then toss with garlic oil and oyster sauce.', ['1 bunch|gai lan|P', '1|garlic clove{s}|P', '1 tbsp|oyster sauce|S']),
    O('Smashed cucumber', '#5f9a50', 'chunk', 'Smash, cut into chunks, dress with black vinegar, garlic and chilli oil.', ['1|Lebanese cucumber{s}|P', '1 tbsp|Chinkiang black vinegar|I']),
    O('Baby bok choy', '#7cb85a', 'leaf', 'Halve, then stir-fry 2 minutes with ginger and a splash of water.', ['2|baby bok choy|P', '10 g|ginger|P']),
    O('Wood ear mushrooms', '#2a1c18', 'shred', 'Soak 20 minutes, trim, then dress with vinegar, soy and chilli.', ['15 g|dried wood ear mushrooms|I', '1 tsp|soy sauce|S'], { core: '#4a362e' }),
    O('Sichuan bean sprouts', '#eee8c4', 'sprout', 'Stir-fry 30 seconds over high heat with a pinch of ground Sichuan pepper.', ['150 g|mung bean sprouts|P', '0.25 tsp|Sichuan pepper|I'], { head: '#cfdc8a' }),
    O('Snow peas', '#7cb342', 'strip', 'Trim and stir-fry 1 minute with garlic until bright green.', ['100 g|snow peas|P']),
    O('Wombok slaw', '#dfe8bf', 'shred', 'Shred finely and toss with rice vinegar, sesame oil and a pinch of sugar.', ['0.25|wombok (Chinese cabbage)|P', '1 tsp|rice vinegar|S'], { core: '#f6f6e4' }),
    O('Zha cai', '#a8a24a', 'shred', 'Rinse the pickled mustard stem and slice thinly.', ['50 g|zha cai (pickled mustard stem)|I'], { core: '#c9b96a' }),
    O('Garlic eggplant', '#5a2d5c', 'chunk', 'Cut into fingers, fry until soft, then glaze with garlic and soy.', ['1|eggplant{s}|P'])],
  centre: [
    O('Crispy fried egg', '#fbf7ec', 'eggx', 'Fry in plenty of hot oil, spooning it over until the edges go lacy and brown.', ['2|egg{s}|E']),
    O('Soy-marinated egg', '#c9935a', 'jammy', 'Boil 7 minutes, peel, then soak in soy, sugar and star anise for 2 hours.', ['2|egg{s}|E', '1|star anise|S']),
    O('Tea egg', '#9a6a3a', 'jammy', 'Boil 8 minutes, crack the shells all over, then simmer 30 minutes in tea, soy and five spice.', ['2|egg{s}|E', '1|black tea bag{s}|S'], { marble: true })],
  sauce: [
    O('Chilli crisp', '#9c2a14', 's', 'Stir the jar well and spoon out plenty of the crunchy bits.', ['2 tbsp|chilli crisp|I'], { fleck: '#3a0f08' }),
    O('Ginger-scallion oil', '#b9c46a', 's', 'Pour smoking-hot oil over minced ginger, spring onion and salt.', ['20 g|ginger|P', '3|spring onion{s}|P', '3 tbsp|neutral oil|S'], { fleck: '#4f8a2a' }),
    O('Black vinegar dressing', '#3a2016', 's', 'Mix black vinegar, soy, sugar, garlic and a little chilli oil.', ['1 tbsp|Chinkiang black vinegar|I', '1 tbsp|soy sauce|S', '1 tsp|sugar|S'])],
  garnish: [
    O('Coriander and spring onion', '#4c8c34', 'g', 'Pick the coriander leaves and slice the spring onion finely.', ['0.5 bunch|coriander|P', '1|spring onion{s}|P'], { mix: [['herb', '#4c8c34'], ['ring', '#8cc06a']] }),
    O('Roasted peanuts', '#c49155', 'g', 'Roughly crush and scatter.', ['30 g|roasted peanuts|S'], { mix: [['flake', '#c49155'], ['flake', '#e3bb83']] }),
    O('Fried shallots', '#b9793a', 'g', 'Scatter straight from the jar.', ['2 tbsp|fried shallots|I'], { mix: [['flake', '#b9793a'], ['flake', '#8a5524']] })] },

{ id: 'jamaican', n: 'Jamaican', sub: 'Jerk and island heat', style: 'Jerk', glaze: '#3e1e0c', palette: ['#3e1e0c', '#f2b632', '#2f5f2a'],
  mar: { how: 'Blend jerk paste with lime juice, allspice, thyme leaves, seeded scotch bonnet and garlic.', i: ['2 tbsp|jerk seasoning paste|S', '1|lime{s}|P', '0.5 tsp|ground allspice|S', '3|thyme sprig{s}|P', '0.5|scotch bonnet chilli{s}|P', '2|garlic clove{s}|P'] },
  base: [
    O('Rice and peas', '#ddc9b5', 'rice', 'Simmer rice with kidney beans, coconut milk, thyme, allspice and a whole scotch bonnet (do not burst it).', ['1 cup|long-grain rice|R', '200 ml|coconut milk|S', '0.5 can|kidney beans|S'], { fleck: '#6e1f22', big: true }),
    O('Coconut rice', '#f4efe2', 'rice', 'Cook the rice in half coconut milk, half water, with a pinch of salt.', ['1 cup|long-grain rice|R', '200 ml|coconut milk|S']),
    O('Steamed long-grain rice', '#f5f2ea', 'rice', 'Rinse and cook with 1.5 parts water. Rest 10 minutes.', ['1 cup|long-grain rice|R'], { long: true })],
  veg: [
    O('Fried sweet plantain', '#d98b2b', 'chunk', 'Slice ripe, black-spotted plantain on the diagonal and fry until caramelised.', ['1|ripe plantain{s}|P'], { char: true }),
    O('Callaloo', '#2f5f2a', 'leaf', 'Sauté with onion, garlic and thyme until wilted. Spinach works if you can’t find callaloo.', ['1 bunch|callaloo or English spinach|P', '0.5|brown onion{s}|P']),
    O('Escovitch pickle', '#e5a33a', 'strip', 'Boil vinegar, allspice and sugar and pour over sliced carrot, onion and chilli. Cool.', ['1|carrot{s}|P', '0.5|red onion{s}|P', '100 ml|white vinegar|S']),
    O('Mango and red onion', '#f2b632', 'chunk', 'Dice and toss with lime and a pinch of salt.', ['1|mango{es}|P', '0.25|red onion{s}|P']),
    O('Charred corn', '#f0c94a', 'dot', 'Char the cob in a grill pan or over a flame, then slice off the kernels.', ['1|corn cob{s}|P'], { char: true }),
    O('Steamed cabbage', '#cfdca0', 'shred', 'Shred and steam with carrot, onion and thyme until tender.', ['0.25|green cabbage|P'], { core: '#eef2d8' }),
    O('Charred pineapple', '#f4cf5e', 'chunk', 'Cut into wedges and char in a very hot pan.', ['0.25|pineapple{s}|P'], { char: true }),
    O('Roast sweet potato', '#d9692e', 'chunk', 'Dice, toss with oil and allspice, and roast 25 minutes at 220°C.', ['1|sweet potato{es}|P'], { char: true }),
    O('Avocado', '#9db84a', 'slice', 'Slice and season with lime and salt.', ['1|avocado{s}|P'], { flesh: '#d8e39a', skin: '#3d5a22' })],
  centre: [eggFried(),
    O('Sautéed ackee', '#f5d24a', 'blob', 'Drain canned ackee and fold gently through sautéed onion, tomato and capsicum.', ['0.5 can|ackee|I', '1|tomato{es}|P']),
    O('Fried dumpling', '#c8914a', 'disc', 'Knead flour, salt, baking powder and water, shape into discs and shallow-fry until golden.', ['1 cup|plain flour|S', '0.5 tsp|baking powder|S'])],
  sauce: [
    O('Scotch bonnet sauce', '#d9481c', 's', 'Blend scotch bonnet, vinegar, a little carrot, garlic and sugar.', ['1|scotch bonnet chilli{s}|P', '2 tbsp|white vinegar|S'], { fleck: '#f2a03a' }),
    O('Mango-lime dressing', '#f0a830', 's', 'Blend mango with lime juice and a pinch of salt.', ['0.5|mango{es}|P', '1|lime{s}|P']),
    O('Jerk BBQ glaze', '#5a2614', 's', 'Simmer jerk paste, ketchup, brown sugar and lime for 5 minutes.', ['1 tbsp|jerk seasoning paste|S', '2 tbsp|tomato ketchup|S', '1 tbsp|brown sugar|S'])],
  garnish: [
    O('Spring onion and thyme', '#5a9a3a', 'g', 'Slice the spring onion and strip the thyme leaves.', ['2|spring onion{s}|P', '2|thyme sprig{s}|P'], { mix: [['ring', '#5a9a3a'], ['herb', '#3f6a2a']] }),
    O('Toasted coconut', '#efe4cc', 'g', 'Toast in a dry pan until golden at the edges.', ['2 tbsp|desiccated coconut|S'], { mix: [['flake', '#f4ecd8'], ['flake', '#d9b884']] }),
    O('Lime and coriander', '#4c8c34', 'g', 'Pick coriander leaves and cut the lime into wedges.', ['1|lime{s}|P', '0.5 bunch|coriander|P'], { mix: [['herb', '#4c8c34'], ['herb', '#a9cf52']] })] },

{ id: 'mexican', n: 'Mexican', sub: 'Chipotle and lime', style: 'Chipotle', glaze: '#6a2412', palette: ['#d8432b', '#8fae3e', '#2a2230'],
  mar: { how: 'Blend chipotles with cumin, oregano, garlic and lime juice.', i: ['2|chipotle{s} in adobo|I', '1 tsp|ground cumin|S', '1 tsp|dried oregano|S', '2|garlic clove{s}|P', '1|lime{s}|P'] },
  base: [
    O('Cilantro-lime rice', '#e9eed8', 'rice', 'Cook the rice, then fold through chopped coriander, lime zest and juice.', ['1 cup|long-grain rice|R', '0.5 bunch|coriander|P', '1|lime{s}|P'], { fleck: '#4c8c34', long: true }),
    O('Mexican red rice', '#e3a77a', 'rice', 'Fry the rice until golden, then simmer with blended tomato, onion and garlic.', ['1 cup|long-grain rice|R', '1|tomato{es}|P', '0.5|brown onion{s}|P'], { long: true }),
    O('Rice and black beans', '#d5cdc4', 'rice', 'Cook the rice, then fold through warmed black beans and a pinch of cumin.', ['1 cup|long-grain rice|R', '0.5 can|black beans|S'], { fleck: '#241d29', big: true, long: true })],
  veg: [
    O('Pickled red onion', '#c94a86', 'shred', 'Slice thinly and cover with lime juice, vinegar, salt and sugar for 20 minutes.', ['1|red onion{s}|P', '60 ml|white vinegar|S'], { core: '#f2c6dc' }),
    O('Charred corn', '#f0c94a', 'dot', 'Char the cob in a grill pan, slice off the kernels, finish with lime and chilli.', ['1|corn cob{s}|P'], { char: true }),
    O('Black beans', '#2a2230', 'dot', 'Warm with cumin, garlic and a squeeze of lime.', ['1 can|black beans|S']),
    O('Pico de gallo', '#d8432b', 'chunk', 'Dice tomato, onion, jalapeño and coriander. Season with lime and salt.', ['2|tomato{es}|P', '1|jalapeño{s}|P'], { small: true }),
    O('Guacamole', '#8fae3e', 'mash', 'Mash avocado with lime, salt and finely diced onion.', ['1|avocado{s}|P', '1|lime{s}|P']),
    O('Red cabbage slaw', '#7a2f6a', 'shred', 'Shred finely and toss with lime and salt.', ['0.25|red cabbage|P'], { core: '#e8d4ea' }),
    O('Poblano rajas', '#3f6a2a', 'strip', 'Char, peel and slice into strips, then sauté with onion.', ['2|poblano or green capsicum{s}|P'], { char: true }),
    O('Radishes', '#d94a6a', 'slice', 'Slice paper-thin and keep in iced water until serving.', ['4|radish{es}|P'], { flesh: '#fbf3f1' }),
    O('Calabacitas', '#7aa04a', 'slice', 'Sauté diced zucchini with corn, onion and a pinch of cumin.', ['1|zucchini|P'], { flesh: '#e8efc4' })],
  centre: [
    O('Fried egg', '#fbf7ec', 'egg', 'Fry sunny-side up in a little oil until the white is set and the edges crisp.', ['2|egg{s}|E']),
    eggJammy(),
    O('Queso fresco', '#f6f3ea', 'crumble', 'Crumble over the centre of the bowl.', ['80 g|queso fresco or feta|E'])],
  sauce: [
    O('Salsa verde', '#6f9a2e', 's', 'Blend tomatillos with jalapeño, coriander and lime.', ['200 g|canned tomatillos|I', '1|jalapeño{s}|P'], { fleck: '#3f6a1a' }),
    O('Chipotle crema', '#d9935e', 's', 'Stir chipotle and adobo through sour cream with a squeeze of lime.', ['100 g|sour cream|E', '1|chipotle{s} in adobo|I']),
    O('Salsa roja', '#a8301c', 's', 'Blend charred tomatoes, garlic, onion and a dried chilli.', ['2|tomato{es}|P', '1|garlic clove{s}|P'], { fleck: '#5a1408' })],
  garnish: [
    O('Coriander and lime', '#4c8c34', 'g', 'Pick the coriander and cut the lime into wedges.', ['0.5 bunch|coriander|P', '1|lime{s}|P'], { mix: [['herb', '#4c8c34'], ['herb', '#a9cf52']] }),
    O('Toasted pepitas', '#5f7a3a', 'g', 'Toast in a dry pan until they start to pop.', ['2 tbsp|pepitas|S'], { mix: [['seed', '#5f7a3a'], ['seed', '#8aa45a']] }),
    O('Tortilla strips', '#e6c27a', 'g', 'Slice corn tortillas into strips and fry until crisp.', ['2|corn tortilla{s}|R'], { mix: [['nori', '#e6c27a'], ['nori', '#c99a4a']] })] },

{ id: 'japanese', n: 'Japanese', sub: 'Teriyaki and pickles', style: 'Teriyaki', glaze: '#4a200e', palette: ['#f2d23a', '#3f6a3a', '#ee8a4a'],
  mar: { how: 'Stir soy, mirin, sake, sugar and grated ginger until the sugar dissolves.', i: ['2 tbsp|soy sauce|S', '2 tbsp|mirin|I', '1 tbsp|sake|I', '1 tsp|sugar|S', '10 g|ginger|P'] },
  base: [
    O('Steamed Japanese rice', '#f5f3ec', 'rice', 'Rinse until clear, soak 30 minutes, then cook with 1.1 parts water.', ['1 cup|Japanese short-grain rice|R']),
    O('Sushi rice', '#f2eee2', 'rice', 'Fold seasoned rice vinegar and sugar through the warm rice while fanning it.', ['1 cup|Japanese short-grain rice|R', '2 tbsp|rice vinegar|S', '1 tsp|sugar|S']),
    O('Brown rice', '#cfb592', 'rice', 'Simmer 30 minutes, then rest 10 minutes off the heat.', ['1 cup|brown rice|R'], { fleck: '#9a7650' })],
  veg: [
    O('Spinach goma-ae', '#2f6b2f', 'leaf', 'Blanch, squeeze dry and dress with ground sesame, soy and sugar.', ['1 bunch|English spinach|P', '1 tbsp|toasted sesame seeds|S']),
    O('Cucumber sunomono', '#4f8a3a', 'slice', 'Slice paper-thin, salt, squeeze and dress with rice vinegar and sugar.', ['1|Lebanese cucumber{s}|P', '1 tbsp|rice vinegar|S'], { flesh: '#dcedc2' }),
    O('Edamame', '#7aa83a', 'dot', 'Boil 4 minutes from frozen, pod and salt.', ['150 g|frozen edamame|E']),
    O('Takuan', '#e9c62a', 'slice', 'Slice the pickled daikon into thin half-moons.', ['60 g|takuan (pickled daikon)|I'], { flesh: '#f6e27a' }),
    O('Simmered shiitake', '#5e3b26', 'mush', 'Simmer in dashi, soy and mirin until glossy.', ['6|fresh shiitake mushroom{s}|P', '1 tbsp|mirin|I']),
    O('Avocado', '#9db84a', 'slice', 'Slice and squeeze over a little lemon.', ['1|avocado{s}|P'], { flesh: '#d8e39a', skin: '#3d5a22' }),
    O('Carrot kinpira', '#e07a2a', 'strip', 'Stir-fry julienned carrot with soy, mirin and sesame until just tender.', ['1|carrot{s}|P', '1 tsp|soy sauce|S']),
    O('Wakame', '#3f6a3a', 'shred', 'Rehydrate 5 minutes and dress with sesame oil and rice vinegar.', ['5 g|dried wakame|I'], { core: '#5f8a4a' }),
    O('Pickled ginger', '#f0b8b0', 'shred', 'Drain and pile loosely.', ['30 g|pickled ginger (gari)|I'], { core: '#fbe2dc' })],
  centre: [
    O('Onsen tamago', '#fbf7ec', 'yolk', 'Hold eggs in 64°C water for 45 minutes, or cheat with a 6-minute boil.', ['2|egg{s}|E'], { veil: true }),
    O('Tamagoyaki', '#f5d044', 'roll', 'Roll thin layers of seasoned egg in a pan, then slice.', ['3|egg{s}|E', '1 tsp|mirin|I']),
    eggFried()],
  sauce: [
    O('Goma dressing', '#c9a26b', 's', 'Whisk tahini, soy, rice vinegar and a little sugar until creamy.', ['2 tbsp|tahini|S', '1 tbsp|soy sauce|S', '1 tbsp|rice vinegar|S']),
    O('Ponzu', '#8a5a2a', 's', 'Mix soy with lemon or yuzu juice and a splash of mirin.', ['2 tbsp|soy sauce|S', '1|lemon{s}|P']),
    O('Spicy mayo', '#ee8a4a', 's', 'Stir sriracha through Kewpie mayonnaise.', ['3 tbsp|Kewpie mayonnaise|I', '1 tsp|sriracha|S'])],
  garnish: [
    O('Furikake', '#3a4a2a', 'g', 'Sprinkle generously.', ['1 tbsp|furikake|I'], { mix: [['seed', '#f1e4c0'], ['flake', '#24301f']] }),
    O('Nori and spring onion', '#1d271d', 'g', 'Cut nori into fine strips and slice the spring onion.', ['1|nori sheet{s}|I', '1|spring onion{s}|P'], { mix: [['nori', '#1d271d'], ['ring', '#6aa34a']] }),
    O('Bonito flakes', '#d9a87a', 'g', 'Pile on at the last second so they dance.', ['5 g|bonito flakes|I'], { mix: [['flake', '#d9a87a'], ['flake', '#b98058']] })] },

{ id: 'thai', n: 'Thai', sub: 'Herbs, lime and heat', style: 'Lemongrass', glaze: '#5a3010', palette: ['#e04a2a', '#b8d06a', '#3f7a32'],
  mar: { how: 'Pound the lemongrass and garlic, then mix with fish sauce and palm sugar.', i: ['1|lemongrass stalk{s}|P', '1 tbsp|fish sauce (or light soy)|S', '1 tbsp|palm sugar|I', '2|garlic clove{s}|P'] },
  base: [
    O('Jasmine rice', '#f5f2ea', 'rice', 'Rinse twice and cook with 1.25 parts water. Rest 10 minutes.', ['1 cup|jasmine rice|R'], { long: true }),
    O('Sticky rice', '#f2eee2', 'rice', 'Soak glutinous rice 4 hours or overnight, then steam 20 minutes.', ['1 cup|glutinous rice|R']),
    O('Coconut rice', '#f4efe2', 'rice', 'Cook jasmine rice in half coconut milk, half water, with a pinch of salt.', ['1 cup|jasmine rice|R', '200 ml|coconut milk|S'], { long: true })],
  veg: [
    O('Green papaya salad', '#b8d06a', 'strip', 'Shred, then bruise lightly with lime, fish sauce, palm sugar and chilli.', ['200 g|green papaya|I', '1|lime{s}|P', '1|bird’s eye chilli{es}|P']),
    O('Cucumber and Thai basil', '#5f9a50', 'chunk', 'Cut into chunks and toss with torn Thai basil and lime.', ['1|Lebanese cucumber{s}|P', '0.5 bunch|Thai basil|P']),
    O('Morning glory', '#3f7a32', 'leaf', 'Stir-fry over fierce heat with garlic, chilli and oyster sauce.', ['1 bunch|morning glory (water spinach)|P', '1 tbsp|oyster sauce|S']),
    O('Bean sprouts and mint', '#e9e6c0', 'sprout', 'Toss raw sprouts with torn mint and a squeeze of lime.', ['150 g|mung bean sprouts|P', '0.5 bunch|mint|P'], { head: '#cfdc8a' }),
    O('Snake beans', '#4f8a2a', 'strip', 'Cut into 4 cm lengths and stir-fry with garlic until blistered.', ['150 g|snake beans|P'], { char: true }),
    O('Roast pumpkin', '#e88a2a', 'chunk', 'Cube, toss with oil and roast 25 minutes at 220°C.', ['300 g|Kent pumpkin|P'], { char: true }),
    O('Charred eggplant', '#5a2d5c', 'chunk', 'Char whole eggplant, peel, tear and dress with lime and fish sauce.', ['1|eggplant{s}|P'], { char: true }),
    O('Red cabbage slaw', '#7a2f6a', 'shred', 'Shred finely and toss with lime and a pinch of sugar.', ['0.25|red cabbage|P'], { core: '#e8d4ea' })],
  centre: [
    O('Khai dao', '#fbf7ec', 'eggx', 'Fry in a wok of hot oil, spooning oil over until puffed with lacy brown edges.', ['2|egg{s}|E']),
    eggJammy(),
    O('Son-in-law egg', '#c88a3a', 'jammy', 'Deep-fry boiled eggs until blistered, then spoon over a tamarind caramel.', ['2|egg{s}|E', '1 tbsp|tamarind purée|I', '1 tbsp|palm sugar|I'])],
  sauce: [
    O('Nam jim jaew', '#7a2a14', 's', 'Mix lime, fish sauce, palm sugar, chilli flakes and toasted rice powder.', ['2 tbsp|fish sauce (or light soy)|S', '1|lime{s}|P', '1 tsp|chilli flakes|S'], { fleck: '#c9a46a' }),
    O('Peanut sauce', '#b5793a', 's', 'Simmer peanut butter, coconut milk, red curry paste and lime until smooth.', ['2 tbsp|peanut butter|S', '100 ml|coconut milk|S', '1 tsp|red curry paste|I']),
    O('Sweet chilli and lime', '#e04a2a', 's', 'Loosen sweet chilli sauce with lime juice.', ['3 tbsp|sweet chilli sauce|S', '1|lime{s}|P'], { fleck: '#8a1a0a' })],
  garnish: [
    O('Toasted rice and mint', '#d9c08a', 'g', 'Dry-toast rice until golden, grind coarsely and scatter with mint.', ['1 tbsp|glutinous rice|R', '0.5 bunch|mint|P'], { mix: [['flake', '#d9c08a'], ['herb', '#4c8c34']] }),
    O('Peanuts and coriander', '#c49155', 'g', 'Crush the peanuts and pick the coriander.', ['30 g|roasted peanuts|S', '0.5 bunch|coriander|P'], { mix: [['flake', '#c49155'], ['herb', '#4c8c34']] }),
    O('Crispy shallots', '#b9793a', 'g', 'Scatter straight from the jar.', ['2 tbsp|fried shallots|I'], { mix: [['flake', '#b9793a'], ['flake', '#8a5524']] })] }
];

// Give every option a stable id: "<cuisine>-<slug>".
const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
for (const c of CUISINES) for (const k of ['base', 'veg', 'centre', 'sauce', 'garnish']) for (const o of c[k]) o.id = `${c.id}-${slug(o.n)}`;
