// Canvas renderer for the stone bowl. Everything is drawn in a 1000 × 1000 logical space.
import { PHOTOS } from './data.js';

const S = 1.6;                       // sprite resolution: device px per logical unit
const G = { CX: 470, CY: 470, RO: 440, RW: 404, RF: 372, R1: 130, R2: 352, RC: 118, SX: 880, SY: 884, SR: 96 };
const WEDGES = 6, GAP = 0.045;
const ACCENT = '#ff7a5c';
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
function sprites(o, t, n = 8) {
  const key = `${o.id || o.c}|${t}|${o.c}`;
  if (spriteCache.has(key)) return spriteCache.get(key);
  const R = rng(hash(key)), make = SPR[t] || SPR.chunk, list = [];
  for (let i = 0; i < n; i++) list.push(make(o, R));
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
  const { CX, CY, RO, RW, RF, SX, SY, SR } = G, R = rng(42);
  const body = (cx, cy, ro, rw, rf, shadowK) => {
    const sh = x.createRadialGradient(cx + 16 * shadowK, cy + 22 * shadowK, ro * .8, cx + 16 * shadowK, cy + 22 * shadowK, ro * 1.14);
    sh.addColorStop(0, 'rgba(0,0,0,.6)'); sh.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = sh; x.beginPath(); x.arc(cx + 16 * shadowK, cy + 22 * shadowK, ro * 1.14, 0, 7); x.fill();
    const g = x.createRadialGradient(cx - ro * .3, cy - ro * .35, ro * .1, cx, cy, ro); g.addColorStop(0, '#5a5f5e'); g.addColorStop(.55, '#2d3131'); g.addColorStop(1, '#121414');
    x.fillStyle = g; x.beginPath(); x.arc(cx, cy, ro, 0, 7); x.fill();
    x.save(); x.beginPath(); x.arc(cx, cy, ro, 0, 7); x.clip();
    const n = Math.round(ro * ro * .05); for (let i = 0; i < n; i++) { const a = R() * 7, r = Math.sqrt(R()) * ro; x.fillStyle = R() < .5 ? `rgba(255,255,255,${.04 + R() * .08})` : `rgba(0,0,0,${.08 + R() * .12})`; x.beginPath(); x.arc(cx + r * Math.cos(a), cy + r * Math.sin(a), .5 + R() * 1.2, 0, 7); x.fill(); }
    x.restore();
    const w = x.createLinearGradient(cx - rw, cy - rw, cx + rw, cy + rw); w.addColorStop(0, '#0b0d0d'); w.addColorStop(.5, '#1a1d1d'); w.addColorStop(1, '#3a3f3f');
    x.fillStyle = w; x.beginPath(); x.arc(cx, cy, rw, 0, 7); x.fill();
    x.strokeStyle = 'rgba(0,0,0,.65)'; x.lineWidth = 2.5; x.beginPath(); x.arc(cx, cy, rw, 0, 7); x.stroke();
    x.strokeStyle = 'rgba(255,255,255,.2)'; x.lineWidth = 3; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, ro - 7, Math.PI * 1.1, Math.PI * 1.55); x.stroke();
    x.strokeStyle = 'rgba(255,255,255,.08)'; x.lineWidth = 2; x.beginPath(); x.arc(cx, cy, rw + 6, Math.PI * .1, Math.PI * .5); x.stroke();
    if (rf) { x.fillStyle = '#0d0f0f'; x.beginPath(); x.arc(cx, cy, rf, 0, 7); x.fill(); }
  };
  // chopsticks resting on the table
  for (const [x0, y0, x1, y1] of [[934, 70, 962, 700], [962, 64, 986, 694]]) {
    const ang = Math.atan2(y1 - y0, x1 - x0), len = Math.hypot(x1 - x0, y1 - y0);
    x.save(); x.translate(x0, y0); x.rotate(ang);
    x.fillStyle = 'rgba(0,0,0,.45)'; x.beginPath(); x.moveTo(6, 10); x.lineTo(len + 6, 8.2); x.lineTo(len + 6, 13.4); x.lineTo(6, 19); x.closePath(); x.fill();
    const wg = x.createLinearGradient(0, -5, 0, 5); wg.addColorStop(0, '#c9965c'); wg.addColorStop(.5, '#a8743e'); wg.addColorStop(1, '#6e4520');
    x.fillStyle = wg; x.beginPath(); x.moveTo(0, -5); x.lineTo(len, -1.6); x.lineTo(len, 1.6); x.lineTo(0, 5); x.closePath(); x.fill();
    x.strokeStyle = 'rgba(255,240,210,.35)'; x.lineWidth = 1; x.beginPath(); x.moveTo(4, -2.6); x.lineTo(len - 4, -.8); x.stroke();
    x.fillStyle = '#3a2412'; x.fillRect(0, -5, 60, 10);
    x.restore();
  }
  body(SX, SY, SR, SR - 13, 0, .45);
  body(CX, CY, RO, RW, RF, 1);
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

