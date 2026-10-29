import { CUISINES, PROTEINS, AISLES, AISLE_ORDER } from './data.js';
import { Bowl, WEDGE_KEYS, geometry, thumb, dish, cutlery, mixHex } from './bowl.js';

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const lc = s => s.charAt(0).toLowerCase() + s.slice(1);
const pick = a => a[Math.floor(Math.random() * a.length)];
const rint = n => Math.floor(Math.random() * n);
function shuffled(a) { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rint(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function choose(n, k) { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); }
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }

const VEG = 5;
const SLOTS = ['base', 'protein', 'veg0', 'veg1', 'veg2', 'veg3', 'veg4', 'centre', 'sauce', 'garnish'];
const CAT = { base: 'Base', protein: 'Protein', centre: 'Centre', sauce: 'Sauce on the side', garnish: 'Garnish' };
const catOf = slot => CAT[slot] || 'Topping';
const kindOf = slot => slot === 'base' ? 'base' : slot === 'centre' ? 'centre' : slot === 'sauce' ? 'sauce' : slot === 'garnish' ? 'garnish' : 'wedge';

/* ---------- state ---------- */
const st = { cuisine: 'korean', protein: 'beef', serves: 2, bowl: null, locks: new Set(), active: null, mixed: false, checked: new Set(), done: new Set(), fresh: new Set() };
const cur = () => CUISINES.find(c => c.id === st.cuisine);
const styleOf = (i = st.bowl.style) => cur().styles[i] || cur().styles[0];
function proteinOpt(key = st.protein, si = st.bowl.style) { const C = cur(), P = PROTEINS[key], S = styleOf(si); return { id: `${C.id}-protein-${key}-${S.id}`, n: `${S.n} ${P.w}`, c: mixHex(P.c, S.glaze, .32), t: P.t, protein: true }; }
function slotOpt(slot) {
  const C = cur(), b = st.bowl;
  if (slot === 'protein') return proteinOpt();
  if (slot.startsWith('veg')) return C.veg[b.veg[+slot.slice(3)]];
  return C[slot][b[slot]];
}
const curVal = slot => slot === 'protein' ? st.protein : slot.startsWith('veg') ? st.bowl.veg[+slot.slice(3)] : st.bowl[slot];
function choices(slot) { const C = cur(); if (slot === 'protein') return Object.keys(PROTEINS); if (slot.startsWith('veg')) return C.veg.map((_, i) => i); return C[slot].map((_, i) => i); }
function optFor(slot, v) { const C = cur(); if (slot === 'protein') return proteinOpt(v); if (slot.startsWith('veg')) return C.veg[v]; return C[slot][v]; }
function usedElsewhere(slot, v) { if (!slot.startsWith('veg')) return false; const k = +slot.slice(3); return st.bowl.veg.some((x, j) => j !== k && x === v); }
function setSlot(slot, v) {
  if (slot === 'protein') st.protein = v;
  else if (slot.startsWith('veg')) st.bowl.veg[+slot.slice(3)] = +v;
  else st.bowl[slot] = +v;
  st.fresh.add(slot);
}
function randomise(slot) {
  if (slot === 'protein') { const n = cur().styles.length, opts = [...Array(n).keys()].filter(i => i !== st.bowl.style); st.bowl.style = pick(opts); st.fresh.add('protein'); return; }
  const opts = choices(slot).filter(v => v !== curVal(slot) && !usedElsewhere(slot, v)); if (opts.length) setSlot(slot, pick(opts)); }
function newBowl(keep) {
  const C = cur(), old = st.bowl, L = keep ? st.locks : new Set();
  const lockedVeg = old ? old.veg.filter((_, i) => L.has('veg' + i)) : [];
  const pool = shuffled(C.veg.map((_, i) => i).filter(i => !lockedVeg.includes(i)));
  const veg = Array.from({ length: VEG }, (_, i) => L.has('veg' + i) && old ? old.veg[i] : pool.pop());
  const one = k => L.has(k) && old ? old[k] : rint(C[k].length);
  const style = L.has('protein') && old ? old.style : rint(C.styles.length);
  return { style, base: one('base'), veg, centre: one('centre'), sauce: one('sauce'), garnish: one('garnish') };
}
function bowlState() { const C = cur(), b = st.bowl; return { base: C.base[b.base], wedges: [proteinOpt(), ...b.veg.map(v => C.veg[v])], centre: C.centre[b.centre], sauce: C.sauce[b.sauce], garnish: C.garnish[b.garnish] }; }
function combos(C) { return C.base.length * choose(C.veg.length, VEG) * C.centre.length * C.sauce.length * C.garnish.length * C.styles.length * Object.keys(PROTEINS).length; }

