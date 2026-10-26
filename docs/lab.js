/* Creative Tech Lab: Schicht umschalten, Prompt tippen, Hörprobe abspielen.
   Ohne JavaScript ist alles trotzdem da: Text steht im HTML, die Hörprobe hat normale Bedienelemente. */
(() => {
  const wurzel = document.documentElement;
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Tagschicht oder Nachtschicht. Gemerkt wird nur eine eigene Wahl, sonst gilt die Einstellung des Systems. */
  const schalter = document.querySelector('.schicht');
  const dunkelSystem = matchMedia('(prefers-color-scheme: dark)');
  const istDunkel = () => (wurzel.dataset.theme ? wurzel.dataset.theme === 'dark' : dunkelSystem.matches);
  const beschriften = () => {
    const ziel = istDunkel() ? 'Tagschicht' : 'Nachtschicht';
    schalter.querySelector('.schicht-text').textContent = ziel;
    schalter.setAttribute('aria-label', ziel + ' einschalten');
    const farbe = getComputedStyle(wurzel).getPropertyValue('--papier').trim();
    document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.setAttribute('content', farbe));
  };
  if (schalter) {
    schalter.hidden = false;
    beschriften();
    schalter.addEventListener('click', () => {
      const neu = istDunkel() ? 'light' : 'dark';
      wurzel.dataset.theme = neu;
      try { localStorage.setItem('ctl.schicht', neu); } catch (e) { /* privates Fenster: dann eben ohne Merken */ }
      beschriften();
    });
    dunkelSystem.addEventListener('change', beschriften);
  }

  /* Der Prompt aus dem Emblem tippt einmal "whoami", dann erscheint die Antwort. */
  const befehl = document.querySelector('[data-tippen]');
  if (befehl && !ruhig) {
    const text = befehl.textContent;
    const ausgabe = befehl.parentElement.querySelector('.ausgabe');
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    befehl.textContent = '';
    befehl.after(cursor);
    ausgabe.style.visibility = 'hidden';
    let i = 0;
    const tippe = () => {
      befehl.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(tippe, 85);
      else setTimeout(() => { ausgabe.style.visibility = ''; cursor.remove(); }, 300);
    };
    setTimeout(tippe, 450);
  }

  /* Hörprobe: eigener Knopf, die Balken laufen mit. */
  const probe = document.querySelector('.hoerprobe');
  if (probe) {
    const audio = probe.querySelector('audio');
    const knopf = probe.querySelector('button');
    const beschriftung = knopf.querySelector('span');
    const balken = [...probe.querySelectorAll('.welle rect')];
    const dauer = parseFloat(probe.dataset.dauer) || 7;
    const ruhetext = beschriftung.textContent;
    audio.removeAttribute('controls');
    audio.hidden = true;
    knopf.hidden = false;

    let schleife = 0;
    const zeichne = () => {
      const anteil = Math.min(1, audio.currentTime / dauer);
      balken.forEach((b, n) => b.classList.toggle('an', n / balken.length <= anteil));
      if (!audio.paused) schleife = requestAnimationFrame(zeichne);
    };
    const zuruecksetzen = () => {
      cancelAnimationFrame(schleife);
      probe.classList.remove('spielt');
      beschriftung.textContent = ruhetext;
      knopf.setAttribute('aria-pressed', 'false');
    };
    audio.addEventListener('play', () => {
      probe.classList.add('spielt');
      beschriftung.textContent = 'Anhalten';
      knopf.setAttribute('aria-pressed', 'true');
      zeichne();
    });
    audio.addEventListener('pause', zuruecksetzen);
    audio.addEventListener('ended', () => { zuruecksetzen(); audio.currentTime = 0; balken.forEach(b => b.classList.remove('an')); });
    knopf.addEventListener('click', () => {
      if (!audio.paused) { audio.pause(); return; }
      audio.play().catch(() => { beschriftung.textContent = 'Ihr Browser kann die Hörprobe leider nicht abspielen'; });
    });
  }
})();
