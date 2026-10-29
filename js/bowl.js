// Canvas renderer for the stone bowl. Everything is drawn in a 1000 × 1000 logical space.
import { PHOTOS } from './data.js';

const S = 1.6;                       // sprite resolution: device px per logical unit
const G = { CX: 500, CY: 500, RT: 470, RO: 414, RW: 380, RF: 350, R1: 120, R2: 332, RC: 110 };
const WEDGES = 6, GAP = 0.045;
const ACCENT = '#ff8a5c';
export const WEDGE_KEYS = ['protein', 'veg0', 'veg1', 'veg2', 'veg3', 'veg4'];

/* ---------- small utils ---------- */
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeBack = t => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
export function rng(seed) { let a = seed >>> 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
const rgbOf = hex => { const n = parseInt(hex.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255]; };
export function shade(hex, a, alpha = 1) { const [r, g, b] = rgbOf(hex), t = a < 0 ? 0 : 255, p = Math.abs(a); const m = v => Math.round(v + (t - v) * p); return alpha < 1 ? `rgba(${m(r)},${m(g)},${m(b)},${alpha})` : `rgb(${m(r)},${m(g)},${m(b)})`; }
export function mixHex(h1, h2, p) { const a = rgbOf(h1), b = rgbOf(h2); return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * p).toString(16).padStart(2, '0')).join(''); }

function mk(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w * S)); c.height = Math.max(1, Math.ceil(h * S)); const x = c.getContext('2d'); x.setTransform(S, 0, 0, S, c.width / 2, c.height / 2); return { c, x, w, h }; }
function shadowOn(x, blur = 3, oy = 1.6, a = .42) { x.shadowColor = `rgba(25,12,4,${a})`; x.shadowBlur = blur * S; x.shadowOffsetX = .5 * S; x.shadowOffsetY = oy * S; }
function shadowOff(x) { x.shadowColor = 'transparent'; x.shadowBlur = 0; x.shadowOffsetX = 0; x.shadowOffsetY = 0; }
function blobPath(x, pts) { const n = pts.length; x.beginPath(); for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n]; if (!i) { const z = pts[n - 1]; x.moveTo((z[0] + a[0]) / 2, (z[1] + a[1]) / 2); } x.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); } x.closePath(); }
function blobPts(R, rx, ry, n, v, cx = 0, cy = 0) { const p = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, k = 1 + (R() - .5) * v; p.push([cx + rx * k * Math.cos(a), cy + ry * k * Math.sin(a)]); } return p; }
function rr(x, X, Y, W, H, r) { r = Math.min(r, W / 2, H / 2); x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + W, Y, X + W, Y + H, r); x.arcTo(X + W, Y + H, X, Y + H, r); x.arcTo(X, Y + H, X, Y, r); x.arcTo(X, Y, X + W, Y, r); x.closePath(); }
function gloss(x, cx, cy, rx, ry, a = .32, rot = -.5) { x.save(); x.translate(cx, cy); x.rotate(rot); x.fillStyle = `rgba(255,255,255,${a})`; x.beginPath(); x.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); x.fill(); x.restore(); }