/* ---------- link state ---------- */
function writeHash() {
  const b = st.bowl, q = new URLSearchParams({ c: st.cuisine, p: st.protein, m: b.style, b: b.base, v: b.veg.join('.'), e: b.centre, s: b.sauce, g: b.garnish, n: st.serves });
  try { history.replaceState(null, '', '#' + q.toString()); } catch (e) { /* sandboxed preview */ }
}
function readHash() {
  try {
    const q = new URLSearchParams(location.hash.slice(1)); const C = CUISINES.find(c => c.id === q.get('c')); if (!C) return false;
    const ok = (v, n) => Number.isInteger(v) && v >= 0 && v < n;
    const veg = (q.get('v') || '').split('.').map(Number), m = +(q.get('m') || 0), b = { style: ok(m, C.styles.length) ? m : 0, base: +q.get('b'), veg, centre: +q.get('e'), sauce: +q.get('s'), garnish: +q.get('g') };
    if (!ok(b.base, C.base.length) || !ok(b.centre, C.centre.length) || !ok(b.sauce, C.sauce.length) || !ok(b.garnish, C.garnish.length)) return false;
    if (veg.length !== VEG || new Set(veg).size !== VEG || !veg.every(v => ok(v, C.veg.length))) return false;
    st.cuisine = C.id; st.bowl = b; if (PROTEINS[q.get('p')]) st.protein = q.get('p');
    const n = +q.get('n'); if (n >= 1 && n <= 12) st.serves = n;
    return true;
  } catch (e) { return false; }
}

/* ---------- shopping and method ---------- */
const PLURAL = { cup: 'cups', can: 'cans', bunch: 'bunches', jar: 'jars', pinch: 'pinches', pack: 'packs' }, FR = { 0.25: '¼', 0.5: '½', 0.75: '¾' };
function parseItem(s) { const [q, name, a] = s.split('|'); const p = q.trim().split(/\s+/); return { qty: parseFloat(p[0]), unit: p[1] || '', name, a }; }
function fmtQty(q, u) {
  if (u === 'g' || u === 'ml') { const r = q >= 100 ? Math.round(q / 10) * 10 : Math.max(5, Math.round(q / 5) * 5); return r + ' ' + u; }
  let v = Math.round(q * 4) / 4; if (v <= 0) v = .25; if (!u && v > 1) v = Math.ceil(v * 2) / 2;
  const w = Math.floor(v), fr = +(v - w).toFixed(2);
  return (w || '') + (FR[fr] || '') + (u ? ' ' + (v > 1 && PLURAL[u] ? PLURAL[u] : u) : '');
}
const fmtName = (name, q, u) => name.replace(/\{([^}]*)\}/g, (_, s) => { const many = !u && q > 1, [one, more] = s.includes('/') ? s.split('/') : ['', s]; return many ? more : one; });
function gather() {
  const C = cur(), b = st.bowl, P = PROTEINS[st.protein];
  const src = [...C.base[b.base].i, ...P.i, ...styleOf().i, ...b.veg.flatMap(v => C.veg[v].i), ...C.centre[b.centre].i, ...C.sauce[b.sauce].i, ...C.garnish[b.garnish].i];
  // spoons add up across units: everything is counted in teaspoons, then shown as tablespoons when there are 3 or more
  const map = new Map(); for (const s of src) {
    const it = parseItem(s), spoon = it.unit === 'tsp' || it.unit === 'tbsp', k = it.name + '|' + (spoon ? 'spoon' : it.unit), q = spoon && it.unit === 'tbsp' ? it.qty * 3 : it.qty;
    const e = map.get(k); if (e) e.qty += q; else map.set(k, { ...it, qty: q, unit: spoon ? 'tsp' : it.unit, key: k });
  }
  const f = st.serves / 2; return [...map.values()].map(it => {
    let q = it.qty * f, u = it.unit; if (u === 'tsp' && q >= 3) { q /= 3; u = 'tbsp'; }
    return { ...it, q, unit: u, label: fmtQty(q, u), nm: fmtName(it.name, q, u) };
  });
}
function steps() {
  const C = cur(), b = st.bowl, P = PROTEINS[st.protein], S = styleOf();
  const base = C.base[b.base], cen = C.centre[b.centre], sau = C.sauce[b.sauce], gar = C.garnish[b.garnish];
  return [
    [`Start the ${lc(base.n)}`, base.p],
    [S.step || `Make the ${lc(S.n)} marinade`, `${S.how} ${P.cut} ${P.plant ? 'Keep the marinade aside for the end.' : `Toss the ${P.w} through it and leave it while you prep everything else.`}`],
    [`Mix the ${lc(sau.n)}`, sau.p],
    ['Prep the toppings', null, b.veg.map(v => C.veg[v])],
    [`Cook the ${P.w}`, P.cook + (P.plant ? ' Pour in the marinade for the last minute and toss until sticky and glazed.' : '')],
    [cen.n, cen.p],
    ['Build the bowls', `Spread the rice in warm bowls. Arrange the ${P.w} and each topping in its own segment around the edge, then set the ${lc(cen.n)} in the middle. Finish with ${lc(gar.n)}: ${lc(gar.p)}`],
    ['Mix and eat', `Serve the ${lc(sau.n)} on the side, spoon on as much as you like, and stir everything together.`]
  ];
}


