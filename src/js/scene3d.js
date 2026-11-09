/**
 * Cenas 3D (Three.js): modelo estrutural do hero e a obra guiada pela rolagem (#processo).
 * Carregado via import() dinâmico por main.js — fica num chunk separado e não bloqueia a página.
 */
import * as THREE from 'three';

const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const C = { pet: 0x253438, pet2: 0x3B4F54, gra: 0x1B2326, green: 0x22A563, cl: 0xE5EAEA, steel: 0x6E8489, line: 0x9FB0B2, skin: 0xC69C7E, pants: 0x2A3B40 };
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (v, a, b) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: .5, metalness: .2, ...o });
function mesh(geo, m) { const x = new THREE.Mesh(geo, m); x.castShadow = true; x.receiveShadow = true; return x; }
function bar(a, b, t, m) {
  const dir = new THREE.Vector3().subVectors(b, a), len = dir.length();
  const x = mesh(new THREE.CylinderGeometry(t / 2, t / 2, len, 8), m);
  x.position.copy(a).addScaledVector(dir, .5); x.quaternion.setFromUnitVectors(V(0, 1, 0), dir.normalize()); return x;
}
function person(shirt = 0xE9EDED) {
  const g = new THREE.Group();
  const pm = std(C.pants, { roughness: .8 }), sm = std(shirt, { roughness: .7 }), km = std(C.skin, { roughness: .8 }), hm = std(0xffffff, { roughness: .35 });
  const add = (geo, m, x, y, z = 0) => { const o = mesh(geo, m); o.position.set(x, y, z); g.add(o); return o; };
  add(new THREE.BoxGeometry(.12, .5, .14), pm, -.075, .25); add(new THREE.BoxGeometry(.12, .5, .14), pm, .075, .25);
  const t = add(new THREE.CapsuleGeometry(.17, .22, 4, 12), sm, 0, .74); t.scale.z = .66;
  add(new THREE.CapsuleGeometry(.05, .3, 4, 8), sm, -.235, .7); add(new THREE.CapsuleGeometry(.05, .3, 4, 8), sm, .235, .7);
  add(new THREE.SphereGeometry(.11, 20, 16), km, 0, 1.07);
  add(new THREE.SphereGeometry(.128, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), hm, 0, 1.1);
  add(new THREE.CylinderGeometry(.16, .16, .02, 24), hm, 0, 1.1, .02);
  return g;
}

