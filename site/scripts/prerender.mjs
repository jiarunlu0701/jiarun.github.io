import { readFile, writeFile, rm, cp, readdir } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import Home from '../.prerender/page.js';

const buildDirectory = new URL('../.dist/', import.meta.url);
const output = new URL('index.html', buildDirectory);
const html = await readFile(output, 'utf8');
const marker = '<div id="root"></div>';
if (!html.includes(marker)) throw new Error('Missing root marker in built HTML');
await writeFile(output, html.replace(marker, `<div id="root">${renderToString(createElement(Home))}</div>`));
// Only replace the documented generated assets after the entire build succeeds.
const repository = new URL('../../', import.meta.url);
await rm(new URL('assets', repository), { recursive: true, force: true });
for (const entry of await readdir(buildDirectory)) {
  await cp(new URL(entry, buildDirectory), new URL(entry, repository), { recursive: true });
}
await rm(new URL('../.prerender', import.meta.url), { recursive: true, force: true });
console.log('Pre-rendered homepage for GitHub Pages.');