/* ---------- ingredient sprites ---------- */
const SPR = {
  strip(o, R) {
    const L = 34 + R() * 22, W = (o.small ? 4 : 5.5) + R() * 2.5, s = mk(L + 14, W + 14), x = s.x, c = o.c;
    const g = x.createLinearGradient(0, -W / 2, 0, W / 2); g.addColorStop(0, shade(c, .28)); g.addColorStop(.45, c); g.addColorStop(1, shade(c, -.32));
    shadowOn(x, 2.5, 1.4); x.fillStyle = g; rr(x, -L / 2, -W / 2, L, W, W / 2); x.fill(); shadowOff(x);
    x.strokeStyle = 'rgba(255,255,255,.3)'; x.lineWidth = W * .16; x.lineCap = 'round'; x.beginPath(); x.moveTo(-L / 2 + 4, -W * .18); x.lineTo(L / 2 - 4, -W * .18); x.stroke();
    if (o.char) for (let i = 0; i < 3; i++) { x.fillStyle = 'rgba(40,18,6,.45)'; x.beginPath(); x.ellipse((R() - .5) * L * .8, 0, 2 + R() * 3, W * .35, 0, 0, 7); x.fill(); }
    return s;
  },
  leaf(o, R, small) {
    const L = small ? 9 + R() * 5 : 26 + R() * 16, W = L * (.45 + R() * .2), s = mk(L + 12, W * 1.6 + 12), x = s.x, c = o.c;
    x.beginPath(); x.moveTo(-L / 2, 0); x.bezierCurveTo(-L / 4, -W * .78, L / 4, -W * .62, L / 2, 0); x.bezierCurveTo(L / 4, W * .62, -L / 4, W * .78, -L / 2, 0); x.closePath();
    const g = x.createRadialGradient(-L * .1, -W * .15, 1, 0, 0, L * .6); g.addColorStop(0, shade(c, .2)); g.addColorStop(.55, c); g.addColorStop(1, shade(c, -.3));
    shadowOn(x, small ? 1.5 : 3, small ? .8 : 1.5, .38); x.fillStyle = g; x.fill(); shadowOff(x);
    if (!small) {
      x.strokeStyle = shade(c, .38, .7); x.lineWidth = 1.1; x.beginPath(); x.moveTo(-L / 2, 0); x.quadraticCurveTo(0, -1.5, L / 2 - 2, 0); x.stroke();
      x.strokeStyle = shade(c, .3, .32); x.lineWidth = .8;
      for (let i = -2; i <= 2; i++) { if (!i) continue; const px = i * L * .15; x.beginPath(); x.moveTo(px, -.5); x.lineTo(px + L * .1, -W * .42 * Math.sign(i + .1)); x.moveTo(px, .5); x.lineTo(px + L * .1, W * .4); x.stroke(); }
      gloss(x, -L * .12, -W * .2, L * .2, W * .1, .14, 0);
    }
    return s;
  },
  chunk(o, R) {
    const r = o.small ? 7 + R() * 3 : 10 + R() * 5, s = mk(r * 3 + 10, r * 3 + 10), x = s.x, c = o.c;
    const pts = blobPts(R, r * (1 + R() * .25), r, 9, .3);
    const g = x.createRadialGradient(-r * .35, -r * .4, 1, 0, 0, r * 1.3); g.addColorStop(0, shade(c, .3)); g.addColorStop(.5, c); g.addColorStop(1, shade(c, -.32));
    shadowOn(x, 3, 1.8); blobPath(x, pts); x.fillStyle = g; x.fill(); shadowOff(x);
    if (o.char || o.protein) { x.save(); blobPath(x, pts); x.clip(); x.strokeStyle = 'rgba(38,16,4,.5)'; x.lineWidth = 2; for (let i = -1; i <= 1; i++) { x.beginPath(); x.moveTo(-r * 1.2, i * r * .55 - r * .4); x.lineTo(r * 1.2, i * r * .55 + r * .4); x.stroke(); } x.restore(); }
    gloss(x, -r * .3, -r * .38, r * .32, r * .15, o.protein ? .4 : .28);
    return s;
  },
  meat(o, R) {
    const L = 38 + R() * 18, W = 14 + R() * 7, s = mk(L + 16, W * 1.5 + 16), x = s.x, c = o.c;
    const pts = blobPts(R, L / 2, W / 2, 12, .32);
    const g = x.createLinearGradient(0, -W / 2, 0, W / 2); g.addColorStop(0, shade(c, .18)); g.addColorStop(.5, c); g.addColorStop(1, shade(c, -.38));
    shadowOn(x, 3, 1.8, .45); blobPath(x, pts); x.fillStyle = g; x.fill(); shadowOff(x);
    x.save(); blobPath(x, pts); x.clip();
    x.strokeStyle = shade(c, -.5, .55); x.lineWidth = 3; blobPath(x, pts); x.stroke();
    for (let i = 0; i < 5; i++) { x.fillStyle = shade(c, -.55, .35); x.beginPath(); x.ellipse((R() - .5) * L * .8, (R() - .5) * W * .6, 2 + R() * 4, 1.5 + R() * 2, R() * 3, 0, 7); x.fill(); }
    x.restore();
    gloss(x, -L * .08, -W * .2, L * .3, W * .1, .3, 0);
    return s;
  },
  cube(o, R) {
    const a = 16 + R() * 5, s = mk(a + 14, a + 14), x = s.x, c = o.c;
    shadowOn(x, 3, 2, .4); x.fillStyle = shade(c, -.22); rr(x, -a / 2, -a / 2, a, a, 3); x.fill(); shadowOff(x);
    const g = x.createLinearGradient(-a / 2, -a / 2, a / 2, a / 2); g.addColorStop(0, shade(c, .3)); g.addColorStop(1, shade(c, -.02));
    x.fillStyle = g; rr(x, -a / 2 + 2.5, -a / 2 + 2.5, a - 5, a - 5, 2); x.fill();
    const e = x.createRadialGradient(a * .4, a * .4, 0, a * .4, a * .4, a * .5); e.addColorStop(0, shade(c, -.35, .55)); e.addColorStop(1, shade(c, -.35, 0));
    x.fillStyle = e; rr(x, -a / 2, -a / 2, a, a, 3); x.fill();
    gloss(x, -a * .2, -a * .22, a * .18, a * .07, .35);
    return s;
  },
  dot(o, R) {
    const rx = 6 + R() * 2, ry = 5 + R() * 1.8, s = mk(rx * 2 + 10, ry * 2 + 10), x = s.x;
    const c = o.char && R() < .3 ? shade(o.c, -.4) : o.c;
    const g = x.createRadialGradient(-rx * .35, -ry * .4, .5, 0, 0, rx * 1.15); g.addColorStop(0, shade(c, .35)); g.addColorStop(.55, c); g.addColorStop(1, shade(c, -.35));
    shadowOn(x, 2, 1.2); x.fillStyle = g; x.beginPath(); x.ellipse(0, 0, rx, ry, 0, 0, 7); x.fill(); shadowOff(x);
    gloss(x, -rx * .3, -ry * .38, rx * .3, ry * .17, .45);
    return s;
  },
  slice(o, R) {
    const r = 12 + R() * 5, s = mk(r * 2 + 12, r * 2 + 12), x = s.x, skin = o.skin || o.c, fl = o.flesh || shade(o.c, .55);
    shadowOn(x, 2.5, 1.4, .35); x.fillStyle = skin; x.beginPath(); x.ellipse(0, 0, r, r * .96, 0, 0, 7); x.fill(); shadowOff(x);
    const g = x.createRadialGradient(-r * .2, -r * .25, 1, 0, 0, r); g.addColorStop(0, fl.startsWith('#') ? shade(fl, .25) : fl); g.addColorStop(1, fl.startsWith('#') ? shade(fl, -.08) : fl);
    x.fillStyle = g; x.beginPath(); x.ellipse(0, 0, r - 2.4, r * .96 - 2.4, 0, 0, 7); x.fill();
    if (!o.skin) { x.fillStyle = 'rgba(255,255,255,.55)'; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + R() * .3; x.beginPath(); x.ellipse(Math.cos(a) * r * .45, Math.sin(a) * r * .45, 1.8, 1, a, 0, 7); x.fill(); } }
    else { x.fillStyle = 'rgba(160,180,60,.35)'; x.beginPath(); x.arc(0, 0, r * .55, 0, 7); x.fill(); }
    x.strokeStyle = 'rgba(255,255,255,.38)'; x.lineWidth = 1.6; x.beginPath(); x.arc(0, 0, r - 4.5, Math.PI * 1.05, Math.PI * 1.55); x.stroke();
    return s;
  },
  shred(o, R) {
    const L = 24 + R() * 22, s = mk(L + 16, L * .6 + 16), x = s.x, bend = (R() - .5) * L * .7;
    x.lineCap = 'round'; x.lineJoin = 'round';
    const w2 = R();
    shadowOn(x, 2, 1.2, .35); x.strokeStyle = o.c; x.lineWidth = 5.5 + w2 * 2; x.beginPath(); x.moveTo(-L / 2, 0); x.quadraticCurveTo(0, bend, L / 2, 0); x.stroke(); shadowOff(x);
    if (o.core) { x.strokeStyle = o.core; x.lineWidth = 2; x.globalAlpha = .9; x.beginPath(); x.moveTo(-L / 2 + 3, 0); x.quadraticCurveTo(0, bend, L / 2 - 3, 0); x.stroke(); x.globalAlpha = 1; }
    x.strokeStyle = 'rgba(255,255,255,.22)'; x.lineWidth = 1; x.beginPath(); x.moveTo(-L / 2 + 2, -1.6); x.quadraticCurveTo(0, bend - 1.6, L / 2 - 2, -1.6); x.stroke();
    return s;
  },
  sprout(o, R) {
    const L = 32 + R() * 14, s = mk(L + 18, 26), x = s.x, c = o.c, b = (R() - .5) * 14;
    x.lineCap = 'round';
    shadowOn(x, 2, 1.2, .3); x.strokeStyle = c; x.lineWidth = 3.4; x.beginPath(); x.moveTo(-L / 2, 0); x.quadraticCurveTo(0, b, L / 2, (R() - .5) * 6); x.stroke(); shadowOff(x);
    x.strokeStyle = 'rgba(255,255,255,.5)'; x.lineWidth = 1; x.beginPath(); x.moveTo(-L / 2 + 2, -.8); x.quadraticCurveTo(0, b - .8, L / 2 - 3, -.8); x.stroke();
    const h = o.head || '#e3c94a'; const g = x.createRadialGradient(-L / 2 - 1, -1.5, .5, -L / 2, 0, 6); g.addColorStop(0, shade(h, .35)); g.addColorStop(1, shade(h, -.15));
    shadowOn(x, 1.5, 1, .3); x.fillStyle = g; x.beginPath(); x.ellipse(-L / 2, 0, 6.5, 4.6, R() - .5, 0, 7); x.fill(); shadowOff(x);
    x.strokeStyle = shade(h, -.3, .6); x.lineWidth = .7; x.beginPath(); x.moveTo(-L / 2 - 4, 0); x.lineTo(-L / 2 + 4, 0); x.stroke();
    return s;
  },
  mush(o, R) {
    const w = 28 + R() * 10, h = w * .62, s = mk(w + 14, h * 2 + 14), x = s.x, c = o.c;
    shadowOn(x, 3, 1.6, .4);
    x.fillStyle = shade(c, .55); rr(x, -w * .14, -1, w * .28, h * .95, 3); x.fill();
    const g = x.createRadialGradient(-w * .15, -h * .7, 1, 0, -h * .3, w * .6); g.addColorStop(0, shade(c, .2)); g.addColorStop(.6, c); g.addColorStop(1, shade(c, -.35));
    x.fillStyle = g; x.beginPath(); x.moveTo(-w / 2, 0); x.bezierCurveTo(-w / 2, -h * 1.15, w / 2, -h * 1.15, w / 2, 0); x.quadraticCurveTo(0, h * .18, -w / 2, 0); x.fill(); shadowOff(x);
    x.strokeStyle = shade(c, .45, .7); x.lineWidth = 2; x.beginPath(); x.moveTo(-w / 2 + 2, -.5); x.quadraticCurveTo(0, h * .14, w / 2 - 2, -.5); x.stroke();
    gloss(x, -w * .15, -h * .65, w * .16, h * .1, .3);
    return s;
  },
  curl(o, R) {
    const r = 10 + R() * 2.5, s = mk(r * 3 + 12, r * 3 + 12), x = s.x, c = o.c, a0 = .35 * Math.PI, a1 = 1.8 * Math.PI;
    x.lineCap = 'round';
    shadowOn(x, 3, 1.8, .42); x.strokeStyle = c; x.lineWidth = 9.5; x.beginPath(); x.arc(0, 0, r, a0, a1); x.stroke(); shadowOff(x);
    x.strokeStyle = shade(c, .4, .7); x.lineWidth = 3; x.beginPath(); x.arc(0, 0, r - 2.6, a0 + .1, a1 - .1); x.stroke();
    x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 1.3;
    for (let k = 1; k < 6; k++) { const a = a0 + (a1 - a0) * k / 6; x.beginPath(); x.moveTo(Math.cos(a) * (r - 4.5), Math.sin(a) * (r - 4.5)); x.lineTo(Math.cos(a) * (r + 4.5), Math.sin(a) * (r + 4.5)); x.stroke(); }
    const tx = Math.cos(a1) * r, ty = Math.sin(a1) * r; x.fillStyle = shade(c, -.25); x.beginPath(); x.moveTo(tx, ty); x.lineTo(tx + 9, ty - 4); x.lineTo(tx + 8, ty + 5); x.closePath(); x.fill();
    return s;
  },
  mash(o, R) {
    const r = 20 + R() * 12, s = mk(r * 2.6 + 14, r * 2.6 + 14), x = s.x, c = o.c;
    const pts = blobPts(R, r, r * .85, 10, .35);
    const g = x.createRadialGradient(-r * .3, -r * .35, 1, 0, 0, r * 1.2); g.addColorStop(0, shade(c, .22)); g.addColorStop(.6, c); g.addColorStop(1, shade(c, -.2));
    shadowOn(x, 5, 1.6, .22); blobPath(x, pts); x.fillStyle = g; x.fill(); shadowOff(x);
    x.strokeStyle = shade(c, -.25, .25); x.lineWidth = 1.4; for (let i = 0; i < 3; i++) { x.beginPath(); x.arc((R() - .5) * r, (R() - .5) * r, r * .4, R() * 6, R() * 6 + 1.6); x.stroke(); }
    x.fillStyle = 'rgba(255,250,235,.7)'; for (let i = 0; i < 4; i++) { x.beginPath(); x.arc((R() - .5) * r * 1.2, (R() - .5) * r, 1.4, 0, 7); x.fill(); }
    return s;
  },
  // garnish
  seed(o, R) { const s = mk(12, 10), x = s.x; shadowOn(x, 1.2, .7, .4); x.fillStyle = o.c; x.beginPath(); x.ellipse(0, 0, 2.8, 1.6, 0, 0, 7); x.fill(); shadowOff(x); gloss(x, -.8, -.5, 1, .45, .5, 0); return s; },
  nori(o, R) { const L = 16 + R() * 12, s = mk(L + 8, 9), x = s.x; shadowOn(x, 1.5, .8, .35); x.fillStyle = o.c; rr(x, -L / 2, -1.2, L, 2.4, 1); x.fill(); shadowOff(x); x.fillStyle = 'rgba(255,255,255,.15)'; x.fillRect(-L / 2 + 2, -1, L - 4, .6); return s; },
  ring(o, R) { const r = 3.6 + R() * 1.4, s = mk(r * 2 + 8, r * 2 + 8), x = s.x; shadowOn(x, 1.2, .7, .35); x.strokeStyle = o.c; x.lineWidth = 2.1; x.beginPath(); x.arc(0, 0, r, 0, 7); x.stroke(); shadowOff(x); x.fillStyle = shade(o.c, .6, .75); x.beginPath(); x.arc(0, 0, r - 1.2, 0, 7); x.fill(); return s; },
  herb(o, R) { return SPR.leaf(o, R, true); },
  flake(o, R) { const r = 2.4 + R() * 2.4, s = mk(r * 3 + 8, r * 3 + 8), x = s.x; shadowOn(x, 1.2, .7, .4); blobPath(x, blobPts(R, r, r * .75, 6, .7)); const g = x.createLinearGradient(-r, -r, r, r); g.addColorStop(0, shade(o.c, .25)); g.addColorStop(1, shade(o.c, -.2)); x.fillStyle = g; x.fill(); shadowOff(x); return s; }
};
const COUNTS = { strip: 220, leaf: 210, chunk: 150, meat: 112, cube: 150, dot: 330, slice: 110, shred: 300, sprout: 280, mush: 112, curl: 128, mash: 46, photo: 140 };

