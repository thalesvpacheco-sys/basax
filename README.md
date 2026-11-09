# Basax Engenharia — site institucional

Site estático de página única com páginas de serviço por hash (`#servico-<chave>`) e duas cenas 3D em Three.js.

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

## Deploy (Hostinger — https://basax.grifo.agency)

Site do tipo **PHP/HTML** na Hostinger. A cada push na `main`, o GitHub Actions gera o build e publica o conteúdo de `dist/` na branch **`hostinger`**.

Configuração única no hPanel: **Avançado → Git** → repositório `https://github.com/thalesvpacheco-sys/basax.git`, branch `hostinger`, diretório vazio (raiz do `public_html`). Ative o **deploy automático** (webhook) para publicar a cada push.

Alternativa manual: `npm run build` e envie o **conteúdo** de `dist/` (incluindo o `.htaccess`) para `public_html` pelo Gerenciador de Arquivos.

O `public/.htaccess` força HTTPS, ativa compressão, cabeçalhos de segurança e cache longo para os assets com hash.

## Estrutura

```
index.html              marcação da página (home + template das páginas de serviço)
src/styles/main.css     estilos
src/js/main.js          menu, roteamento dos serviços, formulário → WhatsApp
src/js/services.js      textos das páginas de serviço
src/js/scene3d.js       cenas 3D do hero e da seção "Como trabalhamos"
public/                 arquivos servidos como estão (logos, favicon, robots, sitemap)
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

- [ ] Equipe: nomes reais e fotos (hoje `[Nome Sobrenome]` e ilustração)
- [ ] Portfólio: fotos, nomes e escopo das obras
- [ ] Depoimentos reais e autorizados
- [ ] Logos dos clientes (hoje em texto)
- [ ] Imagem de compartilhamento `og:image` (1200×630, PNG/JPG) em `public/` e a tag correspondente no `<head>`
- [ ] Confirmar o domínio final (`canonical`, `og:url`, `sitemap.xml`, `robots.txt` apontam para `basaxengenharia.com.br`)
- [ ] Coordenadas exatas do endereço nos dados estruturados (JSON-LD) do `<head>`
