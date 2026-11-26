// Fotografiert Klaus-Dieter Pollenberg aus seinem 3D-Modell in mehreren Posen nach docs/img/kd-*.webp (transparent).
// Das Modell (hummel3d.js, three.js in vendor/) liegt im Repo Hyperframes, ursprünglich aus der Wiki-APP.
// Aufruf: node tools/klaus-dieter-posen.mjs ../hyperframes/videos/klaus-dieter-kling
//         (CHROME=/pfad/zu/chrome, falls Chrome woanders liegt)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const wurzel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const quelle = path.resolve(process.argv[2] || '../hyperframes/videos/klaus-dieter-kling');
if (!fs.existsSync(path.join(quelle, 'hummel3d.js'))) {
  console.error(`hummel3d.js nicht gefunden in ${quelle}`);
  process.exit(1);
}
const ziel = path.join(wurzel, 'docs/img');

// Name, Blickrichtung (-1 links, 0 Kamera, 1 rechts), Pose, Zeitpunkt in Sekunden
const POSEN = [
  ['kd-vorne', 0, 'sitzt', 0.4],
  ['kd-rechts', 1, 'sitzt', 0.4],
  ['kd-links', -1, 'sitzt', 0.4],
  ['kd-fliegt-rechts', 1, 'fliegt', 0.55],
  ['kd-fliegt-links', -1, 'fliegt', 0.55],
  ['kd-winkt', 0, 'winkt', 1.6], // Winken beginnt beim ersten Bild mit positiver Zeit
];
// Ausschnitt im 1024er-Bild (gemessen über alle Posen) und Breite der fertigen Bilder
const AUSSCHNITT = process.env.VOLL ? { x: 0, y: 0, width: 1024, height: 1024 } : { x: 117, y: 160, width: 770, height: 670 };
const BREITE = 308;

const SEITE = `<!doctype html><html><head><meta charset="utf-8"><link rel="icon" href="data:,">
<script type="importmap">{ "imports": { "three": "./vendor/three.module.js" } }</script>
<style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:1024px;height:1024px;overflow:hidden;background:transparent}
#kd{position:absolute;left:50%;top:52%;width:640px;height:585px;margin:-292px 0 0 -320px}
.fe{position:relative;width:100%;height:100%}.fe-hub{position:relative;display:block;width:100%;height:100%}
.fe-3d{position:absolute;left:-40%;top:-45%;width:180%;height:180%}</style></head>
<body><div id="kd"><div class="fe" id="fe"><span class="fe-hub"></span></div></div>
<script type="module">
const q = new URLSearchParams(location.search);
const blick = Number(q.get('blick')), pose = q.get('pose'), t = Number(q.get('t'));
const fe = document.getElementById('fe');
if (pose !== 'sitzt') fe.classList.add(pose);
let zeichne = null;
const { baue } = await import('./hummel3d.js');
const ok = await baue({ fe, stand: () => ({ blick, kipp: pose === 'fliegt' ? 8 * (blick < 0 ? -1 : 1) : 0 }), extern: f => { zeichne = f; } });
if (!ok || !zeichne) throw new Error('WebGL fehlt');
for (let k = 0; k <= 30; k++) zeichne((t - 1 + k / 30) * 1000);
window.__fertig = true;
</script></body></html>`;

const MIME = { '.js': 'text/javascript' };
const server = http.createServer((req, res) => {
  const pfad = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (pfad === '/') { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(SEITE); return; }
  const datei = path.join(quelle, pfad);
  if (!datei.startsWith(quelle) || !fs.existsSync(datei) || fs.statSync(datei).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(datei)] || 'application/octet-stream' });
  fs.createReadStream(datei).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || '/usr/bin/google-chrome',
  headless: 'new',
  args: [...(process.getuid?.() === 0 ? ['--no-sandbox'] : []), '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--hide-scrollbars'],
});
const fehler = [];
for (const [name, blick, pose, t] of POSEN) {
  const seite = await browser.newPage();
  seite.on('pageerror', e => fehler.push(`${name}: ${e}`));
  await seite.setViewport({ width: 1024, height: 1024, deviceScaleFactor: BREITE / AUSSCHNITT.width });
  await seite.goto(`http://127.0.0.1:${server.address().port}/?blick=${blick}&pose=${pose}&t=${t}`, { waitUntil: 'load' });
  await seite.waitForFunction('window.__fertig === true', { timeout: 60000 });
  const datei = path.join(ziel, `${name}.webp`);
  await seite.screenshot({ path: datei, type: 'webp', quality: 86, omitBackground: true, clip: AUSSCHNITT });
  await seite.close();
  console.log('geschrieben:', path.relative(wurzel, datei), `${(fs.statSync(datei).size / 1024).toFixed(1)} KB`);
}
await browser.close();
server.close();
if (fehler.length) { console.error(fehler.join('\n')); process.exit(1); }