const spriteCache = new Map();
function sprites(o, t, n = 10) {
  const key = `${o.id || o.c}|${t}|${o.c}`;
  if (spriteCache.has(key)) return spriteCache.get(key);
  const R = rng(hash(key)), make = SPR[t] || SPR.chunk, list = [];
  // every variant gets a slightly different shade so a heap never looks cloned
  for (let i = 0; i < n; i++) { const j = (R() - .5) * .16, v = { ...o, c: mixHex(o.c, j < 0 ? '#000000' : '#ffffff', Math.abs(j)) }; list.push(make(v, R)); }
  spriteCache.set(key, list); return list;
}

/* ---------- photos ---------- */
const photos = new Map();
function photo(o, onload) {
  if (!o.id || !PHOTOS.has(o.id)) return null;
  let p = photos.get(o.id);
  if (!p) { const img = new Image(); p = { img, ok: false, crops: null }; photos.set(o.id, p); img.onload = () => { p.ok = true; onload && onload(); }; img.src = `img/${o.id}.webp`; }
  return p.ok ? p : null;
}
function photoCrops(o, p) {
  if (p.crops) return p.crops;
  const R = rng(hash(o.id)), list = [], iw = p.img.naturalWidth, ih = p.img.naturalHeight;
  for (let i = 0; i < 10; i++) {
    const r = 15 + R() * 6, s = mk(r * 2 + 10, r * 2 + 10), x = s.x, sz = Math.min(iw, ih) * .14;
    shadowOn(x, 3, 1.6, .4); blobPath(x, blobPts(R, r, r * .85, 8, .35)); x.fillStyle = '#000'; x.fill(); shadowOff(x);
    x.save(); blobPath(x, blobPts(R, r, r * .85, 8, .35)); x.globalCompositeOperation = 'source-atop';
    x.drawImage(p.img, R() * (iw - sz), R() * (ih - sz), sz, sz, -r * 1.1, -r * 1.1, r * 2.2, r * 2.2); x.restore();
    list.push(s);
  }
  return (p.crops = list);
}

/* ---------- rice bed and stone ---------- */
const riceCache = new Map();
function rice(base) {
  if (riceCache.has(base.id)) return riceCache.get(base.id);
  const RF = G.RF, s = mk(RF * 2 + 4, RF * 2 + 4), x = s.x, R = rng(hash(base.id)), c = base.c;
  x.save(); x.beginPath(); x.arc(0, 0, RF, 0, 7); x.clip();
  const g = x.createRadialGradient(-60, -70, 20, 0, 0, RF); g.addColorStop(0, shade(c, .12)); g.addColorStop(1, shade(c, -.14));
  x.fillStyle = g; x.fillRect(-RF, -RF, RF * 2, RF * 2);
  const rx = base.long ? 4.6 : 3.4, ry = base.long ? 1.55 : 2;
  for (let i = 0; i < 3300; i++) {
    const a = R() * Math.PI * 2, r = Math.sqrt(R()) * RF, px = r * Math.cos(a), py = r * Math.sin(a), rot = R() * Math.PI;
    x.fillStyle = 'rgba(70,50,20,.10)'; x.beginPath(); x.ellipse(px + .7, py + .9, rx, ry, rot, 0, 7); x.fill();
    x.fillStyle = shade(c, -.06 + R() * .16); x.beginPath(); x.ellipse(px, py, rx, ry, rot, 0, 7); x.fill();
    x.fillStyle = 'rgba(255,255,255,.45)'; x.beginPath(); x.ellipse(px - .6, py - .5, rx * .45, ry * .35, rot, 0, 7); x.fill();
  }
  if (base.fleck) for (let i = 0; i < (base.big ? 60 : 140); i++) {
    const a = R() * Math.PI * 2, r = Math.sqrt(R()) * RF, px = r * Math.cos(a), py = r * Math.sin(a), rot = R() * Math.PI;
    const fx = base.big ? 7 : 3.4, fy = base.big ? 4.2 : 1.9;
    x.fillStyle = 'rgba(40,20,10,.25)'; x.beginPath(); x.ellipse(px + 1, py + 1.3, fx, fy, rot, 0, 7); x.fill();
    x.fillStyle = base.fleck; x.beginPath(); x.ellipse(px, py, fx, fy, rot, 0, 7); x.fill();
    x.fillStyle = 'rgba(255,255,255,.35)'; x.beginPath(); x.ellipse(px - fx * .3, py - fy * .3, fx * .35, fy * .3, rot, 0, 7); x.fill();
  }
  if (base.crust) for (let i = 0; i < 26; i++) {
    const a = R() * Math.PI * 2, r = RF * (.78 + R() * .2), px = r * Math.cos(a), py = r * Math.sin(a), gg = x.createRadialGradient(px, py, 0, px, py, 40);
    gg.addColorStop(0, 'rgba(176,112,40,.55)'); gg.addColorStop(1, 'rgba(176,112,40,0)'); x.fillStyle = gg; x.beginPath(); x.arc(px, py, 40, 0, 7); x.fill();
  }
  x.restore();
  riceCache.set(base.id, s); return s;
}

