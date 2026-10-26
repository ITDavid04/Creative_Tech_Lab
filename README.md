# Creative Tech Lab

Mein Portfolio als Laborbuch: Projekte stehen als Versuchsprotokolle auf kariertem Papier, mit Frage, Aufbau, Ergebnis, meiner Rolle und dem, was ich dabei gelernt habe.

▶️ **Live:** [itdavid04.github.io/Creative_Tech_Lab](https://itdavid04.github.io/Creative_Tech_Lab/)

## Was drin ist

| Abschnitt | Inhalt |
|---|---|
| Einstieg | Wer ich bin, was ich suche (Praktikum ab 11/2026), Kontakt und Lebenslauf |
| Versuchsprotokolle | Wiki-APP, Prüfungsprügler, Jarvis, Claude Skills, Ubuntu Autoinstall, mit echten Screenshots, Code-Auszügen und einer Hörprobe von Jarvis |
| Werkzeugkasten | Jede Technik mit dem Projekt, in dem ich sie eingesetzt habe |
| Über mich und Werdegang | Vom Gewächshaus ins Labor |

Tagschicht und Nachtschicht folgen der Systemeinstellung und lassen sich umschalten. Die Seite lädt nichts von fremden Servern, setzt keine Cookies und zählt keine Besucher.

## Aufbau

| Ordner | Inhalt |
|---|---|
| `docs/` | Die fertige Seite für GitHub Pages: `index.html`, `styles.css`, `lab.js`, `datenschutz.html`, Bilder, Hörprobe, `lebenslauf.pdf` |
| `projekt/lebenslauf/` | Quelle der Web-Fassung des Lebenslaufs (ohne Straße, Telefon, E-Mail und Geburtsdatum) |
| `projekt/Spezifikation.md` | Ziel, Abschnitte, Gestaltungsentscheidungen und Prüfbericht |
| `tools/lebenslauf-pdf.mjs` | Baut `docs/lebenslauf.pdf` mit Chrome |

Kein Framework, kein Build-Schritt: HTML, CSS und ein kleines Skript für Umschalter, Prompt und Hörprobe. Ohne JavaScript ist trotzdem alles lesbar.

## Ansehen und ändern

```bash
python3 -m http.server 8096 --directory docs   # dann http://localhost:8096
npm install && npm run lebenslauf              # Lebenslauf-PDF neu bauen
```

## Veröffentlichen

GitHub Pages: Settings, Pages, Deploy from a branch, `main` und Ordner `/docs`.

## Lizenz

MIT, siehe [LICENSE](LICENSE). Screenshots und Emblem zeigen meine eigenen Projekte.