// ---------------------------------------------------------------- modelo estrutural (estilo BIM)
const GRID_X = [-3, -1, 1, 3], GRID_Z = [-1.5, 0, 1.5], FLOORS = 5, FH = 1.15;
function buildingModel({ edgeColor = C.line } = {}) {
  const root = new THREE.Group();
  const floors = [], edgesMats = [], solidMats = [];
  const edgeMat = new THREE.LineBasicMaterial({ color: edgeColor, transparent: true, opacity: .55 });
  edgesMats.push(edgeMat);
  const W = GRID_X[3] - GRID_X[0], D = GRID_Z[2] - GRID_Z[0];
  for (let f = 0; f < FLOORS; f++) {
    const fg = new THREE.Group(); root.add(fg);
    const m = std(0xD9E1E1, { roughness: .75, metalness: .05, transparent: true, opacity: 1 });
    solidMats.push(m);
    const add = (geo, x, y, z) => {
      const o = mesh(geo, m); o.position.set(x, y, z); fg.add(o);
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat); e.position.copy(o.position); fg.add(e);
    };
    const y0 = f * FH;
    GRID_X.forEach(x => GRID_Z.forEach(z => add(new THREE.BoxGeometry(.16, FH, .16), x, y0 + FH / 2, z)));
    add(new THREE.BoxGeometry(W + .4, .1, D + .4), 0, y0 + FH, 0);
    floors.push({ group: fg, mat: m });
  }
  const base = mesh(new THREE.BoxGeometry(W + .9, .12, D + .9), std(0x3B4F54, { roughness: .9 })); base.position.y = -.06; root.add(base);

  // contraventamento verde na fachada (o x da marca)
  const brace = new THREE.MeshStandardMaterial({ color: C.green, emissive: C.green, emissiveIntensity: .35, roughness: .35, metalness: .3, transparent: true, opacity: 1 });
  const braces = new THREE.Group(); root.add(braces);
  const zf = GRID_Z[2] + .02;
  for (let f = 0; f < FLOORS; f++) {
    const y0 = f * FH, y1 = (f + 1) * FH;
    braces.add(bar(V(-1, y0, zf), V(1, y1, zf), .07, brace));
    braces.add(bar(V(1, y0, zf), V(-1, y1, zf), .07, brace));
  }
  // vidro e luzes
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x7FA2A9, metalness: .7, roughness: .08, transparent: true, opacity: 0 });
  const lightMat = new THREE.MeshStandardMaterial({ color: 0xFFE6B8, emissive: 0xFFD08A, emissiveIntensity: 0, transparent: true, opacity: 0 });
  const glass = new THREE.Group(); root.add(glass);
  for (let f = 0; f < FLOORS; f++) {
    const y = f * FH + FH / 2 + .05;
    [[-2, GRID_Z[2] + .1, 0], [2, GRID_Z[2] + .1, 0], [-2, GRID_Z[0] - .1, Math.PI], [0, GRID_Z[0] - .1, Math.PI], [2, GRID_Z[0] - .1, Math.PI]].forEach(([x, z, r]) => {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(1.8, FH - .16), glassMat); p.position.set(x, y, z); p.rotation.y = r; glass.add(p);
      if ((f + Math.round(x)) % 2 === 0) { const l = new THREE.Mesh(new THREE.PlaneGeometry(1.5, FH - .4), lightMat); l.position.set(x, y, z - Math.sign(z) * .06); l.rotation.y = r; glass.add(l); }
    });
    [GRID_X[0] - .1, GRID_X[3] + .1].forEach(x => { const p = new THREE.Mesh(new THREE.PlaneGeometry(2.9, FH - .16), glassMat); p.position.set(x, y, 0); p.rotation.y = Math.PI / 2; glass.add(p); });
  }
  return { root, floors, edgeMat, brace, braces, glassMat, lightMat, W, D };
}

function dotGround(size, step, color, opacity) {
  const pts = [];
  for (let x = -size; x <= size; x += step) for (let z = -size; z <= size; z += step) { const d = Math.hypot(x, z); if (d < size) pts.push(x, 0, z); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ color, size: .045, transparent: true, opacity, sizeAttenuation: true }));
}

function setup(canvas) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  r.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, 1, .1, 120);
  const resize = () => { const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  new ResizeObserver(resize).observe(canvas); resize();
  return { r, scene, cam };
}
function lights(scene, hemiTop, hemiBottom, sunI) {
  scene.add(new THREE.HemisphereLight(hemiTop, hemiBottom, 1.1));
  const d = new THREE.DirectionalLight(0xffffff, sunI); d.position.set(7, 12, 8); d.castShadow = true;
  d.shadow.mapSize.set(1024, 1024); Object.assign(d.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 50 }); d.shadow.bias = -.0005;
  scene.add(d);
}
function loop(canvas, tick) {
  let visible = true, raf = 0; const t0 = performance.now();
  const frame = now => { raf = 0; tick((now - t0) / 1000); if (visible && !REDUCE) raf = requestAnimationFrame(frame); };
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !raf) raf = requestAnimationFrame(frame); }).observe(canvas);
  raf = requestAnimationFrame(frame);
  return () => { if (!raf) raf = requestAnimationFrame(frame); };
}
const pointer = { x: 0, y: 0 };
addEventListener('pointermove', e => { pointer.x = e.clientX / innerWidth - .5; pointer.y = e.clientY / innerHeight - .5; }, { passive: true });

