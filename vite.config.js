import { defineConfig } from 'vite';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { SERVICES } from './src/js/services.js';

const SITE = 'https://basaxengenharia.com.br';
const ORG_ID = `${SITE}/#empresa`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Substitui exatamente um trecho; falha o build se o template mudar e o trecho sumir. */
function swap(html, from, to, label) {
  if (typeof from === 'string' ? !html.includes(from) : !from.test(html)) {
    throw new Error(`[seo-pages] trecho não encontrado no index.html: ${label}`);
  }
  return html.replace(from, to);
}

/** Corta o HTML entre dois marcadores (o primeiro incluso, o segundo mantido). */
function cut(html, start, end, label) {
  const a = html.indexOf(start);
  const b = html.indexOf(end, a);
  if (a < 0 || b < 0) throw new Error(`[seo-pages] marcadores não encontrados: ${label}`);
  return html.slice(0, a) + html.slice(b);
}

function setHead(html, { title, description, url }) {
  const t = esc(title), d = esc(description), u = esc(url);
  html = swap(html, /<title>[^<]*<\/title>/, `<title>${t}</title>`, 'title');
  html = swap(html, /(<meta name="description" content=")[^"]*/, `$1${d}`, 'description');
  html = swap(html, /(<link rel="canonical" href=")[^"]*/, `$1${u}`, 'canonical');
  html = swap(html, /(<meta property="og:url" content=")[^"]*/, `$1${u}`, 'og:url');
  html = swap(html, /(<meta property="og:title" content=")[^"]*/, `$1${t}`, 'og:title');
  html = swap(html, /(<meta property="og:description" content=")[^"]*/, `$1${d}`, 'og:description');
  html = swap(html, /(<meta name="twitter:title" content=")[^"]*/, `$1${t}`, 'twitter:title');
  html = swap(html, /(<meta name="twitter:description" content=")[^"]*/, `$1${d}`, 'twitter:description');
  return html;
}

const HOME_START = '<div class="home">';
const SVC_START = '<!-- ============================ SERVICE PAGE';

function servicePage(template, key, s) {
  const url = `${SITE}${s.path}`;
  let html = setHead(template, { title: `${s.seoTitle} | Basax Engenharia`, description: s.description, url });

  html = cut(html, HOME_START, SVC_START, 'bloco da home');
  html = swap(html, '<body>', `<body class="detail" data-service="${key}">`, 'body');
  html = swap(html, '<span id="sp-crumb"></span>', `<span id="sp-crumb">${esc(s.title)}</span>`, 'sp-crumb');
  html = swap(html, '<h1 id="sp-title" tabindex="-1"></h1>', `<h1 id="sp-title" tabindex="-1">${esc(s.title)}</h1>`, 'sp-title');
  html = swap(html, '<p class="lead" id="sp-intro"></p>', `<p class="lead" id="sp-intro">${esc(s.intro)}</p>`, 'sp-intro');
  html = swap(html, /(<svg class="ico" id="sp-ico"[^>]*><use href=")#i-[\w-]+/, `$1#i-${s.icon}`, 'sp-ico');
  html = swap(html, '<ul class="sp-list" id="sp-list"></ul>',
    `<ul class="sp-list" id="sp-list">${s.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`, 'sp-list');
  html = swap(html, '<div class="sp-diff" id="sp-diff"></div>',
    `<div class="sp-diff" id="sp-diff">${s.diff.map(([t, p]) => `<div><b>${esc(t)}</b><p>${esc(p)}</p></div>`).join('')}</div>`, 'sp-diff');
  html = swap(html, '<div class="sp-others" id="sp-others"></div>',
    `<div class="sp-others" id="sp-others">${Object.entries(SERVICES).filter(([k]) => k !== key)
      .map(([, o]) => `<a href="${o.path}">${esc(o.title)}</a>`).join('')}</div>`, 'sp-others');

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#servico`,
        name: s.title,
        serviceType: s.title,
        description: s.description,
        url,
        provider: { '@id': ORG_ID },
        areaServed: { '@type': 'City', name: 'Goiânia' },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: s.title,
          itemListElement: s.items.map((t) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: t } })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Serviços', item: `${SITE}/#servicos` },
          { '@type': 'ListItem', position: 3, name: s.title, item: url },
        ],
      },
    ],
  };
  html = swap(html, '</head>', `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n</head>`, '</head>');
  return html;
}

function sitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ['/', '1.0', 'monthly'],
    ...Object.values(SERVICES).map((s) => [s.path, '0.8', 'monthly']),
    ['/politica-de-privacidade/', '0.2', 'yearly'],
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([p, pr, cf]) => `  <url>
    <loc>${SITE}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${cf}</changefreq>
    <priority>${pr}</priority>
  </url>`).join('\n')}
</urlset>
`;
}

/** Gera as páginas estáticas dos serviços e o sitemap.xml depois do build. */
function seoPages() {
  let outDir;
  return {
    name: 'basax-seo-pages',
    apply: 'build',
    configResolved(c) { outDir = resolve(c.root, c.build.outDir); },
    closeBundle() {
      const indexPath = join(outDir, 'index.html');
      if (!existsSync(indexPath)) return;
      const template = readFileSync(indexPath, 'utf-8');

      for (const [key, s] of Object.entries(SERVICES)) {
        const dir = join(outDir, s.path);
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, 'index.html'), servicePage(template, key, s));
      }

      // Home sem o template vazio das páginas de serviço (evita um <h1> vazio)
      writeFileSync(indexPath, cut(template, SVC_START, '</main>', 'template de serviço na home'));
      writeFileSync(join(outDir, 'sitemap.xml'), sitemap());
    },
  };
}

export default defineConfig({
  plugins: [seoPages()],
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        // three.js isolado em chunk próprio: cache longo e não bloqueia o carregamento inicial
        manualChunks: { three: ['three'] },
      },
    },
  },
});
