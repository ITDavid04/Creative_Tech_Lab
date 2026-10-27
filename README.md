# Creative Tech Lab

Mein Portfolio als Labor bei Nacht, in den Farben meines Profilbilds: Jeder Abschnitt beginnt mit einem Befehl, der sich tippt, sobald die Ranke dort ankommt. Um das Wappen schwebt ein Würfel je Versuch, und die Projekte stehen als Versuchsprotokolle mit Frage, Aufbau, Ergebnis, meiner Rolle und dem, was ich dabei gelernt habe.

▶️ **Live:** [itdavid04.github.io/Creative_Tech_Lab](https://itdavid04.github.io/Creative_Tech_Lab/)

## Was drin ist

| Abschnitt | Inhalt |
|---|---|
| Einstieg | `whoami`: wer ich bin, was ich suche (Praktikum ab 11/2026), Kontakt und Lebenslauf, daneben die Würfel-Bühne |
| Versuchsprotokolle | Wiki-APP, Prüfungsprügler, Jarvis, Claude Skills, Ubuntu Autoinstall, mit echten Screenshots, Code-Auszügen, dem Werbespot der Wiki-APP und einer Hörprobe von Jarvis |
| Werkzeugkasten | Jede Technik mit dem Projekt, in dem ich sie eingesetzt habe |
| Über mich und Werdegang | Vom Gewächshaus ins Labor |

Nachtschicht ist der Standard, die Tagschicht lässt sich umschalten. Bei „Bewegung reduzieren“ steht alles still. Die Seite lädt nichts von fremden Servern, setzt keine Cookies und zählt keine Besucher.

## Aufbau

| Ordner | Inhalt |
|---|---|
| `docs/` | Die fertige Seite für GitHub Pages: `index.html`, `styles.css`, `lab.js` (Befehle, Würfel, Ranke, Bienen, Hörprobe), `datenschutz.html`, Schriften, Bilder, Hörprobe, Werbespot (`video/wiki-spot.mp4`), `lebenslauf.pdf` |
| `projekt/lebenslauf/` | Quelle der Web-Fassung des Lebenslaufs (ohne Straße, Telefon, E-Mail und Geburtsdatum) |
| `projekt/Spezifikation.md` | Ziel, Abschnitte, Gestaltungsentscheidungen und Prüfbericht |
| `tools/lebenslauf-pdf.mjs` | Baut `docs/lebenslauf.pdf` mit Chrome |

Kein Framework, kein Build-Schritt: HTML, CSS und ein Skript ohne Bibliotheken. Die Würfel sind reines CSS-3D mit berechnetem Licht, Metallglanz und Schatten aus ihren echten Ecken, die Ranke ein SVG, das beim Laden aus den Positionen der Befehle entsteht. Ohne JavaScript ist trotzdem alles lesbar. Schrift: Ubuntu und Ubuntu Mono, lokal eingebunden.

## Ansehen und ändern

```bash
python3 -m http.server 8096 --directory docs   # dann http://localhost:8096
npm install && npm run lebenslauf              # Lebenslauf-PDF neu bauen
```

## Veröffentlichen

GitHub Pages: Settings, Pages, Deploy from a branch, `main` und Ordner `/docs`.

## Lizenz

MIT, siehe [LICENSE](LICENSE). Screenshots und Emblem zeigen meine eigenen Projekte.