// ---------------------------------------------------------------- HERO: modelo em varredura
function hero() {
  const canvas = document.getElementById('c-hero'); if (!canvas) return;
  const { r, scene, cam } = setup(canvas);
  lights(scene, 0xCFE0E2, 0x1B2326, 1.6);
  const rim = new THREE.DirectionalLight(0x6FE0A3, .9); rim.position.set(-8, 5, -6); scene.add(rim);
  const world = new THREE.Group(); scene.add(world);
  const b = buildingModel(); world.add(b.root);
  b.floors.forEach(f => { f.mat.opacity = .14; f.mat.depthWrite = false; });
  b.edgeMat.opacity = .7;
  world.add(dotGround(9, .5, 0x6E8489, .55));
  // plano de varredura
  const scanMat = new THREE.MeshBasicMaterial({ color: C.green, transparent: true, opacity: .16, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
  const scan = new THREE.Mesh(new THREE.PlaneGeometry(b.W + 1.6, b.D + 1.6), scanMat); scan.rotation.x = -Math.PI / 2; world.add(scan);
  const ringGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(b.W + 1.6, b.D + 1.6));
  const ring = new THREE.LineSegments(ringGeo, new THREE.LineBasicMaterial({ color: C.green, transparent: true, opacity: .8 })); ring.rotation.x = -Math.PI / 2; world.add(ring);
  // nós
  const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const nodes = [];
  GRID_X.forEach(x => GRID_Z.forEach(z => { for (let f = 1; f <= FLOORS; f++) { const n = new THREE.Mesh(new THREE.SphereGeometry(.045, 8, 8), nodeMat.clone()); n.position.set(x, f * FH, z); world.add(n); nodes.push(n); } }));
  world.position.set(4.8, 0, 0);
  cam.position.set(15, 7.5, 19);
  const look = V(2.2, 2.9, 0), state = document.getElementById('hud-state');
  let lastPav = -1;
  loop(canvas, t => {
    const H = FLOORS * FH + .4;
    const y = REDUCE ? H * .6 : (Math.sin(t * .45) * .5 + .5) * H;
    scan.position.y = y; ring.position.y = y;
    nodes.forEach(n => { const d = Math.abs(n.position.y - y); n.material.color.setHex(d < .35 ? C.green : 0xffffff); n.scale.setScalar(d < .35 ? 1.8 : 1); });
    const pav = Math.min(FLOORS, Math.max(1, Math.round(y / FH)));
    if (state && pav !== lastPav) { state.textContent = `Varredura · pavimento ${pav} de ${FLOORS}`; lastPav = pav; }
    world.rotation.y += ((-.35 + pointer.x * .5 + (REDUCE ? 0 : Math.sin(t * .12) * .12)) - world.rotation.y) * .05;
    cam.position.y += ((7.5 - pointer.y * 2) - cam.position.y) * .05;
    cam.lookAt(look);
    r.render(scene, cam);
  });
  document.querySelector('.hero').classList.add('has3d');
}

// ---------------------------------------------------------------- OBRA: construção guiada pela rolagem
function obra() {
  const section = document.getElementById('processo'), canvas = document.getElementById('c-obra'); if (!canvas || !section) return;
  const { r, scene, cam } = setup(canvas);
  lights(scene, 0xE4EEEF, 0x1B2326, 2.0);
  const world = new THREE.Group(); scene.add(world);
  const b = buildingModel(); world.add(b.root);
  b.floors.forEach(f => { f.mat.depthWrite = true; });
  const ground = dotGround(10, .5, 0x9FB0B2, .5); world.add(ground);
  // estacas do levantamento
  const stakeMat = new THREE.MeshBasicMaterial({ color: C.green, transparent: true, opacity: 1 });
  const stakes = new THREE.Group(); world.add(stakes);
  GRID_X.forEach(x => GRID_Z.forEach(z => { const s = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .6, 6), stakeMat); s.position.set(x, .3, z); stakes.add(s); }));
  const sweepMat = new THREE.MeshBasicMaterial({ color: C.green, transparent: true, opacity: .3, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const sweep = new THREE.Mesh(new THREE.PlaneGeometry(.06, 6), sweepMat); sweep.rotation.x = -Math.PI / 2; sweep.position.y = .02; world.add(sweep);
  // andaime
  const scMat = new THREE.MeshStandardMaterial({ color: 0x8FA3A7, roughness: .5, metalness: .5, transparent: true, opacity: 0 });
  const scaffold = new THREE.Group(); world.add(scaffold);
  const zs0 = GRID_Z[2] + .45, zs1 = GRID_Z[2] + .95;
  [-3, -2, -1, 0, 1, 2, 3].forEach(x => [zs0, zs1].forEach(z => scaffold.add(bar(V(x, 0, z), V(x, FLOORS * FH + .4, z), .04, scMat))));
  for (let f = 1; f <= FLOORS; f++) [zs0, zs1].forEach(z => scaffold.add(bar(V(-3, f * FH, z), V(3, f * FH, z), .035, scMat)));
  // pessoas
  const people = new THREE.Group(); world.add(people);
  const p1 = person(); p1.position.set(-2.2, 0, 3.4); p1.rotation.y = .6; people.add(p1);
  const p2 = person(C.green); p2.position.set(-1.5, 0, 3.9); p2.rotation.y = 2.4; people.add(p2);
  const p3 = person(C.pet); p3.position.set(3.4, 0, 3.1); p3.rotation.y = -.7; people.add(p3);
  people.traverse(o => { if (o.material) { o.material = o.material.clone(); o.material.transparent = true; } });

  const steps = [...document.querySelectorAll('.obra-step')], meter = document.getElementById('obra-meter'), stepLbl = document.getElementById('obra-step-lbl');
  let progress = 0, shown = 0, active = -1;
  const measure = () => { const rc = section.getBoundingClientRect(); progress = clamp(-rc.top / Math.max(1, rc.height - innerHeight)); };
  addEventListener('scroll', measure, { passive: true }); measure();
  world.position.x = innerWidth > 1020 ? 2.6 : 0;
  addEventListener('resize', () => { world.position.x = innerWidth > 1020 ? 2.6 : 0; });
  const kick = loop(canvas, t => {
    measure();
    shown += (progress - shown) * (REDUCE ? 1 : .12);
    const p = shown;
    // 1 · levantamento
    stakeMat.opacity = smooth(p, 0, .06) * (1 - smooth(p, .4, .5));
    sweep.position.x = -4 + ((p / .25) % 1) * 8; sweepMat.opacity = .35 * (1 - smooth(p, .22, .3));
    // 2 · projeto (aramado)
    b.edgeMat.opacity = .12 + .7 * smooth(p, .2, .38) - .45 * smooth(p, .8, .95);
    // 3 · execução: pavimento a pavimento
    b.floors.forEach((f, i) => {
      const a = smooth(p, .48 + i * .055, .53 + i * .055);
      f.mat.opacity = a; f.mat.depthWrite = a > .9;
      f.group.visible = p > .2 + i * .03;
    });
    b.brace.opacity = smooth(p, .3, .45);
    scMat.opacity = smooth(p, .5, .6) * (1 - smooth(p, .82, .9));
    // 4 · entrega
    b.glassMat.opacity = .55 * smooth(p, .8, .93);
    b.lightMat.opacity = smooth(p, .86, .96); b.lightMat.emissiveIntensity = 1.4 * smooth(p, .86, .96);
    people.traverse(o => { if (o.material) o.material.opacity = smooth(p, .86, .95); });
    people.visible = p > .84;
    // câmera
    const ang = -.75 + p * 1.15 + pointer.x * .12, rad = (innerWidth < 700 ? 30 : 21) - p * 2.5, cx = world.position.x * .55;
    cam.position.set(cx + Math.sin(ang) * rad, 5.2 + p * 2.4, Math.cos(ang) * rad);
    cam.lookAt(cx, 2.9 + p * .4, 0);
    // interface
    const idx = Math.min(3, Math.floor(p * 4));
    if (idx !== active) { active = idx; steps.forEach((s, i) => s.classList.toggle('on', i === idx)); if (stepLbl) stepLbl.textContent = `Etapa ${idx + 1} de 4`; }
    if (meter) meter.style.transform = `scaleY(${p.toFixed(3)})`;
    r.render(scene, cam);
  });
  addEventListener('scroll', kick, { passive: true });
  section.classList.add('has3d');
}

/* ---------------------------------------------------------------- API pública
 * Cada cena falha de forma isolada: se o WebGL quebrar, o fallback em SVG continua visível. */
export function initHeroScene() {
  try { hero(); } catch (e) { console.warn('[basax] 3D hero indisponível', e); }
}
export function initObraScene() {
  try { obra(); } catch (e) { console.warn('[basax] 3D obra indisponível', e); }
}