/* ---------- rendering ---------- */
const DICE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>';
const LOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
const SIDES = ['base', 'centre', 'sauce', 'garnish'];
const SIDE_CAT = { base: 'Under it all', centre: 'In the middle', sauce: 'On the side', garnish: 'Over the top' };
const flat = () => matchMedia('(max-width: 860px)').matches;   // labels become a list, no leader lines

function renderPickers() {
  $('#cuisines').innerHTML = CUISINES.map((c, i) => `<button type="button" class="cz" role="radio" aria-checked="${c.id === st.cuisine}" data-cuisine="${c.id}" title="${esc(c.sub)}">
    <span class="n">${String(i + 1).padStart(2, '0')}</span><span class="nm">${esc(c.n)}</span></button>`).join('');
  $('#proteins').innerHTML = Object.entries(PROTEINS).map(([k, p]) => `<button type="button" class="pr" role="radio" aria-checked="${k === st.protein}" data-protein="${k}">
    <img src="${thumb('wedge', proteinOpt(k))}" alt="">${esc(p.n)}</button>`).join('');
}
function toolButtons(slot, o) {
  const locked = st.locks.has(slot);
  return `<span class="tools"><button type="button" class="mini dice" data-rand="${slot}" aria-label="Swap ${esc(o.n)} for something random">${DICE}</button>
    <button type="button" class="mini lock" data-lock="${slot}" aria-pressed="${locked}" aria-label="${locked ? 'Stop keeping' : 'Keep'} ${esc(o.n)} when shuffling">${LOCK}</button></span>`;
}
function renderNotes() {
  $('#notes').innerHTML = WEDGE_KEYS.map((slot, i) => {
    const o = slotOpt(slot), side = Math.cos(geometry.wedgeAngle(i)) >= -0.01 ? 'right' : 'left';
    const cls = [st.active === slot ? 'on' : '', st.fresh.has(slot) ? 'fresh' : ''].join(' ');
    return `<li class="note ${cls}" data-note="${slot}" data-side="${side}">
      <button type="button" class="note-open" data-open="${slot}" title="${esc(o.id)}"><span class="meta">${String(i + 1).padStart(2, '0')} · ${slot === 'protein' ? 'Protein' : 'Topping'}</span><span class="nm">${esc(o.n)}</span></button>
      ${toolButtons(slot, o)}</li>`;
  }).join('');
  layoutNotes();
}
function renderSides() {
  $('#sides').innerHTML = SIDES.map(slot => {
    const o = slotOpt(slot), cls = [st.active === slot ? 'on' : '', st.fresh.has(slot) ? 'fresh' : ''].join(' ');
    return `<button type="button" class="side ${cls}" data-open="${slot}" data-note="${slot}" title="${esc(o.id)}"><img src="${dish(kindOf(slot), o)}" alt=""><span class="meta">${SIDE_CAT[slot]}</span><span class="nm">${esc(o.n)}</span></button>`;
  }).join('') + `<img class="cutlery" src="${cutlery()}" alt="">`;
}
function layoutNotes(draw = false) {
  const svg = $('#leaders');
  if (flat()) { svg.innerHTML = ''; return; }
  const plate = $('#plate'), still = $('#still'), W = still.offsetWidth, cx = still.offsetLeft + W / 2, cy = still.offsetTop + W / 2;
  svg.setAttribute('viewBox', `0 0 ${plate.clientWidth} ${plate.clientHeight}`);
  let paths = '';
  WEDGE_KEYS.forEach((slot, i) => {
    const el = document.querySelector(`.note[data-note="${slot}"]`); if (!el) return;
    const a = geometry.wedgeAngle(i), cs = Math.cos(a), sn = Math.sin(a), right = cs >= -0.01;
    const wr = W * (geometry.R1 + (geometry.R2 - geometry.R1) * .7) / 1000, er = W * .505;
    const p0 = [cx + cs * wr, cy + sn * wr], p1 = [cx + cs * er, cy + sn * er], p2 = [p1[0] + (right ? 18 : -18), p1[1]];
    el.style.top = p2[1] + 'px';
    el.style.left = (right ? p2[0] + 6 : p2[0] - 6 - el.offsetWidth) + 'px';
    const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) + 18;
    paths += `<g data-leader="${slot}" class="${st.active === slot ? 'on' : ''}"><path style="--len:${len.toFixed(0)}" d="M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} L${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}"/><circle cx="${p0[0].toFixed(1)}" cy="${p0[1].toFixed(1)}" r="3"/></g>`;
  });
  svg.innerHTML = paths;
  if (draw) { svg.classList.remove('draw'); void svg.getBoundingClientRect(); svg.classList.add('draw'); }
}
function markLit(slot) {
  document.querySelectorAll('[data-note]').forEach(el => el.classList.toggle('on', el.dataset.note === slot || el.dataset.note === st.active));
  document.querySelectorAll('[data-leader]').forEach(el => el.classList.toggle('on', el.dataset.leader === slot || el.dataset.leader === st.active));
}
function renderShop() {
  const items = gather();
  $('#shop').innerHTML = AISLE_ORDER.map(a => {
    const its = items.filter(i => i.a === a); if (!its.length) return '';
    return `<div class="aisle"><h4>${AISLES[a]}</h4><ul class="shop">${its.map(i => { const id = 'i' + hashStr(i.key);
      return `<li><label for="${id}"><input type="checkbox" id="${id}" data-key="${esc(i.key)}" ${st.checked.has(i.key) ? 'checked' : ''}><span class="nm">${esc(i.nm)}</span><span class="dots"></span><span class="q">${esc(i.label)}</span></label></li>`; }).join('')}</ul></div>`;
  }).join('');
  $('#shopCount').textContent = items.length;
  $('#shopGot').textContent = items.filter(i => st.checked.has(i.key)).length;
  $('#serves').textContent = st.serves;
  $('#docketServes').textContent = `Serves ${st.serves}`;
  return items;
}
function renderSteps() {
  const S = steps();
  $('#steps').innerHTML = S.map(([h, p, list], i) => `<li><button type="button" class="step" data-step="${i}" aria-pressed="${st.done.has(i)}">
    <span class="num">${String(i + 1).padStart(2, '0')}</span><span><h4>${esc(h)}</h4>${p ? `<p>${esc(p)}</p>` : ''}${list ? `<ul>${list.map(v => `<li><img src="${thumb('wedge', v)}" alt=""><span><strong>${esc(v.n)}.</strong> ${esc(v.p)}</span></li>`).join('')}</ul>` : ''}</span></button></li>`).join('');
  const d = [...st.done].filter(i => i < S.length).length;
  $('#methodProgress').innerHTML = d ? `<b>${d}</b> of ${S.length} steps done` : `${S.length} steps. Tap each one as you finish it.`;
}
let oddsShown = 0, oddsRaf = 0;
function rollOdds(to) {
  const el = $('#odds'), from = oddsShown, t0 = performance.now(), dur = matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 900;
  cancelAnimationFrame(oddsRaf);
  const tick = t => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4); oddsShown = Math.round(from + (to - from) * e); el.textContent = oddsShown.toLocaleString('en-AU'); if (p < 1) oddsRaf = requestAnimationFrame(tick); };
  oddsRaf = requestAnimationFrame(tick);
}
let lastTitle = '';
function renderHead() {
  const C = cur(), P = PROTEINS[st.protein], name = `${styleOf().n} ${P.w}`;
  $('#eyebrow').textContent = `${C.n} · ${C.sub}`;
  if (name !== lastTitle) {
    const h = $('#title'); h.querySelector('.t1').textContent = name; h.classList.remove('swap'); void h.offsetWidth; h.classList.add('swap'); lastTitle = name;
  }
  $('#recipeTitle').textContent = `${name} bibimbap`;
  $('#oddsCuisine').textContent = C.n === 'Traditional' ? 'traditional' : C.n;
  rollOdds(combos(C));
  document.title = `${name} bibimbap · Bibimbap Builder`;
}
function render({ shuffle = false, draw = false } = {}) {
  document.querySelectorAll('[data-cuisine]').forEach(b => b.setAttribute('aria-checked', b.dataset.cuisine === st.cuisine));
  document.querySelectorAll('[data-protein]').forEach(b => { b.setAttribute('aria-checked', b.dataset.protein === st.protein); b.querySelector('img').src = thumb('wedge', proteinOpt(b.dataset.protein)); });
  renderHead(); renderNotes(); renderSides(); renderShop(); renderSteps();
  if (draw) layoutNotes(true);
  bowl.update(bowlState(), { shuffle });
  bowl.setActive(st.active);
  if (st.active && !sheet.hidden) fillSheet(st.active);
  writeHash();
  st.fresh.clear();
}