/* ---------- thumbnails ---------- */
const thumbCache = new Map();
export function thumb(kind, o) {
  const key = kind + '|' + (o.id || o.n) + '|' + o.c;
  if (thumbCache.has(key)) return thumbCache.get(key);
  const c = document.createElement('canvas'), px = 120; c.width = c.height = px; const x = c.getContext('2d'); const k = px / 100; x.setTransform(k, 0, 0, k, 0, 0);
  x.save(); x.beginPath(); x.arc(50, 50, 50, 0, 7); x.clip();
  const ph = photo(o);
  if (ph) { x.drawImage(ph.img, 0, 0, 100, 100); }
  else if (kind === 'base') { const r = rice(o); x.drawImage(r.c, r.c.width / 2 - 60 * S, r.c.height / 2 - 60 * S, 120 * S, 120 * S, -10, -10, 120, 120); }
  else if (kind === 'sauce') { x.fillStyle = '#1b1e1e'; x.fillRect(0, 0, 100, 100); drawSauce(x, o, 50, 50, 46); }
  else if (kind === 'centre') { x.fillStyle = '#ece5d4'; x.fillRect(0, 0, 100, 100); drawCentre(x, o, 50, 50, .74); }
  else if (kind === 'garnish') {
    x.fillStyle = '#ece5d4'; x.fillRect(0, 0, 100, 100); const R = rng(hash(key)), m = o.mix || [['flake', o.c]];
    for (let i = 0; i < 40; i++) { const [t, col] = m[i % m.length], sp = sprites({ id: o.id + t + col, c: col }, t, 4)[i % 4]; x.save(); x.translate(R() * 100, R() * 100); x.rotate(R() * 7); x.scale(1.8, 1.8); x.drawImage(sp.c, -sp.w / 2, -sp.h / 2, sp.w, sp.h); x.restore(); }
  } else {
    x.fillStyle = shade(o.c, -.3); x.fillRect(0, 0, 100, 100); const R = rng(hash(key)), list = sprites(o, o.t);
    const n = o.t === 'mash' ? 8 : o.t === 'dot' ? 48 : 30;
    for (let i = 0; i < n; i++) { const sp = list[i % list.length]; x.save(); x.translate(R() * 110 - 5, R() * 110 - 5); x.rotate(R() * 7); x.drawImage(sp.c, -sp.w / 2, -sp.h / 2, sp.w, sp.h); x.restore(); }
  }
  const v = x.createRadialGradient(50, 50, 30, 50, 50, 52); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.28)'); x.fillStyle = v; x.fillRect(0, 0, 100, 100);
  x.restore();
  const url = c.toDataURL('image/png'); thumbCache.set(key, url); return url;
}

/* ---------- the live bowl ---------- */
function sectorPath(x, i, r1 = G.R1, r2 = G.R2, dx = 0, dy = 0) {
  const step = Math.PI * 2 / WEDGES, mid = -Math.PI / 2 + i * step, a0 = mid - step / 2 + GAP, a1 = mid + step / 2 - GAP, cx = G.CX + dx, cy = G.CY + dy;
  x.beginPath(); x.arc(cx, cy, r2, a0, a1); x.arc(cx, cy, r1, a1, a0, true); x.closePath();
  return { a0, a1, mid };
}
const wedgeMid = i => -Math.PI / 2 + i * Math.PI * 2 / WEDGES;

