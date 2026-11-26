/* Klaus-Dieter Pollenberg, die Hummel: Gast aus der Wiki-APP, führt durchs Labor und beantwortet Fragen.
   - Aussehen: Bilder aus seinem 3D-Modell (img/kd-*.webp, gebaut mit tools/klaus-dieter-posen.mjs), bewegt nur mit CSS.
   - Antworten kommen aus der Wissensbasis unten, abgeglichen über Stichworte. Nichts verlässt den Browser.
   - Gemerkt wird nur, ob er schon begrüßt hat oder ausgeblendet ist (localStorage "ctl.hummel").
   - Bei "Bewegung reduzieren" fliegt er nicht, er blendet nur ein. Ohne JavaScript fehlt nur er.
   Texte pflegen: STATIONEN (Führung) und WISSEN (Fragen). Antworten dürfen einfache Links enthalten. */
(() => {
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPEICHER = 'ctl.hummel';
  const LINKEDIN = 'https://www.linkedin.com/in/david-hartmann-774a75411/';
  const linkedin = (text = 'LinkedIn') => `<a href="${LINKEDIN}" rel="noopener" target="_blank">${text}</a>`;

  /* ---------- Führung: eine Station je Abschnitt ---------- */
  const STATIONEN = [
    { ziel: '#inhalt', text: 'Das ist David: fast 20 Jahre Gärtner, jetzt Anwendungsentwickler in Umschulung. Die Würfel da sind seine Versuche, jeder führt zu einem Protokoll. Und <code>./wuerfeln.sh</code> sucht dir einen aus.' },
    { ziel: '.steckbrief-bereich', text: 'Frisch reingekommen: Seit dem 16. November ist David im Praktikum, in der IT der Stadtreinigung Hamburg. Was er da genau baut, erzählt er dir am besten selbst.' },
    { ziel: '#versuche', text: 'Die Versuchsprotokolle, das neueste oben. Jeder fängt mit einer Frage aus dem Alltag an und hört mit was auf, das läuft. Mit Screenshots, Code und zwei Werbespots.' },
    { ziel: '#wiki-app', text: 'Und hier wohn ich! In der Wiki-APP pass ich auf die Ranke auf: jedes Blatt ein Artikel, läuft offline und testet sich jede Nacht selbst. Gepflegter Garten, sag ich ja.' },
    { ziel: '#werkzeug', text: 'Der Werkzeugkasten. Jede Technik steht mit dem Projekt drin, in dem David sie wirklich benutzt hat. Unten steht, was er gerade lernt.' },
    { ziel: '#ueber-mich', text: 'Die Manpage vom Chef. Erst Gewächshaus, dann Linux, Shell und Python. Darum wächst hier auch eine Ranke, und darum bin ich da: Bestäuben ist Ehrensache.' },
    { ziel: '#werdegang', text: 'Der Werdegang als <code>git log</code>. Ganz oben frisch gemergt: das Praktikum. Die Wurzeln stecken in der Gärtnerei.' },
    { ziel: '#kontakt', text: `Und so erreichst du David: am besten auf ${linkedin()}. Ich flieg dann mal zurück in meinen Garten. Tschüss!`, ende: true },
  ];

  /* ---------- Wissen: Stichworte und Antworten ----------
     Ein Stichwort trifft, wenn ein Wort der Frage damit beginnt (lange Stichworte auch mitten im Wort,
     kurze bis drei Buchstaben nur als ganzes Wort, damit "hi" nicht in "hier" trifft).
     Stichworte mit Leerzeichen müssen als Ganzes vorkommen und zählen doppelt. */
  const WISSEN = [
    { id: 'praktikum', frage: 'Was macht David gerade?',
      stichworte: ['praktikum', 'stadtreinigung', 'gerade', 'aktuell', 'momentan', 'derzeit', 'zurzeit', 'betrieb', 'firma', 'was macht', 'arbeitgeber', 'srh'],
      antwort: 'Seit dem 16. November 2026 ist David im Praktikum in der IT der Stadtreinigung Hamburg, sechs Monate Vollzeit. Da entsteht auch sein IHK-Abschlussprojekt. Was er da genau baut, erzählt er dir am besten selbst.' },
    { id: 'projekt', frage: 'Welches Projekt zuerst?',
      stichworte: ['welches projekt', 'zuerst', 'empfehl', 'bestes', 'lieblings', 'anschauen', 'highlight', 'ansehen', 'zeig'],
      antwort: 'Ich bin da befangen: die <a href="#wiki-app">Wiki-APP</a>, da wohn ich. Wer was zum Spielen will, nimmt den <a href="#pruefungspruegler">Prüfungsprügler</a>. Und wer’s lieber unter der Haube mag: <a href="#autoinstall">Ubuntu Autoinstall</a>.' },
    { id: 'kontakt', frage: 'Wie erreiche ich David?',
      stichworte: ['kontakt', 'erreich', 'schreib', 'linkedin', 'mail', 'telefon', 'anruf', 'nachricht', 'melden', 'sprechen'],
      antwort: `Am schnellsten über ${linkedin()}. E-Mail und Telefon stehen mit Absicht nicht auf der Seite, die gibt’s im Gespräch.` },
    { id: 'wer', frage: 'Wer bist du überhaupt?',
      stichworte: ['wer bist', 'bist du', 'klaus', 'dieter', 'pollenberg', 'hummel', 'dein name', 'heisst du', 'ueber dich'],
      antwort: 'Klaus-Dieter Pollenberg, Hummel. Hauptberuflich Gartenaufsicht in Davids <a href="#wiki-app">Wiki-APP</a>, da pass ich auf die Ranke mit den Artikeln auf. Heute bin ich zu Gast und führ durchs Labor. Sag ruhig Klaus-Dieter.' },
    { id: 'abschlussprojekt',
      stichworte: ['abschlussprojekt', 'projektarbeit', 'abschlusspruefung', 'thema', 'ihk projekt', 'pruefungsprojekt'],
      antwort: 'Die betriebliche Projektarbeit für die IHK (höchstens 80 Stunden) macht David im Praktikum bei der Stadtreinigung. Das Thema verrät er auf Nachfrage, aus mir summt da nix raus.' },
    { id: 'danach',
      stichworte: ['danach', 'uebernahme', 'festanstellung', 'einstell', 'stellenangebot', 'offene stelle', 'freie stelle', 'verfuegbar', 'job', 'bewerb', 'anstellung', 'zukunft', 'nach dem abschluss'],
      antwort: `Nach dem Abschluss im Sommer 2027 ist David offen für Gespräche über die Zeit danach. Am besten direkt auf ${linkedin()} schreiben.` },
    { id: 'umschulung',
      stichworte: ['umschulung', 'ausbildung', 'abschluss', 'fertig', 'syntax', 'ihk', 'fachinformatiker', 'fiae', 'schule', 'wann'],
      antwort: 'Umschulung zum Fachinformatiker für Anwendungsentwicklung am Syntax Institut Hamburg, seit 09/2025. Der Abschluss ist für 08/2027 geplant, das Praktikum ist die Praxisphase davon.' },
    { id: 'lebenslauf',
      stichworte: ['lebenslauf', 'cv', 'vita', 'zeugnis', 'pdf', 'unterlagen'],
      antwort: 'Den Lebenslauf gibt’s als <a href="lebenslauf.pdf" type="application/pdf">PDF</a>, ohne Adresse und Telefon. Den Rest gern im Gespräch.' },
    { id: 'technik',
      stichworte: ['programmiersprache', 'sprachen', 'python', 'javascript', 'sql', 'bash', 'datenbank', 'technik', 'kann er', 'kenntnis', 'werkzeug', 'tools', 'stack'],
      antwort: 'Python, JavaScript ohne Framework, SQL mit SQLite und Bash, dazu Linux, systemd, cloud-init und GitHub Actions. Wo er was eingesetzt hat, steht im <a href="#werkzeug">Werkzeugkasten</a>.' },
    { id: 'wiki',
      stichworte: ['wiki', 'artikel', 'pwa', 'offline', 'lernapp', 'lern app', 'ranke'],
      antwort: 'Die <a href="#wiki-app">Wiki-APP</a> macht aus Davids freiem Lern-Wiki eine App fürs Handy, die auch im Funkloch läuft. Über 170 Artikel, Prüfungs-Ampel, und jede Nacht holt sie neue Artikel, testet sich und veröffentlicht sich selbst. Ich mach da die Gartenaufsicht.' },
    { id: 'pruegler',
      stichworte: ['pruegler', 'souls', 'spiel', 'game', 'lernkarten', 'karten', 'dante', 'boss'],
      antwort: 'Der <a href="#pruefungspruegler">Prüfungsprügler</a> macht aus 1134 Prüfungskarten ein Souls-like fürs Handy: richtig bringt Seelen, falsch kostet Leben. Düster, aber ohne Prüfungsangst, versprochen.' },
    { id: 'jarvis',
      stichworte: ['jarvis', 'sprachassistent', 'assistent', 'stimme', 'tts', 'piper', 'systemd', 'hoerprobe'],
      antwort: '<a href="#jarvis">Jarvis</a> begrüßt David jeden Morgen nach dem Login: Wetter, Systemstatus, Schlagzeilen, alles lokal mit Roboterstimme. Hörprobe gibt’s im Protokoll. Nur Kaffee kann er noch nicht.' },
    { id: 'skills',
      stichworte: ['claude', 'gemini', 'gems', 'skill', 'prompt', 'kuenstliche', 'ki', 'ai', 'chatgpt', 'llm'],
      antwort: 'David hat eigene <a href="#claude-skills">Claude Skills und Gemini Gems</a> gebaut, damit die KI jedes Mal dieselbe Qualität liefert. Beim Programmieren plant, entscheidet und prüft er selbst und lässt KI-Agenten wie Claude Code mitschreiben. Jede Änderung bekommt Tests und Screenshots, bevor er sie freigibt.' },
    { id: 'autoinstall',
      stichworte: ['autoinstall', 'ubuntu', 'installation', 'luks', 'tpm', 'cloud init', 'workshop', 'iso', 'linux'],
      antwort: 'Mit <a href="#autoinstall">Ubuntu Autoinstall</a> setzt David Schulungsrechner vollautomatisch auf, verschlüsselt und auch ohne Internet. Daraus ist ein zweitägiger Workshop für IT-Auszubildende geworden.' },
    { id: 'vorher',
      stichworte: ['gaertner', 'garten', 'vorher', 'frueher', 'quereinst', 'werdegang', 'lebenslauf luecke', 'erfahrung', 'gewaechshaus'],
      antwort: 'Fast 20 Jahre Gärtnerei, zuletzt fest angestellt. Daher kann David Kunden zuhören, Technik am Laufen halten und Fehler Schritt für Schritt eingrenzen. Steht alles im <a href="#werdegang">Werdegang</a>. Und unter uns: Darum versteh ich mich so gut mit ihm.' },
    { id: 'ort',
      stichworte: ['wo wohnt', 'wohnort', 'wohnt', 'standort', 'region', 'hamburg', 'umzug', 'pendel', 'woher'],
      antwort: 'David wohnt im Raum Hamburg, das Praktikum ist in Hamburg.' },
    { id: 'englisch',
      stichworte: ['englisch', 'english', 'sprache', 'deutsch'],
      antwort: 'Deutsch ist Davids Muttersprache, Englisch kann er auf B2. Ich selbst kann nur Hochdeutsch, Summen und ein bisschen Platt.' },
    { id: 'seite',
      stichworte: ['diese seite', 'webseite', 'website', 'gebaut', 'framework', 'quelltext', 'quellcode', 'github', 'wuerfel', 'bienen', 'tagschicht', 'nachtschicht'],
      antwort: 'Die Seite ist handgemacht: HTML, CSS und Skripte ohne Bibliotheken, keine Cookies, keine fremden Server. Die Ranke wächst beim Scrollen mit, die Würfel sind reines CSS-3D. Und ich bin nur Bilder aus meinem 3D-Modell, damit alles leicht bleibt. Den <a href="https://github.com/ITDavid04/Creative_Tech_Lab" rel="noopener" target="_blank">Quelltext</a> gibt’s auf GitHub.' },
    { id: 'datenschutz',
      stichworte: ['datenschutz', 'daten', 'tracking', 'speicher', 'cookie', 'gespeichert'],
      antwort: 'Deine Fragen bleiben in deinem Browser, die schickt hier keiner irgendwohin. Ich merk mir nur, ob ich dich schon begrüßt hab. Mehr im <a href="datenschutz.html">Datenschutzhinweis</a>.' },
    { id: 'honig',
      stichworte: ['honig', 'stechen', 'stich', 'blume', 'bluete'],
      antwort: 'Honig? Ich bin Hummel und in der Aufsicht, nicht in der Produktion. Und stechen tu ich nur Bugs.' },
    { id: 'gruss',
      stichworte: ['moin', 'hallo', 'hi', 'hey', 'servus', 'guten tag', 'gruess'],
      antwort: 'Moin moin! Frag ruhig, was du über David wissen willst, oder lass dich von mir rumführen.' },
    { id: 'danke',
      stichworte: ['danke', 'dank', 'super', 'toll', 'cool', 'nett'],
      antwort: 'Da nich für! Wenn noch was ist: Ich sitz hier unten rechts.' },
  ];
  const VORSCHLAEGE = WISSEN.filter(w => w.frage);
  const UNBEKANNT = `Da muss ich passen, das weiß nur David selbst. Schreib ihm am besten auf ${linkedin()}, oder frag mich was anderes:`;

  /* ---------- Fragen verstehen ---------- */
  const norm = s => ' ' + s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
  WISSEN.forEach(w => { w.n = w.stichworte.map(s => norm(s).trim()); });
  function antworte(frage) {
    const t = norm(frage);
    let beste = null, punkte = 0;
    for (const w of WISSEN) {
      let p = 0;
      for (const s of w.n) {
        if (s.includes(' ')) { if (t.includes(' ' + s + ' ')) p += 2; }
        else if (s.length <= 3 ? t.includes(' ' + s + ' ') : t.includes(' ' + s) || (s.length >= 7 && t.includes(s))) p += 1;
      }
      if (p > punkte) { punkte = p; beste = w; }
    }
    return beste;
  }

  /* ---------- Aufbau ---------- */
  let zustand = null;
  try { zustand = localStorage.getItem(SPEICHER); } catch (e) { /* privates Fenster: dann ohne Merken */ }
  const merken = wert => { zustand = wert; try { localStorage.setItem(SPEICHER, wert); } catch (e) {} };

  const POSEN = ['vorne', 'links', 'rechts', 'winkt', 'fliegt-links', 'fliegt-rechts'];
  const bilder = {};
  const vorladen = () => POSEN.forEach(p => { if (!bilder[p]) { bilder[p] = new Image(); bilder[p].src = `img/kd-${p}.webp`; } });

  const kd = document.createElement('aside');
  kd.className = 'kd';
  kd.setAttribute('aria-label', 'Klaus-Dieter, der Laborführer');
  kd.innerHTML = `
    <div class="kd-blase" id="kd-blase" hidden>
      <div class="kd-kopf">
        <p class="kd-name"><b>Klaus-Dieter</b> <span>Gast aus der Wiki-APP</span></p>
        <button class="kd-zu" type="button" aria-label="Sprechblase schließen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      </div>
      <div class="kd-verlauf" aria-live="polite"></div>
      <div class="kd-wahl"></div>
      <form class="kd-frage" hidden>
        <label class="kd-sr" for="kd-eingabe">Deine Frage an Klaus-Dieter</label>
        <input id="kd-eingabe" type="text" maxlength="200" autocomplete="off" enterkeyhint="send" placeholder="Frag mich was über David …">
        <button type="submit" aria-label="Frage senden"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg></button>
      </form>
      <p class="kd-fuss"><button class="kd-weg" type="button">Klaus-Dieter ausblenden</button></p>
    </div>
    <button class="kd-figur" type="button" aria-expanded="false" aria-controls="kd-blase">
      <span class="kd-sr">Klaus-Dieter: Führung und Fragen</span>
      <span class="kd-schwebe"><img alt="" width="154" height="134" decoding="async"></span>
    </button>`;
  const $ = s => kd.querySelector(s);
  const blase = $('.kd-blase'), verlauf = $('.kd-verlauf'), wahl = $('.kd-wahl'), form = $('.kd-frage'), eingabe = $('#kd-eingabe');
  const figur = $('.kd-figur'), bild = $('.kd-figur img');

  /* Rückweg, wenn er ausgeblendet ist: ein Knopf im Seitenfuß */
  const fussZeile = document.querySelector('.fuss .zeilen p');
  let rufen = null;
  if (fussZeile) {
    rufen = document.createElement('span');
    rufen.hidden = true;
    rufen.innerHTML = ' · <button class="kd-rufen" type="button">Klaus-Dieter rufen</button>';
    fussZeile.append(rufen);
  }

  /* ---------- Posen und Bewegung ---------- */
  let posenTimer = 0;
  function pose(name, dauer) {
    clearTimeout(posenTimer);
    bild.src = `img/kd-${name}.webp`;
    kd.dataset.pose = name;
    if (dauer) posenTimer = setTimeout(() => pose('vorne'), dauer);
  }
  /* Er schaut zum Inhalt (links von ihm) und ab und zu in die Kamera */
  let blickTimer = 0;
  function umschauen() {
    clearInterval(blickTimer);
    if (ruhig) return;
    blickTimer = setInterval(() => {
      if (kd.classList.contains('fliegt') || document.hidden) return;
      const p = kd.dataset.pose === 'vorne' ? (Math.random() < 0.7 ? 'links' : 'rechts') : 'vorne';
      pose(p);
    }, 4200);
  }
  function fliegen(dauer = 900) {
    if (ruhig) return Promise.resolve();
    kd.classList.add('fliegt');
    pose('fliegt-links');
    return new Promise(r => setTimeout(() => { kd.classList.remove('fliegt'); pose('links'); r(); }, dauer));
  }

  /* ---------- Sprechblase ---------- */
  function sag(html, wer = 'kd') {
    const p = document.createElement('p');
    p.className = wer === 'kd' ? 'kd-sagt' : 'kd-du';
    if (wer === 'kd') p.innerHTML = html; else p.textContent = html;
    /* Nur die letzte Frage mit Antwort stehen lassen, sonst wird die Blase zu lang */
    if (wer !== 'kd' || !verlauf.lastElementChild?.classList.contains('kd-du')) verlauf.textContent = '';
    verlauf.append(p);
    verlauf.scrollTop = verlauf.scrollHeight;
    if (!ruhig) { kd.classList.remove('spricht'); void kd.offsetWidth; kd.classList.add('spricht'); }
  }
  function knoepfe(liste) {
    wahl.textContent = '';
    liste.forEach(({ text, tun, haupt, href }) => {
      const k = document.createElement(href ? 'a' : 'button');
      if (href) { k.href = href; k.rel = 'noopener'; k.target = '_blank'; } else { k.type = 'button'; k.addEventListener('click', tun); }
      k.className = 'kd-knopf' + (haupt ? ' kd-haupt' : '');
      k.textContent = text;
      wahl.append(k);
    });
  }
  const offen = () => !blase.hidden;
  function oeffnen(fokus) {
    blase.hidden = false;
    figur.setAttribute('aria-expanded', 'true');
    kd.classList.add('offen');
    if (fokus) (wahl.querySelector('button, a') || eingabe).focus({ preventScroll: true });
  }
  function schliessen(fokusZurueck) {
    blase.hidden = true;
    figur.setAttribute('aria-expanded', 'false');
    kd.classList.remove('offen');
    tour = -1;
    if (zustand !== 'aus') merken('still');
    if (fokusZurueck) figur.focus({ preventScroll: true });
  }

  /* ---------- Menü, Führung, Fragen ---------- */
  function menue(text) {
    tour = -1;
    form.hidden = true;
    sag(text || 'Moin! Klaus-Dieter Pollenberg, sonst Gartenaufsicht in der Wiki-APP. Heute führ ich dich durchs Labor. Soll ich?');
    knoepfe([
      { text: 'Ja, führ mich rum', haupt: true, tun: () => station(0) },
      { text: 'Ich hab ’ne Frage', tun: fragen },
      { text: 'Nee, lass mal', tun: () => schliessen(true) },
    ]);
  }

  let tour = -1;
  async function station(n) {
    tour = n;
    const s = STATIONEN[n];
    const ziel = document.querySelector(s.ziel);
    form.hidden = true;
    knoepfe([]);
    if (ziel) {
      ziel.scrollIntoView({ behavior: ruhig ? 'auto' : 'smooth', block: 'start' });
      await fliegen();
    }
    if (tour !== n) return;               /* inzwischen weitergeklickt oder geschlossen */
    sag(s.text);
    if (s.ende) pose('winkt', 2400);
    const zurueck = { text: 'zurück', tun: () => station(n - 1) };
    knoepfe(s.ende
      ? [{ text: 'Auf LinkedIn schreiben', haupt: true, href: LINKEDIN }, { text: 'Noch ’ne Frage', tun: fragen }, { text: 'Nochmal von vorn', tun: () => station(0) }]
      : [{ text: `weiter (${n + 2}/${STATIONEN.length})`, haupt: true, tun: () => station(n + 1) }, ...(n > 0 ? [zurueck] : []), { text: 'Führung beenden', tun: () => menue('Alles klar. Wenn was ist: Ich sitz hier unten rechts.') }]);
    wahl.querySelector('.kd-haupt')?.focus({ preventScroll: true });
  }

  function vorschlaege() {
    knoepfe(VORSCHLAEGE.map(w => ({ text: w.frage, tun: () => beantworte(w.frage, w) })).concat([{ text: 'Führung starten', tun: () => station(0) }]));
  }
  function fragen() {
    tour = -1;
    sag('Na los, frag mich was über David. Oder tipp eine von diesen an:');
    vorschlaege();
    form.hidden = false;
    eingabe.focus({ preventScroll: true });
  }
  function beantworte(frage, treffer) {
    sag(frage, 'du');
    const w = treffer || antworte(frage);
    sag(w ? w.antwort : UNBEKANNT);
    if (w && w.id === 'danke') pose('winkt', 2400);
    form.hidden = false;
    vorschlaege();
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    const frage = eingabe.value.trim();
    if (!frage) return;
    eingabe.value = '';
    beantworte(frage);
  });

  figur.addEventListener('click', () => {
    if (offen()) { schliessen(false); return; }
    oeffnen(false);
    if (!verlauf.childElementCount) menue(); else if (tour < 0) menue('Na, wieder da? Was darf’s sein?');
    pose('winkt', 2000);
    (wahl.querySelector('.kd-haupt') || wahl.querySelector('button'))?.focus({ preventScroll: true });
  });
  $('.kd-zu').addEventListener('click', () => schliessen(true));
  kd.addEventListener('keydown', e => { if (e.key === 'Escape' && offen()) { e.stopPropagation(); schliessen(true); } });
  /* Links in der Blase: Sprünge auf der Seite schließen die Blase am Handy, damit man etwas sieht */
  blase.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (a && innerWidth < 720) schliessen(false);
  });

  function ausblenden() {
    merken('aus');
    kd.classList.add('weg');
    blase.hidden = true;
    clearInterval(blickTimer);
    setTimeout(() => { kd.hidden = true; kd.classList.remove('weg'); }, ruhig ? 0 : 450);
    if (rufen) { rufen.hidden = false; rufen.querySelector('button').focus({ preventScroll: true }); }
  }
  $('.kd-weg').addEventListener('click', ausblenden);
  rufen?.querySelector('button').addEventListener('click', () => {
    rufen.hidden = true;
    merken('still');
    auftritt(true);
  });

  /* ---------- Auftritt ---------- */
  function auftritt(begruessen) {
    vorladen();
    kd.hidden = false;
    pose(ruhig ? 'vorne' : 'fliegt-links');
    kd.classList.add('anflug');
    setTimeout(() => {
      kd.classList.remove('anflug');
      pose('vorne');
      umschauen();
      if (begruessen) { oeffnen(false); menue(); pose('winkt', 2200); }
    }, ruhig ? 50 : 1300);
  }

  document.body.append(kd);
  kd.hidden = true;
  if (zustand === 'aus') { if (rufen) rufen.hidden = false; return; }
  /* Erst die Seite in Ruhe ankommen lassen; Wiederkehrer begrüßt er nicht noch einmal */
  const start = () => setTimeout(() => auftritt(zustand !== 'still'), zustand === 'still' ? 600 : 3000);
  if (document.readyState === 'complete') start(); else addEventListener('load', start, { once: true });
})();
