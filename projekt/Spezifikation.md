# Seitenspezifikation: Creative Tech Lab

Variante: D (Portfolio, Bewerbung) · Seitentyp: Startseite · Datum: 26.10.2026

## Ziel
- Ziel der Seite: Ausbilder und Recruiter verstehen in 10 Sekunden Rolle, Schwerpunkt und Verfügbarkeit und öffnen ein Projekt.
- Primärer CTA: „Kontakt auf LinkedIn“
- Sekundärweg: „Lebenslauf (PDF)“
- Navigation: ja (Startseite)
- Länge: lang, weil ein Praktikum über sechs Monate für den Betrieb eine echte Entscheidung ist und Leser Belege sehen wollen (regelwerk.md §2.3). Desktop rund 11 Bildschirmhöhen, Handy rund 20.

## Abschnittsfolge

| # | Abschnitt | Inhalt | Beantwortet | Regel |
|---|---|---|---|---|
| 1 | Einstieg | Satz aus dem Lebenslauf als Überschrift, Rolle, Verfügbarkeit, LinkedIn, PDF, Beleg mit zwei Live-Apps, Emblem | Wer ist das, was sucht er? | §2.1, zielgruppen D |
| 2 | Steckbrief Praktikum | Zeitraum, Ort, Kosten für den Betrieb, Abschlussprojekt | Passt das zu uns, was kostet es? | §2.3 (keine Frage offen) |
| 3 | Versuchsprotokolle | 5 Projekte mit Frage, Aufbau, Ergebnis, Rolle, Erkenntnis und Beleg (Screenshot, Code, Hörprobe) | Kann er das wirklich? | zielgruppen D (3 bis 6 Projekte) |
| 4 | Werkzeugkasten | Inventarliste: Technik mit Einsatzort | Welche Technik, wo belegt? | §2.2 (Zahlen und Belege statt Adjektive) |
| 5 | Über mich | Gärtnerei, Selbststudium, Arbeitsweise mit KI, Workshop | Wie arbeitet er, passt er ins Team? | §2.4 (Foto der Person) |
| 6 | Werdegang | Vier Stationen, Rest im PDF | Lückenlos? | zielgruppen D |
| 7 | Kontakt | LinkedIn, GitHub | Wie geht es weiter? | §2.3 |

Gestrichen: Filter über den Projekten (bei fünf Projekten unnötig, Prüffrage 2), Kartenraster „Was ich ins Team bringe“ (steht schon im Text, Slop-Muster 4).

## Botschaft
- Überschrift: „Ich baue lieber ein Skript, als dieselbe Aufgabe zweimal zu erledigen.“ (aus Davids Lebenslauf)
- Unterzeile: Umschulung FIAE, Abschluss 08/2027, Praktikum ab 11/2026 im Raum Hamburg, Lern-Apps und Linux-Automatisierung
- Beleg: zwei Live-Apps mit Link, eine testet und veröffentlicht sich jede Nacht selbst
- Konkurrenz-Test: bestanden, Gärtnerei, Ranke, Souls-like und Jarvis kann niemand sonst schreiben

## Gestaltungsentscheidungen
- Schrift: Systemschriften, Monospace für Etiketten und Protokollköpfe. Schnell, keine externen Anfragen, passt zum Terminal im Emblem.
- Akzentfarbe: Rankengrün `#1b6e36` (hell) und `#80d494` (dunkel), aus dem Emblem. Magenta `#a1267d` nur für den Prompt `>_`.
- Hintergrund: kariertes Laborpapier `#f6f7f3`, Nachtschicht tiefes Violett `#17132a` aus dem Emblem.
- Bildsprache: echte Screenshots der Live-Apps, echte Code-Auszüge, echte Hörprobe von Jarvis, Porträt aus dem Lebenslauf.
- Slop-Zählung (regelwerk.md §3): 1. Kleine Etiketten über den Abschnittsüberschriften (Muster 5), bewusst als Laborbuch-Beschriftung und ohne Nummerierung. Sonst keins: kein Verlauf in Schrift, keine Glaseffekte, keine Emojis, kein Kartenraster mit Icons.
- Bewegung: einmal tippt der Prompt `whoami` (von David gewählt), Knöpfe reagieren, die Balken der Hörprobe laufen mit. Bei reduzierter Bewegung steht alles still.

## Technik
- Formular: keins, Kontakt über LinkedIn
- Externe Dienste: keine
- Schema.org: `Person`
- BFSG: nein (private Präsentationsseite)
- Messung: keine; Rückfrage im Gespräch, woher der Kontakt kam

## Prüfbericht (Kurzform für eigene Bauten), 26.10.2026

Zugriffsstufe 2+ (Browser, Shell, puppeteer auf dem lokalen Rechner)

| Punkt | Ergebnis |
|---|---|
| C1 Erster Eindruck | ✅ Rolle, Schwerpunkt, Verfügbarkeit und beide Knöpfe im ersten Bildschirm, auch am Handy (390 × 844) |
| C2 Botschaft | ✅ eigene Überschrift, konkrete Zahlen (172 Artikel, 1134 Karten, 78 Prüfungen) |
| C3 Belege | ✅ Live-Links, Screenshots, Code, Hörprobe, Foto |
| C4 Ablenkung | ✅ ein primärer CTA, kein Pop-up, keine Show-Animation |
| C5 Offene Fragen | ✅ Zeitraum, Ort, Kosten, Abschlussprojekt im Steckbrief |
| C6 KI-Muster | ✅ 1 von 7, begründet |
| C7 Gerüst | ✅ ruhig, typischer Aufbau |
| C8 Mobil | ✅ LCP 0,6 s am Handy und 0,7 s am Desktop (Labormessung, ein Durchlauf, Slow 4G und 4-fach gedrosselte CPU, lokaler Server), CLS 0 |
| C9 Lesbarkeit | ✅ Zeilen bis 62 Zeichen, Kontrast Text 14:1, Grün auf Papier über 4,5:1 |
| C10 Auffindbarkeit | ✅ Titel, Beschreibung, canonical, JSON-LD, Sitemap; kein SEO-Fokus (Variante D) |
| C11 Messung | ➖ bewusst keine |
| C12 Pflicht und Technik | ⚠️ kein Impressum (private Bewerbungsseite, Entscheidung bei David, keine Rechtsberatung); Datenschutzhinweis vorhanden; keine Cookies, keine fremden Server |

Schnellcheck: 1 Fehler (kein Impressum, siehe C12), Hinweise „Emblem ohne lazy“ (ist das Hero-Bild, Fehlalarm) und „kein tel:-Link“ (nur Variante A).
