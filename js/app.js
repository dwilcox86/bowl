import { CUISINES, PROTEINS, AISLES, AISLE_ORDER } from './data.js';
import { Bowl, WEDGE_KEYS, thumb, mixHex } from './bowl.js';

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
  const map = new Map(); for (const s of src) { const it = parseItem(s), k = it.name + '|' + it.unit, e = map.get(k); if (e) e.qty += it.qty; else map.set(k, { ...it, key: k }); }
  const f = st.serves / 2; return [...map.values()].map(it => { const q = it.qty * f; return { ...it, q, label: fmtQty(q, it.unit), nm: fmtName(it.name, q, it.unit) }; });
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

function renderPickers() {
  $('#cuisines').innerHTML = CUISINES.map(c => `<button type="button" class="cuisine" role="radio" aria-checked="${c.id === st.cuisine}" data-cuisine="${c.id}">
    <span class="dots">${c.palette.map(p => `<i style="background:${p}"></i>`).join('')}</span><b>${esc(c.n)}</b><small>${esc(c.sub)}</small></button>`).join('');
  $('#proteins').innerHTML = Object.entries(PROTEINS).map(([k, p]) => `<button type="button" class="protein" role="radio" aria-checked="${k === st.protein}" data-protein="${k}">
    <img src="${thumb('wedge', proteinOpt(k))}" alt="">${esc(p.n)}</button>`).join('');
}
function renderRows() {
  $('#rows').innerHTML = SLOTS.map(slot => {
    const o = slotOpt(slot), lockable = true, locked = st.locks.has(slot);
    return `<li class="${st.active === slot ? 'on' : ''} ${st.fresh.has(slot) ? 'fresh' : ''}" data-row="${slot}">
      <button type="button" class="row-open" data-open="${slot}" title="${esc(o.id)}"><img src="${thumb(kindOf(slot), o)}" alt=""><span><span class="cat">${catOf(slot)}</span><span class="nm">${esc(o.n)}</span></span></button>
      ${lockable ? `<button type="button" class="mini lock" data-lock="${slot}" aria-pressed="${locked}" aria-label="${locked ? 'Unlock' : 'Keep'} ${esc(o.n)} when shuffling">${LOCK}</button>` : '<span class="mini spacer"></span>'}
      <button type="button" class="mini dice" data-rand="${slot}" aria-label="Swap ${esc(o.n)} for something random">${DICE}</button></li>`;
  }).join('');
}
function renderShop() {
  const items = gather();
  $('#shop').innerHTML = AISLE_ORDER.map(a => {
    const its = items.filter(i => i.a === a); if (!its.length) return '';
    return `<div class="aisle"><h3>${AISLES[a]}</h3><ul class="shop">${its.map(i => { const id = 'i' + hashStr(i.key);
      return `<li><label for="${id}"><input type="checkbox" id="${id}" data-key="${esc(i.key)}" ${st.checked.has(i.key) ? 'checked' : ''}><span class="q">${esc(i.label)}</span><span>${esc(i.nm)}</span></label></li>`; }).join('')}</ul></div>`;
  }).join('');
  const got = items.filter(i => st.checked.has(i.key)).length;
  $('#shopCount').textContent = items.length;
  $('#shopProgress').innerHTML = got ? `<b>${got}</b> of ${items.length} in the basket` : `${items.length} ingredients for ${st.serves} ${st.serves === 1 ? 'serve' : 'serves'}. Tick them off as you shop.`;
  $('#serves').textContent = st.serves;
  return items;
}
function renderSteps() {
  const S = steps();
  $('#steps').innerHTML = S.map(([h, p, list], i) => `<li><button type="button" class="step" data-step="${i}" aria-pressed="${st.done.has(i)}">
    <span class="num"><span>${i + 1}</span></span><span><h4>${esc(h)}</h4>${p ? `<p>${esc(p)}</p>` : ''}${list ? `<ul>${list.map(v => `<li><strong>${esc(v.n)}.</strong> ${esc(v.p)}</li>`).join('')}</ul>` : ''}</span></button></li>`).join('');
  const d = [...st.done].filter(i => i < S.length).length;
  $('#methodProgress').innerHTML = d ? `<b>${d}</b> of ${S.length} steps done` : 'Tap a step when it’s done.';
}
function renderHead() {
  const C = cur(), P = PROTEINS[st.protein];
  $('#eyebrow').textContent = `${C.n} · ${C.sub}`;
  $('#title').textContent = `${styleOf().n} ${P.w} bibimbap`;
  $('#odds').innerHTML = `One of <b>${combos(C).toLocaleString('en-AU')}</b> ${esc(C.n === 'Traditional' ? 'traditional' : C.n)} bowls`;
  document.title = `${styleOf().n} ${P.w} bibimbap · Bibimbap Builder`;
}
function render({ shuffle = false } = {}) {
  document.querySelectorAll('[data-cuisine]').forEach(b => b.setAttribute('aria-checked', b.dataset.cuisine === st.cuisine));
  document.querySelectorAll('[data-protein]').forEach(b => { b.setAttribute('aria-checked', b.dataset.protein === st.protein); b.querySelector('img').src = thumb('wedge', proteinOpt(b.dataset.protein)); });
  renderHead(); renderRows(); renderShop(); renderSteps();
  bowl.update(bowlState(), { shuffle });
  bowl.setActive(st.active);
  if (st.active) fillSheet(st.active);
  writeHash();
  st.fresh.clear();
}

