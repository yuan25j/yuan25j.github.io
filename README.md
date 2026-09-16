# John Yuan — Portfolio

A fast, accessible portfolio built with Astro, TypeScript, and Tailwind CSS. Content is stored in typed Markdown collections and deployed as a static site to GitHub Pages.

## Local development

Requires Node.js 22.19 or newer.

```sh
npm install
npm run dev
```

Open `http://localhost:4321`.

## Commands

- `npm run dev` — start the development server
- `npm run check` — run Astro and TypeScript diagnostics
- `npm run build` — type-check and generate the production site
- `npm run preview` — preview the production build

## Content

- Experience: `src/content/work`
- Projects: `src/content/projects`
- Pages and components: `src/pages` and `src/components`
- Global design tokens: `src/styles/global.css`

Pushing `main` or `master` runs the GitHub Pages workflow in `.github/workflows/deploy.yml`.