let stoneSprite = null;
function stone() {
  if (stoneSprite) return stoneSprite;
  const c = document.createElement('canvas'); c.width = c.height = 1000 * S; const x = c.getContext('2d'); x.setTransform(S, 0, 0, S, 0, 0);
  const { CX, CY, RT, RO, RW, RF } = G, R = rng(42);
  // shadow of the trivet on the table
  let g = x.createRadialGradient(CX + 14, CY + 22, RT * .86, CX + 14, CY + 22, RT * 1.07);
  g.addColorStop(0, 'rgba(0,0,0,.62)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.beginPath(); x.arc(CX + 14, CY + 22, RT * 1.07, 0, 7); x.fill();
  // wooden trivet: straight plank grain, bevelled edge
  x.save(); x.beginPath(); x.arc(CX, CY, RT, 0, 7); x.clip();
  g = x.createLinearGradient(CX - RT, CY - RT, CX + RT, CY + RT); g.addColorStop(0, '#7a4c2c'); g.addColorStop(.5, '#5c381f'); g.addColorStop(1, '#3a2213');
  x.fillStyle = g; x.fillRect(CX - RT, CY - RT, RT * 2, RT * 2);
  for (let y = -RT; y < RT; y += 2.2) {
    const dark = R() < .55, w = .5 + R() * 1.6, ph = R() * 9, amp = 1.5 + R() * 4;
    x.strokeStyle = dark ? `rgba(30,14,5,${.10 + R() * .22})` : `rgba(255,214,160,${.03 + R() * .07})`; x.lineWidth = w; x.beginPath();
    for (let xx = -RT; xx <= RT; xx += 20) { const yy = CY + y + Math.sin(xx / 140 + ph) * amp + Math.sin(xx / 37 + ph * 2) * .8; xx === -RT ? x.moveTo(CX + xx, yy) : x.lineTo(CX + xx, yy); }
    x.stroke();
  }
  for (let k = 0; k < 2; k++) { const kx = CX + (R() - .5) * RT * 1.2, ky = CY + (R() - .5) * RT * 1.2; for (let r = 4; r < 26; r += 3) { x.strokeStyle = `rgba(30,14,5,${.25 - r / 140})`; x.lineWidth = 1; x.beginPath(); x.ellipse(kx, ky, r * 1.9, r * .8, 0, 0, 7); x.stroke(); } }
  // bevel
  g = x.createRadialGradient(CX, CY, RT - 26, CX, CY, RT); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.7, 'rgba(0,0,0,.12)'); g.addColorStop(1, 'rgba(0,0,0,.45)'); x.fillStyle = g; x.fillRect(CX - RT, CY - RT, RT * 2, RT * 2);
  x.restore();
  x.lineCap = 'round';
  x.strokeStyle = 'rgba(255,220,170,.28)'; x.lineWidth = 2.5; x.beginPath(); x.arc(CX, CY, RT - 3, Math.PI * 1.02, Math.PI * 1.6); x.stroke();
  x.strokeStyle = 'rgba(255,220,170,.12)'; x.lineWidth = 1.5; x.beginPath(); x.arc(CX, CY, RT - 22, Math.PI * .1, Math.PI * .45); x.stroke();
  // the bowl's shadow on the wood
  g = x.createRadialGradient(CX + 12, CY + 18, RO * .9, CX + 12, CY + 18, RO * 1.1); g.addColorStop(0, 'rgba(10,4,0,.75)'); g.addColorStop(1, 'rgba(10,4,0,0)'); x.fillStyle = g; x.beginPath(); x.arc(CX + 12, CY + 18, RO * 1.1, 0, 7); x.fill();
  // stone body
  g = x.createRadialGradient(CX - RO * .35, CY - RO * .4, RO * .05, CX, CY, RO); g.addColorStop(0, '#62686a'); g.addColorStop(.5, '#303536'); g.addColorStop(1, '#101313');
  x.fillStyle = g; x.beginPath(); x.arc(CX, CY, RO, 0, 7); x.fill();
  x.save(); x.beginPath(); x.arc(CX, CY, RO, 0, 7); x.clip();
  for (let i = 0; i < 14000; i++) { const a = R() * 7, r = Math.sqrt(R()) * RO; x.fillStyle = R() < .45 ? `rgba(255,255,255,${.03 + R() * .08})` : `rgba(0,0,0,${.06 + R() * .14})`; x.beginPath(); x.arc(CX + r * Math.cos(a), CY + r * Math.sin(a), .4 + R() * 1.1, 0, 7); x.fill(); }
  x.restore();
  // lip: a rounded band with a lit top-left and a shaded bottom-right
  g = x.createLinearGradient(CX - RO, CY - RO, CX + RO, CY + RO); g.addColorStop(0, 'rgba(255,255,255,.16)'); g.addColorStop(.45, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,.35)');
  x.strokeStyle = g; x.lineWidth = RO - RW; x.beginPath(); x.arc(CX, CY, (RO + RW) / 2, 0, 7); x.stroke();
  x.strokeStyle = 'rgba(255,255,255,.26)'; x.lineWidth = 2.6; x.beginPath(); x.arc(CX, CY, RO - 6, Math.PI * 1.05, Math.PI * 1.58); x.stroke();
  x.strokeStyle = 'rgba(255,255,255,.1)'; x.lineWidth = 1.4; x.beginPath(); x.arc(CX, CY, RW + 5, Math.PI * .08, Math.PI * .52); x.stroke();
  // inner wall: concave, so the far (bottom-right) side catches the light
  g = x.createLinearGradient(CX - RW, CY - RW, CX + RW, CY + RW); g.addColorStop(0, '#070909'); g.addColorStop(.55, '#191c1c'); g.addColorStop(1, '#3e4444');
  x.fillStyle = g; x.beginPath(); x.arc(CX, CY, RW, 0, 7); x.fill();
  x.strokeStyle = 'rgba(0,0,0,.7)'; x.lineWidth = 2.5; x.beginPath(); x.arc(CX, CY, RW, 0, 7); x.stroke();
  // sesame-oil sheen on the lit inner wall
  x.strokeStyle = 'rgba(255,236,200,.13)'; x.lineWidth = 9; x.beginPath(); x.arc(CX, CY, (RW + RF) / 2, Math.PI * .02, Math.PI * .42); x.stroke();
  x.strokeStyle = 'rgba(255,236,200,.22)'; x.lineWidth = 2; x.beginPath(); x.arc(CX, CY, (RW + RF) / 2 + 3, Math.PI * .12, Math.PI * .3); x.stroke();
  x.fillStyle = '#0b0d0d'; x.beginPath(); x.arc(CX, CY, RF, 0, 7); x.fill();
  return (stoneSprite = c);
}