/* ---------- swap card ---------- */
const sheet = $('#sheet'); let scrim = null, sheetOpener = null;
function fillSheet(slot) {
  const o = slotOpt(slot), locked = st.locks.has(slot);
  $('#sheetThumb').src = thumb(kindOf(slot), o);
  $('#sheetCat').textContent = WEDGE_KEYS.includes(slot) ? (slot === 'protein' ? 'Protein' : 'Topping') : SIDE_CAT[slot];
  $('#sheetName').textContent = o.n;
  $('#sheetPrep').textContent = slot === 'protein' ? styleOf().how : o.p;
  const styleGroup = slot === 'protein' ? `<p class="label">Style</p><div class="alts">${cur().styles.map((S, i) => `<button type="button" class="alt" data-pick-style="${i}" aria-pressed="${i === st.bowl.style}"><img src="${thumb('wedge', proteinOpt(st.protein, i))}" alt="">${esc(S.n)}</button>`).join('')}</div>` : '';
  $('#sheetAlts').innerHTML = styleGroup + `<p class="label">${slot === 'protein' ? 'Protein' : 'Swap for'}</p><div class="alts">` + choices(slot).sort((a, b) => usedElsewhere(slot, a) - usedElsewhere(slot, b)).map(v => {
    const opt = optFor(slot, v), sel = v === curVal(slot), used = usedElsewhere(slot, v), label = slot === 'protein' ? PROTEINS[v].n : opt.n;
    return `<button type="button" class="alt" data-pick="${v}" aria-pressed="${sel}" ${used ? 'disabled' : ''}><img src="${thumb(kindOf(slot), opt)}" alt="">${esc(label)}${used ? '<small>in the bowl</small>' : ''}</button>`;
  }).join('') + '</div>';
  const lock = $('#sheetLock'); lock.setAttribute('aria-pressed', locked);
  lock.querySelector('span').textContent = (locked ? 'Kept' : 'Keep') + (slot === 'protein' ? ' this style' : '') + ' when shuffling';
}
function placeSheet(slot) {
  if (flat()) { sheet.style.left = sheet.style.top = ''; return; }
  const host = $('.hero-inner').getBoundingClientRect(), W = sheet.offsetWidth, H = sheet.offsetHeight;
  let ref = document.querySelector(`[data-note="${slot}"]`);
  if (!ref || slot === 'centre') ref = $('#still');
  const r = ref.getBoundingClientRect();
  let left, top;
  if (SIDES.includes(slot) && slot !== 'centre') { left = r.left + r.width / 2 - W / 2 - host.left; top = r.top - host.top - H - 12; }
  else if (ref.id === 'still') { left = r.left + r.width / 2 - host.left + 24; top = r.top + r.height / 2 - H / 2 - host.top; }
  else { const right = r.left + r.width / 2 > host.left + host.width * .62; left = right ? r.left - host.left - W - 14 : r.right - host.left + 14; top = r.top + r.height / 2 - H / 2 - host.top; }
  left = Math.max(12, Math.min(host.width - W - 12, left)); top = Math.max(12, Math.min(host.height - H - 12, top));
  sheet.style.left = left + 'px'; sheet.style.top = top + 'px';
}
function openSheet(slot, opener) {
  st.active = slot; sheetOpener = opener || null;
  fillSheet(slot); sheet.hidden = false;
  if (flat() && !scrim) { scrim = document.createElement('div'); scrim.className = 'scrim'; scrim.addEventListener('click', closeSheet); $('.hero-inner').appendChild(scrim); }
  placeSheet(slot); bowl.setActive(slot); markLit(slot);
  ($('#sheetAlts [aria-pressed="true"]') || $('#sheetClose')).focus({ preventScroll: true });
}
function closeSheet() {
  if (sheet.hidden) return;
  sheet.hidden = true; st.active = null; bowl.setActive(null); markLit(null);
  if (scrim) { scrim.remove(); scrim = null; }
  if (sheetOpener && document.contains(sheetOpener)) sheetOpener.focus({ preventScroll: true });
}