export class Bowl {
  constructor(canvas, { onHover, onClick } = {}) {
    this.cv = canvas; this.ctx = canvas.getContext('2d');
    this.onHover = onHover || (() => {}); this.onClick = onClick || (() => {});
    this.pieces = []; this.garnish = []; this.ids = {}; this.opts = {};
    this.mix = 0; this.mixFrom = 0; this.mixTo = 0; this.mixT0 = 0;
    this.rot = 0; this.rotFrom = 0; this.rotT0 = 0; this.rotDur = 0;
    this.hov = new Array(WEDGES).fill(0); this.hover = null; this.active = null;
    this.rice = null; this.prevRice = null; this.riceT0 = 0;
    this.centre = null; this.prevCentre = null; this.centreT0 = 0;
    this.sauce = null; this.prevSauce = null; this.sauceT0 = 0;
    this.smear = null; this.animUntil = 0; this.raf = 0; this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    new ResizeObserver(() => this.resize()).observe(canvas);
    canvas.addEventListener('pointermove', e => this.pointer(e));
    canvas.addEventListener('pointerleave', () => this.setHover(null));
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

  /* state in */
  update(state, { shuffle = false } = {}) {
    const now = this.now(), photoReload = () => this.refreshPhotos();
    let latest = 0;
    if (shuffle && !this.reduced) { this.rotFrom = -.6; this.rot = -.6; this.rotT0 = now; this.rotDur = 1100; }
    // base
    if (state.base.id !== this.ids.base) { this.prevRice = this.rice; this.rice = rice(state.base); this.riceT0 = now; this.ids.base = state.base.id; latest = Math.max(latest, 500); }
    // wedges
    state.wedges.forEach((o, i) => {
      if (o.id === this.ids['w' + i] && o.c === this.opts['w' + i]?.c) return;
      const first = !this.ids['w' + i];
      for (const p of this.pieces) if (p.slot === i && !p.td) p.td = now + Math.random() * 140;
      this.ids['w' + i] = o.id; this.opts['w' + i] = o; photo(o, photoReload);
      this.spawn(i, o, now + (shuffle || first ? 120 + i * 90 : 120));
      latest = Math.max(latest, 1200 + i * 90);
    });
    // centre
    if (state.centre.id !== this.ids.centre) { this.prevCentre = this.centre; this.centre = state.centre; this.centreT0 = now + (shuffle ? 500 : 0); this.ids.centre = state.centre.id; this.makeSmear(); latest = Math.max(latest, 1100); }
    if (state.sauce.id !== this.ids.sauce) { this.prevSauce = this.sauce; this.sauce = state.sauce; this.sauceT0 = now; this.ids.sauce = state.sauce.id; latest = Math.max(latest, 600); }
    if (state.garnish.id !== this.ids.garnish) {
      for (const p of this.garnish) if (!p.td) p.td = now + Math.random() * 100;
      this.ids.garnish = state.garnish.id; this.spawnGarnish(state.garnish, now + (shuffle ? 900 : 150)); latest = Math.max(latest, 1500);
    }
    this.kick(this.dur(latest + 200));
  }
  spawn(i, o, t0) {
    const ph = photo(o), list = ph ? photoCrops(o, ph) : sprites(o, o.t), n = ph ? COUNTS.photo : (COUNTS[o.t] || 150);
    const { a0, a1 } = { a0: wedgeMid(i) - Math.PI / WEDGES + GAP, a1: wedgeMid(i) + Math.PI / WEDGES - GAP };
    const R = Math.random, aligned = ['strip', 'meat', 'shred', 'sprout'].includes(o.t);
    for (let k = 0; k < n; k++) {
      const r = Math.sqrt(R() * (G.R2 ** 2 - G.R1 ** 2) + G.R1 ** 2), th = a0 - .03 + R() * (a1 - a0 + .06);
      const mr = Math.sqrt(R()) * 345, ma = R() * Math.PI * 2;
      const rot = aligned ? th + Math.PI / 2 + (R() - .5) * 1.6 : R() * Math.PI * 2;
      this.pieces.push({ slot: i, s: list[k % list.length], x: G.CX + r * Math.cos(th), y: G.CY + r * Math.sin(th), rot, mx: G.CX + mr * Math.cos(ma), my: G.CY + mr * Math.sin(ma), mrot: rot + (R() - .5) * 3, z: R(), t0: t0 + (this.reduced ? 0 : R() * 320), td: 0, photo: !!ph });
    }
    this.pieces.sort((a, b) => (a.slot - b.slot) || (a.t0 > b.t0 ? 1 : -1));
  }
  spawnGarnish(o, t0) {
    const m = o.mix || [['flake', o.c]], R = Math.random;
    for (let k = 0; k < 90; k++) {
      const [t, col] = m[k % m.length], list = sprites({ id: o.id + t + col, c: col }, t, 6);
      const r = 30 + Math.sqrt(R()) * 318, a = R() * Math.PI * 2, mr = Math.sqrt(R()) * 345, ma = R() * 7;
      this.garnish.push({ s: list[k % list.length], x: G.CX + r * Math.cos(a), y: G.CY + r * Math.sin(a), rot: R() * 7, mx: G.CX + mr * Math.cos(ma), my: G.CY + mr * Math.sin(ma), mrot: R() * 7, t0: t0 + (this.reduced ? 0 : R() * 600), td: 0 });
    }
  }
  refreshPhotos() { for (let i = 0; i < WEDGES; i++) { const o = this.opts['w' + i]; if (o && PHOTOS.has(o.id)) { this.pieces = this.pieces.filter(p => p.slot !== i); this.spawn(i, o, this.now()); } } this.kick(400); }
  makeSmear() { const R = rng(hash(this.centre.id)); this.smear = Array.from({ length: 7 }, () => ({ a: R() * 7, r: 110 + R() * 160, b: (R() - .5) * 120, w: 8 + R() * 10 })); }
  setMix(on) { this.mixFrom = this.mix; this.mixTo = on ? 1 : 0; this.mixT0 = this.now(); this.kick(this.dur(1300)); }
  setActive(slot) { this.active = slot; this.kick(400); }
  setHover(slot) { if (slot === this.hover) return; this.hover = slot; this.cv.style.cursor = slot ? 'pointer' : ''; this.kick(400); }

  /* geometry for the UI */
  toLogical(e) { const b = this.cv.getBoundingClientRect(); return [(e.clientX - b.left) / b.width * 1000, (e.clientY - b.top) / b.height * 1000]; }
  pick(e) {
    const [lx, ly] = this.toLogical(e);
    if (Math.hypot(lx - G.SX, ly - G.SY) < G.SR) return 'sauce';
    const c = Math.cos(-this.rot), s = Math.sin(-this.rot), dx0 = lx - G.CX, dy0 = ly - G.CY, dx = dx0 * c - dy0 * s, dy = dx0 * s + dy0 * c, r = Math.hypot(dx, dy);
    if (r > G.RW) return null;
    if (this.mix > .5) return 'mixed';
    if (r < G.RC) return 'centre';
    if (r < G.R2 + 6 && r > G.R1 - 6) { let a = Math.atan2(dy, dx) + Math.PI / 2; a = (a % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2); return WEDGE_KEYS[Math.round(a / (Math.PI * 2 / WEDGES)) % WEDGES]; }
    return 'base';
  }
  pointer(e) { if (e.pointerType === 'touch') return; const s = this.pick(e); this.setHover(s); this.onHover(s, e); }
  anchor(slot) { // logical point -> fraction of canvas
    let x = G.CX, y = G.CY;
    if (slot === 'sauce') { x = G.SX; y = G.SY - G.SR; }
    else if (slot === 'base') { x = G.CX; y = G.CY + G.RF * .9; }
    else if (WEDGE_KEYS.includes(slot)) { const a = wedgeMid(WEDGE_KEYS.indexOf(slot)) + this.rot; x = G.CX + Math.cos(a) * (G.R2 - 10); y = G.CY + Math.sin(a) * (G.R2 - 10); }
    return { fx: x / 1000, fy: y / 1000 };
  }

  /* drawing */
  frame(t) {
    this.raf = 0; const now = this.now();
    let busy = now < this.animUntil;
    // tweens
    if (this.mix !== this.mixTo) { const p = clamp((now - this.mixT0) / this.dur(1200)); this.mix = lerp(this.mixFrom, this.mixTo, easeIO(p)); if (p >= 1) this.mix = this.mixTo; busy = true; }
    if (this.rotDur) { const p = clamp((now - this.rotT0) / this.rotDur); this.rot = lerp(this.rotFrom, 0, easeOut(p)); if (p >= 1) { this.rot = 0; this.rotDur = 0; } busy = true; }
    for (let i = 0; i < WEDGES; i++) { const target = (this.hover === WEDGE_KEYS[i] || this.active === WEDGE_KEYS[i]) && this.mix < .05 ? 1 : 0; const d = target - this.hov[i]; if (Math.abs(d) > .002) { this.hov[i] += d * .22; busy = true; } else this.hov[i] = target; }
    this.draw(now);
    if (busy) this.raf = requestAnimationFrame(tt => this.frame(tt));
  }
  draw(now) {
    const x = this.ctx, K = this.K, m = this.mix, mm = m, φ = this.rot;
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, this.cv.width, this.cv.height);
    x.setTransform(K, 0, 0, K, 0, 0);
    x.drawImage(stone(), 0, 0, 1000, 1000);
    // sauce in its dish
    const sr = (G.SR - 21) * (1 - .45 * m);
    if (this.prevSauce && now - this.sauceT0 < 450) drawSauce(x, this.prevSauce, G.SX, G.SY, sr);
    if (this.sauce) { x.globalAlpha = clamp((now - this.sauceT0) / this.dur(450)); drawSauce(x, this.sauce, G.SX, G.SY, sr); x.globalAlpha = 1; }
    if (this.hover === 'sauce' || this.active === 'sauce') { x.strokeStyle = ACCENT; x.lineWidth = 4; x.beginPath(); x.arc(G.SX, G.SY, G.SR + 4, 0, 7); x.stroke(); }

    // food layer, rotated about the bowl centre
    const c = Math.cos(φ), s = Math.sin(φ), ex = G.CX - G.CX * c + G.CY * s, ey = G.CY - G.CX * s - G.CY * c;
    const base = () => x.setTransform(K * c, K * s, -K * s, K * c, K * ex, K * ey);
    base();
    x.save(); x.beginPath(); x.arc(G.CX, G.CY, G.RF, 0, 7); x.clip();
    const rp = clamp((now - this.riceT0) / this.dur(500));
    if (this.prevRice && rp < 1) x.drawImage(this.prevRice.c, G.CX - this.prevRice.w / 2, G.CY - this.prevRice.h / 2, this.prevRice.w, this.prevRice.h);
    if (this.rice) { x.globalAlpha = rp; x.drawImage(this.rice.c, G.CX - this.rice.w / 2, G.CY - this.rice.h / 2, this.rice.w, this.rice.h); x.globalAlpha = 1; }
    if (this.hover === 'base' && m < .05) { x.fillStyle = 'rgba(255,255,255,.08)'; x.fillRect(0, 0, 1000, 1000); }
    // sauce stirred through
    if (m > 0 && this.sauce) { const R = rng(hash(this.sauce.id)); for (let i = 0; i < 9; i++) { const a = R() * 7, r = R() * 260, px = G.CX + r * Math.cos(a), py = G.CY + r * Math.sin(a), rad = 70 + R() * 90, g = x.createRadialGradient(px, py, 0, px, py, rad); g.addColorStop(0, shade(this.sauce.c, 0, .55 * m)); g.addColorStop(1, shade(this.sauce.c, 0, 0)); x.fillStyle = g; x.beginPath(); x.arc(px, py, rad, 0, 7); x.fill(); } }
    // wedge beds
    if (m < 1) for (let i = 0; i < WEDGES; i++) {
      const o = this.opts['w' + i]; if (!o) continue;
      const h = this.hov[i] * 9, mid = wedgeMid(i), dx = Math.cos(mid) * h, dy = Math.sin(mid) * h;
      const born = this.pieces.find(p => p.slot === i && !p.td); const vis = born ? clamp((now - born.t0 + 300) / 500) : 0;
      x.globalAlpha = (1 - m) * vis; sectorPath(x, i, G.R1 + 4, G.R2 - 4, dx, dy);
      x.save(); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 10 * K; x.shadowOffsetY = 3 * K;
      x.fillStyle = shade(o.c, -.3); x.lineJoin = 'round'; x.lineWidth = 8; x.strokeStyle = shade(o.c, -.3); x.fill(); x.stroke(); x.restore();
      const ph = photo(o); if (ph) { x.save(); sectorPath(x, i, G.R1, G.R2, dx, dy); x.clip(); x.drawImage(ph.img, G.CX - G.R2 + dx, G.CY - G.R2 + dy, G.R2 * 2, G.R2 * 2); x.restore(); }
      x.globalAlpha = 1;
    }
    x.restore();
    // pieces
    const swirl = Math.sin(mm * Math.PI) * .85, order = m > .5 ? [...this.pieces].sort((a, b) => a.z - b.z) : this.pieces;
    let dead = false;
    for (const p of order) {
      let sp = clamp((now - p.t0) / this.dur(420)); if (sp <= 0) continue;
      let sc = this.reduced ? 1 : easeBack(sp), al = clamp(sp * 2.2);
      if (p.td) { const d = clamp((now - p.td) / this.dur(260)); if (d >= 1) { p.dead = dead = true; continue; } sc *= 1 - d * .5; al *= 1 - d; }
      if (p.photo) al *= mm;
      if (al <= 0) continue;
      const h = this.hov[p.slot] * 9 * (1 - mm), mid = wedgeMid(p.slot);
      let px = lerp(p.x + Math.cos(mid) * h, p.mx, mm), py = lerp(p.y + Math.sin(mid) * h, p.my, mm), pr = lerp(p.rot, p.mrot, mm);
      if (swirl) { const dx = px - G.CX, dy = py - G.CY, cs = Math.cos(swirl), sn = Math.sin(swirl); px = G.CX + dx * cs - dy * sn; py = G.CY + dx * sn + dy * cs; pr += swirl; }
      const qx = G.CX + (px - G.CX) * c - (py - G.CY) * s, qy = G.CY + (px - G.CX) * s + (py - G.CY) * c, a = pr + φ, k = K * sc;
      x.globalAlpha = al; x.setTransform(k * Math.cos(a), k * Math.sin(a), -k * Math.sin(a), k * Math.cos(a), K * qx, K * qy);
      x.drawImage(p.s.c, -p.s.w / 2, -p.s.h / 2, p.s.w, p.s.h);
    }
    x.globalAlpha = 1; if (dead) this.pieces = this.pieces.filter(p => !p.dead);
    // centre
    base();
    if (this.centre) {
      const cp = clamp((now - this.centreT0) / this.dur(500)), hk = (this.hover === 'centre' || this.active === 'centre') && m < .05 ? 1.05 : 1;
      if (this.prevCentre && cp < 1) { x.globalAlpha = (1 - cp) * (1 - m); drawCentre(x, this.prevCentre, G.CX, G.CY, 1.35); }
      x.globalAlpha = cp * (1 - m); if (x.globalAlpha > 0) drawCentre(x, this.centre, G.CX, G.CY, (this.reduced ? 1 : .85 + .15 * easeBack(cp)) * hk * 1.35);
      x.globalAlpha = 1;
      if (m > 0 && this.smear && ['egg', 'eggx', 'yolk', 'jammy'].includes(this.centre.t)) {
        x.lineCap = 'round'; for (const sm of this.smear) { x.strokeStyle = `rgba(242,160,24,${.6 * m})`; x.lineWidth = sm.w; x.beginPath(); x.moveTo(G.CX, G.CY); x.quadraticCurveTo(G.CX + Math.cos(sm.a + .5) * sm.r * .5 + sm.b * .3, G.CY + Math.sin(sm.a + .5) * sm.r * .5, G.CX + Math.cos(sm.a) * sm.r * m, G.CY + Math.sin(sm.a) * sm.r * m); x.stroke(); }
      }
    }
    // garnish
    let gdead = false;
    for (const p of this.garnish) {
      const sp = clamp((now - p.t0) / this.dur(360)); if (sp <= 0) continue;
      let al = sp, sc = this.reduced ? 1 : .6 + .4 * easeOut(sp);
      if (p.td) { const d = clamp((now - p.td) / this.dur(240)); if (d >= 1) { p.dead = gdead = true; continue; } al *= 1 - d; }
      let px = lerp(p.x, p.mx, mm), py = lerp(p.y, p.my, mm), pr = lerp(p.rot, p.mrot, mm);
      if (swirl) { const dx = px - G.CX, dy = py - G.CY, cs = Math.cos(swirl), sn = Math.sin(swirl); px = G.CX + dx * cs - dy * sn; py = G.CY + dx * sn + dy * cs; }
      const qx = G.CX + (px - G.CX) * c - (py - G.CY) * s, qy = G.CY + (px - G.CX) * s + (py - G.CY) * c, a = pr + φ, k = K * sc;
      x.globalAlpha = al; x.setTransform(k * Math.cos(a), k * Math.sin(a), -k * Math.sin(a), k * Math.cos(a), K * qx, K * qy);
      x.drawImage(p.s.c, -p.s.w / 2, -p.s.h / 2, p.s.w, p.s.h);
    }
    x.globalAlpha = 1; if (gdead) this.garnish = this.garnish.filter(p => !p.dead);
    // depth: the bowl wall shades the food at its edge, light from top left
    x.setTransform(K, 0, 0, K, 0, 0);
    x.save(); x.beginPath(); x.arc(G.CX, G.CY, G.RF, 0, 7); x.clip();
    let g = x.createRadialGradient(G.CX, G.CY, G.RF - 50, G.CX, G.CY, G.RF); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.5)'); x.fillStyle = g; x.fillRect(0, 0, 1000, 1000);
    g = x.createRadialGradient(G.CX + 34, G.CY + 40, G.RF - 30, G.CX + 34, G.CY + 40, G.RF + 50); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.45)'); x.fillStyle = g; x.fillRect(0, 0, 1000, 1000);
    g = x.createRadialGradient(G.CX - 120, G.CY - 140, 10, G.CX - 120, G.CY - 140, 320); g.addColorStop(0, 'rgba(255,248,230,.10)'); g.addColorStop(1, 'rgba(255,248,230,0)'); x.fillStyle = g; x.fillRect(0, 0, 1000, 1000);
    x.restore();
    // selection outline
    if (m < .05) {
      const sel = this.active, hv = this.hover;
      for (const slot of new Set([sel, hv])) {
        if (!slot) continue; const strong = slot === sel;
        x.save(); x.strokeStyle = strong ? ACCENT : 'rgba(255,255,255,.55)'; x.lineWidth = strong ? 4 : 2.5; x.shadowColor = strong ? ACCENT : 'transparent'; x.shadowBlur = strong ? 14 * K : 0;
        if (WEDGE_KEYS.includes(slot)) { const i = WEDGE_KEYS.indexOf(slot), h = this.hov[i] * 9, mid = wedgeMid(i) + φ; x.translate(G.CX, G.CY); x.rotate(φ); x.translate(-G.CX, -G.CY); sectorPath(x, i, G.R1 - 2, G.R2 + 2, Math.cos(mid - φ) * h, Math.sin(mid - φ) * h); x.lineJoin = 'round'; x.stroke(); }
        else if (slot === 'centre') { x.beginPath(); x.arc(G.CX, G.CY, G.RC - 4, 0, 7); x.stroke(); }
        else if (slot === 'base' && strong) { x.setLineDash([10, 10]); x.beginPath(); x.arc(G.CX, G.CY, G.RF - 6, 0, 7); x.stroke(); }
        x.restore();
      }
    }
  }
}
