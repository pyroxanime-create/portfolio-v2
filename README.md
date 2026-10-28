# Adam Calliste — portfolio (v2)

UX and product design portfolio, built as an annotated design file: an interactive dot-grid background, a Figma-style selection box that follows the pointer, real prototypes running inside the phones, and case studies with linked annotations.

Dark is the default theme; the switch at the top remembers your choice.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck
```

## Where things live

- `content/site.ts` — name, status, contact links and photo. Email, LinkedIn and photo are empty until you fill them in; anything left empty is hidden on the site.
- `content/projects.ts` — every project card and case study, in display order.
- `public/` — screenshots and the working prototypes (`/atlas/`, `kivo.html`, `daymark.html`, `global.html`).
- `components/DotField.tsx` — the interactive background.
- `components/AnnotateCursor.tsx` — the selection box that follows the pointer (mouse only).

## Deploy

Import this repository into Vercel as a new project. No environment variables are needed. After the first deploy, set `url` in `content/site.ts` to the project's address so shared links preview correctly.