/* ---------- swap sheet ---------- */
const sheet = $('#sheet'); let scrim = null, sheetOpener = null;
const narrow = () => matchMedia('(max-width: 720px)').matches;
function fillSheet(slot) {
  const o = slotOpt(slot), locked = st.locks.has(slot);
  $('#sheetThumb').src = thumb(kindOf(slot), o);
  $('#sheetCat').textContent = catOf(slot);
  $('#sheetName').textContent = o.n;
  $('#sheetPrep').textContent = slot === 'protein' ? styleOf().how : o.p;
  const styleGroup = slot === 'protein' ? `<p class="lbl">Style</p><div class="alts">${cur().styles.map((S, i) => `<button type="button" class="alt" data-pick-style="${i}" aria-pressed="${i === st.bowl.style}"><img src="${thumb('wedge', proteinOpt(st.protein, i))}" alt="">${esc(S.n)}</button>`).join('')}</div>` : '';
  $('#sheetAlts').innerHTML = styleGroup + `<p class="lbl">${slot === 'protein' ? 'Protein' : 'Swap for'}</p><div class="alts">` + choices(slot).sort((a, b) => usedElsewhere(slot, a) - usedElsewhere(slot, b)).map(v => {
    const opt = optFor(slot, v), sel = v === curVal(slot), used = usedElsewhere(slot, v), label = slot === 'protein' ? PROTEINS[v].n : opt.n;
    return `<button type="button" class="alt" data-pick="${v}" aria-pressed="${sel}" ${used ? 'disabled' : ''}><img src="${thumb(kindOf(slot), opt)}" alt="">${esc(label)}${used ? '<small>in the bowl</small>' : ''}</button>`;
  }).join('') + '</div>';
  const lock = $('#sheetLock'); lock.setAttribute('aria-pressed', locked);
  lock.querySelector('span').textContent = (locked ? 'Kept' : 'Keep') + (slot === 'protein' ? ' this style' : '') + ' when shuffling';
}
function placeSheet(slot) {
  if (narrow()) { sheet.style.left = sheet.style.top = ''; return; }
  const stage = $('#stage'), box = $('#bowlBox'), a = bowl.anchor(slot);
  const ax = box.offsetLeft + a.fx * box.clientWidth, ay = box.offsetTop + a.fy * box.clientHeight;
  const W = sheet.offsetWidth, H = sheet.offsetHeight, SW = stage.clientWidth, SH = stage.clientHeight;
  let left = ax < SW / 2 ? ax + 28 : ax - W - 28; left = Math.max(12, Math.min(SW - W - 12, left));
  const top = Math.max(12, Math.min(SH - H - 12, ay - H / 2));
  sheet.style.left = left + 'px'; sheet.style.top = top + 'px';
}
function openSheet(slot, opener) {
  st.active = slot; sheetOpener = opener || null;
  fillSheet(slot); sheet.hidden = false;
  if (narrow() && !scrim) { scrim = document.createElement('div'); scrim.className = 'scrim'; scrim.addEventListener('click', closeSheet); document.body.appendChild(scrim); }
  placeSheet(slot); bowl.setActive(slot); renderRows();
  ($('#sheetAlts [aria-pressed="true"]') || $('#sheetClose')).focus({ preventScroll: true });
}
function closeSheet() {
  if (sheet.hidden) return;
  sheet.hidden = true; st.active = null; bowl.setActive(null); renderRows();
  if (scrim) { scrim.remove(); scrim = null; }
  if (sheetOpener && document.contains(sheetOpener)) sheetOpener.focus({ preventScroll: true });
}

/* ---------- misc ui ---------- */
let toastT = 0;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 1800); }
async function copyText(txt, ok) {
  try { await navigator.clipboard.writeText(txt); toast(ok); return true; } catch (e) { return false; }
}
function setMixed(on) {
  st.mixed = on; bowl.setMix(on);
  const b = $('#mix'); b.setAttribute('aria-pressed', on); b.querySelector('span').textContent = on ? 'Tidy the bowl' : 'Mix it';
  $('#hint').textContent = on ? 'Bibim means mixed. Tidy the bowl to swap things.' : 'Tap any segment to swap it.';
  if (on) closeSheet();
}
function selectTab(name) {
  for (const t of ['bowl', 'shop', 'method']) { $('#tab-' + t).setAttribute('aria-selected', t === name); $('#pane-' + t).hidden = t !== name; }
}

