// Recipe data for Bibimbap Builder.
// Ingredient strings: "qty unit|name|aisle" for 2 serves. {s}/{es} pluralise counted items.
// Aisles: P fruit & veg, M butcher, E fridge, R rice & grains, I specialty, S pantry.
// Textures (t): strip, leaf, chunk, meat, cube, dot, slice, shred, sprout, mush, curl, mash.
// Centre types: egg, eggx, yolk, jammy, roll, crumble, blob, disc.
// Each cuisine has styles: the way the protein is seasoned and cooked. Its glaze tints the protein segment.

export const AISLES = { P: 'Fruit & veg', M: 'Butcher & seafood', E: 'Fridge & eggs', R: 'Rice & grains', I: 'Specialty aisle', S: 'Pantry' };
export const AISLE_ORDER = ['P', 'M', 'E', 'R', 'I', 'S'];

// Option ids that have a photo at img/<id>.webp (see img/README.md).
export const PHOTOS = new Set([]);

const O = (n, c, t, p, i, x = {}) => Object.assign({ n, c, t, p, i }, x);
const St = (n, glaze, how, i, x = {}) => Object.assign({ n, glaze, how, i }, x);
const E = {
  fried: () => O('Fried egg', '#fbf7ec', 'egg', 'Fry sunny-side up in a little oil until the white is set and the edges crisp.', ['2|egg{s}|E']),
  crispy: n => O(n || 'Crispy fried egg', '#fbf7ec', 'eggx', 'Fry in plenty of hot oil, spooning it over until the edges go lacy and brown.', ['2|egg{s}|E']),
  jammy: () => O('Jammy soft egg', '#fbf7ec', 'jammy', 'Boil 6½ minutes, cool in iced water, peel and halve.', ['2|egg{s}|E'])
};

export const PROTEINS = {
  beef: { n: 'Beef', w: 'beef', c: '#6e3524', t: 'meat', i: ['300 g|beef scotch fillet|M'], cut: 'Slice the beef as thinly as you can across the grain (15 minutes in the freezer helps).', cook: 'Sear in batches over high heat, about a minute a side, until caramelised.' },
  chicken: { n: 'Chicken', w: 'chicken', c: '#c4874a', t: 'chunk', i: ['350 g|chicken thigh fillets|M'], cut: 'Cut the thighs into bite-size pieces.', cook: 'Cook over medium-high heat for 6–8 minutes, turning, until cooked through and charred at the edges.' },
  pork: { n: 'Pork', w: 'pork', c: '#b4684a', t: 'meat', i: ['300 g|pork neck|M'], cut: 'Slice the pork thinly.', cook: 'Sear 2–3 minutes a side until caramelised and cooked through.' },
  prawns: { n: 'Prawns', w: 'prawns', c: '#ef8a5d', t: 'curl', i: ['300 g|raw peeled prawns|M'], cut: 'Devein the prawns and pat them dry.', cook: 'Sear over high heat 1–2 minutes a side until just pink.' },
  tofu: { n: 'Tofu', w: 'tofu', c: '#e6c487', t: 'cube', plant: true, i: ['300 g|firm tofu|E'], cut: 'Press the tofu for 15 minutes, then cut into 2 cm cubes.', cook: 'Pan-fry the tofu in a little oil until golden on all sides.' },
  mushrooms: { n: 'Mushrooms', w: 'mushrooms', c: '#a07a52', t: 'mush', plant: true, i: ['300 g|king oyster mushrooms|P'], cut: 'Tear or thickly slice the mushrooms.', cook: 'Sear the mushrooms in a hot, dry pan until well browned.' }
};

