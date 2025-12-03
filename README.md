# Kotopes — Node + React rewrite

This repository will host the Node (API) and React (client) rewrite of https://kotopes.kr.ua/.

Quick start

1. Install root scripts and utilities (image optimizer etc):

```powershell
cd c:\kotopes\node\kotopes
npm install
```

2. Client (in a separate terminal):

```powershell
cd client
npm install
npm run dev
```

3. Server:

```powershell
cd server
npm install
npm run dev
```

Files of interest

- `docs/site-audit.md` — audit of the existing site
- `docs/project-structure.md` — planned repo layout
- `scripts/optimize-images.js` — image optimizer
- `public/images/originals/` — original images (migrated)
- `public/images/optimized/` — generated responsive images
