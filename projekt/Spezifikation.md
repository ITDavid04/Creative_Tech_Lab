# Seitenspezifikation: Creative Tech Lab

Variante: D (Portfolio, Bewerbung) · Seitentyp: Startseite · Stand: 26.10.2026, Fassung 2 "Labor bei Nacht"

## Ziel
- Ziel der Seite: Ausbilder und Recruiter verstehen in 10 Sekunden Rolle, Schwerpunkt und Verfügbarkeit und öffnen ein Projekt.
- Primärer CTA: „Kontakt auf LinkedIn“
- Sekundärweg: „Lebenslauf (PDF)“
- Navigation: ja (Startseite)
- Länge: lang, weil ein Praktikum über sechs Monate für den Betrieb eine echte Entscheidung ist und Leser Belege sehen wollen (regelwerk.md §2.3). Desktop rund 12,5 Bildschirmhöhen, Handy rund 23,5.

## Idee der Fassung 2
Davids Wunsch: mehr Wirkung, Befehle über jedem Feld, Ranke und Würfel aus der Wiki-APP, Farben wie im GitHub-Profilbild, damit alles eins wird.

- **Befehle:** Jeder Abschnitt beginnt mit einer Terminalzeile, die sich tippt, sobald die Ranke dort ankommt: `whoami`, `cat motto.txt`, `cat praktikum.conf`, `cat versuche/*/protokoll.md`, `apt list --installed`, `man david`, `git log --graph`, `sudo apt install praktikant`, `exit`. Die Inhalte darunter sind passend gestaltet (Konfigurationsdatei, Paketliste, Manpage, Git-Graph, apt-Ausgabe).
- **Würfel:** Auf der Bühne um das Wappen schwebt ein Würfel je Versuch, in der Farbe des Projekts und mit seinem Zeichen aus dem Wappen (Blatt, Feuer und Schwert, Schallwellen, Funken, Prompt). Ein Klick führt zum Protokoll, `./wuerfeln.sh` lässt alle rollen und empfiehlt einen Versuch.
- **Metall und Schatten:** Die Würfel sind gebürstetes, eloxiertes Metall. Ein Licht von oben links bestimmt für jede Seite Helligkeit, Glanzstreifen und Lichtpunkt, berechnet aus derselben Drehung wie die Würfel; das Wappen wirft magenta Widerschein auf die zugewandten Seiten. Die Schatten entstehen aus den acht Ecken jedes Würfels, entlang der Lichtstrahlen auf die Wand projiziert, und werden weicher und heller, je weiter der Würfel nach vorn schwebt. Desktop 60 Bilder pro Sekunde, Handy mit 4-fach gedrosselter CPU im Mittel 50.
- **Ampel:** Unter jedem Befehl, der sichtbar getippt wird, läuft einmal ein 3 px dünner Balken von links nach rechts, Rot, Gelb, Grün wie die Prüfungs-Ampel der Wiki-APP, und blendet dann aus (rund 1,7 s). Bei reduzierter Bewegung entfällt er.
- **Werbespot:** Im Protokoll der Wiki-APP läuft am Desktop in der Lücke unter dem Screenshot der Werbespot (26 s, 540 × 960, H.264 und AAC, 2,7 MB, mit GStreamer aus der 42,5-MB-Fassung gerechnet). Er lädt erst beim Hinscrollen, läuft stumm in Schleife, hält außer Sicht an und hat Knöpfe zum Anhalten und für den Ton. Am Handy wird er nicht geladen, dort steht ein Link. Bei reduzierter Bewegung startet er erst auf Knopfdruck.
- **Ranke:** wächst beim Scrollen am linken Rand mit, läuft beim Hochscrollen zurück, an jedem Befehl blüht eine Blüte auf. Zwei Bienen: eine an der Spitze, eine an der zuletzt geöffneten Blüte. Im Werdegang wird die Ranke zum Git-Graph, mit den Wurzeln in der Gärtnerei.

## Abschnittsfolge