/* ---------- centre pieces ---------- */
function yolk(x, cx, cy, r) {
  x.save(); shadowOn(x, 6, 2.5, .35);
  const g = x.createRadialGradient(cx - r * .35, cy - r * .4, r * .1, cx, cy, r); g.addColorStop(0, '#ffcc4a'); g.addColorStop(.6, '#f5a013'); g.addColorStop(1, '#dd7b06');
  x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); shadowOff(x);
  gloss(x, cx - r * .35, cy - r * .42, r * .32, r * .17, .75); gloss(x, cx + r * .2, cy + r * .25, r * .5, r * .3, .08, .6);
  x.restore();
}
function drawCentre(x, o, cx, cy, k = 1) {
  const R = rng(hash(o.id || o.n));
  x.save(); x.translate(cx, cy); x.scale(k, k);
  switch (o.t) {
    case 'egg': case 'eggx': {
      const pts = blobPts(R, 58, 54, 16, .22);
      shadowOn(x, 10, 4, .35); blobPath(x, pts);
      const g = x.createRadialGradient(-12, -14, 4, 0, 0, 64); g.addColorStop(0, '#fffdf6'); g.addColorStop(1, '#efe6d2'); x.fillStyle = g; x.fill(); shadowOff(x);
      if (o.t === 'eggx') { x.save(); blobPath(x, pts); x.clip(); x.lineWidth = 14; x.strokeStyle = 'rgba(168,104,36,.75)'; blobPath(x, pts); x.stroke(); x.lineWidth = 5; x.setLineDash([3, 6]); x.strokeStyle = 'rgba(214,160,80,.9)'; x.scale(.9, .9); blobPath(x, pts); x.stroke(); x.restore(); }
      else { x.save(); blobPath(x, pts); x.clip(); x.lineWidth = 5; x.strokeStyle = 'rgba(206,160,96,.55)'; blobPath(x, pts); x.stroke(); x.restore(); }
      for (let i = 0; i < 5; i++) gloss(x, (R() - .5) * 60, (R() - .5) * 60, 6 + R() * 6, 3, .18, R() * 3);
      yolk(x, 6, -4, 22); break;
    }
    case 'yolk':
      if (o.veil) { x.fillStyle = 'rgba(250,246,236,.65)'; blobPath(x, blobPts(R, 44, 40, 12, .3)); x.fill(); }
      yolk(x, 0, 0, 25); break;
    case 'jammy':
      for (const dx of [-24, 24]) {
        x.save(); x.translate(dx, 0); x.rotate(dx < 0 ? -.12 : .1);
        shadowOn(x, 7, 3, .35); const g = x.createRadialGradient(-6, -10, 2, 0, 0, 34); g.addColorStop(0, shade(o.c, .3)); g.addColorStop(1, shade(o.c, -.12)); x.fillStyle = g; x.beginPath(); x.ellipse(0, 0, 22, 31, 0, 0, 7); x.fill(); shadowOff(x);
        if (o.marble) { x.strokeStyle = 'rgba(80,45,20,.55)'; x.lineWidth = 1; for (let i = 0; i < 7; i++) { x.beginPath(); x.moveTo((R() - .5) * 36, (R() - .5) * 56); x.lineTo((R() - .5) * 36, (R() - .5) * 56); x.stroke(); } }
        x.fillStyle = o.c === '#fbf7ec' ? '#fffdf7' : shade(o.c, .55); x.beginPath(); x.ellipse(0, 1, 17, 25, 0, 0, 7); x.fill();
        const y = x.createRadialGradient(-2, -2, 1, 0, 2, 15); y.addColorStop(0, '#f39418'); y.addColorStop(.6, '#f7ad2c'); y.addColorStop(1, '#f6c04a'); x.fillStyle = y; x.beginPath(); x.ellipse(0, 2, 12, 16, 0, 0, 7); x.fill();
        gloss(x, -4, -4, 4, 2.5, .6); x.restore();
      } break;
    case 'roll':
      for (const dx of [-30, 0, 30]) {
        x.save(); x.translate(dx, (R() - .5) * 6); x.rotate((R() - .5) * .2);
        shadowOn(x, 6, 3, .35); const g = x.createLinearGradient(-13, -20, 13, 20); g.addColorStop(0, shade(o.c, .2)); g.addColorStop(1, shade(o.c, -.12)); x.fillStyle = g; rr(x, -13, -20, 26, 40, 6); x.fill(); shadowOff(x);
        x.strokeStyle = shade(o.c, -.3, .7); x.lineWidth = 1.6; x.beginPath(); for (let i = 0; i < 4; i++) { x.moveTo(-9, -14 + i * 9); x.quadraticCurveTo(0, -10 + i * 9, 9, -14 + i * 9); } x.stroke();
        x.strokeStyle = 'rgba(160,100,30,.45)'; x.lineWidth = 2.5; rr(x, -13, -20, 26, 40, 6); x.stroke(); x.restore();
      } break;
    case 'crumble':
      for (let i = 0; i < 42; i++) { const a = R() * 7, r = Math.sqrt(R()) * 50; x.save(); x.translate(r * Math.cos(a), r * Math.sin(a)); shadowOn(x, 2.5, 1.4, .3); x.fillStyle = i % 4 ? o.c : '#e8e0cc'; blobPath(x, blobPts(R, 5 + R() * 4, 4 + R() * 3, 6, .5)); x.fill(); x.restore(); }
      break;
    case 'blob':
      for (let i = 0; i < 20; i++) { const a = R() * 7, r = Math.sqrt(R()) * 46; x.save(); x.translate(r * Math.cos(a), r * Math.sin(a)); shadowOn(x, 3, 1.6, .35); const g = x.createRadialGradient(-2, -3, 1, 0, 0, 10); g.addColorStop(0, shade(o.c, .3)); g.addColorStop(1, shade(o.c, -.12)); x.fillStyle = g; blobPath(x, blobPts(R, 9, 7, 7, .45)); x.fill(); x.restore(); }
      for (let i = 0; i < 9; i++) { const a = R() * 7, r = Math.sqrt(R()) * 44; x.save(); x.translate(r * Math.cos(a), r * Math.sin(a)); shadowOn(x, 2, 1, .3); x.fillStyle = '#c8361e'; blobPath(x, blobPts(R, 4, 3.4, 6, .5)); x.fill(); x.restore(); }
      break;
    case 'disc':
      for (const [dx, dy] of [[-20, -8], [20, 10]]) { x.save(); x.translate(dx, dy); shadowOn(x, 7, 3, .35); const g = x.createRadialGradient(-8, -10, 2, 0, 0, 30); g.addColorStop(0, shade(o.c, .3)); g.addColorStop(.7, o.c); g.addColorStop(1, shade(o.c, -.35)); x.fillStyle = g; x.beginPath(); x.arc(0, 0, 29, 0, 7); x.fill(); shadowOff(x); for (let i = 0; i < 8; i++) { x.fillStyle = 'rgba(110,60,20,.3)'; x.beginPath(); x.arc((R() - .5) * 38, (R() - .5) * 38, 1.5 + R() * 2, 0, 7); x.fill(); } gloss(x, -9, -11, 8, 4, .3); x.restore(); }
      break;
  }
  x.restore();
}
function drawSauce(x, o, cx, cy, r) {
  x.save(); x.beginPath(); x.arc(cx, cy, r, 0, 7); x.clip();
  const g = x.createRadialGradient(cx - r * .3, cy - r * .35, 2, cx, cy, r); g.addColorStop(0, shade(o.c, .25)); g.addColorStop(.7, o.c); g.addColorStop(1, shade(o.c, -.35));
  x.fillStyle = g; x.fillRect(cx - r, cy - r, r * 2, r * 2);
  if (o.fleck) { const R = rng(hash(o.id || o.n)); x.fillStyle = o.fleck; for (let i = 0; i < 70; i++) { const a = R() * 7, rr2 = Math.sqrt(R()) * r * .95; x.beginPath(); x.ellipse(cx + rr2 * Math.cos(a), cy + rr2 * Math.sin(a), 1.2 + R() * 2.2, .9 + R() * 1.2, R() * 3, 0, 7); x.fill(); } }
  const ig = x.createRadialGradient(cx, cy, r * .6, cx, cy, r); ig.addColorStop(0, 'rgba(0,0,0,0)'); ig.addColorStop(1, 'rgba(0,0,0,.35)'); x.fillStyle = ig; x.fillRect(cx - r, cy - r, r * 2, r * 2);
  x.restore();
  x.strokeStyle = 'rgba(255,255,255,.42)'; x.lineWidth = r * .08; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r * .72, Math.PI * 1.1, Math.PI * 1.45); x.stroke();
  gloss(x, cx + r * .3, cy + r * .35, r * .1, r * .05, .4, .8);
}

