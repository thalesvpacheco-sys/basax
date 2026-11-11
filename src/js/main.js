import { SERVICES } from './services.js';

const WHATSAPP = '5562981214963';

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

/* ------------------------------------------------------------ páginas de serviço */
// Em produção cada serviço é uma página estática gerada no build (vite.config.js).
// Aqui só tratamos os links antigos (#servico-xxx) e o modo de desenvolvimento,
// em que o Vite entrega o index.html para /servicos/... e o conteúdo é montado no navegador.
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
      .map(([, v]) => el('a', { href: v.path, textContent: v.title })),
  );
  document.title = `${s.seoTitle} | Basax Engenharia`;
}

function initServicePages() {
  // Links antigos no formato /#servico-condominios → endereço novo
  const hash = decodeURIComponent(location.hash.slice(1));
  if (hash.startsWith('servico-')) {
    const key = hash.slice(8);
    if (Object.hasOwn(SERVICES, key)) { location.replace(SERVICES[key].path); return; }
  }

  const path = location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`;
  const entry = Object.entries(SERVICES).find(([, s]) => s.path === path);
  if (!entry) return;
  if (!document.body.dataset.service) {
    // modo de desenvolvimento: a página não veio pré-renderizada
    renderService(...entry);
    document.body.classList.add('detail');
  }
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
  if (!document.getElementById('c-hero') && !document.getElementById('c-obra')) return; // páginas sem cena 3D
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
initServicePages();
initQuoteForm();
initScenes();
