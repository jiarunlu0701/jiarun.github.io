# Jiarun Lu — Personal homepage

Live at https://jiarunlu0701.github.io/jiarun.github.io/.

The editable React and TypeScript source is in `site/`. The root `index.html`, `assets/`, portrait, and favicon are generated static files served by GitHub Pages from `main`.

## Local development

Use Node.js 22.13 or newer.

```sh
cd site
npm ci
npm run dev
```

## Build and publish

```sh
cd site
npm run check
npm run build
cd ..
git add site index.html assets favicon.svg jiarun-lu.jpg .nojekyll
git commit -m "Update homepage"
git push origin main
```

The build pre-renders the content and keeps relative asset paths so the site works under the repository's GitHub Pages URL. Animation, navigation, accordions, and clipboard copying hydrate in the browser.