| # | Abschnitt | Befehl | Beantwortet | Regel |
|---|---|---|---|---|
| 1 | Einstieg mit Würfel-Bühne | `whoami`, `cat motto.txt` | Wer ist das, was sucht er? | §2.1, zielgruppen D |
| 2 | Steckbrief Praktikum | `cat praktikum.conf` | Passt das zu uns, was kostet es? | §2.3 |
| 3 | Versuchsprotokolle (5) | `cat versuche/*/protokoll.md` | Kann er das wirklich? | zielgruppen D |
| 4 | Werkzeugkasten | `apt list --installed` | Welche Technik, wo belegt? | §2.2 |
| 5 | Über mich | `man david` | Wie arbeitet er? | §2.4 |
| 6 | Werdegang | `git log --graph` | Lückenlos? | zielgruppen D |
| 7 | Kontakt | `sudo apt install praktikant` | Wie geht es weiter? | §2.3 |

## Gestaltungsentscheidungen
- Schrift: Ubuntu und Ubuntu Mono, lokal als WOFF2 (je zwei Schnitte, zusammen 118 KB, Lizenz in `docs/fonts/LICENSE-UFL.txt`). Begründung: Ubuntu ist Davids System und Thema eines Versuchs, die Mono-Schrift trägt die Terminalzeilen.
- Farben aus dem Profilbild gemessen: Grund `#1a1033` mit Türkis oben rechts und Violett unten links, Rankengrün `#83d97d`, Prompt-Magenta `#ff6bf0`, Orange `#ffa35c`, Gelb `#ffd447`, Bildschirm-Beige `#f2d3ae`. Tagschicht hell zum Umschalten.
- Kontraste: Text auf Grund 16:1, Zweitext 10:1, Grün 10:1, Magenta 7,4:1; Tagschicht alle über 5,5:1.
- Bilder: echte Screenshots im beigen Bildschirmrahmen aus dem Wappen, Code-Auszüge und Hörprobe als Terminal.
- Slop-Zählung (regelwerk.md §3): 2, beide bewusst. Muster 1 (dunkler violett-türkiser Grund mit Leuchten): das ist Davids Profilbild, also Marke statt Standard. Muster 5 (Zeile über jeder Überschrift): die Befehle tragen Bedeutung und passen zum Inhalt darunter.
- Bewegung: deutlich mehr als in Fassung 1, auf Davids Wunsch. Bei „Bewegung reduzieren“ steht alles: Ranke ausgewachsen, Befehle fertig, Würfel ruhig. Alle Inhalte stehen im HTML, ohne JavaScript ist alles lesbar.

## Technik
- Formular: keins, Kontakt über LinkedIn
- Externe Dienste: keine
- Schema.org: `Person`
- BFSG: nein (private Präsentationsseite)
- Messung: keine

## Prüfbericht (Kurzform für eigene Bauten), Fassung 2

Zugriffsstufe 2+ (Browser, Shell, puppeteer auf dem lokalen Rechner)

| Punkt | Ergebnis |
|---|---|
| C1 Erster Eindruck | ✅ Rolle, Verfügbarkeit, Motto und LinkedIn im ersten Bildschirm am Desktop und am Handy |
| C2 Botschaft | ✅ eigene Überschrift, konkrete Zahlen |
| C3 Belege | ✅ Live-Links, Screenshots, Code, Hörprobe, Foto |
| C4 Ablenkung | ⚠️ mehr Bewegung als Regelwerk §2.6 empfiehlt, bewusst gewählt; ein primärer CTA, kein Pop-up |
| C5 Offene Fragen | ✅ Zeitraum, Ort, Kosten, Abschlussprojekt |
| C6 KI-Muster | ✅ 2 von 7, begründet |
| C7 Gerüst | ✅ Abschnitte konventionell, Wirkung über Bühne, Ranke und Befehle |
| C8 Mobil | ✅ LCP 1,2 s Desktop und Handy (Labormessung, ein Durchlauf, Slow 4G, 4-fach gedrosselte CPU), CLS 0,002 |
| C9 Lesbarkeit | ✅ Kontraste siehe oben, Fließtext 17 px |
| C10 Auffindbarkeit | ✅ Titel, Beschreibung, canonical, JSON-LD, Sitemap |
| C11 Messung | ➖ bewusst keine |
| C12 Pflicht und Technik | ⚠️ kein Impressum (Davids Entscheidung, keine Rechtsberatung); Datenschutzhinweis; keine Cookies, keine fremden Server |

Schnellcheck: 1 Fehler (kein Impressum, siehe C12), Hinweise „Emblem ohne lazy“ (Hero-Bild, Fehlalarm) und „kein tel:-Link“ (nur Variante A).