/* ---------- misc ui ---------- */
let toastT = 0;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2000); }
async function copyText(txt, ok) { try { await navigator.clipboard.writeText(txt); toast(ok); return true; } catch (e) { return false; } }
function setMixed(on) {
  st.mixed = on; bowl.setMix(on);
  const b = $('#mix'); b.setAttribute('aria-pressed', on); b.querySelector('span').textContent = on ? 'Tidy up' : 'Mix it';
  $('#hint').textContent = on ? 'Bibim means mixed. Tidy up to swap things' : 'Tap a segment or a label to swap it';
  if (on) closeSheet();
}
function shuffle() {
  closeSheet(); setMixed(false); st.bowl = newBowl(true);
  for (const s of SLOTS) if (!st.locks.has(s)) st.fresh.add(s);
  const btn = $('#shuffle'); btn.classList.remove('roll'); void btn.offsetWidth; btn.classList.add('roll');
  render({ shuffle: true });
}

/* ---------- bowl ---------- */
const bowl = new Bowl($('#bowl'), {
  onHover(slot) { markLit(slot && slot !== 'mixed' ? slot : null); },
  onClick(slot, e) {
    if (slot === 'mixed') { setMixed(false); return; }
    if (st.active === slot && !sheet.hidden) closeSheet(); else openSheet(slot);
  }
});