/* ---------- bowl ---------- */
const tip = $('#tip');
const bowl = new Bowl($('#bowl'), {
  onHover(slot, e) {
    if (!slot || slot === 'mixed' || !sheet.hidden) { tip.hidden = true; return; }
    const box = $('#bowlBox').getBoundingClientRect();
    tip.innerHTML = `<small>${catOf(slot)}</small>${esc(slotOpt(slot).n)}`; tip.hidden = false;
    tip.style.left = (e.clientX - box.left) + 'px'; tip.style.top = (e.clientY - box.top) + 'px';
  },
  onClick(slot) {
    tip.hidden = true;
    if (slot === 'mixed') { setMixed(false); return; }
    if (st.active === slot && !sheet.hidden) closeSheet(); else openSheet(slot);
  }
});

/* ---------- events ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t) return;
  const d = t.dataset;
  if (d.cuisine && d.cuisine !== st.cuisine) { st.cuisine = d.cuisine; st.locks.clear(); st.done.clear(); closeSheet(); st.bowl = newBowl(false); setMixed(false); renderPickers(); render({ shuffle: true }); }
  else if (d.protein && d.protein !== st.protein) { st.protein = d.protein; st.fresh.add('protein'); render(); }
  else if (d.open) { if (st.mixed) setMixed(false); openSheet(d.open, t); }
  else if (d.rand) { if (st.mixed) setMixed(false); randomise(d.rand); render(); }
  else if (d.lock) { st.locks.has(d.lock) ? st.locks.delete(d.lock) : st.locks.add(d.lock); renderRows(); if (st.active === d.lock) fillSheet(d.lock); }
  else if (d.pickStyle !== undefined) { st.bowl.style = +d.pickStyle; st.fresh.add('protein'); render(); }
  else if (d.pick !== undefined && st.active) { const slot = st.active; setSlot(slot, slot === 'protein' ? d.pick : +d.pick); render(); }
  else if (d.step !== undefined) { const i = +d.step; st.done.has(i) ? st.done.delete(i) : st.done.add(i); renderSteps(); }
});
document.addEventListener('change', e => { const t = e.target; if (t.dataset.key) { t.checked ? st.checked.add(t.dataset.key) : st.checked.delete(t.dataset.key); renderShop(); } });
$('#shuffle').addEventListener('click', () => { closeSheet(); setMixed(false); st.bowl = newBowl(true); for (const s of SLOTS) if (!st.locks.has(s)) st.fresh.add(s); render({ shuffle: true }); });
$('#mix').addEventListener('click', () => setMixed(!st.mixed));
$('#sheetClose').addEventListener('click', closeSheet);
$('#sheetRandom').addEventListener('click', () => { if (st.active) { randomise(st.active); render(); } });
$('#sheetLock').addEventListener('click', () => { const s = st.active; if (!s) return; st.locks.has(s) ? st.locks.delete(s) : st.locks.add(s); fillSheet(s); renderRows(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
document.addEventListener('pointerdown', e => { if (!sheet.hidden && !narrow() && !sheet.contains(e.target) && e.target.id !== 'bowl' && !e.target.closest('[data-open]')) closeSheet(); });
window.addEventListener('resize', () => { if (!sheet.hidden && st.active) placeSheet(st.active); });
$('#less').addEventListener('click', () => { if (st.serves > 1) { st.serves--; renderShop(); writeHash(); } });
$('#more').addEventListener('click', () => { if (st.serves < 12) { st.serves++; renderShop(); writeHash(); } });
for (const t of ['bowl', 'shop', 'method']) $('#tab-' + t).addEventListener('click', () => selectTab(t));
$('.tabs').addEventListener('keydown', e => {
  if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return; const order = ['bowl', 'shop', 'method'];
  const i = order.findIndex(t => $('#tab-' + t).getAttribute('aria-selected') === 'true'), n = order[(i + (e.key === 'ArrowRight' ? 1 : 2)) % 3];
  selectTab(n); $('#tab-' + n).focus();
});
$('#copy').addEventListener('click', async () => {
  const items = gather(), txt = `${$('#title').textContent} (serves ${st.serves})\n` + AISLE_ORDER.map(a => { const its = items.filter(i => i.a === a); return its.length ? `\n${AISLES[a].toUpperCase()}\n` + its.map(i => `- ${i.label} ${i.nm}`).join('\n') : ''; }).join('\n');
  if (!(await copyText(txt, 'Shopping list copied'))) { const box = $('#copybox'); box.value = txt; box.hidden = false; box.focus(); box.select(); toast('Select the list below to copy it'); }
});
$('#share').addEventListener('click', async () => {
  writeHash(); const url = location.href;
  if (!(await copyText(url, 'Link copied. Anyone with it gets this exact bowl.'))) toast('Copy the address bar to share this bowl');
});
window.addEventListener('hashchange', () => { if (readHash()) { renderPickers(); render(); } });

/* ---------- start ---------- */
if (!readHash()) st.bowl = { style: 0, base: 0, veg: [0, 1, 2, 5, 4], centre: 0, sauce: 0, garnish: 0 };
renderPickers();
render({ shuffle: true });
