import { SERVICES } from './services.js';

const WHATSAPP = '5562981214963';
const DEFAULT_TITLE = document.title;

/* ------------------------------------------------------------ header + menu mobile */
function initHeader() {
  const header = document.querySelector('header.site');
  const menuBtn = header.querySelector('.menu-btn');

  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setOpen = (open) => {
    header.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  menuBtn.addEventListener('click', () => setOpen(!header.classList.contains('open')));
  header.querySelectorAll('nav.main a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('open')) { setOpen(false); menuBtn.focus(); }
  });
}

/* ------------------------------------------------------------ reveal on scroll */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------ páginas de serviço (#servico-xxx) */
function el(tag, props = {}, children = []) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
}

function renderService(key, s) {
  document.getElementById('sp-crumb').textContent = s.title;
  document.getElementById('sp-title').textContent = s.title;
  document.getElementById('sp-intro').textContent = s.intro;
  document.querySelector('#sp-ico use').setAttribute('href', `#i-${s.icon}`);
  document.getElementById('sp-list').replaceChildren(...s.items.map((t) => el('li', { textContent: t })));
  document.getElementById('sp-diff').replaceChildren(
    ...s.diff.map(([title, text]) => el('div', {}, [el('b', { textContent: title }), el('p', { textContent: text })])),
  );
  document.getElementById('sp-others').replaceChildren(
    ...Object.entries(SERVICES)
      .filter(([k]) => k !== key)
      .map(([k, v]) => el('a', { href: `#servico-${k}`, textContent: v.title })),
  );
  document.title = `${s.title} — Basax Engenharia`;
}

function initRouter() {
  const route = () => {
    const hash = decodeURIComponent(location.hash.slice(1));
    const key = hash.startsWith('servico-') ? hash.slice(8) : null;
    const service = key && Object.hasOwn(SERVICES, key) ? SERVICES[key] : null;

    if (service) {
      renderService(key, service);
      document.body.classList.add('detail');
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.getElementById('sp-title').focus({ preventScroll: true });
      return;
    }

    const wasDetail = document.body.classList.contains('detail');
    document.body.classList.remove('detail');
    document.title = DEFAULT_TITLE;
    if (wasDetail && hash) {
      const target = document.getElementById(hash);
      if (target) requestAnimationFrame(() => target.scrollIntoView());
    }
  };
  window.addEventListener('hashchange', route);
  route();
}

/* ------------------------------------------------------------ formulário de orçamento -> WhatsApp */
function initQuoteForm() {
  const form = document.getElementById('qform');
  const send = document.getElementById('qsend');
  if (!form || !send) return;

  const buildLink = () => {
    const d = new FormData(form);
    const val = (k) => String(d.get(k) ?? '').trim();
    const lines = ['Olá, Basax! Gostaria de um orçamento.'];
    if (val('nome')) lines.push(`Nome: ${val('nome')}`);
    if (val('tel')) lines.push(`Telefone: ${val('tel')}`);
    lines.push(`Tipo de obra: ${val('tipo')}`);
    if (val('msg')) lines.push(`Detalhes: ${val('msg')}`);
    send.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  form.addEventListener('input', buildLink);
  form.addEventListener('change', buildLink);
  form.addEventListener('submit', (e) => { e.preventDefault(); buildLink(); window.open(send.href, '_blank', 'noopener'); });
  buildLink();
}

/* ------------------------------------------------------------ cenas 3D (carregadas sob demanda) */
function initScenes() {
  const hasWebGL = (() => {
    try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
    catch { return false; }
  })();
  if (!hasWebGL) return; // mantém os fallbacks em SVG
  import('./scene3d.js')
    .then(({ initHeroScene, initObraScene }) => { initHeroScene(); initObraScene(); })
    .catch((err) => console.warn('[basax] cenas 3D indisponíveis', err));
}

/* ------------------------------------------------------------ boot */
document.getElementById('footer-year').textContent = String(new Date().getFullYear());
initHeader();
initReveal();
initRouter();
initQuoteForm();
initScenes();
