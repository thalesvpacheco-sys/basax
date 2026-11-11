# Basax Engenharia — site institucional

Site estático: home de página única, 6 páginas de serviço geradas no build (nos mesmos endereços do WordPress antigo) e duas cenas 3D em Three.js.

## Stack

- HTML, CSS e JavaScript (ES modules), sem framework
- [Vite](https://vite.dev) para servidor de desenvolvimento e build de produção
- [Three.js](https://threejs.org) 0.160, carregado sob demanda em chunk separado

## Como rodar

Requer Node 20 ou superior.

```bash
npm install
npm run dev       # desenvolvimento em http://localhost:5173
npm run build     # gera a versão de produção em dist/
npm run preview   # serve dist/ localmente para conferência
```

## Deploy

A cada push na `main`, o GitHub Actions gera o build e publica o conteúdo de `dist/` em duas branches:

| Branch | Destino | Uso |
|---|---|---|
| `hostgator` | **HostGator (cPanel)** — https://basaxengenharia.com.br | Produção |
| `hostinger` | Hostinger (hPanel) — https://basax.grifo.agency | Homologação |

### HostGator (produção)

A branch `hostgator` tem o site pronto e o `.cpanel.yml` (origem: `deploy/.cpanel.yml`), que copia tudo para `~/basax-site/`.

`basaxengenharia.com.br` é **domínio adicional** nessa conta: o `public_html` pertence a outro site (`basaengenharia.com.br`). Não aponte o deploy para o `public_html`.

1. cPanel → **Git™ Version Control** → **Create** → ative *Clone a Repository*.
2. Clone URL: `https://github.com/thalesvpacheco-sys/basax.git` · Repository Path: ex. `repositories/basax` (fora do `public_html`).
3. Depois de criado, em **Manage → Basic Information**, troque o *Checked-Out Branch* para `hostgator`.
4. Na aba **Pull or Deploy**: **Update from Remote** e depois **Deploy HEAD Commit**.

Para publicar uma nova versão: push na `main` → aguarde o Actions → no cPanel, **Update from Remote** + **Deploy HEAD Commit**.

A raiz do domínio em cPanel → **Domínios** precisa ser `basax-site`. Se mudar, ajuste o `DEPLOYPATH` em `deploy/.cpanel.yml`.

O deploy **não apaga** arquivos que já estavam na pasta de destino.

### Hostinger (homologação)

hPanel → **Avançado → Git** → mesmo repositório, branch `hostinger`, diretório vazio (raiz do `public_html`), com deploy automático (webhook).

### Manual

`npm run build` e envie o **conteúdo** de `dist/` (incluindo o `.htaccess`) para o `public_html` pelo Gerenciador de Arquivos.

### SEO

- **Páginas de serviço estáticas**: o plugin `basax-seo-pages` em `vite.config.js` gera, no build, uma página por serviço em `dist/<path>/index.html` a partir do `index.html`, com título, description, canonical, Open Graph e JSON-LD (`Service` + `BreadcrumbList`) próprios. Os endereços (`/servicos/condominio/`, `/pintura-predial/`, `/servicos/adm/`, `/servicos/comercial/`, `/servicos/industrial/`, `/servicos/residencial/`) são os mesmos do WordPress, para manter o posicionamento no Google. Links antigos `/#servico-xxx` redirecionam para eles.
- **`sitemap.xml`** é gerado no build com todas as páginas e `lastmod` do dia (não editar à mão).
- **Home**: JSON-LD `GeneralContractor` + `WebSite` (endereço, geo, telefone, certificações, serviços).
- **Compartilhamento**: `public/og-image.jpg` (1200×630), ícones `apple-touch-icon.png`, `favicon-32.png`, `icon-192/512.png` e `img/logo-512.png` (logo para o Google).
- **404**: `public/404.html` (noindex).

Para criar ou editar um serviço: altere `src/js/services.js` (`path`, `seoTitle`, `description` e o conteúdo). O build gera a página e atualiza o sitemap.

Depois de publicar: cadastrar o domínio no **Google Search Console**, enviar `https://basaxengenharia.com.br/sitemap.xml` e atualizar o site no **Perfil da Empresa no Google** (hoje "Basa Engenharia").

### .htaccess

O `public/.htaccess` força HTTPS e domínio sem `www`, redireciona URLs do WordPress sem equivalente (`/a-empresa/`, `/contato/`, `/orcamento/`, `/servicos/`) para a seção da home, usa `/404.html` como página de erro, bloqueia `wp-login.php`/`xmlrpc.php`/`wp-admin`, ativa compressão, cabeçalhos de segurança e cache longo para os assets com hash.

## Estrutura

```
index.html              marcação da página (home + template das páginas de serviço)
src/styles/main.css     estilos
src/js/main.js          menu, roteamento dos serviços, formulário → WhatsApp
src/js/services.js      textos das páginas de serviço
src/js/scene3d.js       cenas 3D do hero e da seção "Como trabalhamos"
public/                 arquivos servidos como estão (logos, ícones, og-image, robots, 404, política de privacidade)
vite.config.js          build + geração das páginas de serviço e do sitemap
```

## Onde editar

| O quê | Arquivo |
|---|---|
| Textos da home, equipe, portfólio, depoimentos | `index.html` |
| Textos das páginas de serviço | `src/js/services.js` |
| Número de WhatsApp | `src/js/main.js` (`WHATSAPP`) e os links `wa.me` em `index.html` |
| Cores e tipografia | variáveis no topo de `src/styles/main.css` |

## Conteúdo pendente antes de publicar

O layout é o protótipo aprovado; alguns blocos ainda usam conteúdo provisório:

- [ ] Equipe: nomes reais e fotos — seção oculta (`hidden`) e link "Equipe" comentado no menu até chegarem as fotos
- [ ] Portfólio: nomes e escopo reais das obras (fotos vieram do site antigo)
- [x] Depoimentos reais (avaliações do Google)
- [x] Logos dos clientes
- [x] Imagem de compartilhamento `og:image` (1200×630)
- [x] Domínio final `basaxengenharia.com.br` (`canonical`, `og:url`, `sitemap.xml`, `robots.txt`)
- [x] Coordenadas do endereço no JSON-LD (do Google Maps) — conferir CEP com a Basax