/* ---------- thumbnails, side dishes and cutlery ---------- */
function fillContent(x, kind, o, cx, cy, r) {
  const ph = photo(o);
  x.save(); x.beginPath(); x.arc(cx, cy, r, 0, 7); x.clip();
  if (ph) x.drawImage(ph.img, cx - r, cy - r, r * 2, r * 2);
  else if (kind === 'base') { const rc = rice(o), span = 130; x.drawImage(rc.c, rc.c.width / 2 - span / 2 * S, rc.c.height / 2 - span / 2 * S, span * S, span * S, cx - r, cy - r, r * 2, r * 2); }
  else if (kind === 'sauce') { x.fillStyle = '#1b1e1e'; x.fillRect(cx - r, cy - r, r * 2, r * 2); drawSauce(x, o, cx, cy, r); }
  else if (kind === 'centre') { const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, '#f2ecdc'); g.addColorStop(1, '#ddd2bc'); x.fillStyle = g; x.fillRect(cx - r, cy - r, r * 2, r * 2); drawCentre(x, o, cx, cy, r / 68); }
  else if (kind === 'garnish') {
    x.fillStyle = '#ece5d4'; x.fillRect(cx - r, cy - r, r * 2, r * 2); const R = rng(hash(o.id + kind)), m = o.mix || [['flake', o.c]], k = r / 50;
    for (let i = 0; i < 70; i++) { const [t, col] = m[i % m.length], sp = sprites({ id: o.id + t + col, c: col }, t, 4)[i % 4]; x.save(); x.translate(cx + (R() * 2 - 1) * r, cy + (R() * 2 - 1) * r); x.rotate(R() * 7); x.scale(1.8 * k, 1.8 * k); x.drawImage(sp.c, -sp.w / 2, -sp.h / 2, sp.w, sp.h); x.restore(); }
  } else {
    x.fillStyle = shade(o.c, -.3); x.fillRect(cx - r, cy - r, r * 2, r * 2); const R = rng(hash(o.id + kind)), list = sprites(o, o.t), k = r / 50;
    const n = o.t === 'mash' ? 9 : o.t === 'dot' ? 56 : 34;
    for (let i = 0; i < n; i++) { const sp = list[i % list.length]; x.save(); x.translate(cx + (R() * 2.2 - 1.1) * r, cy + (R() * 2.2 - 1.1) * r); x.rotate(R() * 7); x.scale(k, k); x.drawImage(sp.c, -sp.w / 2, -sp.h / 2, sp.w, sp.h); x.restore(); }
  }
  const v = x.createRadialGradient(cx, cy, r * .55, cx, cy, r * 1.02); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.34)'); x.fillStyle = v; x.fillRect(cx - r, cy - r, r * 2, r * 2);
  x.restore();
}
const thumbCache = new Map();
export function thumb(kind, o) {
  const key = kind + '|' + (o.id || o.n) + '|' + o.c;
  if (thumbCache.has(key)) return thumbCache.get(key);
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); x.setTransform(1.28, 0, 0, 1.28, 0, 0);
  fillContent(x, kind, o, 50, 50, 50);
  const url = c.toDataURL('image/png'); thumbCache.set(key, url); return url;
}
// A celadon banchan dish holding a component, seen from above.
const dishCache = new Map();
export function dish(kind, o) {
  const key = kind + '|' + (o.id || o.n) + '|' + o.c;
  if (dishCache.has(key)) return dishCache.get(key);
  const px = 320, k = px / 100, c = document.createElement('canvas'); c.width = c.height = px; const x = c.getContext('2d'); x.setTransform(k, 0, 0, k, 0, 0);
  const R = rng(hash('dish' + key));
  x.save(); x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 9 * k; x.shadowOffsetX = 2 * k; x.shadowOffsetY = 5 * k;
  let g = x.createRadialGradient(36, 32, 2, 50, 50, 47); g.addColorStop(0, '#d6e6d6'); g.addColorStop(.55, '#a9c4b0'); g.addColorStop(1, '#6e8c78');
  x.fillStyle = g; x.beginPath(); x.arc(50, 50, 45, 0, 7); x.fill(); x.restore();
  x.save(); x.beginPath(); x.arc(50, 50, 45, 0, 7); x.clip(); x.strokeStyle = 'rgba(52,78,62,.22)'; x.lineWidth = .35;
  for (let i = 0; i < 26; i++) { let px2 = R() * 100, py = R() * 100; x.beginPath(); x.moveTo(px2, py); for (let s = 0; s < 4; s++) { px2 += (R() - .5) * 18; py += (R() - .5) * 18; x.lineTo(px2, py); } x.stroke(); }
  x.restore();
  x.lineCap = 'round'; x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 1.4; x.beginPath(); x.arc(50, 50, 43, Math.PI * 1.08, Math.PI * 1.55); x.stroke();
  g = x.createLinearGradient(15, 15, 85, 85); g.addColorStop(0, '#5f7e6a'); g.addColorStop(1, '#c9dccc'); x.fillStyle = g; x.beginPath(); x.arc(50, 50, 36.5, 0, 7); x.fill();
  fillContent(x, kind, o, 50, 50, 34.5);
  x.strokeStyle = 'rgba(255,255,255,.3)'; x.lineWidth = .8; x.beginPath(); x.arc(50, 50, 35, Math.PI * .05, Math.PI * .5); x.stroke();
  const url = c.toDataURL('image/png'); dishCache.set(key, url); return url;
}
// Korean brass spoon (sutgarak) and flat chopsticks (jeotgarak), laid horizontally.
let cutleryUrl = null;
export function cutlery() {
  if (cutleryUrl) return cutleryUrl;
  const W = 520, H = 120, k = 2, c = document.createElement('canvas'); c.width = W * k; c.height = H * k; const x = c.getContext('2d'); x.setTransform(k, 0, 0, k, 0, 0);
  const brass = (y0, y1) => { const g = x.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#f6e0a6'); g.addColorStop(.35, '#d3aa5c'); g.addColorStop(.75, '#9c7230'); g.addColorStop(1, '#6e4e1c'); return g; };
  const sh = () => { x.shadowColor = 'rgba(0,0,0,.55)'; x.shadowBlur = 6 * k; x.shadowOffsetX = 2 * k; x.shadowOffsetY = 4 * k; };
  // chopsticks
  for (const y of [78, 96]) {
    x.save(); sh(); x.fillStyle = brass(y - 4, y + 4); x.beginPath(); x.moveTo(30, y - 2); x.lineTo(500, y - 4.5); x.lineTo(500, y + 4.5); x.lineTo(30, y + 2); x.closePath(); x.fill(); x.restore();
    x.strokeStyle = 'rgba(80,50,10,.45)'; x.lineWidth = .7; for (let i = 0; i < 9; i++) { x.beginPath(); x.moveTo(420 + i * 8, y - 4); x.lineTo(424 + i * 8, y + 4); x.stroke(); }
    x.strokeStyle = 'rgba(255,250,230,.6)'; x.lineWidth = .8; x.beginPath(); x.moveTo(40, y - 1); x.lineTo(495, y - 2.6); x.stroke();
  }
  // spoon
  x.save(); sh(); x.fillStyle = brass(30, 42); x.beginPath(); x.moveTo(108, 36); x.lineTo(505, 31); x.quadraticCurveTo(512, 36, 505, 41); x.lineTo(108, 42); x.closePath(); x.fill(); x.restore();
  x.save(); sh(); const bg = x.createRadialGradient(56, 30, 4, 66, 39, 46); bg.addColorStop(0, '#fbecc0'); bg.addColorStop(.45, '#d9b266'); bg.addColorStop(1, '#7a5520'); x.fillStyle = bg; x.beginPath(); x.ellipse(66, 39, 48, 30, 0, 0, 7); x.fill(); x.restore();
  const cg = x.createRadialGradient(72, 44, 2, 66, 39, 40); cg.addColorStop(0, 'rgba(90,60,15,.45)'); cg.addColorStop(1, 'rgba(90,60,15,0)'); x.fillStyle = cg; x.beginPath(); x.ellipse(66, 39, 42, 25, 0, 0, 7); x.fill();
  x.strokeStyle = 'rgba(255,250,225,.75)'; x.lineWidth = 1.5; x.lineCap = 'round'; x.beginPath(); x.ellipse(66, 39, 44, 26, 0, Math.PI * 1.05, Math.PI * 1.5); x.stroke();
  x.strokeStyle = 'rgba(255,250,230,.55)'; x.lineWidth = 1; x.beginPath(); x.moveTo(120, 36.5); x.lineTo(500, 32.5); x.stroke();
  return (cutleryUrl = c.toDataURL('image/png'));
}

/* ---------- the live bowl ---------- */
const STEP = Math.PI * 2 / WEDGES;
const wedgeMid = i => -Math.PI / 2 + Math.PI / 6 + i * STEP;   // segments sit at 2, 4, 6, 8, 10 and 12 o'clock offsets so labels fall left and right
function sectorPath(x, i, r1 = G.R1, r2 = G.R2, dx = 0, dy = 0) {
  const mid = wedgeMid(i), a0 = mid - STEP / 2 + GAP, a1 = mid + STEP / 2 - GAP, cx = G.CX + dx, cy = G.CY + dy;
  x.beginPath(); x.arc(cx, cy, r2, a0, a1); x.arc(cx, cy, r1, a1, a0, true); x.closePath();
  return { a0, a1, mid };
}
export const geometry = { ...G, wedgeAngle: i => wedgeMid(i) };

export class Bowl {
  constructor(canvas, { onHover, onClick } = {}) {
    this.cv = canvas; this.ctx = canvas.getContext('2d');
    this.onHover = onHover || (() => {}); this.onClick = onClick || (() => {});
    this.pieces = []; this.garnish = []; this.ids = {}; this.opts = {};
    this.mix = 0; this.mixFrom = 0; this.mixTo = 0; this.mixT0 = 0;
    this.rot = 0; this.rotFrom = 0; this.rotT0 = 0; this.rotDur = 0;
    this.hov = new Array(WEDGES).fill(0); this.hover = null; this.active = null; this.external = null;
    this.rice = null; this.prevRice = null; this.riceT0 = 0;
    this.centre = null; this.prevCentre = null; this.centreT0 = 0;
    this.sauce = null; this.smear = null; this.animUntil = 0; this.raf = 0; this.first = true;
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    new ResizeObserver(() => this.resize()).observe(canvas);
    canvas.addEventListener('pointermove', e => this.pointer(e));
    canvas.addEventListener('pointerleave', () => { this.setHover(null); this.onHover(null, null); });
    canvas.addEventListener('click', e => { const s = this.pick(e); if (s) this.onClick(s, e); });
    this.resize();
  }
  resize() {
    const w = this.cv.clientWidth || 600, dpr = Math.min(window.devicePixelRatio || 1, 2), px = Math.min(1600, Math.round(w * dpr));
    if (this.cv.width !== px) { this.cv.width = this.cv.height = px; }
    this.K = px / 1000; this.kick(0);
  }
  now() { return performance.now(); }
  kick(ms = 0) { this.animUntil = Math.max(this.animUntil, this.now() + ms); if (!this.raf) this.raf = requestAnimationFrame(t => this.frame(t)); }
  dur(ms) { return this.reduced ? 1 : ms; }

  update(state, { shuffle = false } = {}) {
    const now = this.now(), first = this.first, reload = () => this.refreshPhotos();
    this.first = false;
    if (shuffle && !first && !this.reduced) { this.rotFrom = -.55; this.rot = -.55; this.rotT0 = now; this.rotDur = 1100; }
    if (state.base.id !== this.ids.base) { this.prevRice = this.rice; this.rice = rice(state.base); this.riceT0 = now; this.ids.base = state.base.id; }
    state.wedges.forEach((o, i) => {
      if (o.id === this.ids['w' + i]) return;
      for (const p of this.pieces) if (p.slot === i && !p.td) p.td = now + Math.random() * 140;
      this.ids['w' + i] = o.id; this.opts['w' + i] = o; photo(o, reload);
      this.spawn(i, o, now + (first ? 450 + i * 190 : shuffle ? 120 + i * 90 : 100));
    });
    if (state.centre.id !== this.ids.centre) { this.prevCentre = this.centre; this.centre = state.centre; this.centreT0 = now + (first ? 1700 : shuffle ? 650 : 0); this.ids.centre = state.centre.id; this.makeSmear(); }
    this.sauce = state.sauce;
    if (state.garnish.id !== this.ids.garnish) {
      for (const p of this.garnish) if (!p.td) p.td = now + Math.random() * 100;
      this.ids.garnish = state.garnish.id; this.spawnGarnish(state.garnish, now + (first ? 2200 : shuffle ? 1000 : 150));
    }
    this.kick(this.dur(first ? 3400 : 1900));
  }
  spawn(i, o, t0) {
    const ph = photo(o), list = ph ? photoCrops(o, ph) : sprites(o, o.t), n = Math.round((ph ? COUNTS.photo : (COUNTS[o.t] || 150)) * .88);
    const mid = wedgeMid(i), a0 = mid - STEP / 2 + GAP, a1 = mid + STEP / 2 - GAP;
    const R = Math.random, aligned = ['strip', 'meat', 'shred', 'sprout'].includes(o.t);
    const born = [];
    for (let k = 0; k < n; k++) {
      // bias pieces toward the middle of the segment so each one reads as a mound
      const u = R(), r = Math.sqrt(u * (G.R2 ** 2 - G.R1 ** 2) + G.R1 ** 2), th = a0 - .03 + R() * (a1 - a0 + .06);
      const mr = Math.sqrt(R()) * (G.RF - 18), ma = R() * Math.PI * 2;
      const rot = aligned ? th + Math.PI / 2 + (R() - .5) * 1.6 : R() * Math.PI * 2;
      const centrality = 1 - Math.abs((r - (G.R1 + G.R2) / 2) / ((G.R2 - G.R1) / 2)) * .6 - Math.abs((th - mid) / (STEP / 2)) * .4;
      born.push({ slot: i, s: list[k % list.length], x: G.CX + r * Math.cos(th), y: G.CY + r * Math.sin(th), rot, mx: G.CX + mr * Math.cos(ma), my: G.CY + mr * Math.sin(ma), mrot: rot + (R() - .5) * 3, z: R(), lift: .94 + centrality * .12, t0: t0 + (this.reduced ? 0 : R() * 340), td: 0, photo: !!ph });
    }
    born.sort((a, b) => a.lift - b.lift); // pieces at the top of the heap are drawn last
    this.pieces = this.pieces.concat(born);
    this.pieces.sort((a, b) => a.slot - b.slot);
  }
  spawnGarnish(o, t0) {
    const m = o.mix || [['flake', o.c]], R = Math.random;
    for (let k = 0; k < 96; k++) {
      const [t, col] = m[k % m.length], list = sprites({ id: o.id + t + col, c: col }, t, 6);
      const r = 26 + Math.sqrt(R()) * (G.R2 - 24), a = R() * Math.PI * 2, mr = Math.sqrt(R()) * (G.RF - 18), ma = R() * 7;
      this.garnish.push({ s: list[k % list.length], x: G.CX + r * Math.cos(a), y: G.CY + r * Math.sin(a), rot: R() * 7, mx: G.CX + mr * Math.cos(ma), my: G.CY + mr * Math.sin(ma), mrot: R() * 7, t0: t0 + (this.reduced ? 0 : R() * 700), td: 0 });
    }
  }
  refreshPhotos() { for (let i = 0; i < WEDGES; i++) { const o = this.opts['w' + i]; if (o && PHOTOS.has(o.id)) { this.pieces = this.pieces.filter(p => p.slot !== i); this.spawn(i, o, this.now()); } } this.kick(400); }
  makeSmear() { const R = rng(hash(this.centre.id)); this.smear = Array.from({ length: 7 }, () => ({ a: R() * 7, r: 110 + R() * 150, b: (R() - .5) * 120, w: 8 + R() * 10 })); }
  setMix(on) { this.mixFrom = this.mix; this.mixTo = on ? 1 : 0; this.mixT0 = this.now(); this.kick(this.dur(1400)); }
  setActive(slot) { this.active = slot; this.kick(450); }
  setHover(slot) { if (slot === this.hover) return; this.hover = slot; this.cv.style.cursor = slot && slot !== 'mixed' ? 'pointer' : ''; this.kick(450); }
  highlight(slot) { this.external = slot; this.kick(450); }   // hover coming from a label outside the canvas

  toLogical(e) { const b = this.cv.getBoundingClientRect(); return [(e.clientX - b.left) / b.width * 1000, (e.clientY - b.top) / b.height * 1000]; }
  pick(e) {
    const [lx, ly] = this.toLogical(e);
    const c = Math.cos(-this.rot), s = Math.sin(-this.rot), dx0 = lx - G.CX, dy0 = ly - G.CY, dx = dx0 * c - dy0 * s, dy = dx0 * s + dy0 * c, r = Math.hypot(dx, dy);
    if (r > G.RW) return null;
    if (this.mix > .5) return 'mixed';
    if (r < G.RC) return 'centre';
    if (r < G.R2 + 6 && r > G.R1 - 6) { let a = Math.atan2(dy, dx) - wedgeMid(0); a = (a % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2); return WEDGE_KEYS[Math.round(a / STEP) % WEDGES]; }
    return 'base';
  }
  pointer(e) { if (e.pointerType === 'touch') return; const s = this.pick(e); this.setHover(s); this.onHover(s, e); }

  frame() {
    this.raf = 0; const now = this.now();
    let busy = now < this.animUntil;
    if (this.mix !== this.mixTo) { const p = clamp((now - this.mixT0) / this.dur(1300)); this.mix = lerp(this.mixFrom, this.mixTo, easeIO(p)); if (p >= 1) this.mix = this.mixTo; busy = true; }
    if (this.rotDur) { const p = clamp((now - this.rotT0) / this.rotDur); this.rot = lerp(this.rotFrom, 0, easeOut(p)); if (p >= 1) { this.rot = 0; this.rotDur = 0; } busy = true; }
    for (let i = 0; i < WEDGES; i++) { const k = WEDGE_KEYS[i], target = (this.hover === k || this.active === k || this.external === k) && this.mix < .05 ? 1 : 0, d = target - this.hov[i]; if (Math.abs(d) > .002) { this.hov[i] += d * .2; busy = true; } else this.hov[i] = target; }
    this.draw(now);
    if (busy) this.raf = requestAnimationFrame(() => this.frame());
  }
  draw(now) {
    const x = this.ctx, K = this.K, m = this.mix, φ = this.rot;
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, this.cv.width, this.cv.height);
    x.setTransform(K, 0, 0, K, 0, 0);
    x.drawImage(stone(), 0, 0, 1000, 1000);
    const c = Math.cos(φ), s = Math.sin(φ), ex = G.CX - G.CX * c + G.CY * s, ey = G.CY - G.CX * s - G.CY * c;
    const base = () => x.setTransform(K * c, K * s, -K * s, K * c, K * ex, K * ey);
    const lit = slot => slot && (this.hover === slot || this.active === slot || this.external === slot);
    base();
    // rice
    x.save(); x.beginPath(); x.arc(G.CX, G.CY, G.RF, 0, 7); x.clip();
    const rp = clamp((now - this.riceT0) / this.dur(this.prevRice ? 500 : 900));
    if (this.prevRice && rp < 1) x.drawImage(this.prevRice.c, G.CX - this.prevRice.w / 2, G.CY - this.prevRice.h / 2, this.prevRice.w, this.prevRice.h);
    if (this.rice) {
      x.globalAlpha = rp;
      const sc = this.prevRice || this.reduced ? 1 : .92 + .08 * easeOut(rp);
      x.drawImage(this.rice.c, G.CX - this.rice.w * sc / 2, G.CY - this.rice.h * sc / 2, this.rice.w * sc, this.rice.h * sc); x.globalAlpha = 1;
    }
    if (lit('base') && m < .05) { x.fillStyle = 'rgba(255,240,215,.08)'; x.fillRect(0, 0, 1000, 1000); }
    if (m > 0 && this.sauce) { const R = rng(hash(this.sauce.id)); for (let i = 0; i < 9; i++) { const a = R() * 7, r = R() * 240, px = G.CX + r * Math.cos(a), py = G.CY + r * Math.sin(a), rad = 70 + R() * 90, g = x.createRadialGradient(px, py, 0, px, py, rad); g.addColorStop(0, shade(this.sauce.c, 0, .55 * m)); g.addColorStop(1, shade(this.sauce.c, 0, 0)); x.fillStyle = g; x.beginPath(); x.arc(px, py, rad, 0, 7); x.fill(); } }
    // segment beds
    if (m < 1) for (let i = 0; i < WEDGES; i++) {
      const o = this.opts['w' + i]; if (!o) continue;
      const h = this.hov[i] * 10, mid = wedgeMid(i), dx = Math.cos(mid) * h, dy = Math.sin(mid) * h;
      const born = this.pieces.find(p => p.slot === i && !p.td), vis = born ? clamp((now - born.t0 + 300) / 500) : 0;
      x.globalAlpha = (1 - m) * vis; sectorPath(x, i, G.R1 + 4, G.R2 - 4, dx, dy);
      x.save(); x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = (10 + h) * K; x.shadowOffsetY = (3 + h * .6) * K;
      x.fillStyle = shade(o.c, -.32); x.lineJoin = 'round'; x.lineWidth = 8; x.strokeStyle = shade(o.c, -.32); x.fill(); x.stroke(); x.restore();
      const ph = photo(o); if (ph) { x.save(); sectorPath(x, i, G.R1, G.R2, dx, dy); x.clip(); x.drawImage(ph.img, G.CX - G.R2 + dx, G.CY - G.R2 + dy, G.R2 * 2, G.R2 * 2); x.restore(); }
      x.globalAlpha = 1;
    }
    x.restore();
    // pieces
    const swirl = Math.sin(m * Math.PI) * .85, order = m > .5 ? [...this.pieces].sort((a, b) => a.z - b.z) : this.pieces;
    let dead = false;
    for (const p of order) {
      const sp = clamp((now - p.t0) / this.dur(440)); if (sp <= 0) continue;
      let sc = (this.reduced ? 1 : easeBack(sp)) * lerp(p.lift, 1, m), al = clamp(sp * 2.2);
      if (p.td) { const d = clamp((now - p.td) / this.dur(260)); if (d >= 1) { p.dead = dead = true; continue; } sc *= 1 - d * .5; al *= 1 - d; }
      if (p.photo) al *= m;
      if (al <= 0) continue;
      const h = this.hov[p.slot] * 10 * (1 - m), mid = wedgeMid(p.slot), hs = 1 + this.hov[p.slot] * .03 * (1 - m);
      let px = lerp(p.x + Math.cos(mid) * h, p.mx, m), py = lerp(p.y + Math.sin(mid) * h, p.my, m), pr = lerp(p.rot, p.mrot, m);
      if (swirl) { const dx = px - G.CX, dy = py - G.CY, cs = Math.cos(swirl), sn = Math.sin(swirl); px = G.CX + dx * cs - dy * sn; py = G.CY + dx * sn + dy * cs; pr += swirl; }
      const qx = G.CX + (px - G.CX) * c - (py - G.CY) * s, qy = G.CY + (px - G.CX) * s + (py - G.CY) * c, a = pr + φ, k = K * sc * hs;
      x.globalAlpha = al; x.setTransform(k * Math.cos(a), k * Math.sin(a), -k * Math.sin(a), k * Math.cos(a), K * qx, K * qy);
      x.drawImage(p.s.c, -p.s.w / 2, -p.s.h / 2, p.s.w, p.s.h);
    }
    x.globalAlpha = 1; if (dead) this.pieces = this.pieces.filter(p => !p.dead);
    // light each segment like a heap: bright crown, darker skirts
    base();
    if (m < 1) for (let i = 0; i < WEDGES; i++) {
      if (!this.opts['w' + i]) continue;
      const h = this.hov[i] * 10, mid = wedgeMid(i), dx = Math.cos(mid) * h, dy = Math.sin(mid) * h, rc = (G.R1 + G.R2) / 2;
      const px = G.CX + Math.cos(mid) * rc + dx - 18, py = G.CY + Math.sin(mid) * rc + dy - 22;
      x.save(); sectorPath(x, i, G.R1 - 6, G.R2 + 6, dx, dy); x.clip();
      const g = x.createRadialGradient(px, py, 0, px + 18, py + 22, 175);
      g.addColorStop(0, `rgba(255,244,222,${.2 * (1 - m)})`); g.addColorStop(.45, 'rgba(255,244,222,0)'); g.addColorStop(1, `rgba(0,0,0,${.34 * (1 - m)})`);
      x.fillStyle = g; x.fillRect(0, 0, 1000, 1000); x.restore();
    }
    // centre
    if (this.centre) {
      const cp = clamp((now - this.centreT0) / this.dur(560)), hk = lit('centre') && m < .05 ? 1.05 : 1;
      if (this.prevCentre && cp < 1) { x.globalAlpha = (1 - cp) * (1 - m); drawCentre(x, this.prevCentre, G.CX, G.CY, 1.3); }
      x.globalAlpha = cp * (1 - m);
      if (x.globalAlpha > 0) {
        const drop = this.reduced ? 1 : 1 + .4 * (1 - easeOut(cp));   // falls onto the rice
        if (!this.reduced && cp < 1) { const g = x.createRadialGradient(G.CX + 8, G.CY + 12, 10, G.CX + 8, G.CY + 12, 110 * drop); g.addColorStop(0, `rgba(0,0,0,${.35 * cp})`); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.beginPath(); x.arc(G.CX + 8, G.CY + 12, 110 * drop, 0, 7); x.fill(); }
        drawCentre(x, this.centre, G.CX, G.CY, 1.3 * hk * drop);
      }
      x.globalAlpha = 1;
      if (m > 0 && this.smear && ['egg', 'eggx', 'yolk', 'jammy'].includes(this.centre.t)) {
        x.lineCap = 'round'; for (const sm of this.smear) { x.strokeStyle = `rgba(242,160,24,${.6 * m})`; x.lineWidth = sm.w; x.beginPath(); x.moveTo(G.CX, G.CY); x.quadraticCurveTo(G.CX + Math.cos(sm.a + .5) * sm.r * .5 + sm.b * .3, G.CY + Math.sin(sm.a + .5) * sm.r * .5, G.CX + Math.cos(sm.a) * sm.r * m, G.CY + Math.sin(sm.a) * sm.r * m); x.stroke(); }
      }
    }
    // garnish
    let gdead = false;
    for (const p of this.garnish) {
      const sp = clamp((now - p.t0) / this.dur(380)); if (sp <= 0) continue;
      let al = sp, sc = this.reduced ? 1 : .5 + .5 * easeBack(sp);
      if (p.td) { const d = clamp((now - p.td) / this.dur(240)); if (d >= 1) { p.dead = gdead = true; continue; } al *= 1 - d; }
      let px = lerp(p.x, p.mx, m), py = lerp(p.y, p.my, m), pr = lerp(p.rot, p.mrot, m);
      if (swirl) { const dx = px - G.CX, dy = py - G.CY, cs = Math.cos(swirl), sn = Math.sin(swirl); px = G.CX + dx * cs - dy * sn; py = G.CY + dx * sn + dy * cs; }
      const qx = G.CX + (px - G.CX) * c - (py - G.CY) * s, qy = G.CY + (px - G.CX) * s + (py - G.CY) * c, a = pr + φ, k = K * sc;
      x.globalAlpha = al; x.setTransform(k * Math.cos(a), k * Math.sin(a), -k * Math.sin(a), k * Math.cos(a), K * qx, K * qy);
      x.drawImage(p.s.c, -p.s.w / 2, -p.s.h / 2, p.s.w, p.s.h);
    }
    x.globalAlpha = 1; if (gdead) this.garnish = this.garnish.filter(p => !p.dead);
    // the wall shades the food at its edge; light from the top left
    x.setTransform(K, 0, 0, K, 0, 0);
    x.save(); x.beginPath(); x.arc(G.CX, G.CY, G.RF, 0, 7); x.clip();
    let g = x.createRadialGradient(G.CX, G.CY, G.RF - 46, G.CX, G.CY, G.RF); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)'); x.fillStyle = g; x.fillRect(0, 0, 1000, 1000);
    g = x.createRadialGradient(G.CX + 34, G.CY + 40, G.RF - 30, G.CX + 34, G.CY + 40, G.RF + 50); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.5)'); x.fillStyle = g; x.fillRect(0, 0, 1000, 1000);
    g = x.createRadialGradient(G.CX - 120, G.CY - 140, 10, G.CX - 120, G.CY - 140, 330); g.addColorStop(0, 'rgba(255,246,226,.12)'); g.addColorStop(1, 'rgba(255,246,226,0)'); x.fillStyle = g; x.fillRect(0, 0, 1000, 1000);
    x.restore();
    // outline for the selected or hovered part
    if (m < .05) {
      for (const slot of new Set([this.active, this.hover, this.external])) {
        if (!slot) continue; const strong = slot === this.active;
        x.save(); x.strokeStyle = strong ? ACCENT : 'rgba(255,248,236,.6)'; x.lineWidth = strong ? 3.5 : 2; x.shadowColor = strong ? ACCENT : 'transparent'; x.shadowBlur = strong ? 16 * K : 0;
        if (WEDGE_KEYS.includes(slot)) { const i = WEDGE_KEYS.indexOf(slot), h = this.hov[i] * 10, mid = wedgeMid(i); x.translate(G.CX, G.CY); x.rotate(φ); x.translate(-G.CX, -G.CY); sectorPath(x, i, G.R1 - 3, G.R2 + 3, Math.cos(mid) * h, Math.sin(mid) * h); x.lineJoin = 'round'; x.stroke(); }
        else if (slot === 'centre') { x.beginPath(); x.arc(G.CX, G.CY, G.RC - 2, 0, 7); x.stroke(); }
        else if (slot === 'base') { x.setLineDash([2, 9]); x.lineCap = 'round'; x.beginPath(); x.arc(G.CX, G.CY, G.RF - 8, 0, 7); x.stroke(); }
        x.restore();
      }
    }
  }
}
