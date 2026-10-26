/* Creative Tech Lab: Schicht, Befehle, Würfel, Ranke mit Bienen, Hörprobe.
   Ohne JavaScript ist alles lesbar: Texte stehen im HTML, die Hörprobe hat normale Bedienelemente.
   Bei "Bewegung reduzieren" steht alles still: Ranke ausgewachsen, Befehle fertig, Würfel ruhig. */
(() => {
  const wurzel = document.documentElement;
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const zufall = (a, b) => a + Math.random() * (b - a);
  /* fester Zufall, damit die Ranke nach jedem Neuaufbau gleich aussieht */
  const fest = n => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };

  /* ---------- Tagschicht und Nachtschicht ---------- */
  const schalter = document.querySelector('.schicht');
  if (schalter) {
    const istHell = () => wurzel.dataset.theme === 'light';
    const beschriften = () => {
      const ziel = istHell() ? 'Nachtschicht' : 'Tagschicht';
      schalter.querySelector('.schicht-text').textContent = ziel;
      schalter.setAttribute('aria-label', ziel + ' einschalten');
      const farbe = getComputedStyle(wurzel).getPropertyValue('--grund').trim();
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', farbe);
    };
    schalter.hidden = false;
    beschriften();
    schalter.addEventListener('click', () => {
      const neu = istHell() ? 'dark' : 'light';
      wurzel.dataset.theme = neu;
      try { localStorage.setItem('ctl.schicht', neu); } catch (e) { /* privates Fenster: dann ohne Merken */ }
      beschriften();
    });
  }

  /* ---------- Befehle tippen ---------- */
  const befehle = [...document.querySelectorAll('code[data-tippen]')];
  befehle.forEach(c => { c.dataset.text = c.textContent; });
  const nachTippen = document.querySelector('[data-nach-tippen]');
  const zeilen = document.querySelector('[data-zeilen]');
  const heroBefehle = befehle.filter(c => c.closest('.einstieg-raster'));
  if (!ruhig) {
    /* Die Befehle sind Kulisse: Vorleseprogramme lesen gleich die Überschrift und den Inhalt */
    befehle.forEach(c => { c.textContent = ''; c.closest('.befehl')?.setAttribute('aria-hidden', 'true'); });
    if (nachTippen) nachTippen.style.visibility = 'hidden';
    if (zeilen) zeilen.classList.add('wartet');
  }
  const imBild = e => { const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
  let kette = Promise.resolve();

  function nachher(code) {
    if (nachTippen && code === heroBefehle[0]) nachTippen.style.visibility = '';
    if (zeilen && code.closest('#kontakt')) {
      [...zeilen.children].forEach((s, n) => setTimeout(() => { s.style.opacity = '1'; s.style.transform = 'none'; }, ruhig ? 0 : 220 * n));
    }
  }

  function tippe(code) {
    if (!code || code.dataset.los) return;
    code.dataset.los = '1';
    kette = kette.then(() => new Promise(fertig => {
      const text = code.dataset.text;
      const ende = () => { nachher(code); fertig(); };
      if (ruhig || !imBild(code)) { code.textContent = text; ende(); return; }
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      cursor.setAttribute('aria-hidden', 'true');
      code.after(cursor);
      let i = 0;
      const schritt = () => {
        code.textContent = text.slice(0, ++i);
        if (i < text.length) { setTimeout(schritt, zufall(40, 90)); return; }
        setTimeout(() => {
          if (code.closest('.fuss')) cursor.classList.add('blinkt'); else cursor.remove();
          ende();
        }, 240);
      };
      setTimeout(schritt, 110);
    }));
  }
  /* whoami und das Motto kommen zusammen */
  const tippeAnker = code => { if (code === heroBefehle[0]) heroBefehle.forEach(tippe); else tippe(code); };

  /* ---------- Würfel ---------- */
  const buehne = document.querySelector('.buehne');
  const wuerfel = [...document.querySelectorAll('.wuerfel')].map((el, n) => ({
    el, koerper: el.querySelector('.koerper'), schwebe: el.querySelector('.schwebe'),
    ax: -24 + zufall(-8, 8), ay: 20 + n * 47, vx: zufall(4, 8) * (n % 2 ? 1 : -1), vy: zufall(9, 15) * (n % 3 ? 1 : -1),
    phase: zufall(0, 6.3), hub: zufall(5, 9), modus: 'treiben', ziel: null, halten: 0, hover: false
  }));
  let buehneSichtbar = true;
  const zeiger = { x: 0, y: 0, zx: 0, zy: 0 };
  const naechster = (ziel, ist) => ziel + 360 * Math.round((ist - ziel) / 360);
  const zuZiel = (w, zx, zy, dt, k) => {
    const f = 1 - Math.exp(-dt * k);
    w.ax += (naechster(zx, w.ax) - w.ax) * f;
    w.ay += (naechster(zy, w.ay) - w.ay) * f;
  };
  const zeichneWuerfel = (w, t) => {
    const hub = ruhig ? 0 : Math.sin(t * 0.9 + w.phase) * w.hub;
    w.koerper.style.transform = `rotateX(${(w.ax - zeiger.y * 9).toFixed(2)}deg) rotateY(${(w.ay + zeiger.x * 12).toFixed(2)}deg)`;
    w.schwebe.style.transform = `translate3d(0, ${hub.toFixed(2)}px, 0)`;
  };
  function wuerfelUpdate(dt, t) {
    zeiger.x += (zeiger.zx - zeiger.x) * (1 - Math.exp(-dt * 5));
    zeiger.y += (zeiger.zy - zeiger.y) * (1 - Math.exp(-dt * 5));
    for (const w of wuerfel) {
      if (w.hover && w.modus !== 'rollen') zuZiel(w, -16, 24, dt, 7);
      else if (w.modus === 'treiben') { w.ax += w.vx * dt; w.ay += w.vy * dt; }
      else if (w.modus === 'rollen') {
        w.ax += w.vx * dt; w.ay += w.vy * dt;
        const d = Math.exp(-dt * 1.6); w.vx *= d; w.vy *= d;
        if (Math.hypot(w.vx, w.vy) < 70) { w.modus = 'landen'; w.ziel = { x: Math.round(w.ax / 90) * 90 - 14, y: Math.round(w.ay / 90) * 90 + 22 }; }
      } else if (w.modus === 'landen') {
        zuZiel(w, w.ziel.x, w.ziel.y, dt, 6);
        if (Math.abs(naechster(w.ziel.x, w.ax) - w.ax) < 0.4 && Math.abs(naechster(w.ziel.y, w.ay) - w.ay) < 0.4) { w.modus = 'liegen'; w.halten = 4; }
      } else if (w.modus === 'liegen') {
        zuZiel(w, w.ziel.x, w.ziel.y, dt, 6);
        w.halten -= dt;
        if (w.halten <= 0) { w.modus = 'treiben'; w.vx = zufall(4, 8) * (Math.random() < 0.5 ? -1 : 1); w.vy = zufall(9, 15) * (Math.random() < 0.5 ? -1 : 1); }
      }
      zeichneWuerfel(w, t);
    }
  }
  wuerfel.forEach(w => {
    const an = () => { w.hover = true; }, aus = () => { w.hover = false; };
    w.el.addEventListener('pointerenter', an); w.el.addEventListener('pointerleave', aus);
    w.el.addEventListener('focus', an); w.el.addEventListener('blur', aus);
  });
  if (buehne) {
    if (!ruhig) {
      buehne.addEventListener('pointermove', e => {
        const r = buehne.getBoundingClientRect();
        zeiger.zx = Math.max(-1, Math.min(1, (e.clientX - r.left) / r.width * 2 - 1));
        zeiger.zy = Math.max(-1, Math.min(1, (e.clientY - r.top) / r.height * 2 - 1));
      });
      buehne.addEventListener('pointerleave', () => { zeiger.zx = 0; zeiger.zy = 0; });
    }
    new IntersectionObserver(e => { buehneSichtbar = e[0].isIntersecting; }).observe(buehne);
    wuerfel.forEach(w => zeichneWuerfel(w, 0));

    /* ./wuerfeln.sh: alle rollen, einer wird empfohlen */
    const knopf = buehne.querySelector('.wuerfeln');
    const ergebnis = buehne.querySelector('.wurf-ergebnis');
    if (knopf && wuerfel.length) {
      knopf.hidden = false;
      knopf.addEventListener('click', () => {
        const gewinner = wuerfel[Math.floor(Math.random() * wuerfel.length)];
        wuerfel.forEach(w => {
          w.el.classList.remove('gewaehlt');
          if (ruhig) { w.ax = Math.round(zufall(0, 4)) * 90 - 14; w.ay = Math.round(zufall(0, 4)) * 90 + 22; w.modus = 'treiben'; w.vx = w.vy = 0; zeichneWuerfel(w, 0); return; }
          w.modus = 'rollen';
          w.vx = zufall(420, 720) * (Math.random() < 0.5 ? -1 : 1);
          w.vy = zufall(520, 900) * (Math.random() < 0.5 ? -1 : 1);
        });
        ergebnis.textContent = ruhig ? '' : 'rollt …';
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = gewinner.el.getAttribute('href');
          link.textContent = gewinner.el.dataset.name + ' öffnen';
          ergebnis.textContent = 'Gewürfelt: ';
          ergebnis.append(link);
          gewinner.el.classList.add('gewaehlt');
        }, ruhig ? 0 : 2300);
      });
    }
  }

  /* ---------- Ranke mit Blüten und Bienen ---------- */
  const labor = document.querySelector('.labor');
  const svg = labor && labor.querySelector('.ranke');
  const BLUETEN = ['#ff6bd6', '#ffa04a', '#ffd447', '#f472b6', '#ff7a59', '#c084fc'];
  let ranke = null;

  function neu(name, attrs, eltern) {
    const e = document.createElementNS(NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (eltern) eltern.appendChild(e);
    return e;
  }

  function baueBiene(m, eltern) {
    const aussen = neu('g', { class: 'biene' }, eltern);
    const k = neu('g', { transform: `scale(${m})` }, aussen);
    neu('ellipse', { class: 'fluegel', cx: -2, cy: -8, rx: 5, ry: 7, fill: 'rgba(230,246,255,0.85)', stroke: '#2b1d4a', 'stroke-width': 1 }, k);
    neu('ellipse', { class: 'fluegel', cx: 5, cy: -7.5, rx: 4.2, ry: 6.2, fill: 'rgba(230,246,255,0.75)', stroke: '#2b1d4a', 'stroke-width': 1 }, k);
    neu('ellipse', { cx: 0, cy: 0, rx: 11, ry: 7.5, fill: '#ffd447', stroke: '#3b2410', 'stroke-width': 1.5 }, k);
    neu('path', { d: 'M-4.5 -6.6 Q -3.5 0 -4.5 6.6 M1.5 -7.4 Q 2.5 0 1.5 7.4', stroke: '#3b2410', 'stroke-width': 2.6, fill: 'none' }, k);
    neu('circle', { cx: 7.6, cy: -1.6, r: 1.4, fill: '#1c1230' }, k);
    neu('path', { d: 'M-11 0.5 L-15 1.5', stroke: '#3b2410', 'stroke-width': 1.6, 'stroke-linecap': 'round' }, k);
    return { el: aussen, x: 0, y: 0, richtung: 1, start: true };
  }

  function baue() {
    const altLaenge = ranke ? ranke.len : null;
    svg.textContent = '';
    const lr = labor.getBoundingClientRect();
    const oben = lr.top + scrollY, links = lr.left + scrollX;
    const W = labor.clientWidth, H = labor.scrollHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const huelle = document.querySelector('main .huelle');
    const hr = huelle.getBoundingClientRect();
    const inhaltLinks = hr.left - links + parseFloat(getComputedStyle(huelle).paddingLeft);
    const breit = innerWidth >= 1300, mittel = innerWidth >= 720;
    const g = breit ? { abstand: 60, amp: 20, dicke: 6, blatt: 26, blattAbst: 92, bluete: 15, zweig: true, biene: 1 }
      : mittel ? { abstand: 33, amp: 9, dicke: 4.5, blatt: 17, blattAbst: 78, bluete: 11, zweig: true, biene: 0.8 }
      : { abstand: 20, amp: 4.5, dicke: 3.4, blatt: 11, blattAbst: 64, bluete: 8.5, zweig: false, biene: 0.62 };
    const x0 = inhaltLinks - g.abstand;
    const anker = [...document.querySelectorAll('[data-anker]')].map(p => {
      const r = p.getBoundingClientRect();
      return { code: p.querySelector('code[data-tippen]'), y: r.top + scrollY - oben + r.height / 2, links: r.left - links };
    });
    if (!anker.length) return null;

    /* Stiel: sanfte Welle am linken Rand, vom ersten bis zum letzten Befehl */
    const yStart = anker[0].y - 46, yEnde = anker[anker.length - 1].y + 4;
    const xBei = y => x0 + g.amp * Math.sin(y / 170 + 0.8) + g.amp * 0.35 * Math.sin(y / 53 + 2);
    const pkte = [];
    for (let y = yStart; y < yEnde; y += 36) pkte.push([xBei(y), y]);
    pkte.push([xBei(yEnde), yEnde]);
    let d = `M${pkte[0][0].toFixed(1)} ${pkte[0][1].toFixed(1)}`;
    for (let i = 0; i < pkte.length - 1; i++) {
      const p0 = pkte[i - 1] || pkte[i], p1 = pkte[i], p2 = pkte[i + 1], p3 = pkte[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    const gStiel = neu('g', {}, svg);
    const pfade = [
      neu('path', { d, class: 'stiel-kontur', 'stroke-width': g.dicke + 3.2 }, gStiel),
      neu('path', { d, class: 'stiel', 'stroke-width': g.dicke }, gStiel),
      neu('path', { d, class: 'stiel-licht', 'stroke-width': Math.max(1, g.dicke / 3), transform: `translate(${(-g.dicke / 4).toFixed(2)} 0)` }, gStiel)
    ];
    const L = pfade[1].getTotalLength();
    pfade.forEach(p => { p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
    const tab = [];
    for (let s = 0; s <= L; s += 10) tab.push([s, pfade[1].getPointAtLength(s).y]);
    tab.push([L, pfade[1].getPointAtLength(L).y]);
    const lAnY = y => {
      if (y <= tab[0][1]) return 0;
      if (y >= tab[tab.length - 1][1]) return L;
      let lo = 0, hi = tab.length - 1;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (tab[m][1] < y) lo = m; else hi = m; }
      const [s0, y0] = tab[lo], [s1, y1] = tab[hi];
      return s0 + (s1 - s0) * ((y - y0) / Math.max(0.001, y1 - y0));
    };
    const punktBei = s => pfade[1].getPointAtLength(Math.max(0, Math.min(L, s)));

    /* Blätter und Locken, nicht direkt an den Blüten */
    const gBlaetter = neu('g', {}, svg);
    const blaetter = [];
    let seite = 1, n = 0;
    for (let s = 34; s < L - 12; s += g.blattAbst * (0.8 + fest(n + 1) * 0.4)) {
      n++;
      const p = punktBei(s), q = punktBei(s + 3);
      if (anker.some(a => Math.abs(a.y - p.y) < g.bluete * 2.6)) continue;
      const tangente = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
      const winkel = tangente - 180 + seite * (58 + fest(n) * 18);
      const lang = g.blatt * (0.8 + fest(n + 7) * 0.4), breite = lang * 0.42;
      const b = neu('g', { class: 'blatt', transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${winkel.toFixed(1)})` }, gBlaetter);
      const innen = neu('g', { class: 'blatt-innen' }, b);
      neu('path', { d: `M0 0 C ${lang * 0.25} ${-breite} ${lang * 0.72} ${-breite} ${lang} 0 C ${lang * 0.72} ${breite} ${lang * 0.25} ${breite} 0 0 Z` }, innen);
      neu('path', { class: 'ader', d: `M${lang * 0.08} 0 L${lang * 0.82} 0` }, innen);
      const eintrag = { el: b, y: p.y, offen: false, locke: null, lLaenge: 0 };
      if (n % 3 === 0) {
        const k = g.blatt * 0.75, w2 = tangente - 180 - seite * 70;
        const locke = neu('path', {
          class: 'locke', 'stroke-width': Math.max(1.4, g.dicke * 0.4),
          d: `M0 0 C ${k * 0.6} ${-k * 0.15} ${k} ${k * 0.25} ${k * 0.85} ${k * 0.62} S ${k * 0.32} ${k * 0.95} ${k * 0.38} ${k * 0.6} S ${k * 0.68} ${k * 0.45} ${k * 0.6} ${k * 0.68}`,
          transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${w2.toFixed(1)})`
        }, gBlaetter);
        eintrag.lLaenge = locke.getTotalLength();
        locke.style.strokeDasharray = eintrag.lLaenge;
        locke.style.strokeDashoffset = eintrag.lLaenge;
        eintrag.locke = locke;
      }
      blaetter.push(eintrag);
      seite *= -1;
    }

    /* Eine Blüte an jedem Befehl, auf breiten Schirmen mit Zweig */
    const gBlueten = neu('g', {}, svg);
    const blueten = anker.map((a, i) => {
      const p = punktBei(lAnY(a.y));
      const bx = g.zweig ? a.links - g.bluete - 9 : p.x;
      const by = a.y;
      let zweig = null;
      if (g.zweig) {
        const dz = `M${p.x.toFixed(1)} ${p.y.toFixed(1)} Q ${((p.x + bx) / 2).toFixed(1)} ${(by - 14).toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`;
        const teile = [neu('path', { d: dz, class: 'zweig-kontur' }, gBlueten), neu('path', { d: dz, class: 'zweig' }, gBlueten)];
        const laenge = teile[1].getTotalLength();
        teile.forEach(z => { z.style.strokeDasharray = laenge; z.style.strokeDashoffset = laenge; });
        zweig = { teile, laenge };
      }
      const farbe = BLUETEN[i % BLUETEN.length], r = g.bluete;
      const b = neu('g', { class: 'bluete', transform: `translate(${bx.toFixed(1)} ${by.toFixed(1)})` }, gBlueten);
      const knospe = neu('g', { class: 'knospe' }, b);
      neu('ellipse', { class: 'blatt-k', cx: 0, cy: 0, rx: r * 0.42, ry: r * 0.6, fill: '#86dc78' }, knospe);
      neu('ellipse', { cx: 0, cy: -r * 0.32, rx: r * 0.22, ry: r * 0.3, fill: farbe }, knospe);
      const innen = neu('g', { class: 'bluete-innen' }, b);
      for (let k = 0; k < 5; k++) neu('ellipse', { cx: 0, cy: -r * 0.55, rx: r * 0.42, ry: r * 0.6, transform: `rotate(${k * 72})`, fill: farbe, stroke: '#4a1340', 'stroke-width': 1.1, 'stroke-opacity': 0.55 }, innen);
      neu('circle', { r: r * 0.34, fill: '#ffd447', stroke: '#8a4b12', 'stroke-width': 1.2 }, innen);
      return { b, zweig, x: bx, y: by, code: a.code, offen: false };
    });

    const gBienen = neu('g', {}, svg);
    const bienen = (mittel ? [0, 1] : [0]).map(() => baueBiene(g.biene, gBienen));
    const neuR = { L, pfade, lAnY, punktBei, blaetter, blueten, bienen, oben, len: 0, letzterOff: null, g };
    if (altLaenge !== null || ruhig) neuR.len = ruhig ? L : lAnY(zielY(neuR));
    return neuR;
  }

  const zielY = r => {
    const ganzUnten = scrollY + innerHeight >= document.documentElement.scrollHeight - 4;
    return ganzUnten ? Infinity : scrollY - r.oben + innerHeight * 0.82;
  };

  function rankeUpdate(dt, t) {
    const r = ranke;
    if (!r) return;
    const zielL = ruhig ? r.L : r.lAnY(zielY(r));
    r.len += (zielL - r.len) * (1 - Math.exp(-dt * 4.5));
    if (Math.abs(zielL - r.len) < 0.5) r.len = zielL;
    const off = (r.L - r.len).toFixed(1);
    if (off !== r.letzterOff) { r.pfade.forEach(p => { p.style.strokeDashoffset = off; }); r.letzterOff = off; }
    const spitze = r.punktBei(r.len);
    for (const b of r.blaetter) {
      const auf = b.y <= spitze.y;
      if (auf !== b.offen) {
        b.offen = auf;
        b.el.classList.toggle('offen', auf);
        if (b.locke) b.locke.style.strokeDashoffset = auf ? 0 : b.lLaenge;
      }
    }
    let letzte = null;
    for (const b of r.blueten) {
      const auf = b.y <= spitze.y + 6;
      if (auf !== b.offen) {
        b.offen = auf;
        b.b.classList.toggle('offen', auf);
        if (b.zweig) b.zweig.teile.forEach(z => { z.style.strokeDashoffset = auf ? 0 : b.zweig.laenge; });
        if (auf) tippeAnker(b.code);
      }
      if (b.offen) letzte = b;
    }
    /* Biene 1 summt an der Spitze, Biene 2 an der zuletzt geöffneten Blüte */
    const ziele = ruhig
      ? [1, 3].map(i => { const b = r.blueten[Math.min(i, r.blueten.length - 1)]; return { x: b.x + 20, y: b.y - 16, zeigen: true }; })
      : [
        { x: spitze.x + 16 * Math.sin(t * 1.6), y: spitze.y - 12 + 7 * Math.sin(t * 2.3), zeigen: r.len > 20 },
        letzte ? { x: letzte.x + 22 * Math.cos(t * 0.8), y: letzte.y - 16 + 10 * Math.sin(t * 1.1), zeigen: true } : { zeigen: false }
      ];
    r.bienen.forEach((bi, i) => {
      const z = ziele[r.bienen.length === 1 ? 1 : i];
      if (!z.zeigen) { bi.el.style.opacity = '0'; return; }
      bi.el.style.opacity = '1';
      if (ruhig || bi.start) { bi.x = z.x; bi.y = z.y; bi.start = false; }
      const f = 1 - Math.exp(-dt * 3);
      const dx = (z.x - bi.x) * f;
      bi.x += dx; bi.y += (z.y - bi.y) * f;
      if (Math.abs(dx) > 0.15) bi.richtung = dx > 0 ? 1 : -1;
      bi.el.setAttribute('transform', `translate(${bi.x.toFixed(1)} ${bi.y.toFixed(1)}) scale(${bi.richtung} 1)`);
    });
  }

  if (svg) {
    try {
      ranke = baue();
      let wartet = 0;
      const neuBauen = () => { clearTimeout(wartet); wartet = setTimeout(() => { try { ranke = baue(); rankeUpdate(1, performance.now() / 1000); } catch (e) { /* Ranke ist Schmuck */ } }, 220); };
      addEventListener('resize', neuBauen);
      let hoehe = labor.scrollHeight;
      new ResizeObserver(() => { if (Math.abs(labor.scrollHeight - hoehe) > 2) { hoehe = labor.scrollHeight; neuBauen(); } }).observe(labor);
      if (ruhig) rankeUpdate(1, 0);
    } catch (e) {
      ranke = null;
    }
  }
  /* Ohne Ranke tippen die Befehle, sobald sie ins Bild kommen */
  if (!ranke) {
    const io = new IntersectionObserver(eintraege => eintraege.forEach(e => { if (e.isIntersecting) { tippeAnker(e.target); io.unobserve(e.target); } }), { rootMargin: '0px 0px -15% 0px' });
    befehle.forEach(c => { if (c.closest('[data-anker]')) io.observe(c); });
  }

  /* ---------- Hörprobe ---------- */
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
      balken.forEach((b, i) => b.classList.toggle('an', i / balken.length <= anteil));
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

  /* ---------- Takt ---------- */
  if (!ruhig) {
    let zuletzt = performance.now();
    const takt = jetzt => {
      const dt = Math.min(0.05, (jetzt - zuletzt) / 1000);
      zuletzt = jetzt;
      const t = jetzt / 1000;
      if (buehneSichtbar) wuerfelUpdate(dt, t);
      rankeUpdate(dt, t);
      requestAnimationFrame(takt);
    };
    requestAnimationFrame(takt);
  }
})();