/* ---------- events ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t) return;
  const d = t.dataset;
  if (d.cuisine && d.cuisine !== st.cuisine) { st.cuisine = d.cuisine; st.locks.clear(); st.done.clear(); closeSheet(); st.bowl = newBowl(false); setMixed(false); renderPickers(); for (const s of SLOTS) st.fresh.add(s); render({ shuffle: true, draw: true }); }
  else if (d.protein && d.protein !== st.protein) { st.protein = d.protein; st.fresh.add('protein'); render(); }
  else if (d.open) { if (st.mixed) setMixed(false); if (st.active === d.open && !sheet.hidden) closeSheet(); else openSheet(d.open, t); }
  else if (d.rand) { if (st.mixed) setMixed(false); randomise(d.rand); render(); }
  else if (d.lock) { st.locks.has(d.lock) ? st.locks.delete(d.lock) : st.locks.add(d.lock); renderNotes(); if (st.active === d.lock && !sheet.hidden) fillSheet(d.lock); toast(st.locks.has(d.lock) ? 'Kept when you shuffle' : 'Back in the shuffle'); }
  else if (d.pickStyle !== undefined) { st.bowl.style = +d.pickStyle; st.fresh.add('protein'); render(); }
  else if (d.pick !== undefined && st.active) { const slot = st.active; setSlot(slot, slot === 'protein' ? d.pick : +d.pick); render(); }
  else if (d.step !== undefined) { const i = +d.step; st.done.has(i) ? st.done.delete(i) : st.done.add(i); renderSteps(); }
});
document.addEventListener('pointerover', e => { const n = e.target.closest('[data-note]'); if (n && !flat()) { bowl.highlight(n.dataset.note); markLit(n.dataset.note); } });
document.addEventListener('pointerout', e => { const n = e.target.closest('[data-note]'); if (n && !n.contains(e.relatedTarget)) { bowl.highlight(null); markLit(null); } });
document.addEventListener('focusin', e => { const n = e.target.closest('[data-note]'); bowl.highlight(n ? n.dataset.note : null); });
document.addEventListener('change', e => { const t = e.target; if (t.dataset.key) { t.checked ? st.checked.add(t.dataset.key) : st.checked.delete(t.dataset.key); $('#shopGot').textContent = st.checked.size; } });
$('#shuffle').addEventListener('click', shuffle);
$('#mix').addEventListener('click', () => setMixed(!st.mixed));
$('#sheetClose').addEventListener('click', closeSheet);
$('#sheetRandom').addEventListener('click', () => { if (st.active) { randomise(st.active); render(); } });
$('#sheetLock').addEventListener('click', () => { const s = st.active; if (!s) return; st.locks.has(s) ? st.locks.delete(s) : st.locks.add(s); fillSheet(s); renderNotes(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeSheet(); return; }
  if (e.metaKey || e.ctrlKey || e.altKey || /input|textarea|select/i.test(e.target.tagName)) return;
  if (e.key === 's' || e.key === 'S') { e.preventDefault(); shuffle(); }
  if (e.key === 'm' || e.key === 'M') { e.preventDefault(); setMixed(!st.mixed); }
});
document.addEventListener('pointerdown', e => { if (!sheet.hidden && !flat() && !sheet.contains(e.target) && e.target.id !== 'bowl' && !e.target.closest('[data-open]')) closeSheet(); });
let rz = 0;
window.addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(() => { layoutNotes(); if (!sheet.hidden && st.active) placeSheet(st.active); }); });
new ResizeObserver(() => layoutNotes()).observe($('#plate'));
document.fonts && document.fonts.ready.then(() => layoutNotes());
$('#less').addEventListener('click', () => { if (st.serves > 1) { st.serves--; renderShop(); writeHash(); } });
$('#more').addEventListener('click', () => { if (st.serves < 12) { st.serves++; renderShop(); writeHash(); } });
$('#copy').addEventListener('click', async () => {
  const items = gather(), txt = `${$('#recipeTitle').textContent} (serves ${st.serves})\n` + AISLE_ORDER.map(a => { const its = items.filter(i => i.a === a); return its.length ? `\n${AISLES[a].toUpperCase()}\n` + its.map(i => `- ${i.label} ${i.nm}`).join('\n') : ''; }).join('\n');
  if (!(await copyText(txt, 'Market list copied'))) { const box = $('#copybox'); box.value = txt; box.hidden = false; box.focus(); box.select(); toast('Select the list below to copy it'); }
});
$('#share').addEventListener('click', async () => { writeHash(); if (!(await copyText(location.href, 'Link copied. It opens this exact bowl.'))) toast('Copy the address bar to share this bowl'); });
window.addEventListener('hashchange', () => { if (readHash()) { renderPickers(); render(); } });

/* ---------- start ---------- */
if (!readHash()) st.bowl = { style: 0, base: 0, veg: [0, 1, 2, 5, 4], centre: 0, sauce: 0, garnish: 0 };
$('#docketDate').textContent = new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
renderPickers();
for (const s of SLOTS) st.fresh.add(s);
render({ draw: true });
