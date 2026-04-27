# UBIX Website

Minimalistic academic site for the **UBIX Research Group** (SnT, University of Luxembourg),
built with **Jekyll** and **Decap CMS**, deployable to **GitHub Pages**.

## What's in the box

- Static Jekyll site — homepage (hero, about, research areas, photo carousel, news) and per-post pages.
- `_news/` collection — one markdown file per news item. Supports text + multiple images/videos, or a LinkedIn post embed.
- `/admin/` — Decap CMS panel for managing news & the carousel without touching code.
- `_data/carousel.yml` — homepage photo carousel; editable via the admin panel or by hand.
- GitHub Actions workflow that builds & deploys on every push to `main`.
- `CNAME` for the `ubix.group` custom domain.

## Local development

```bash
bundle install
bundle exec jekyll serve
# open http://localhost:4000
```

## First-time deploy

1. Create a GitHub repo (e.g. `sntubix/ubix-website`) and push this project to `main`.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The included workflow (`.github/workflows/pages.yml`) builds and publishes on every push.
4. Point `ubix.group` at GitHub Pages:
   - `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `AAAA` records (optional IPv6) → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - Or a `CNAME` on `www` → `<owner>.github.io`
5. In **Settings → Pages**, enable "Enforce HTTPS" once the cert is issued.

## Admin setup (Decap CMS with GitHub OAuth)

GitHub Pages is static, so the admin panel's login needs a tiny OAuth proxy hosted elsewhere. Free options below — pick one.

### Option A — Vercel (recommended, ~5 min)

1. Register an OAuth app: **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
   - Homepage URL: `https://ubix.group`
   - Authorization callback URL: `https://<your-proxy>.vercel.app/api/callback` (you'll fill this in after step 2)
   - Save the **Client ID** and generate a **Client Secret**.
2. Deploy the proxy: use any maintained Decap/Netlify-CMS OAuth proxy — e.g.
   [`vencax/netlify-cms-github-oauth-provider`](https://github.com/vencax/netlify-cms-github-oauth-provider)
   or [`Gathio/decap-oauth-proxy`](https://github.com/Gathio/decap-oauth-proxy). Fork, deploy to Vercel,
   and set env vars `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, `ORIGIN=https://ubix.group`.
3. Copy the Vercel deployment URL back into the GitHub OAuth App's callback URL.
4. Edit [`admin/config.yml`](admin/config.yml):
   - `repo: OWNER/REPO` → your repo slug
   - `base_url: https://<your-proxy>.vercel.app`
   - `auth_endpoint` → whatever path the proxy exposes (usually `api/auth` or `auth`).
5. Visit `https://ubix.group/admin/` and log in with GitHub. Only users with **write access to the repo** can publish.

### Option B — Netlify for auth only (no Netlify hosting)

You can create a free Netlify site that hosts *nothing* and only provides the OAuth handshake. Decap docs: <https://decapcms.org/docs/github-backend/>.

## Writing news posts

Two ways:

### Through the admin panel
- Go to `/admin/` → **News** → **New**.
- Choose **Post type**:
  - **Native post** — write text (markdown) and attach images/videos. Rendered in-site, styled like X/LinkedIn cards.
  - **LinkedIn embed** — paste the `<iframe>` from LinkedIn (*post menu → Embed this post → Copy code*). The official embed renders inline.
- Save → Decap commits a new markdown file to `_news/` on `main`, which triggers a rebuild.

### By hand
Drop a file in `_news/`:

```markdown
---
title: Paper accepted at NeurIPS
date: 2026-05-10 09:00:00 +0200
source: native
media:
  - type: image
    src: /assets/images/uploads/neurips-2026.jpg
    alt: NeurIPS poster
---

We're happy to announce our paper *"…"* has been accepted.
```

Or, for a LinkedIn embed:

```markdown
---
title: Demo day at 360Lab
date: 2026-05-15 14:00:00 +0200
source: linkedin
linkedin_embed: |
  <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:XXXX" height="520" width="100%" frameborder="0" allowfullscreen title="Embedded post"></iframe>
---
```

## Photo carousel

Homepage gallery reads from [`_data/carousel.yml`](_data/carousel.yml). Edit via the admin panel
(**Site → Carousel**) or by hand. Put image files under `assets/images/carousel/`.

## Project layout

```
_config.yml              Jekyll config
index.html               Homepage entry (uses _layouts/home.html)
_layouts/
  default.html           Base layout (head, header, footer)
  home.html              Homepage sections
  news.html              Individual news post page
_includes/
  header.html, footer.html
_news/                   News posts (markdown). One file per post.
_data/carousel.yml       Carousel slides
admin/
  index.html             Decap CMS entry point
  config.yml             CMS schema
assets/
  css/style.css          Styles
  js/main.js             Carousel behavior
  images/                Static assets + /uploads (CMS) + /carousel
.github/workflows/pages.yml   Build & deploy to GitHub Pages
CNAME                    Custom domain
```

## Customizing

- **Colors & type** — CSS variables at the top of `assets/css/style.css`.
- **Nav links** — `_includes/header.html`.
- **Research areas** — the four cards in `_layouts/home.html`.
- **About copy** — `_layouts/home.html`, `#about` section.
