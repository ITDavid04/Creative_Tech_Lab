// Baut docs/lebenslauf.pdf aus projekt/lebenslauf/lebenslauf.html mit Chrome (puppeteer-core).
// Aufruf: node tools/lebenslauf-pdf.mjs   (CHROME=/pfad/zu/chrome, falls Chrome woanders liegt)
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import puppeteer from 'puppeteer-core';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');
const quelle = pathToFileURL(join(wurzel, 'projekt/lebenslauf/lebenslauf.html')).href;
const ziel = join(wurzel, 'docs/lebenslauf.pdf');

const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: 'new' });
const seite = await browser.newPage();
await seite.goto(quelle, { waitUntil: 'networkidle0' });
await seite.pdf({ path: ziel, format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true, outline: false });
await browser.close();
console.log('geschrieben:', ziel);