export const CUISINES = [
/* ============ KOREAN ============ */
{ id: 'korean', n: 'Traditional', sub: 'Korean classic', palette: ['#c8381f', '#2f6b2f', '#efe3ae'],
  styles: [
    St('Bulgogi', '#6a2414', 'Grate the pear and garlic into the soy, brown sugar and sesame oil.', ['2 tbsp|soy sauce|S', '1 tbsp|brown sugar|S', '2 tsp|sesame oil|S', '2|garlic clove{s}|P', '0.25|nashi pear{s}|P']),
    St('Spicy gochujang', '#9a1f12', 'Mix gochujang, gochugaru, soy, sugar, garlic and ginger into a thick paste.', ['2 tbsp|gochujang|I', '1 tsp|gochugaru|I', '1 tbsp|soy sauce|S', '1 tbsp|sugar|S', '2|garlic clove{s}|P', '10 g|ginger|P']),
    St('Galbi', '#4a2210', 'Whisk soy, honey, crushed garlic, sesame oil, black pepper and sliced spring onion.', ['2 tbsp|soy sauce|S', '1 tbsp|honey|S', '3|garlic clove{s}|P', '2 tsp|sesame oil|S', '0.5 tsp|black pepper|S', '1|spring onion{s}|P']),
    St('Doenjang', '#6b4a24', 'Mash doenjang with honey, garlic and sesame oil until smooth.', ['1.5 tbsp|doenjang|I', '1 tbsp|honey|S', '2|garlic clove{s}|P', '2 tsp|sesame oil|S']),
    St('Yangnyeom', '#a8261a', 'Simmer gochujang, ketchup, honey, soy and garlic until glossy. Toss the cooked protein through at the end.', ['1 tbsp|gochujang|I', '2 tbsp|tomato ketchup|S', '2 tbsp|honey|S', '1 tbsp|soy sauce|S', '2|garlic clove{s}|P'], { step: 'Make the yangnyeom glaze' })],
  base: [
    O('Short-grain white rice', '#f4f1e8', 'rice', 'Rinse until the water runs clear, then cook with 1.1 parts water. Rest 10 minutes covered.', ['1 cup|short-grain rice|R']),
    O('Multigrain japgokbap', '#e2d6c4', 'rice', 'Soak the rice and grains 30 minutes, then cook with a splash more water than usual.', ['0.75 cup|short-grain rice|R', '0.25 cup|mixed grains (barley, black rice)|R'], { fleck: '#4b2338' }),
    O('Crispy dolsot rice', '#efdcb8', 'rice', 'Cook the rice, press into an oiled very hot pan or stone bowl and leave 5 minutes until a golden crust forms.', ['1 cup|short-grain rice|R', '1 tbsp|sesame oil|S'], { fleck: '#c58a3c', crust: true }),
    O('Black rice heukmibap', '#c9b6cc', 'rice', 'Mix a spoonful of black rice through white rice, soak 30 minutes and cook as usual. It turns violet.', ['0.85 cup|short-grain rice|R', '2 tbsp|black rice|R'], { fleck: '#3a1a3a' }),
    O('Barley rice boribap', '#ddd0b4', 'rice', 'Cook pearl barley and rice together with a little extra water.', ['0.7 cup|short-grain rice|R', '0.3 cup|pearl barley|R'], { fleck: '#a8875a' })],
  veg: [
    O('Seasoned spinach', '#2f6b2f', 'leaf', 'Blanch 30 seconds, squeeze dry, toss with sesame oil, garlic and a pinch of salt.', ['1 bunch|English spinach|P', '1 tsp|sesame oil|S', '1|garlic clove{s}|P']),
    O('Soybean sprouts', '#efe3ae', 'sprout', 'Boil 5 minutes with the lid on, drain, dress with sesame oil and salt.', ['150 g|soybean sprouts|P', '1 tsp|sesame oil|S'], { head: '#e3c94a' }),
    O('Sautéed carrot', '#e8742a', 'strip', 'Julienne and stir-fry 1 minute with a pinch of salt.', ['1|carrot{s}|P']),
    O('Zucchini half-moons', '#6e9a3a', 'slice', 'Slice thinly, salt 10 minutes, pat dry and sauté until just soft.', ['1|zucchini|P'], { flesh: '#e4ecc0' }),
    O('Shiitake', '#5e3b26', 'mush', 'Slice and stir-fry with a splash of soy and sugar until glossy.', ['6|fresh shiitake mushroom{s}|P', '1 tsp|soy sauce|S']),
    O('Kimchi', '#c8381f', 'shred', 'Snip into bite-size pieces. Fry 2 minutes if you like it softer.', ['120 g|cabbage kimchi|E'], { core: '#f2d9b8' }),
    O('Gosari', '#6b4a2b', 'strip', 'Rehydrate, simmer 15 minutes, then stir-fry with soy, garlic and sesame oil.', ['30 g|dried gosari (fernbrake)|I', '1 tsp|soy sauce|S', '1|garlic clove{s}|P']),
    O('Cucumber namul', '#4f8a3a', 'slice', 'Slice thinly, salt 10 minutes, squeeze, then dress with gochugaru and sesame.', ['1|Lebanese cucumber{s}|P', '0.5 tsp|gochugaru|I'], { flesh: '#d9ebbf' }),
    O('Spicy radish', '#e7b4a2', 'strip', 'Julienne the daikon and toss with gochugaru, vinegar, sugar and salt.', ['150 g|daikon|P', '1 tsp|gochugaru|I', '1 tsp|rice vinegar|S']),
    O('Doraji', '#efe6d0', 'strip', 'Salt-rub the bellflower root, rinse, then toss with gochujang, vinegar and sugar.', ['80 g|doraji (bellflower root)|I', '1 tsp|gochujang|I', '1 tsp|rice vinegar|S']),
    O('Eomuk bokkeum', '#d9b27a', 'strip', 'Slice fish cake into strips and stir-fry with soy, sugar and a little gochugaru.', ['150 g|Korean fish cake (eomuk)|I', '1 tsp|soy sauce|S']),
    O('Myeolchi bokkeum', '#c9a060', 'strip', 'Dry-fry small anchovies until crisp, then toss in honey, soy and sesame.', ['40 g|dried small anchovies|I', '1 tsp|honey|S'], { small: true }),
    O('Perilla leaves', '#3f6a2a', 'leaf', 'Stack, roll and slice into ribbons.', ['10|perilla lea{f/ves}|I']),
    O('Eggplant namul', '#5a2d5c', 'strip', 'Steam batons 8 minutes, cool, tear and dress with soy, garlic and sesame.', ['1|eggplant{s}|P', '1 tsp|soy sauce|S']),
    O('Gamja jorim', '#d9b46a', 'chunk', 'Braise small potato cubes in soy, sugar and water until sticky.', ['2|potato{es}|P', '1 tbsp|soy sauce|S', '1 tsp|sugar|S']),
    O('Egg jidan', '#f5d044', 'strip', 'Fry yolks and whites as separate thin crepes, roll and slice into ribbons.', ['2|egg{s}|E']),
    O('Kkakdugi', '#d9442a', 'cube', 'Cut radish kimchi into small cubes.', ['120 g|radish kimchi (kkakdugi)|E']),
    O('Lettuce ribbons', '#8cc152', 'shred', 'Slice crisp lettuce finely and dress with a drop of sesame oil.', ['0.5|cos lettuce|P'], { core: '#e6f2c8' })],
  centre: [E.fried(),
    O('Raw egg yolk', '#f2a51b', 'yolk', 'Separate a very fresh egg and slip the yolk onto the hot rice just before serving.', ['2|egg{s}|E']),
    E.jammy(),
    O('Mayak egg', '#b0743a', 'jammy', 'Marinate 6½-minute eggs overnight in soy, sugar, garlic, chilli and spring onion.', ['2|egg{s}|E', '2 tbsp|soy sauce|S', '1 tsp|sugar|S'])],
  sauce: [
    O('Gochujang sauce', '#b8261b', 's', 'Whisk gochujang, sesame oil, sugar, vinegar and a little water until smooth.', ['2 tbsp|gochujang|I', '1 tsp|sesame oil|S', '1 tsp|sugar|S', '1 tsp|rice vinegar|S']),
    O('Ssamjang', '#7a4a22', 's', 'Mix doenjang, gochujang, sesame oil and a little crushed garlic.', ['1 tbsp|doenjang|I', '1 tsp|gochujang|I', '1 tsp|sesame oil|S'], { fleck: '#f1e4c0' }),
    O('Soy-sesame yangnyeom', '#3b2414', 's', 'Stir soy, gochugaru, sliced spring onion, sesame and a pinch of sugar.', ['2 tbsp|soy sauce|S', '0.5 tsp|gochugaru|I', '1|spring onion{s}|P'], { fleck: '#6aa34a' }),
    O('Gochujang mayo', '#e0663a', 's', 'Stir gochujang through Kewpie mayo with a squeeze of lemon.', ['3 tbsp|Kewpie mayonnaise|I', '1 tbsp|gochujang|I']),
    O('Yuzu soy', '#8a6a2a', 's', 'Mix soy with yuzu or lemon juice, a little honey and sesame.', ['2 tbsp|soy sauce|S', '1|lemon{s}|P', '1 tsp|honey|S'], { fleck: '#f1e4c0' })],
  garnish: [
    O('Sesame and gim', '#1d271d', 'g', 'Snip roasted seaweed into strips and scatter with toasted sesame.', ['5 g|roasted seaweed (gim)|I', '1 tsp|toasted sesame seeds|S'], { mix: [['nori', '#1d271d'], ['seed', '#f1e4c0']] }),
    O('Spring onion', '#5a9a3a', 'g', 'Slice finely on the diagonal.', ['2|spring onion{s}|P'], { mix: [['ring', '#5a9a3a'], ['ring', '#9cc96a']] }),
    O('Gochugaru and sesame', '#b32a16', 'g', 'Mix chilli flakes with toasted sesame seeds.', ['0.5 tsp|gochugaru|I', '1 tsp|toasted sesame seeds|S'], { mix: [['flake', '#b32a16'], ['seed', '#f1e4c0']] }),
    O('Toasted pine nuts', '#e8d8a8', 'g', 'Toast in a dry pan until just golden.', ['2 tbsp|pine nuts|S'], { mix: [['seed', '#e8d8a8'], ['seed', '#d4b878']] }),
    O('Chilli threads', '#c8301a', 'g', 'Scatter silgochu threads over the top.', ['2 g|Korean chilli threads (silgochu)|I'], { mix: [['nori', '#c8301a'], ['seed', '#f1e4c0']] })] },

/* ============ CHINESE ============ */
{ id: 'chinese', n: 'Chinese', sub: 'Cantonese to Sichuan', palette: ['#8c1f14', '#2e6b3a', '#f1d98c'],
  styles: [
    St('Char siu', '#8c1f14', 'Whisk hoisin, soy, honey, Shaoxing wine, five spice and crushed garlic.', ['2 tbsp|hoisin sauce|S', '1 tbsp|soy sauce|S', '1 tbsp|honey|S', '1 tbsp|Shaoxing wine|I', '0.5 tsp|Chinese five spice|S', '2|garlic clove{s}|P']),
    St('Kung pao', '#7a2410', 'Mix soy, black vinegar, sugar and cornflour. Fry dried chillies and Sichuan pepper briefly in oil before the protein goes in.', ['1 tbsp|soy sauce|S', '1 tbsp|Chinkiang black vinegar|I', '1 tsp|sugar|S', '6|dried red chilli{es}|I', '0.5 tsp|Sichuan pepper|I']),
    St('Black pepper', '#3a2a1a', 'Mix oyster sauce, soy, coarsely cracked black pepper, a little sugar and garlic.', ['2 tbsp|oyster sauce|S', '1 tsp|soy sauce|S', '1 tsp|black pepper|S', '2|garlic clove{s}|P']),
    St('Honey garlic', '#a8641e', 'Whisk honey, soy, rice vinegar and plenty of crushed garlic.', ['2 tbsp|honey|S', '1 tbsp|soy sauce|S', '1 tsp|rice vinegar|S', '4|garlic clove{s}|P']),
    St('Salt and pepper', '#c8a070', 'Toss the protein in cornflour seasoned with salt, white pepper and five spice. Fry until crisp, then toss with chilli and garlic.', ['3 tbsp|cornflour|S', '0.5 tsp|white pepper|S', '0.25 tsp|Chinese five spice|S', '1|long red chilli{es}|P'], { step: 'Season the coating' }),
    St('Doubanjiang', '#9a2a14', 'Stir chilli bean paste with soy, sugar, ginger and a splash of Shaoxing wine.', ['1.5 tbsp|doubanjiang (chilli bean paste)|I', '1 tsp|soy sauce|S', '1 tsp|sugar|S', '10 g|ginger|P', '1 tbsp|Shaoxing wine|I'])],
  base: [
    O('Steamed jasmine rice', '#f5f2ea', 'rice', 'Rinse twice and cook with 1.25 parts water. Rest 10 minutes.', ['1 cup|jasmine rice|R'], { long: true }),
    O('Ginger-scallion rice', '#ecebd0', 'rice', 'Cook the rice, then fold through ginger and spring onion sizzled in hot oil.', ['1 cup|jasmine rice|R', '20 g|ginger|P', '2|spring onion{s}|P'], { fleck: '#6aa34a', long: true }),
    O('Egg fried rice', '#f1d98c', 'rice', 'Use day-old rice. Scramble an egg in a smoking wok, add rice and soy, and toss until smoky.', ['1 cup|jasmine rice|R', '1|egg{s}|E', '1 tbsp|soy sauce|S'], { fleck: '#f3b21e', long: true }),
    O('Lap cheong rice', '#e9dcc0', 'rice', 'Lay sliced Chinese sausage on the rice for the last 10 minutes of cooking so the fat seasons it.', ['1 cup|jasmine rice|R', '1|lap cheong sausage{s}|I'], { fleck: '#9a2a2a', big: true }),
    O('Brown rice', '#cfb592', 'rice', 'Simmer 30 minutes, then rest 10 minutes off the heat.', ['1 cup|brown rice|R'], { fleck: '#9a7650' })],
  veg: [
    O('Garlic gai lan', '#2e6b3a', 'leaf', 'Blanch 1 minute, then toss with garlic oil and oyster sauce.', ['1 bunch|gai lan|P', '1|garlic clove{s}|P', '1 tbsp|oyster sauce|S']),
    O('Smashed cucumber', '#5f9a50', 'chunk', 'Smash, cut into chunks, dress with black vinegar, garlic and chilli oil.', ['1|Lebanese cucumber{s}|P', '1 tbsp|Chinkiang black vinegar|I']),
    O('Baby bok choy', '#7cb85a', 'leaf', 'Halve, then stir-fry 2 minutes with ginger and a splash of water.', ['2|baby bok choy|P', '10 g|ginger|P']),
    O('Wood ear mushrooms', '#2a1c18', 'shred', 'Soak 20 minutes, trim, then dress with vinegar, soy and chilli.', ['15 g|dried wood ear mushrooms|I', '1 tsp|soy sauce|S'], { core: '#4a362e' }),
    O('Sichuan bean sprouts', '#eee8c4', 'sprout', 'Stir-fry 30 seconds over high heat with a pinch of ground Sichuan pepper.', ['150 g|mung bean sprouts|P', '0.25 tsp|Sichuan pepper|I'], { head: '#cfdc8a' }),
    O('Snow peas', '#7cb342', 'strip', 'Trim and stir-fry 1 minute with garlic until bright green.', ['100 g|snow peas|P']),
    O('Wombok slaw', '#dfe8bf', 'shred', 'Shred finely and toss with rice vinegar, sesame oil and a pinch of sugar.', ['0.25|wombok (Chinese cabbage)|P', '1 tsp|rice vinegar|S'], { core: '#f6f6e4' }),
    O('Zha cai', '#a8a24a', 'shred', 'Rinse the pickled mustard stem and slice thinly.', ['50 g|zha cai (pickled mustard stem)|I'], { core: '#c9b96a' }),
    O('Garlic eggplant', '#5a2d5c', 'chunk', 'Cut into fingers, fry until soft, then glaze with garlic and soy.', ['1|eggplant{s}|P'], { char: true }),
    O('Choy sum', '#3f8a3a', 'leaf', 'Blanch and dress with oyster sauce and a drizzle of garlic oil.', ['1 bunch|choy sum|P', '1 tbsp|oyster sauce|S']),
    O('Vinegar potato threads', '#efe0a8', 'strip', 'Julienne potato, rinse off the starch, then flash-fry with vinegar and dried chilli so it stays crunchy.', ['1|potato{es}|P', '1 tbsp|Chinkiang black vinegar|I'], { small: true }),
    O('Dry-fried green beans', '#4f7a2a', 'strip', 'Fry until blistered and wrinkled, then toss with garlic and chilli.', ['150 g|green beans|P'], { char: true }),
    O('Lotus root', '#ece2c8', 'slice', 'Slice thinly, blanch 2 minutes and dress with vinegar and chilli oil.', ['150 g|lotus root|I'], { flesh: '#f6f0e0', skin: '#d8c8a0' }),
    O('Tiger salad', '#6aa34a', 'leaf', 'Toss coriander, spring onion, cucumber and green chilli with vinegar and sesame oil.', ['0.5 bunch|coriander|P', '1|Lebanese cucumber{s}|P', '1|green chilli{es}|P']),
    O('Enoki', '#f2ecd8', 'sprout', 'Separate into small bunches and sear in a hot pan with soy.', ['100 g|enoki mushrooms|P'], { head: '#f6f0e0' }),
    O('Hot and sour cabbage', '#e3e6c0', 'shred', 'Tear cabbage and stir-fry hard with dried chilli and a splash of vinegar.', ['0.25|green cabbage|P', '1 tsp|rice vinegar|S'], { core: '#f2f2dc', char: true })],
  centre: [
    E.crispy(),
    O('Soy-marinated egg', '#c9935a', 'jammy', 'Boil 7 minutes, peel, then soak in soy, sugar and star anise for 2 hours.', ['2|egg{s}|E', '1|star anise|S']),
    O('Tea egg', '#9a6a3a', 'jammy', 'Boil 8 minutes, crack the shells all over, then simmer 30 minutes in tea, soy and five spice.', ['2|egg{s}|E', '1|black tea bag{s}|S'], { marble: true }),
    O('Salted duck egg', '#eeeee0', 'jammy', 'Halve a cooked salted duck egg. Its yolk is rich and sandy.', ['1|salted duck egg{s}|I'])],
  sauce: [
    O('Chilli crisp', '#9c2a14', 's', 'Stir the jar well and spoon out plenty of the crunchy bits.', ['2 tbsp|chilli crisp|I'], { fleck: '#3a0f08' }),
    O('Ginger-scallion oil', '#b9c46a', 's', 'Pour smoking-hot oil over minced ginger, spring onion and salt.', ['20 g|ginger|P', '3|spring onion{s}|P', '3 tbsp|neutral oil|S'], { fleck: '#4f8a2a' }),
    O('Black vinegar dressing', '#3a2016', 's', 'Mix black vinegar, soy, sugar, garlic and a little chilli oil.', ['1 tbsp|Chinkiang black vinegar|I', '1 tbsp|soy sauce|S', '1 tsp|sugar|S']),
    O('XO sauce', '#8a3018', 's', 'Warm a spoonful of XO sauce in its own oil.', ['2 tbsp|XO sauce|I'], { fleck: '#c87a4a' }),
    O('Hoisin sesame', '#4a1e14', 's', 'Loosen hoisin with sesame oil and a little warm water.', ['2 tbsp|hoisin sauce|S', '1 tsp|sesame oil|S']),
    O('Sichuan red oil', '#c8281a', 's', 'Pour hot oil over chilli flakes, Sichuan pepper and sesame, then add a splash of soy.', ['2 tbsp|chilli flakes|S', '0.5 tsp|Sichuan pepper|I', '3 tbsp|neutral oil|S'], { fleck: '#5a1006' })],
  garnish: [
    O('Coriander and spring onion', '#4c8c34', 'g', 'Pick the coriander leaves and slice the spring onion finely.', ['0.5 bunch|coriander|P', '1|spring onion{s}|P'], { mix: [['herb', '#4c8c34'], ['ring', '#8cc06a']] }),
    O('Roasted peanuts', '#c49155', 'g', 'Roughly crush and scatter.', ['30 g|roasted peanuts|S'], { mix: [['flake', '#c49155'], ['flake', '#e3bb83']] }),
    O('Fried shallots', '#b9793a', 'g', 'Scatter straight from the jar.', ['2 tbsp|fried shallots|I'], { mix: [['flake', '#b9793a'], ['flake', '#8a5524']] }),
    O('Sichuan pepper and chilli', '#8a2a14', 'g', 'Toast Sichuan pepper and chilli flakes, then crush roughly.', ['0.5 tsp|Sichuan pepper|I', '0.5 tsp|chilli flakes|S'], { mix: [['flake', '#8a2a14'], ['seed', '#5a2a1a']] }),
    O('Crispy garlic', '#d9a85a', 'g', 'Fry thinly sliced garlic gently until pale gold.', ['4|garlic clove{s}|P'], { mix: [['flake', '#e2b86a'], ['flake', '#c8903a']] })] },

/* ============ JAMAICAN ============ */
{ id: 'jamaican', n: 'Jamaican', sub: 'Jerk and island heat', palette: ['#3e1e0c', '#f2b632', '#2f5f2a'],
  styles: [
    St('Jerk', '#3e1e0c', 'Blend jerk paste with lime juice, allspice, thyme leaves, seeded scotch bonnet and garlic.', ['2 tbsp|jerk seasoning paste|S', '1|lime{s}|P', '0.5 tsp|ground allspice|S', '3|thyme sprig{s}|P', '0.5|scotch bonnet chilli{es}|P', '2|garlic clove{s}|P']),
    St('Curry', '#b8861a', 'Rub with Jamaican curry powder, garlic, thyme, onion and a little scotch bonnet. Cook low with a splash of coconut milk at the end.', ['1.5 tbsp|Jamaican curry powder|S', '2|garlic clove{s}|P', '3|thyme sprig{s}|P', '100 ml|coconut milk|S'], { step: 'Season with curry' }),
    St('Brown stew', '#4a2410', 'Mix browning, ketchup, soy, allspice, thyme and garlic. Sear, then simmer briefly with onion and capsicum.', ['1 tbsp|browning sauce|I', '2 tbsp|tomato ketchup|S', '1 tbsp|soy sauce|S', '0.5 tsp|ground allspice|S', '1|red capsicum{s}|P']),
    St('Pepper', '#c83a1a', 'Toss with garlic, paprika, plenty of black pepper and finely chopped scotch bonnet.', ['1 tsp|smoked paprika|S', '1 tsp|black pepper|S', '1|scotch bonnet chilli{es}|P', '2|garlic clove{s}|P']),
    St('Pineapple jerk', '#a0521a', 'Blend jerk paste with pineapple juice and brown sugar for a sticky, sweeter glaze.', ['1.5 tbsp|jerk seasoning paste|S', '100 ml|pineapple juice|S', '1 tbsp|brown sugar|S'])],
  base: [
    O('Rice and peas', '#ddc9b5', 'rice', 'Simmer rice with kidney beans, coconut milk, thyme, allspice and a whole scotch bonnet (do not burst it).', ['1 cup|long-grain rice|R', '200 ml|coconut milk|S', '0.5 can|kidney beans|S'], { fleck: '#6e1f22', big: true, long: true }),
    O('Coconut rice', '#f4efe2', 'rice', 'Cook the rice in half coconut milk, half water, with a pinch of salt.', ['1 cup|long-grain rice|R', '200 ml|coconut milk|S'], { long: true }),
    O('Steamed long-grain rice', '#f5f2ea', 'rice', 'Rinse and cook with 1.5 parts water. Rest 10 minutes.', ['1 cup|long-grain rice|R'], { long: true }),
    O('Rice and gungo peas', '#d9ccb0', 'rice', 'Cook like rice and peas, using pigeon peas instead of kidney beans.', ['1 cup|long-grain rice|R', '200 ml|coconut milk|S', '0.5 can|pigeon peas (gungo peas)|I'], { fleck: '#9a7a4a', big: true, long: true }),
    O('Turmeric coconut rice', '#f0d070', 'rice', 'Cook rice in coconut milk with turmeric, thyme and a pinch of allspice.', ['1 cup|long-grain rice|R', '200 ml|coconut milk|S', '0.5 tsp|ground turmeric|S'], { long: true })],
  veg: [
    O('Fried sweet plantain', '#d98b2b', 'chunk', 'Slice ripe, black-spotted plantain on the diagonal and fry until caramelised.', ['1|ripe plantain{s}|P'], { char: true }),
    O('Callaloo', '#2f5f2a', 'leaf', 'Sauté with onion, garlic and thyme until wilted. Spinach works if you can’t find callaloo.', ['1 bunch|callaloo or English spinach|P', '0.5|brown onion{s}|P']),
    O('Escovitch pickle', '#e5a33a', 'strip', 'Boil vinegar, allspice and sugar and pour over sliced carrot, onion and chilli. Cool.', ['1|carrot{s}|P', '0.5|red onion{s}|P', '100 ml|white vinegar|S']),
    O('Mango and red onion', '#f2b632', 'chunk', 'Dice and toss with lime and a pinch of salt.', ['1|mango{es}|P', '0.25|red onion{s}|P']),
    O('Charred corn', '#f0c94a', 'dot', 'Char the cob in a grill pan or over a flame, then slice off the kernels.', ['1|corn cob{s}|P'], { char: true }),
    O('Steamed cabbage', '#cfdca0', 'shred', 'Shred and steam with carrot, onion and thyme until tender.', ['0.25|green cabbage|P'], { core: '#eef2d8' }),
    O('Charred pineapple', '#f4cf5e', 'chunk', 'Cut into wedges and char in a very hot pan.', ['0.25|pineapple{s}|P'], { char: true }),
    O('Roast sweet potato', '#d9692e', 'chunk', 'Dice, toss with oil and allspice, and roast 25 minutes at 220°C.', ['1|sweet potato{es}|P'], { char: true }),
    O('Avocado', '#9db84a', 'slice', 'Slice and season with lime and salt.', ['1|avocado{s}|P'], { flesh: '#d8e39a', skin: '#3d5a22' }),
    O('Okra', '#5a8a2a', 'slice', 'Slice into rounds and fry hot and fast with garlic so they stay crisp.', ['150 g|okra|P'], { flesh: '#cfe0a8' }),
    O('Festival dumplings', '#d9a050', 'chunk', 'Mix cornmeal, flour, sugar and baking powder with water, roll into fingers and fry until golden.', ['0.5 cup|fine cornmeal|S', '0.5 cup|plain flour|S'], { char: true }),
    O('Roast breadfruit', '#e8d49a', 'chunk', 'Roast canned or fresh breadfruit wedges until charred at the edges.', ['250 g|breadfruit|I'], { char: true }),
    O('Island coleslaw', '#efe8c0', 'shred', 'Shred cabbage and carrot and toss with lime, a little mayo and scotch bonnet.', ['0.25|green cabbage|P', '1|carrot{s}|P', '1 tbsp|mayonnaise|S'], { core: '#f6f2dc' }),
    O('Black-eyed peas', '#e8dcc0', 'dot', 'Warm with thyme, garlic and a pinch of allspice.', ['1 can|black-eyed peas|S']),
    O('Roast calabaza', '#e88a2a', 'chunk', 'Cube pumpkin, toss with oil and thyme and roast 25 minutes at 220°C.', ['300 g|Kent pumpkin|P'], { char: true }),
    O('Choko', '#b8d08a', 'strip', 'Peel, slice into batons and sauté with butter and thyme.', ['1|choko{s}|P']),
    O('Boiled yam', '#efe0c0', 'chunk', 'Peel, cube and boil 15 minutes until tender, then toss with butter.', ['300 g|white yam|I'])],
  centre: [E.fried(),
    O('Sautéed ackee', '#f5d24a', 'blob', 'Drain canned ackee and fold gently through sautéed onion, tomato and capsicum.', ['0.5 can|ackee|I', '1|tomato{es}|P']),
    O('Fried dumpling', '#c8914a', 'disc', 'Knead flour, salt, baking powder and water, shape into discs and shallow-fry until golden.', ['1 cup|plain flour|S', '0.5 tsp|baking powder|S']),
    O('Saltfish fritter', '#c8903a', 'disc', 'Fold flaked salt cod, spring onion and chilli into a light batter and shallow-fry.', ['100 g|salt cod|I', '0.5 cup|plain flour|S']),
    E.jammy()],
  sauce: [
    O('Scotch bonnet sauce', '#d9481c', 's', 'Blend scotch bonnet, vinegar, a little carrot, garlic and sugar.', ['1|scotch bonnet chilli{es}|P', '2 tbsp|white vinegar|S'], { fleck: '#f2a03a' }),
    O('Mango-lime dressing', '#f0a830', 's', 'Blend mango with lime juice and a pinch of salt.', ['0.5|mango{es}|P', '1|lime{s}|P']),
    O('Jerk BBQ glaze', '#5a2614', 's', 'Simmer jerk paste, ketchup, brown sugar and lime for 5 minutes.', ['1 tbsp|jerk seasoning paste|S', '2 tbsp|tomato ketchup|S', '1 tbsp|brown sugar|S']),
    O('Tamarind pepper sauce', '#4a2014', 's', 'Simmer tamarind, vinegar, raisins, mango and spices into a sweet-sour brown sauce.', ['1 tbsp|tamarind purée|I', '2 tbsp|white vinegar|S', '1 tbsp|brown sugar|S']),
    O('Pineapple-scotch bonnet', '#f0b030', 's', 'Blend pineapple with scotch bonnet, lime and a pinch of salt.', ['0.25|pineapple{s}|P', '0.5|scotch bonnet chilli{es}|P'], { fleck: '#d8401a' }),
    O('Garlic-lime sauce', '#ece4b8', 's', 'Whisk mayo with crushed garlic, lime and thyme.', ['3 tbsp|mayonnaise|S', '1|garlic clove{s}|P', '1|lime{s}|P'], { fleck: '#5a8a2a' })],
  garnish: [
    O('Spring onion and thyme', '#5a9a3a', 'g', 'Slice the spring onion and strip the thyme leaves.', ['2|spring onion{s}|P', '2|thyme sprig{s}|P'], { mix: [['ring', '#5a9a3a'], ['herb', '#3f6a2a']] }),
    O('Toasted coconut', '#efe4cc', 'g', 'Toast in a dry pan until golden at the edges.', ['2 tbsp|desiccated coconut|S'], { mix: [['flake', '#f4ecd8'], ['flake', '#d9b884']] }),
    O('Lime and coriander', '#4c8c34', 'g', 'Pick coriander leaves and cut the lime into wedges.', ['1|lime{s}|P', '0.5 bunch|coriander|P'], { mix: [['herb', '#4c8c34'], ['herb', '#a9cf52']] }),
    O('Pickled scotch bonnet', '#e85a1a', 'g', 'Slice scotch bonnet into thin rings and cover with vinegar for 10 minutes.', ['1|scotch bonnet chilli{es}|P'], { mix: [['ring', '#e85a1a'], ['ring', '#f2b02a']] }),
    O('Toasted pumpkin seeds', '#6f8a3a', 'g', 'Toast in a dry pan with a pinch of allspice.', ['2 tbsp|pepitas|S'], { mix: [['seed', '#6f8a3a'], ['seed', '#8aa45a']] })] },

/* ============ MEXICAN ============ */
{ id: 'mexican', n: 'Mexican', sub: 'Chillies, citrus and char', palette: ['#d8432b', '#8fae3e', '#2a2230'],
  styles: [
    St('Chipotle', '#6a2412', 'Blend chipotles with cumin, oregano, garlic and lime juice.', ['2|chipotle{s} in adobo|I', '1 tsp|ground cumin|S', '1 tsp|dried oregano|S', '2|garlic clove{s}|P', '1|lime{s}|P']),
    St('Al pastor', '#b8401a', 'Blend achiote paste, soaked guajillo chilli, pineapple juice, vinegar and garlic.', ['1 tbsp|achiote paste|I', '2|dried guajillo chilli{es}|I', '100 ml|pineapple juice|S', '1 tbsp|white vinegar|S', '2|garlic clove{s}|P']),
    St('Carne asada', '#6a3a14', 'Mix orange and lime juice with garlic, cumin, chilli and a splash of soy.', ['1|orange{s}|P', '1|lime{s}|P', '2|garlic clove{s}|P', '1 tsp|ground cumin|S', '1 tsp|soy sauce|S']),
    St('Tinga', '#a8301c', 'Simmer tomato, onion, chipotle and garlic into a smoky sauce. Toss the cooked protein through it.', ['2|tomato{es}|P', '0.5|brown onion{s}|P', '1|chipotle{s} in adobo|I', '1|garlic clove{s}|P'], { step: 'Make the tinga sauce' }),
    St('Mole', '#3a1a10', 'Loosen mole paste with stock and a little dark chocolate. Toss the cooked protein through the sauce.', ['2 tbsp|mole paste|I', '10 g|dark chocolate|S', '150 ml|chicken or vegetable stock|S'], { step: 'Warm the mole' }),
    St('Achiote citrus', '#c8501a', 'Mash achiote paste with orange juice, lime, garlic and oregano.', ['1.5 tbsp|achiote paste|I', '1|orange{s}|P', '1|lime{s}|P', '1 tsp|dried oregano|S'])],
  base: [
    O('Cilantro-lime rice', '#e9eed8', 'rice', 'Cook the rice, then fold through chopped coriander, lime zest and juice.', ['1 cup|long-grain rice|R', '0.5 bunch|coriander|P', '1|lime{s}|P'], { fleck: '#4c8c34', long: true }),
    O('Mexican red rice', '#e3a77a', 'rice', 'Fry the rice until golden, then simmer with blended tomato, onion and garlic.', ['1 cup|long-grain rice|R', '1|tomato{es}|P', '0.5|brown onion{s}|P'], { long: true }),
    O('Rice and black beans', '#d5cdc4', 'rice', 'Cook the rice, then fold through warmed black beans and a pinch of cumin.', ['1 cup|long-grain rice|R', '0.5 can|black beans|S'], { fleck: '#241d29', big: true, long: true }),
    O('Arroz verde', '#c8dca0', 'rice', 'Blend coriander, poblano and stock, then cook the rice in it.', ['1 cup|long-grain rice|R', '0.5 bunch|coriander|P', '1|poblano or green capsicum{s}|P'], { fleck: '#3f7a2a', long: true }),
    O('Brown rice and corn', '#cfb592', 'rice', 'Cook brown rice and fold through charred corn kernels.', ['1 cup|brown rice|R', '1|corn cob{s}|P'], { fleck: '#f0c94a' })],
  veg: [
    O('Pickled red onion', '#c94a86', 'shred', 'Slice thinly and cover with lime juice, vinegar, salt and sugar for 20 minutes.', ['1|red onion{s}|P', '60 ml|white vinegar|S'], { core: '#f2c6dc' }),
    O('Charred corn', '#f0c94a', 'dot', 'Char the cob in a grill pan, slice off the kernels, finish with lime and chilli.', ['1|corn cob{s}|P'], { char: true }),
    O('Black beans', '#2a2230', 'dot', 'Warm with cumin, garlic and a squeeze of lime.', ['1 can|black beans|S']),
    O('Pico de gallo', '#d8432b', 'chunk', 'Dice tomato, onion, jalapeño and coriander. Season with lime and salt.', ['2|tomato{es}|P', '1|jalapeño{s}|P'], { small: true }),
    O('Guacamole', '#8fae3e', 'mash', 'Mash avocado with lime, salt and finely diced onion.', ['1|avocado{s}|P', '1|lime{s}|P']),
    O('Red cabbage slaw', '#7a2f6a', 'shred', 'Shred finely and toss with lime and salt.', ['0.25|red cabbage|P'], { core: '#e8d4ea' }),
    O('Poblano rajas', '#3f6a2a', 'strip', 'Char, peel and slice into strips, then sauté with onion.', ['2|poblano or green capsicum{s}|P'], { char: true }),
    O('Radishes', '#d94a6a', 'slice', 'Slice paper-thin and keep in iced water until serving.', ['4|radish{es}|P'], { flesh: '#fbf3f1' }),
    O('Calabacitas', '#7aa04a', 'slice', 'Sauté diced zucchini with corn, onion and a pinch of cumin.', ['1|zucchini|P'], { flesh: '#e8efc4' }),
    O('Nopales', '#4f8a3a', 'strip', 'Grill cactus paddles until charred, then slice into strips and dress with lime.', ['150 g|nopales (cactus paddles)|I'], { char: true }),
    O('Jícama sticks', '#f2ecd8', 'strip', 'Cut into batons and toss with lime and Tajín.', ['200 g|jícama|P', '1 tsp|Tajín seasoning|I']),
    O('Refried pinto beans', '#a8743a', 'mash', 'Fry onion, add pinto beans and mash with a little stock until creamy.', ['1 can|pinto beans|S', '0.5|brown onion{s}|P']),
    O('Cebollitas', '#6a9a3a', 'strip', 'Grill whole spring onions until blistered and soft, then season with lime and salt.', ['6|spring onion{s}|P'], { char: true }),
    O('Pickled jalapeños', '#5a8a2a', 'slice', 'Slice into rings straight from the jar.', ['60 g|pickled jalapeños|I'], { flesh: '#c8d890' }),
    O('Chilli sweet potato', '#d9692e', 'chunk', 'Dice and roast with oil, smoked paprika and chilli for 25 minutes at 220°C.', ['1|sweet potato{es}|P', '1 tsp|smoked paprika|S'], { char: true }),
    O('Mango and chilli', '#f2b632', 'chunk', 'Dice mango and toss with lime and chilli powder.', ['1|mango{es}|P', '1|lime{s}|P']),
    O('Shredded lettuce', '#9cc96a', 'shred', 'Slice iceberg finely.', ['0.25|iceberg lettuce|P'], { core: '#e6f2c8' })],
  centre: [
    O('Fried egg', '#fbf7ec', 'egg', 'Fry sunny-side up in a little oil until the white is set and the edges crisp.', ['2|egg{s}|E']),
    E.jammy(),
    O('Queso fresco', '#f6f3ea', 'crumble', 'Crumble over the centre of the bowl.', ['80 g|queso fresco or feta|E']),
    E.crispy('Huevo estrellado'),
    O('Grilled panela', '#f0e0b8', 'disc', 'Slice panela or haloumi thickly and grill until golden on both sides.', ['150 g|panela or haloumi|E'])],
  sauce: [
    O('Salsa verde', '#6f9a2e', 's', 'Blend tomatillos with jalapeño, coriander and lime.', ['200 g|canned tomatillos|I', '1|jalapeño{s}|P'], { fleck: '#3f6a1a' }),
    O('Chipotle crema', '#d9935e', 's', 'Stir chipotle and adobo through sour cream with a squeeze of lime.', ['100 g|sour cream|E', '1|chipotle{s} in adobo|I']),
    O('Salsa roja', '#a8301c', 's', 'Blend charred tomatoes, garlic, onion and a dried chilli.', ['2|tomato{es}|P', '1|garlic clove{s}|P'], { fleck: '#5a1408' }),
    O('Avocado crema', '#a8c060', 's', 'Blend avocado with yoghurt, lime, coriander and salt.', ['1|avocado{s}|P', '3 tbsp|Greek yoghurt|E']),
    O('Habanero hot sauce', '#f08020', 's', 'Blend habanero with carrot, vinegar, garlic and salt.', ['1|habanero chilli{es}|P', '2 tbsp|white vinegar|S'], { fleck: '#c83a10' }),
    O('Lime crema', '#f2efe0', 's', 'Whisk sour cream with lime zest, juice and salt until pourable.', ['100 g|sour cream|E', '1|lime{s}|P'], { fleck: '#8ab84a' })],
  garnish: [
    O('Coriander and lime', '#4c8c34', 'g', 'Pick the coriander and cut the lime into wedges.', ['0.5 bunch|coriander|P', '1|lime{s}|P'], { mix: [['herb', '#4c8c34'], ['herb', '#a9cf52']] }),
    O('Toasted pepitas', '#5f7a3a', 'g', 'Toast in a dry pan until they start to pop.', ['2 tbsp|pepitas|S'], { mix: [['seed', '#5f7a3a'], ['seed', '#8aa45a']] }),
    O('Tortilla strips', '#e6c27a', 'g', 'Slice corn tortillas into strips and fry until crisp.', ['2|corn tortilla{s}|R'], { mix: [['nori', '#e6c27a'], ['nori', '#c99a4a']] }),
    O('Cotija and chilli', '#f2eee2', 'g', 'Crumble cotija or feta and dust with chilli powder.', ['40 g|cotija or feta|E'], { mix: [['flake', '#f4f0e4'], ['flake', '#c8401a']] }),
    O('Fresh jalapeño', '#4f8a2a', 'g', 'Slice into thin rings.', ['1|jalapeño{s}|P'], { mix: [['ring', '#4f8a2a'], ['ring', '#7aaa4a']] })] },

/* ============ JAPANESE ============ */
{ id: 'japanese', n: 'Japanese', sub: 'Umami and pickles', palette: ['#f2d23a', '#3f6a3a', '#ee8a4a'],
  styles: [
    St('Teriyaki', '#4a200e', 'Stir soy, mirin, sake, sugar and grated ginger until the sugar dissolves.', ['2 tbsp|soy sauce|S', '2 tbsp|mirin|I', '1 tbsp|sake|I', '1 tsp|sugar|S', '10 g|ginger|P']),
    St('Miso-glazed', '#a8742a', 'Whisk white miso with mirin, sugar and a splash of sake.', ['2 tbsp|white miso|I', '1 tbsp|mirin|I', '1 tsp|sugar|S', '1 tbsp|sake|I']),
    St('Ginger', '#7a4a1a', 'Grate plenty of ginger into soy, mirin and sake. This is shogayaki.', ['30 g|ginger|P', '2 tbsp|soy sauce|S', '1 tbsp|mirin|I', '1 tbsp|sake|I']),
    St('Karaage', '#c8862a', 'Toss with soy, garlic and ginger for 15 minutes, then dredge in potato starch and shallow-fry until crisp.', ['1 tbsp|soy sauce|S', '2|garlic clove{s}|P', '10 g|ginger|P', '3 tbsp|potato starch|I']),
    St('Yakiniku', '#4a1e10', 'Mix soy, mirin, grated apple, garlic and sesame oil.', ['2 tbsp|soy sauce|S', '1 tbsp|mirin|I', '0.25|apple{s}|P', '1|garlic clove{s}|P', '1 tsp|sesame oil|S']),
    St('Yuzu shio', '#c8b860', 'Season with salt, yuzu (or lemon) zest and juice, a little sake and white pepper.', ['1|lemon{s}|P', '1 tbsp|sake|I', '0.25 tsp|white pepper|S'])],
  base: [
    O('Steamed Japanese rice', '#f5f3ec', 'rice', 'Rinse until clear, soak 30 minutes, then cook with 1.1 parts water.', ['1 cup|Japanese short-grain rice|R']),
    O('Sushi rice', '#f2eee2', 'rice', 'Fold seasoned rice vinegar and sugar through the warm rice while fanning it.', ['1 cup|Japanese short-grain rice|R', '2 tbsp|rice vinegar|S', '1 tsp|sugar|S']),
    O('Brown rice', '#cfb592', 'rice', 'Simmer 30 minutes, then rest 10 minutes off the heat.', ['1 cup|brown rice|R'], { fleck: '#9a7650' }),
    O('Zakkokumai', '#d6c6b6', 'rice', 'Stir a spoonful of mixed grains into the rice and cook with a little extra water.', ['0.85 cup|Japanese short-grain rice|R', '2 tbsp|mixed grains (barley, black rice)|R'], { fleck: '#5a2a3a' }),
    O('Ume-shiso rice', '#f3eee4', 'rice', 'Fold chopped umeboshi and shredded shiso through warm rice.', ['1 cup|Japanese short-grain rice|R', '2|umeboshi plum{s}|I'], { fleck: '#c84a5a' })],
  veg: [
    O('Spinach goma-ae', '#2f6b2f', 'leaf', 'Blanch, squeeze dry and dress with ground sesame, soy and sugar.', ['1 bunch|English spinach|P', '1 tbsp|toasted sesame seeds|S']),
    O('Cucumber sunomono', '#4f8a3a', 'slice', 'Slice paper-thin, salt, squeeze and dress with rice vinegar and sugar.', ['1|Lebanese cucumber{s}|P', '1 tbsp|rice vinegar|S'], { flesh: '#dcedc2' }),
    O('Edamame', '#7aa83a', 'dot', 'Boil 4 minutes from frozen, pod and salt.', ['150 g|frozen edamame|E']),
    O('Takuan', '#e9c62a', 'slice', 'Slice the pickled daikon into thin half-moons.', ['60 g|takuan (pickled daikon)|I'], { flesh: '#f6e27a' }),
    O('Simmered shiitake', '#5e3b26', 'mush', 'Simmer in dashi, soy and mirin until glossy.', ['6|fresh shiitake mushroom{s}|P', '1 tbsp|mirin|I']),
    O('Avocado', '#9db84a', 'slice', 'Slice and squeeze over a little lemon.', ['1|avocado{s}|P'], { flesh: '#d8e39a', skin: '#3d5a22' }),
    O('Carrot kinpira', '#e07a2a', 'strip', 'Stir-fry julienned carrot with soy, mirin and sesame until just tender.', ['1|carrot{s}|P', '1 tsp|soy sauce|S']),
    O('Wakame', '#3f6a3a', 'shred', 'Rehydrate 5 minutes and dress with sesame oil and rice vinegar.', ['5 g|dried wakame|I'], { core: '#5f8a4a' }),
    O('Pickled ginger', '#f0b8b0', 'shred', 'Drain and pile loosely.', ['30 g|pickled ginger (gari)|I'], { core: '#fbe2dc' }),
    O('Shredded cabbage', '#e6eccb', 'shred', 'Slice as finely as possible and keep in iced water until serving.', ['0.25|green cabbage|P'], { core: '#f8faec' }),
    O('Hijiki', '#1e1e16', 'shred', 'Soak, then simmer with carrot, soy, mirin and a little sugar.', ['10 g|dried hijiki|I', '1 tsp|soy sauce|S'], { core: '#3a3a2a' }),
    O('Renkon', '#ece2c8', 'slice', 'Slice lotus root and stir-fry with soy, mirin and chilli.', ['150 g|lotus root|I'], { flesh: '#f6f0e0', skin: '#d8c8a0' }),
    O('Roast kabocha', '#e8902a', 'chunk', 'Cut into wedges with the skin on and roast until tender, or simmer in dashi.', ['300 g|kabocha pumpkin|P'], { char: true }),
    O('Butter corn', '#f0c94a', 'dot', 'Pan-fry kernels with butter and a splash of soy.', ['1|corn cob{s}|P', '10 g|butter|E']),
    O('Nasu dengaku', '#5a2d5c', 'chunk', 'Score halved eggplant, roast and brush with sweet miso.', ['1|eggplant{s}|P', '1 tbsp|white miso|I'], { char: true }),
    O('Okra', '#5a8a2a', 'slice', 'Blanch 1 minute and slice into stars. Dress with soy and bonito.', ['100 g|okra|P'], { flesh: '#cfe0a8' }),
    O('Butter enoki', '#f2ecd8', 'sprout', 'Sear with butter and soy until just wilted.', ['100 g|enoki mushrooms|P', '10 g|butter|E'], { head: '#f6f0e0' }),
    O('Natto', '#9a7a3a', 'dot', 'Stir the natto with its sauce and mustard until stringy.', ['1 pack|natto|I'], { small: true })],
  centre: [
    O('Onsen tamago', '#fbf7ec', 'yolk', 'Hold eggs in 64°C water for 45 minutes, or cheat with a 6-minute boil.', ['2|egg{s}|E'], { veil: true }),
    O('Tamagoyaki', '#f5d044', 'roll', 'Roll thin layers of seasoned egg in a pan, then slice.', ['3|egg{s}|E', '1 tsp|mirin|I']),
    E.fried(),
    O('Ajitama', '#c9935a', 'jammy', 'Marinate 6½-minute eggs overnight in soy, mirin and water.', ['2|egg{s}|E', '2 tbsp|soy sauce|S', '2 tbsp|mirin|I']),
    O('Egg soboro', '#f5d044', 'crumble', 'Stir eggs with sugar and soy over low heat with chopsticks until fine and fluffy.', ['3|egg{s}|E', '1 tsp|sugar|S'])],
  sauce: [
    O('Goma dressing', '#c9a26b', 's', 'Whisk tahini, soy, rice vinegar and a little sugar until creamy.', ['2 tbsp|tahini|S', '1 tbsp|soy sauce|S', '1 tbsp|rice vinegar|S']),
    O('Ponzu', '#8a5a2a', 's', 'Mix soy with lemon or yuzu juice and a splash of mirin.', ['2 tbsp|soy sauce|S', '1|lemon{s}|P']),
    O('Spicy mayo', '#ee8a4a', 's', 'Stir sriracha through Kewpie mayonnaise.', ['3 tbsp|Kewpie mayonnaise|I', '1 tsp|sriracha|S']),
    O('Wasabi soy', '#5a4a2a', 's', 'Stir a little wasabi into soy with a drop of mirin.', ['2 tbsp|soy sauce|S', '1 tsp|wasabi paste|I'], { fleck: '#9ab84a' }),
    O('Tonkatsu sauce', '#4a2014', 's', 'Use bottled tonkatsu sauce, or mix Worcestershire, ketchup and oyster sauce.', ['3 tbsp|tonkatsu sauce|I']),
    O('Yuzu kosho dressing', '#b8c060', 's', 'Whisk yuzu kosho with olive oil, rice vinegar and a little honey.', ['1 tsp|yuzu kosho|I', '2 tbsp|olive oil|S', '1 tbsp|rice vinegar|S'], { fleck: '#5a7a2a' })],
  garnish: [
    O('Furikake', '#3a4a2a', 'g', 'Sprinkle generously.', ['1 tbsp|furikake|I'], { mix: [['seed', '#f1e4c0'], ['flake', '#24301f']] }),
    O('Nori and spring onion', '#1d271d', 'g', 'Cut nori into fine strips and slice the spring onion.', ['1|nori sheet{s}|I', '1|spring onion{s}|P'], { mix: [['nori', '#1d271d'], ['ring', '#6aa34a']] }),
    O('Bonito flakes', '#d9a87a', 'g', 'Pile on at the last second so they dance.', ['5 g|bonito flakes|I'], { mix: [['flake', '#d9a87a'], ['flake', '#b98058']] }),
    O('Shichimi togarashi', '#b8341a', 'g', 'Shake over the bowl.', ['1 tsp|shichimi togarashi|I'], { mix: [['flake', '#b8341a'], ['seed', '#f1e4c0']] }),
    O('Beni shoga', '#d8303a', 'g', 'Pile red pickled ginger threads on top.', ['30 g|beni shoga (red pickled ginger)|I'], { mix: [['nori', '#d8303a'], ['nori', '#e85a62']] })] },

/* ============ THAI ============ */
{ id: 'thai', n: 'Thai', sub: 'Herbs, lime and heat', palette: ['#e04a2a', '#b8d06a', '#3f7a32'],
  styles: [
    St('Lemongrass', '#5a3010', 'Pound the lemongrass and garlic, then mix with fish sauce and palm sugar.', ['1|lemongrass stalk{s}|P', '1 tbsp|fish sauce (or light soy)|S', '1 tbsp|palm sugar|I', '2|garlic clove{s}|P']),
    St('Red curry', '#b8341a', 'Fry red curry paste in a little coconut cream until fragrant, then add fish sauce and palm sugar.', ['1.5 tbsp|red curry paste|I', '100 ml|coconut milk|S', '1 tsp|fish sauce (or light soy)|S', '1 tsp|palm sugar|I'], { step: 'Fry the red curry paste' }),
    St('Green curry', '#5a8a2a', 'Fry green curry paste in coconut cream, then add fish sauce, palm sugar and torn kaffir lime leaves.', ['1.5 tbsp|green curry paste|I', '100 ml|coconut milk|S', '1 tsp|fish sauce (or light soy)|S', '3|kaffir lime lea{f/ves}|P'], { step: 'Fry the green curry paste' }),
    St('Satay', '#c8862a', 'Mix coconut milk, curry powder, turmeric, palm sugar and fish sauce. Thread onto skewers if you like.', ['100 ml|coconut milk|S', '1 tsp|curry powder|S', '0.5 tsp|ground turmeric|S', '1 tbsp|palm sugar|I', '1 tsp|fish sauce (or light soy)|S']),
    St('Larb', '#9a6a3a', 'Mix lime juice, fish sauce, chilli flakes and toasted rice powder. Toss with the cooked protein, shallot and lots of mint.', ['2|lime{s}|P', '1 tbsp|fish sauce (or light soy)|S', '1 tsp|chilli flakes|S', '1 tbsp|glutinous rice|R', '0.5 bunch|mint|P'], { step: 'Make the larb dressing' }),
    St('Garlic pepper', '#a8763a', 'Pound garlic, white pepper and coriander root, then mix with oyster sauce. This is kratiem prik thai.', ['5|garlic clove{s}|P', '0.5 tsp|white pepper|S', '1 tbsp|oyster sauce|S']),
    St('Krapow', '#5a3a1a', 'Pound garlic and bird’s eye chilli. Stir-fry with the protein, then add oyster sauce, soy and a big handful of holy basil.', ['3|garlic clove{s}|P', '3|bird’s eye chilli{es}|P', '1 tbsp|oyster sauce|S', '1 bunch|holy or Thai basil|P'], { step: 'Pound the garlic and chilli' })],
  base: [
    O('Jasmine rice', '#f5f2ea', 'rice', 'Rinse twice and cook with 1.25 parts water. Rest 10 minutes.', ['1 cup|jasmine rice|R'], { long: true }),
    O('Sticky rice', '#f2eee2', 'rice', 'Soak glutinous rice 4 hours or overnight, then steam 20 minutes.', ['1 cup|glutinous rice|R']),
    O('Coconut rice', '#f4efe2', 'rice', 'Cook jasmine rice in half coconut milk, half water, with a pinch of salt.', ['1 cup|jasmine rice|R', '200 ml|coconut milk|S'], { long: true }),
    O('Brown jasmine rice', '#cfb592', 'rice', 'Simmer 25 minutes, then rest 10 minutes off the heat.', ['1 cup|brown jasmine rice|R'], { fleck: '#9a7650', long: true }),
    O('Riceberry rice', '#b8a0b8', 'rice', 'Cook Thai riceberry (or black rice mixed with jasmine) with a little extra water.', ['0.5 cup|riceberry or black rice|R', '0.5 cup|jasmine rice|R'], { fleck: '#3a1a3a', long: true })],
  veg: [
    O('Green papaya salad', '#b8d06a', 'strip', 'Shred, then bruise lightly with lime, fish sauce, palm sugar and chilli.', ['200 g|green papaya|I', '1|lime{s}|P', '1|bird’s eye chilli{es}|P']),
    O('Cucumber and Thai basil', '#5f9a50', 'chunk', 'Cut into chunks and toss with torn Thai basil and lime.', ['1|Lebanese cucumber{s}|P', '0.5 bunch|holy or Thai basil|P']),
    O('Morning glory', '#3f7a32', 'leaf', 'Stir-fry over fierce heat with garlic, chilli and oyster sauce.', ['1 bunch|morning glory (water spinach)|P', '1 tbsp|oyster sauce|S']),
    O('Bean sprouts and mint', '#e9e6c0', 'sprout', 'Toss raw sprouts with torn mint and a squeeze of lime.', ['150 g|mung bean sprouts|P', '0.5 bunch|mint|P'], { head: '#cfdc8a' }),
    O('Snake beans', '#4f8a2a', 'strip', 'Cut into 4 cm lengths and stir-fry with garlic until blistered.', ['150 g|snake beans|P'], { char: true }),
    O('Roast pumpkin', '#e88a2a', 'chunk', 'Cube, toss with oil and roast 25 minutes at 220°C.', ['300 g|Kent pumpkin|P'], { char: true }),
    O('Charred eggplant', '#5a2d5c', 'chunk', 'Char whole eggplant, peel, tear and dress with lime and fish sauce.', ['1|eggplant{s}|P'], { char: true }),
    O('Red cabbage slaw', '#7a2f6a', 'shred', 'Shred finely and toss with lime and a pinch of sugar.', ['0.25|red cabbage|P'], { core: '#e8d4ea' }),
    O('Ajad relish', '#8cbf6a', 'slice', 'Slice cucumber and shallot thinly into warm sweet vinegar with chilli.', ['1|Lebanese cucumber{s}|P', '2|red shallot{s}|P', '2 tbsp|white vinegar|S'], { flesh: '#e0f0c8' }),
    O('Baby corn', '#f0d070', 'strip', 'Halve lengthways and stir-fry 2 minutes with garlic.', ['125 g|baby corn|P']),
    O('Pomelo', '#f2b8a0', 'chunk', 'Peel and break into juicy pieces. Dress with lime, fish sauce and toasted coconut.', ['0.5|pomelo{s}|P']),
    O('Thai herb salad', '#4c8c34', 'leaf', 'Pick Thai basil, mint and coriander and toss with sliced shallot and lime.', ['0.5 bunch|mint|P', '0.5 bunch|coriander|P', '2|red shallot{s}|P']),
    O('Green mango salad', '#d8e08a', 'strip', 'Julienne sour green mango and toss with fish sauce, sugar, chilli and roasted peanuts.', ['1|green mango{es}|P', '20 g|roasted peanuts|S']),
    O('Pickled mustard greens', '#a8a24a', 'shred', 'Rinse, slice and fry briefly with a pinch of sugar.', ['80 g|pickled mustard greens|I'], { core: '#c9b96a' }),
    O('Charred pineapple', '#f4cf5e', 'chunk', 'Cut into wedges and char in a very hot pan.', ['0.25|pineapple{s}|P'], { char: true }),
    O('Asian greens', '#2e6b3a', 'leaf', 'Stir-fry gai lan or choy sum with garlic and oyster sauce.', ['1 bunch|gai lan|P', '1 tbsp|oyster sauce|S'])],
  centre: [
    E.crispy('Khai dao'),
    E.jammy(),
    O('Son-in-law egg', '#c88a3a', 'jammy', 'Deep-fry boiled eggs until blistered, then spoon over a tamarind caramel.', ['2|egg{s}|E', '1 tbsp|tamarind purée|I', '1 tbsp|palm sugar|I']),
    O('Khai jiao', '#f2c84a', 'disc', 'Whisk eggs with fish sauce and pour into very hot oil so the omelette puffs and crisps.', ['3|egg{s}|E', '1 tsp|fish sauce (or light soy)|S']),
    O('Salted egg', '#eeeee0', 'jammy', 'Halve a cooked salted duck egg.', ['1|salted duck egg{s}|I'])],
  sauce: [
    O('Nam jim jaew', '#7a2a14', 's', 'Mix lime, fish sauce, palm sugar, chilli flakes and toasted rice powder.', ['2 tbsp|fish sauce (or light soy)|S', '1|lime{s}|P', '1 tsp|chilli flakes|S'], { fleck: '#c9a46a' }),
    O('Peanut sauce', '#b5793a', 's', 'Simmer peanut butter, coconut milk, red curry paste and lime until smooth.', ['2 tbsp|peanut butter|S', '100 ml|coconut milk|S', '1 tsp|red curry paste|I']),
    O('Sweet chilli and lime', '#e04a2a', 's', 'Loosen sweet chilli sauce with lime juice.', ['3 tbsp|sweet chilli sauce|S', '1|lime{s}|P'], { fleck: '#8a1a0a' }),
    O('Nam jim seafood', '#a8c060', 's', 'Pound green chilli, garlic and coriander, then add lime, fish sauce and sugar.', ['2|green chilli{es}|P', '1|lime{s}|P', '1 tbsp|fish sauce (or light soy)|S'], { fleck: '#3f7a2a' }),
    O('Green curry sauce', '#7aa040', 's', 'Simmer green curry paste with coconut milk until thick.', ['1 tbsp|green curry paste|I', '150 ml|coconut milk|S']),
    O('Prik nam pla', '#c8a04a', 's', 'Slice bird’s eye chillies into fish sauce with a squeeze of lime.', ['2 tbsp|fish sauce (or light soy)|S', '2|bird’s eye chilli{es}|P'], { fleck: '#d8301a' })],
  garnish: [
    O('Toasted rice and mint', '#d9c08a', 'g', 'Dry-toast rice until golden, grind coarsely and scatter with mint.', ['1 tbsp|glutinous rice|R', '0.5 bunch|mint|P'], { mix: [['flake', '#d9c08a'], ['herb', '#4c8c34']] }),
    O('Peanuts and coriander', '#c49155', 'g', 'Crush the peanuts and pick the coriander.', ['30 g|roasted peanuts|S', '0.5 bunch|coriander|P'], { mix: [['flake', '#c49155'], ['herb', '#4c8c34']] }),
    O('Crispy shallots', '#b9793a', 'g', 'Scatter straight from the jar.', ['2 tbsp|fried shallots|I'], { mix: [['flake', '#b9793a'], ['flake', '#8a5524']] }),
    O('Crispy garlic', '#d9a85a', 'g', 'Fry thinly sliced garlic gently until pale gold.', ['4|garlic clove{s}|P'], { mix: [['flake', '#e2b86a'], ['flake', '#c8903a']] }),
    O('Bird’s eye chilli', '#d8301a', 'g', 'Slice into fine rings. Go easy.', ['2|bird’s eye chilli{es}|P'], { mix: [['ring', '#d8301a'], ['ring', '#5a9a3a']] })] },

/* ============ VIETNAMESE ============ */
{ id: 'vietnamese', n: 'Vietnamese', sub: 'Fresh herbs and fish sauce', palette: ['#f0a050', '#4c8c34', '#e8b860'],
  styles: [
    St('Caramel', '#7a3a12', 'Make a quick dark caramel, then add fish sauce, shallot and black pepper. This is the bún chả flavour.', ['2 tbsp|sugar|S', '1.5 tbsp|fish sauce (or light soy)|S', '2|red shallot{s}|P', '0.5 tsp|black pepper|S'], { step: 'Make the caramel marinade' }),
    St('Lemongrass chilli', '#b8862a', 'Mince lemongrass, garlic and chilli and mix with fish sauce, sugar and a little oil.', ['2|lemongrass stalk{s}|P', '2|garlic clove{s}|P', '1|long red chilli{es}|P', '1 tbsp|fish sauce (or light soy)|S', '1 tsp|sugar|S']),
    St('Five-spice', '#6a3a1a', 'Mix five spice, honey, garlic, soy and fish sauce.', ['1 tsp|Chinese five spice|S', '1 tbsp|honey|S', '2|garlic clove{s}|P', '1 tbsp|soy sauce|S']),
    St('Shaking', '#4a2a14', 'Toss with oyster sauce, soy, sugar and plenty of black pepper. Sear hard and finish with butter. This is lúc lắc.', ['1 tbsp|oyster sauce|S', '1 tsp|soy sauce|S', '1 tsp|black pepper|S', '15 g|butter|E']),
    St('Claypot', '#5a2410', 'Simmer in caramel, fish sauce, coconut water and black pepper until sticky. This is kho.', ['1.5 tbsp|sugar|S', '1.5 tbsp|fish sauce (or light soy)|S', '150 ml|coconut water|S', '0.5 tsp|black pepper|S'], { step: 'Make the kho caramel' })],
  base: [
    O('Broken rice', '#f4f1e8', 'rice', 'Rinse broken rice (cơm tấm) and steam or cook with 1.1 parts water.', ['1 cup|broken rice|I'], { small: true }),
    O('Jasmine rice', '#f5f2ea', 'rice', 'Rinse twice and cook with 1.25 parts water.', ['1 cup|jasmine rice|R'], { long: true }),
    O('Rice vermicelli', '#f6f3ea', 'rice', 'Soak or boil the noodles, rinse cold and drain well.', ['150 g|rice vermicelli|I'], { long: true }),
    O('Coconut rice', '#f4efe2', 'rice', 'Cook jasmine rice in half coconut milk, half water, with a pinch of salt.', ['1 cup|jasmine rice|R', '200 ml|coconut milk|S'], { long: true }),
    O('Scallion rice', '#eceed0', 'rice', 'Fold mỡ hành (spring onion oil) through hot jasmine rice.', ['1 cup|jasmine rice|R', '3|spring onion{s}|P'], { fleck: '#5a9a3a', long: true })],
  veg: [
    O('Đồ chua', '#f0a050', 'strip', 'Julienne carrot and daikon and pickle in warm vinegar, sugar and salt for 30 minutes.', ['1|carrot{s}|P', '150 g|daikon|P', '60 ml|white vinegar|S']),
    O('Cucumber batons', '#7fb069', 'strip', 'Cut into batons, skin on.', ['1|Lebanese cucumber{s}|P']),
    O('Herb plate', '#4c8c34', 'leaf', 'Pick mint, Thai basil, coriander and perilla. Keep the leaves whole.', ['0.5 bunch|mint|P', '0.5 bunch|holy or Thai basil|P', '0.5 bunch|coriander|P']),
    O('Bean sprouts', '#e9e6c0', 'sprout', 'Rinse and serve raw for crunch.', ['150 g|mung bean sprouts|P'], { head: '#cfdc8a' }),
    O('Shredded lettuce', '#9cc96a', 'shred', 'Slice butter lettuce into ribbons.', ['0.5|butter lettuce|P'], { core: '#e6f2c8' }),
    O('Dưa cải', '#a8a24a', 'shred', 'Slice pickled mustard greens and squeeze out the brine.', ['80 g|pickled mustard greens|I'], { core: '#c9b96a' }),
    O('Mango', '#f2b632', 'chunk', 'Cut ripe mango into slices.', ['1|mango{es}|P']),
    O('Green papaya', '#b8d06a', 'strip', 'Shred and dress with lime, fish sauce and sugar.', ['200 g|green papaya|I']),
    O('Bắp xào', '#f0c94a', 'dot', 'Stir-fry corn kernels with butter, spring onion and dried shrimp if you have it.', ['1|corn cob{s}|P', '10 g|butter|E']),
    O('Eggplant with scallion oil', '#5a2d5c', 'chunk', 'Char eggplant, peel, tear and spoon over spring onion oil and fish sauce.', ['1|eggplant{s}|P', '2|spring onion{s}|P'], { char: true }),
    O('Rau muống', '#3f7a32', 'leaf', 'Stir-fry water spinach hard with lots of garlic.', ['1 bunch|morning glory (water spinach)|P', '3|garlic clove{s}|P']),
    O('Banana blossom salad', '#e8c8c8', 'shred', 'Shred banana blossom into acidulated water, drain and dress with lime and herbs.', ['1 can|banana blossom|I'], { core: '#f6eaea' }),
    O('Pickled onion', '#e8a8c0', 'shred', 'Slice onion thinly and pickle in vinegar and sugar for 20 minutes.', ['1|brown onion{s}|P', '60 ml|white vinegar|S'], { core: '#f6e4ec' }),
    O('Pineapple', '#f4cf5e', 'chunk', 'Cut into small wedges.', ['0.25|pineapple{s}|P'])],
  centre: [E.fried(), E.crispy(),
    O('Chả trứng', '#e8b86a', 'disc', 'Steam beaten egg with pork mince, glass noodles and wood ear, brushing the top with yolk.', ['3|egg{s}|E', '100 g|pork mince|M']),
    E.jammy()],
  sauce: [
    O('Nước chấm', '#e8b860', 's', 'Dissolve sugar in warm water, then add fish sauce, lime, garlic and chilli.', ['2 tbsp|fish sauce (or light soy)|S', '1 tbsp|sugar|S', '1|lime{s}|P', '1|garlic clove{s}|P'], { fleck: '#c83a1a' }),
    O('Peanut hoisin', '#7a4a24', 's', 'Warm hoisin with peanut butter and a little water. Top with crushed peanuts.', ['2 tbsp|hoisin sauce|S', '1 tbsp|peanut butter|S'], { fleck: '#d4a060' }),
    O('Mỡ hành', '#8ab84a', 's', 'Pour hot oil over sliced spring onion with a pinch of salt and sugar.', ['3|spring onion{s}|P', '3 tbsp|neutral oil|S'], { fleck: '#3f7a2a' }),
    O('Sriracha lime', '#d84a2a', 's', 'Stir sriracha with lime juice and a little honey.', ['2 tbsp|sriracha|S', '1|lime{s}|P']),
    O('Ginger fish sauce', '#d8b070', 's', 'Mix grated ginger into fish sauce with lime, sugar and chilli.', ['20 g|ginger|P', '1.5 tbsp|fish sauce (or light soy)|S', '1 tsp|sugar|S'], { fleck: '#f0d8a0' })],
  garnish: [
    O('Fried shallots and peanuts', '#b9793a', 'g', 'Scatter fried shallots and crushed peanuts.', ['2 tbsp|fried shallots|I', '20 g|roasted peanuts|S'], { mix: [['flake', '#b9793a'], ['flake', '#d4a060']] }),
    O('Mint and coriander', '#4c8c34', 'g', 'Tear the leaves over the top.', ['0.5 bunch|mint|P', '0.5 bunch|coriander|P'], { mix: [['herb', '#4c8c34'], ['herb', '#6aa34a']] }),
    O('Chilli and spring onion', '#d8301a', 'g', 'Slice both into fine rings.', ['1|long red chilli{es}|P', '1|spring onion{s}|P'], { mix: [['ring', '#d8301a'], ['ring', '#6aa34a']] }),
    O('Toasted sesame', '#f1e4c0', 'g', 'Toast sesame seeds until golden.', ['1 tbsp|toasted sesame seeds|S'], { mix: [['seed', '#f1e4c0'], ['seed', '#d8c090']] })] },

/* ============ INDIAN ============ */
{ id: 'indian', n: 'Indian', sub: 'Tandoor and tadka', palette: ['#c8401a', '#f2d26a', '#4c8c34'],
  styles: [
    St('Tandoori', '#c8401a', 'Mix yoghurt with tandoori masala, Kashmiri chilli, lemon, garlic and ginger. Marinate at least 30 minutes.', ['3 tbsp|Greek yoghurt|E', '1 tbsp|tandoori masala|S', '1 tsp|Kashmiri chilli powder|S', '1|lemon{s}|P', '2|garlic clove{s}|P', '10 g|ginger|P']),
    St('Butter masala', '#d8702a', 'Simmer tomato passata with butter, garam masala, fenugreek leaves and a splash of cream. Toss the cooked protein through.', ['150 ml|tomato passata|S', '20 g|butter|E', '1 tsp|garam masala|S', '1 tsp|dried fenugreek leaves (kasuri methi)|I', '2 tbsp|cream|E'], { step: 'Make the butter masala sauce' }),
    St('Kashmiri chilli', '#a8301a', 'Mix Kashmiri chilli, cumin, garlic, ginger, vinegar and a little oil into a red paste.', ['2 tsp|Kashmiri chilli powder|S', '1 tsp|ground cumin|S', '2|garlic clove{s}|P', '10 g|ginger|P', '1 tbsp|white vinegar|S']),
    St('Achari', '#a8761a', 'Toast mustard, fennel, nigella and fenugreek seeds, grind and mix with yoghurt, turmeric and lemon.', ['1 tsp|mustard seeds|S', '1 tsp|fennel seeds|S', '0.5 tsp|nigella seeds|I', '2 tbsp|Greek yoghurt|E', '0.5 tsp|ground turmeric|S']),
    St('Malabar pepper', '#7a5a2a', 'Fry curry leaves, then add black pepper, coconut, turmeric and garlic. Coat the protein and finish with lime.', ['10|curry lea{f/ves}|P', '1 tsp|black pepper|S', '2 tbsp|desiccated coconut|S', '0.5 tsp|ground turmeric|S', '1|lime{s}|P']),
    St('Tikka', '#c8562a', 'Mix yoghurt, tikka paste, lemon and a pinch of smoked paprika. Grill or pan-char hard.', ['3 tbsp|Greek yoghurt|E', '2 tbsp|tikka paste|I', '1|lemon{s}|P', '0.5 tsp|smoked paprika|S'])],
  base: [
    O('Basmati rice', '#f5f2ea', 'rice', 'Rinse, soak 20 minutes and cook with 1.5 parts water and a pinch of salt.', ['1 cup|basmati rice|R'], { long: true }),
    O('Jeera rice', '#f2ecd8', 'rice', 'Fry cumin seeds in ghee, add the rice and cook as usual.', ['1 cup|basmati rice|R', '1 tsp|cumin seeds|S', '1 tbsp|ghee|E'], { fleck: '#6a4a2a', long: true }),
    O('Lemon rice', '#f2d26a', 'rice', 'Fry mustard seeds, curry leaves and turmeric in oil and fold through rice with lemon juice.', ['1 cup|basmati rice|R', '1 tsp|mustard seeds|S', '0.5 tsp|ground turmeric|S', '1|lemon{s}|P'], { fleck: '#2a1a10', long: true }),
    O('Coconut rice', '#f4efe2', 'rice', 'Cook rice and fold through fresh coconut fried with mustard seeds and curry leaves.', ['1 cup|basmati rice|R', '3 tbsp|desiccated coconut|S'], { long: true }),
    O('Brown basmati', '#d4bc98', 'rice', 'Simmer 25 minutes with a bay leaf and a cardamom pod.', ['1 cup|brown basmati rice|R'], { fleck: '#9a7650', long: true })],
  veg: [
    O('Kachumber', '#d8432b', 'chunk', 'Finely dice cucumber, tomato and red onion. Season with lemon, salt and chaat masala.', ['1|Lebanese cucumber{s}|P', '1|tomato{es}|P', '0.5|red onion{s}|P'], { small: true }),
    O('Saag', '#2f5f2a', 'leaf', 'Wilt spinach with garlic, ginger, green chilli and garam masala.', ['1 bunch|English spinach|P', '1|garlic clove{s}|P', '1|green chilli{es}|P']),
    O('Jeera aloo', '#e8c06a', 'chunk', 'Fry boiled potato cubes with cumin seeds, turmeric and chilli until crisp.', ['2|potato{es}|P', '1 tsp|cumin seeds|S'], { char: true }),
    O('Chana masala', '#c8903a', 'dot', 'Simmer chickpeas with onion, tomato and chana masala until thick.', ['1 can|chickpeas|S', '1 tsp|chana masala|S']),
    O('Roast gobi', '#f0dca0', 'chunk', 'Toss cauliflower florets with turmeric, cumin and oil and roast until charred.', ['0.5|cauliflower|P', '0.5 tsp|ground turmeric|S'], { char: true }),
    O('Laccha onion', '#d87aa8', 'shred', 'Slice red onion into rings and toss with lemon, chilli powder and salt.', ['1|red onion{s}|P', '1|lemon{s}|P'], { core: '#f6dcea' }),
    O('Bhindi', '#5a8a2a', 'slice', 'Fry sliced okra until crisp with amchur and chilli.', ['150 g|okra|P'], { flesh: '#cfe0a8' }),
    O('Gajar salad', '#e8742a', 'strip', 'Grate carrot and toss with mustard seeds tempered in oil, lemon and salt.', ['2|carrot{s}|P', '0.5 tsp|mustard seeds|S']),
    O('Tadka dal', '#e8b83a', 'mash', 'Simmer red lentils with turmeric until soft, then pour over ghee sizzled with cumin and garlic.', ['0.5 cup|red lentils|S', '1 tbsp|ghee|E']),
    O('Baingan bharta', '#7a5a3a', 'mash', 'Char eggplant until collapsed, scoop the flesh and fry with onion, tomato and spices.', ['1|eggplant{s}|P', '1|tomato{es}|P']),
    O('Ripe mango', '#f2b632', 'chunk', 'Cut into cubes.', ['1|mango{es}|P']),
    O('Masala pumpkin', '#e88a2a', 'chunk', 'Roast cubes with garam masala, chilli and a drizzle of honey.', ['300 g|Kent pumpkin|P', '1 tsp|garam masala|S'], { char: true }),
    O('Matar', '#7ab83a', 'dot', 'Warm peas with cumin, butter and a little mint.', ['150 g|frozen peas|E']),
    O('Cabbage thoran', '#e8e8b0', 'shred', 'Stir-fry shredded cabbage with mustard seeds, curry leaves, turmeric and grated coconut.', ['0.25|green cabbage|P', '2 tbsp|desiccated coconut|S'], { core: '#f6f6dc' }),
    O('Cucumber ribbons', '#7fb069', 'strip', 'Shave cucumber and season with lime and black salt.', ['1|Lebanese cucumber{s}|P'])],
  centre: [E.fried(),
    O('Egg bhurji', '#f2c84a', 'crumble', 'Scramble eggs with onion, tomato, green chilli and turmeric.', ['3|egg{s}|E', '1|green chilli{es}|P']),
    O('Masala omelette', '#f0c050', 'disc', 'Beat eggs with onion, chilli and coriander and fry as small thick omelettes.', ['3|egg{s}|E', '0.25|red onion{s}|P']),
    O('Grilled paneer', '#f4ead0', 'disc', 'Slice paneer thickly and char in a hot pan with a little ghee.', ['150 g|paneer|E']),
    E.jammy()],
  sauce: [
    O('Green chutney', '#4c8c34', 's', 'Blend coriander, mint, green chilli, lemon and a little yoghurt.', ['0.5 bunch|coriander|P', '0.5 bunch|mint|P', '1|green chilli{es}|P'], { fleck: '#2a5a1a' }),
    O('Tamarind chutney', '#5a2a14', 's', 'Simmer tamarind with jaggery, cumin and ginger until syrupy.', ['2 tbsp|tamarind purée|I', '1 tbsp|jaggery or brown sugar|S']),
    O('Mango chutney', '#e8a030', 's', 'Spoon from the jar, chopping any big pieces.', ['3 tbsp|mango chutney|S'], { fleck: '#c87a10' }),
    O('Cucumber raita', '#f2f0e4', 's', 'Stir grated cucumber, cumin and mint into yoghurt with a pinch of salt.', ['150 g|Greek yoghurt|E', '0.5|Lebanese cucumber{s}|P'], { fleck: '#5a9a3a' }),
    O('Lime pickle', '#8a8a2a', 's', 'Chop a spoonful of lime pickle finely and loosen with oil.', ['2 tbsp|lime pickle|I'], { fleck: '#4a3a10' })],
  garnish: [
    O('Crispy curry leaves', '#2f5f2a', 'g', 'Fry curry leaves in hot oil until they stop sizzling.', ['15|curry lea{f/ves}|P'], { mix: [['herb', '#2f5f2a'], ['herb', '#4a7a3a']] }),
    O('Coriander and chilli', '#4c8c34', 'g', 'Chop coriander and slice green chilli.', ['0.5 bunch|coriander|P', '1|green chilli{es}|P'], { mix: [['herb', '#4c8c34'], ['ring', '#5a9a2a']] }),
    O('Sev', '#e8b860', 'g', 'Scatter crisp chickpea noodles just before serving.', ['30 g|sev (chickpea noodles)|I'], { mix: [['nori', '#e8b860'], ['nori', '#d8a040']] }),
    O('Pomegranate', '#c8203a', 'g', 'Knock the seeds out of half a pomegranate.', ['0.5|pomegranate{s}|P'], { mix: [['seed', '#c8203a'], ['seed', '#e84a5a']] })] },

/* ============ MIDDLE EASTERN ============ */
{ id: 'levant', n: 'Middle Eastern', sub: 'Spice, char and tahini', palette: ['#9a4a1a', '#4c8c34', '#c8203a'],
  styles: [
    St('Shawarma', '#9a4a1a', 'Mix cumin, coriander, paprika, turmeric, cinnamon, lemon, garlic and olive oil.', ['1 tsp|ground cumin|S', '1 tsp|ground coriander|S', '1 tsp|smoked paprika|S', '0.5 tsp|ground turmeric|S', '1|lemon{s}|P', '2|garlic clove{s}|P']),
    St('Za’atar lemon', '#6a6a2a', 'Rub with za’atar, lemon zest and juice, garlic and olive oil.', ['2 tbsp|za’atar|I', '1|lemon{s}|P', '2|garlic clove{s}|P', '2 tbsp|olive oil|S']),
    St('Harissa', '#b8301a', 'Mix harissa with olive oil, honey and a little lemon.', ['2 tbsp|harissa paste|I', '1 tbsp|olive oil|S', '1 tsp|honey|S']),
    St('Sumac', '#8a2a3a', 'Toss with sumac, allspice, garlic, olive oil and lemon. Finish with sliced red onion.', ['1 tbsp|sumac|I', '0.5 tsp|ground allspice|S', '2|garlic clove{s}|P', '0.5|red onion{s}|P']),
    St('Baharat', '#6a3a1a', 'Mix baharat with grated onion, garlic, olive oil and a little pomegranate molasses.', ['2 tsp|baharat spice|I', '0.5|brown onion{s}|P', '1 tsp|pomegranate molasses|I']),
    St('Ras el hanout honey', '#a8601a', 'Mix ras el hanout with honey, garlic, lemon and olive oil.', ['2 tsp|ras el hanout|I', '1 tbsp|honey|S', '1|garlic clove{s}|P', '1|lemon{s}|P'])],
  base: [
    O('Saffron rice', '#f4d870', 'rice', 'Steep saffron in hot water and stir through basmati as it cooks.', ['1 cup|basmati rice|R', '1 pinch|saffron|I'], { long: true }),
    O('Vermicelli rice', '#f2ecdc', 'rice', 'Brown broken vermicelli in butter, add rice and cook with stock.', ['0.85 cup|basmati rice|R', '30 g|vermicelli noodles|S'], { fleck: '#b8803a', long: true }),
    O('Freekeh', '#b8a070', 'rice', 'Simmer cracked freekeh 20 minutes with a little cumin and salt.', ['1 cup|cracked freekeh|R'], { fleck: '#5a6a2a' }),
    O('Bulgur pilaf', '#d9c08a', 'rice', 'Fry onion and tomato paste, add bulgur and stock, cover and steam 15 minutes.', ['1 cup|coarse bulgur|R', '1 tbsp|tomato paste|S'], { fleck: '#a85a2a' }),
    O('Jewelled rice', '#f2e2a8', 'rice', 'Fold pistachios, barberries or currants and orange zest through saffron rice.', ['1 cup|basmati rice|R', '20 g|pistachios|S', '20 g|currants|S'], { fleck: '#c8203a', long: true })],
  veg: [
    O('Tabbouleh', '#4c8c34', 'leaf', 'Chop lots of parsley and mint with a little bulgur, tomato, lemon and olive oil.', ['1 bunch|flat-leaf parsley|P', '0.5 bunch|mint|P', '1|tomato{es}|P', '1|lemon{s}|P'], { small: true }),
    O('Fattoush', '#8cbf6a', 'chunk', 'Toss cucumber, tomato, radish and lettuce with sumac dressing and crisp pita.', ['1|Lebanese cucumber{s}|P', '1|tomato{es}|P', '2|radish{es}|P', '1|pita bread|R']),
    O('Pink pickled turnips', '#d84a8a', 'strip', 'Slice into batons straight from the jar.', ['80 g|pickled turnips|I']),
    O('Roast cauliflower', '#f0dca0', 'chunk', 'Roast florets with cumin until deeply charred.', ['0.5|cauliflower|P', '1 tsp|ground cumin|S'], { char: true }),
    O('Hummus', '#e8d09a', 'mash', 'Blend chickpeas with tahini, lemon, garlic and iced water until very smooth.', ['1 can|chickpeas|S', '2 tbsp|tahini|S', '1|lemon{s}|P']),
    O('Baba ganoush', '#c8a87a', 'mash', 'Char eggplant until collapsed, scoop and mash with tahini, garlic and lemon.', ['1|eggplant{s}|P', '1 tbsp|tahini|S']),
    O('Shirazi salad', '#d8432b', 'chunk', 'Dice cucumber, tomato and onion finely and dress with lime and dried mint.', ['1|Lebanese cucumber{s}|P', '1|tomato{es}|P'], { small: true }),
    O('Cumin carrots', '#e8742a', 'strip', 'Roast carrot batons with cumin and honey until caramelised.', ['3|carrot{s}|P', '1 tsp|ground cumin|S'], { char: true }),
    O('Crispy chickpeas', '#d4a060', 'dot', 'Pat dry and roast with paprika and oil until crunchy.', ['1 can|chickpeas|S', '1 tsp|smoked paprika|S']),
    O('Beetroot and dill', '#8a1a3a', 'chunk', 'Dice roasted beetroot and toss with dill, lemon and olive oil.', ['2|beetroot{s}|P', '0.5 bunch|dill|P']),
    O('Muhammara', '#c8502a', 'mash', 'Blend roasted capsicum with walnuts, breadcrumbs, pomegranate molasses and Aleppo pepper.', ['2|red capsicum{s}|P', '40 g|walnuts|S', '1 tbsp|pomegranate molasses|I']),
    O('Olives', '#4a4a2a', 'dot', 'Halve mixed olives and marinate in olive oil and orange zest.', ['100 g|mixed olives|E']),
    O('Pickled cucumbers', '#6a8a3a', 'slice', 'Slice small pickles into rounds.', ['4|small pickled cucumber{s}|I'], { flesh: '#d8e0a8' }),
    O('Charred zucchini', '#6e9a3a', 'slice', 'Slice into rounds, char and dress with mint and lemon.', ['1|zucchini|P'], { flesh: '#e4ecc0' }),
    O('Herbed lentils', '#6a5a3a', 'dot', 'Toss cooked brown lentils with lemon, olive oil, parsley and cumin.', ['1 can|brown lentils|S'], { small: true })],
  centre: [
    E.crispy('Aleppo fried egg'),
    O('Grilled haloumi', '#f0e0b0', 'disc', 'Slice haloumi and grill until golden. Squeeze over lemon.', ['150 g|haloumi|E']),
    O('Feta', '#f6f3ea', 'crumble', 'Crumble feta and drizzle with olive oil and oregano.', ['80 g|feta|E']),
    O('Labneh', '#f6f2e6', 'yolk', 'Spoon thick labneh into the centre and make a well for olive oil.', ['150 g|labneh|E'], { veil: true }),
    E.jammy()],
  sauce: [
    O('Tahini lemon', '#e8dcc0', 's', 'Whisk tahini with lemon, garlic and iced water until creamy.', ['3 tbsp|tahini|S', '1|lemon{s}|P', '1|garlic clove{s}|P']),
    O('Zhoug', '#4c7c2a', 's', 'Blend coriander, parsley, green chilli, garlic, cumin and olive oil.', ['0.5 bunch|coriander|P', '2|green chilli{es}|P', '1|garlic clove{s}|P'], { fleck: '#2a4a1a' }),
    O('Toum', '#f6f2e6', 's', 'Blend garlic and lemon, then stream in oil until thick and fluffy, or stir crushed garlic into thick yoghurt.', ['4|garlic clove{s}|P', '1|lemon{s}|P', '150 ml|neutral oil|S']),
    O('Pomegranate molasses', '#5a1a1a', 's', 'Mix pomegranate molasses with olive oil and a pinch of chilli.', ['2 tbsp|pomegranate molasses|I', '2 tbsp|olive oil|S']),
    O('Amba', '#e8a82a', 's', 'Spoon pickled mango sauce from the jar, or blend mango with fenugreek, turmeric and vinegar.', ['3 tbsp|amba (pickled mango sauce)|I'], { fleck: '#a87a10' })],
  garnish: [
    O('Za’atar and sesame', '#6a6a2a', 'g', 'Sprinkle za’atar over the bowl.', ['1 tbsp|za’atar|I'], { mix: [['flake', '#6a6a2a'], ['seed', '#f1e4c0']] }),
    O('Pomegranate and mint', '#c8203a', 'g', 'Scatter pomegranate seeds and torn mint.', ['0.5|pomegranate{s}|P', '0.5 bunch|mint|P'], { mix: [['seed', '#c8203a'], ['herb', '#4c8c34']] }),
    O('Sumac and parsley', '#8a2a3a', 'g', 'Dust with sumac and scatter chopped parsley.', ['1 tsp|sumac|I', '0.5 bunch|flat-leaf parsley|P'], { mix: [['flake', '#8a2a3a'], ['herb', '#3f7a2a']] }),
    O('Toasted pine nuts', '#e8d8a8', 'g', 'Toast in a dry pan until just golden.', ['2 tbsp|pine nuts|S'], { mix: [['seed', '#e8d8a8'], ['seed', '#d4b878']] }),
    O('Dukkah', '#a8763a', 'g', 'Scatter dukkah generously.', ['2 tbsp|dukkah|I'], { mix: [['flake', '#a8763a'], ['seed', '#e8d8a8']] })] }
];

// Give every option a stable id: "<cuisine>-<slug>".
export const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
for (const c of CUISINES) for (const k of ['base', 'veg', 'centre', 'sauce', 'garnish', 'styles']) for (const o of c[k]) o.id = `${c.id}-${slug(o.n)}`;
