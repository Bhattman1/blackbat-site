/*
 * Zero Day: one hidden cybersecurity word a day, six probes to crack it.
 *
 * Everyone gets the same word on the same calendar day (their own midnight).
 * Nothing leaves the browser except three anonymous counts sent through
 * js/attribution.js (started, finished, shared); streaks and stats live in
 * localStorage on this device only.
 */
(function () {
  'use strict';

  var MAX_PROBES = 6;
  /* Day 1. Month is 0-based: this is 13 November 2026. */
  var EPOCH = [2026, 10, 13];
  var STORE_KEY = 'bb.zeroday.v1';
  var SHARE_URL = 'https://blackbatterminal.com/zeroday/';
  /* Rank for cracking it with 1, 2, ... 6 probes used. */
  var RANKS = ['ZERO DAY', 'ROOT ACCESS', 'ADMIN', 'POWER USER', 'GUEST', 'SCRIPT KIDDIE'];
  var KEY_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
  /* Time for the last cell of a row to finish its reveal. */
  var REVEAL_STEP_MS = 80;

  function rot13(s) {
    return s.replace(/[A-Z]/g, function (c) {
      return String.fromCharCode((c.charCodeAt(0) - 52) % 26 + 65);
    });
  }

  var WORDS = (window.ZD_WORDS || []).map(function (e) {
    return { word: rot13(e[0]), cat: e[1], hint: e[2], def: e[3] };
  });
  if (!WORDS.length) return;

  function $(id) { return document.getElementById(id); }
  function pad(n, len) { n = String(n); while (n.length < len) n = '0' + n; return n; }

  /* Calendar days since the epoch, on the visitor's own clock. */
  function dayNumber(date) {
    var d = date || new Date();
    var today = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    var start = Date.UTC(EPOCH[0], EPOCH[1], EPOCH[2]);
    return Math.max(1, Math.round((today - start) / 86400000) + 1);
  }
  function entryForDay(day) { return WORDS[(day - 1) % WORDS.length]; }

  function track(event, props) {
    if (typeof window.bbTrack === 'function') window.bbTrack(event, props);
  }

  /* ------------------------------------------------------------- storage */
  function load() {
    try { return JSON.parse(window.localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
  }
  var data = load();
  if (!data.stats) data.stats = { played: 0, wins: 0, streak: 0, best: 0, dist: [0, 0, 0, 0, 0, 0], lastWon: 0 };
  function save() {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) {}
  }

  var today = dayNumber();

  /* A streak only counts while yesterday (or today) was a win. */
  function liveStreak() {
    return data.stats.lastWon >= today - 1 ? data.stats.streak : 0;
  }

  /* ---------------------------------------------------------------- game */
  /* rows: {type:'probe', word} or {type:'hint'}. A hint spends a probe. */
  var g = null;

  function newGame(mode, entry, saved) {
    g = {
      mode: mode,
      day: today,
      entry: entry,
      rows: saved ? saved.rows.slice() : [],
      cur: '',
      done: saved ? !!saved.done : false,
      won: saved ? !!saved.won : false,
      busy: false
    };
  }

  function hintUsed() { return g.rows.some(function (r) { return r.type === 'hint'; }); }

  /* hit = right place, near = in the word elsewhere, miss = not in it. */
  function evaluate(guess, answer) {
    var out = [], left = {}, i;
    for (i = 0; i < answer.length; i++) {
      if (guess[i] === answer[i]) out[i] = 'hit';
      else left[answer[i]] = (left[answer[i]] || 0) + 1;
    }
    for (i = 0; i < answer.length; i++) {
      if (out[i]) continue;
      if (left[guess[i]]) { out[i] = 'near'; left[guess[i]]--; }
      else out[i] = 'miss';
    }
    return out;
  }

  function persistDaily() {
    if (g.mode !== 'daily') return;
    data.daily = { day: g.day, rows: g.rows, done: g.done, won: g.won, counted: !!(data.daily && data.daily.day === g.day && data.daily.counted) };
    save();
  }

  function recordDailyResult() {
    if (g.mode !== 'daily' || (data.daily && data.daily.counted)) return;
    var s = data.stats;
    s.played++;
    if (g.won) {
      s.wins++;
      s.streak = s.lastWon === g.day - 1 ? s.streak + 1 : 1;
      s.lastWon = g.day;
      s.best = Math.max(s.best, s.streak);
      s.dist[g.rows.length - 1]++;
    } else {
      s.streak = 0;
    }
    data.daily.counted = true;
    save();
  }

  /* -------------------------------------------------------------- render */
  var board = $('zd-board'), keys = $('zd-keys'), toastEl = $('zd-toast'), toastTimer;

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 1700);
  }

  var STATE_WORDS = { hit: 'locked in', near: 'leaked', miss: 'denied' };

  function renderBoard(revealRow) {
    var len = g.entry.word.length;
    board.style.setProperty('--len', len);
    board.textContent = '';
    for (var r = 0; r < MAX_PROBES; r++) {
      var row = g.rows[r];
      var el = document.createElement('div');
      if (row && row.type === 'hint') {
        el.className = 'zd-row zd-row--hint';
        el.textContent = 'HINT DECRYPTED';
        board.appendChild(el);
        continue;
      }
      el.className = 'zd-row';
      var states = row ? evaluate(row.word, g.entry.word) : null;
      var isCurrent = !row && r === g.rows.length && !g.done;
      for (var c = 0; c < len; c++) {
        var cell = document.createElement('div');
        cell.className = 'zd-cell';
        if (row) {
          cell.textContent = row.word[c];
          cell.dataset.state = states[c];
          cell.setAttribute('aria-label', row.word[c] + ', ' + STATE_WORDS[states[c]]);
          if (r === revealRow) {
            cell.classList.add('is-reveal');
            cell.style.animationDelay = (c * REVEAL_STEP_MS) + 'ms';
          }
        } else if (isCurrent) {
          if (g.cur[c]) { cell.textContent = g.cur[c]; cell.classList.add('is-filled'); }
          else if (c === g.cur.length) cell.classList.add('is-cursor');
        }
        el.appendChild(cell);
      }
      if (row && g.won && r === g.rows.length - 1 && r !== revealRow) el.classList.add('is-win');
      board.appendChild(el);
    }
  }

  function renderKeys() {
    var best = {}, rank = { miss: 1, near: 2, hit: 3 };
    g.rows.forEach(function (row) {
      if (row.type !== 'probe') return;
      evaluate(row.word, g.entry.word).forEach(function (state, i) {
        var ch = row.word[i];
        if (!best[ch] || rank[state] > rank[best[ch]]) best[ch] = state;
      });
    });
    Array.prototype.forEach.call(keys.querySelectorAll('[data-key]'), function (k) {
      var ch = k.dataset.key;
      if (best[ch]) k.dataset.state = best[ch]; else delete k.dataset.state;
    });
  }

  function renderHud() {
    var used = g.rows.length;
    var pct = !g.won && g.done ? 100 : Math.round(used / MAX_PROBES * 100);
    $('zd-trace-fill').style.width = pct + '%';
    $('zd-trace-pct').textContent = pct + '%';
    $('zd-trace').classList.toggle('is-hot', pct >= 67);
    $('zd-trace').setAttribute('aria-label', 'Trace ' + pct + ' percent');
    $('zd-mode').textContent = g.mode === 'daily' ? 'DAY #' + pad(g.day, 3) : 'PRACTICE';

    var tag = $('zd-intel-tag');
    tag.textContent = g.entry.cat + ' ';
    var span = document.createElement('span');
    span.textContent = '· ' + g.entry.word.length + ' LETTERS';
    tag.appendChild(span);

    var used1 = hintUsed(), btn = $('zd-hint-btn'), hint = $('zd-intel-hint');
    hint.hidden = !used1;
    hint.textContent = used1 ? g.entry.hint : '';
    btn.hidden = used1 || g.done;
    var spare = MAX_PROBES - used > 1;
    btn.disabled = !spare;
    btn.textContent = spare ? 'HINT · −1 PROBE' : 'NO PROBE TO SPARE';
  }

  function renderResult() {
    var box = $('zd-result');
    box.hidden = !g.done;
    keys.hidden = g.done;
    if (!g.done) return;
    box.classList.toggle('is-win', g.won);
    box.classList.toggle('is-lose', !g.won);
    $('zd-result-kicker').textContent = g.won ? 'ACCESS GRANTED' : 'CONNECTION TERMINATED';
    $('zd-result-rank').textContent = g.won ? RANKS[g.rows.length - 1] : 'TRACED';
    $('zd-result-line').textContent = g.won
      ? 'Cracked with ' + g.rows.length + ' of ' + MAX_PROBES + ' probes' + (hintUsed() ? ', hint used.' : '.')
      : 'The trace hit 100%. The word was:';
    $('zd-result-word').textContent = g.entry.word;
    $('zd-result-cat').textContent = g.entry.cat;
    $('zd-result-def').textContent = g.entry.def;
    $('zd-share').hidden = g.mode !== 'daily';
    $('zd-next').hidden = g.mode !== 'daily';
    $('zd-again').textContent = g.mode === 'daily' ? 'KEEP GOING: PRACTICE ∞' : 'NEXT WORD ▶';
    $('zd-again').className = 'zd-btn ' + (g.mode === 'daily' ? 'zd-btn--ghost' : 'zd-btn--primary');
  }

  function renderGame(revealRow) {
    renderBoard(revealRow);
    renderKeys();
    renderHud();
    renderResult();
  }

  function renderHome() {
    var d = data.daily && data.daily.day === today ? data.daily : null;
    var start = $('zd-start');
    start.textContent = '';
    if (d && d.done) {
      start.append('SEE TODAY’S RESULT');
      var small = document.createElement('small');
      small.id = 'zd-home-countdown';
      start.appendChild(small);
    } else if (d && d.rows.length) {
      start.append('▶ RESUME BREACH');
      var s2 = document.createElement('small');
      s2.textContent = d.rows.length + ' of ' + MAX_PROBES + ' probes used';
      start.appendChild(s2);
    } else {
      start.append('▶ START TODAY’S BREACH');
    }
    $('zd-daynum').textContent = 'DAY #' + pad(today, 3);
    var streak = liveStreak(), el = $('zd-streak');
    el.hidden = streak < 1;
    el.textContent = '🔥 ' + streak + '-DAY STREAK';
    el.classList.toggle('is-hot', streak >= 2);
    tick();
  }

  function show(screen) {
    document.body.dataset.screen = screen;
    window.scrollTo(0, 0);
    if (screen === 'home') renderHome();
  }

  /* --------------------------------------------------------------- input */
  function shakeCurrentRow() {
    var row = board.children[g.rows.length];
    if (!row) return;
    row.classList.remove('is-shake');
    void row.offsetWidth;
    row.classList.add('is-shake');
  }

  function finish() {
    g.busy = true;
    var revealMs = g.entry.word.length * REVEAL_STEP_MS + 380;
    persistDaily();
    recordDailyResult();
    track('zeroday_finished', { mode: g.mode, day: g.day, won: g.won, probes: g.rows.length, hint_used: hintUsed() });
    setTimeout(function () {
      g.busy = false;
      renderGame();
      if (g.won) celebrate();
      $('zd-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, revealMs);
  }

  function submit() {
    var len = g.entry.word.length;
    if (g.cur.length < len) {
      shakeCurrentRow();
      toast('Need ' + len + ' letters');
      return;
    }
    if (!g.rows.length) track('zeroday_started', { mode: g.mode, day: g.day });
    g.rows.push({ type: 'probe', word: g.cur });
    var won = g.cur === g.entry.word;
    g.cur = '';
    g.won = won;
    g.done = won || g.rows.length >= MAX_PROBES;
    var revealed = g.rows.length - 1;
    if (g.done) {
      /* Show the row and the trace now, the result card after the reveal. */
      renderBoard(revealed);
      renderKeys();
      renderHud();
      finish();
    } else {
      persistDaily();
      renderGame(revealed);
    }
  }

  function press(key) {
    if (!g || g.done || g.busy || document.body.dataset.screen !== 'game') return;
    if (key === 'ENTER') return submit();
    if (key === 'BACK') {
      if (g.cur) { g.cur = g.cur.slice(0, -1); renderBoard(); }
      return;
    }
    if (/^[A-Z]$/.test(key) && g.cur.length < g.entry.word.length) {
      g.cur += key;
      renderBoard();
    }
  }

  function useHint() {
    if (g.done || g.busy || hintUsed() || MAX_PROBES - g.rows.length <= 1) return;
    if (!g.rows.length) track('zeroday_started', { mode: g.mode, day: g.day });
    g.rows.push({ type: 'hint' });
    persistDaily();
    renderGame();
  }

  function buildKeys() {
    KEY_ROWS.forEach(function (letters, i) {
      var row = document.createElement('div');
      row.className = 'zd-keys__row';
      var add = function (label, key, wide, aria) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'zd-key' + (wide ? ' zd-key--wide' : '');
        b.textContent = label;
        b.dataset[wide ? 'action' : 'key'] = key;
        if (aria) b.setAttribute('aria-label', aria);
        row.appendChild(b);
      };
      if (i === 2) add('ENTER', 'ENTER', true, 'Send probe');
      letters.split('').forEach(function (ch) { add(ch, ch, false); });
      if (i === 2) add('⌫', 'BACK', true, 'Delete letter');
      keys.appendChild(row);
    });
    keys.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) press(b.dataset.key || b.dataset.action);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey || document.querySelector('dialog[open]')) return;
    if (document.body.dataset.screen !== 'game') return;
    /* Enter on a focused button should press that button, not send a probe. */
    var onButton = e.target && e.target.closest && e.target.closest('button, a');
    if (e.key === 'Enter') { if (!onButton || keys.contains(e.target)) { e.preventDefault(); press('ENTER'); } return; }
    if (e.key === 'Backspace') return press('BACK');
    if (/^[a-zA-Z]$/.test(e.key)) press(e.key.toUpperCase());
  });

  /* --------------------------------------------------------------- flows */
  function startDaily() {
    var saved = data.daily && data.daily.day === today ? data.daily : null;
    newGame('daily', entryForDay(today), saved);
    show('game');
    renderGame();
    if (!saved && !data.seenHelp) {
      data.seenHelp = true;
      save();
      openDialog('help');
    }
  }

  function startPractice() {
    var todays = entryForDay(today), entry;
    do { entry = WORDS[Math.floor(Math.random() * WORDS.length)]; }
    while (entry === todays || (g && entry === g.entry));
    newGame('practice', entry, null);
    show('game');
    renderGame();
  }

  function shareText() {
    var head = 'ZERO DAY #' + g.day + ' 🦇 ' + (g.won ? g.rows.length : 'X') + '/' + MAX_PROBES +
      ' · ' + (g.won ? RANKS[g.rows.length - 1] : 'TRACED');
    var icon = { hit: '🟢', near: '🟡', miss: '⚫' };
    var lines = g.rows.map(function (row) {
      if (row.type === 'hint') return '💡';
      return evaluate(row.word, g.entry.word).map(function (s) { return icon[s]; }).join('');
    });
    var streak = liveStreak();
    return [head].concat(lines, streak >= 2 ? ['🔥 ' + streak + '-day streak'] : [], [SHARE_URL]).join('\n');
  }

  function share() {
    var text = shareText();
    var touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (navigator.share && touch) {
      navigator.share({ text: text }).then(function () {
        track('zeroday_shared', { day: g.day, method: 'sheet' });
      }).catch(function () {});
      return;
    }
    var done = function () { toast('Copied. Paste it anywhere.'); track('zeroday_shared', { day: g.day, method: 'copy' }); };
    var fallback = function () {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast('Couldn’t copy'); }
      ta.remove();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }

  function celebrate() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var layer = document.createElement('div');
    layer.className = 'zd-bits';
    for (var i = 0; i < 36; i++) {
      var s = document.createElement('span');
      s.textContent = Math.random() < 0.5 ? '1' : '0';
      s.style.left = (Math.random() * 100) + '%';
      s.style.animationDelay = (Math.random() * 0.6) + 's';
      s.style.fontSize = (11 + Math.random() * 10) + 'px';
      layer.appendChild(s);
    }
    document.body.appendChild(layer);
    setTimeout(function () { layer.remove(); }, 2600);
  }

  /* ------------------------------------------------------------- dialogs */
  function renderStats() {
    var s = data.stats;
    $('zd-stat-played').textContent = s.played;
    $('zd-stat-win').textContent = s.played ? Math.round(s.wins / s.played * 100) : 0;
    $('zd-stat-streak').textContent = liveStreak();
    $('zd-stat-best').textContent = s.best;
    var dist = $('zd-dist'), max = Math.max.apply(null, s.dist.concat(1));
    var d = data.daily && data.daily.day === today && data.daily.won ? data.daily.rows.length : 0;
    dist.textContent = '';
    s.dist.forEach(function (n, i) {
      var row = document.createElement('div');
      row.className = 'zd-dist__row';
      var label = document.createElement('span');
      label.textContent = i + 1;
      var bar = document.createElement('div');
      bar.className = 'zd-dist__bar' + (d === i + 1 ? ' is-today' : '');
      bar.style.width = Math.max(8, Math.round(n / max * 100)) + '%';
      bar.textContent = n;
      row.appendChild(label);
      row.appendChild(bar);
      dist.appendChild(row);
    });
  }

  function openDialog(name) {
    var dlg = $('zd-dialog-' + name);
    if (!dlg || dlg.open) return;
    if (name === 'stats') renderStats();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }

  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-open]');
    if (opener) return openDialog(opener.dataset.open);
    var closer = e.target.closest('[data-close]');
    if (closer) return closer.closest('dialog').close();
    /* A click on the backdrop lands on the dialog element, outside its box. */
    if (e.target.tagName === 'DIALOG') {
      var r = e.target.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.target.close();
    }
  });

  /* ----------------------------------------------------------- countdown */
  function tick() {
    var now = new Date();
    if (dayNumber(now) !== today) {
      /* Midnight passed with the page open: a new word is ready. */
      today = dayNumber(now);
      if (document.body.dataset.screen === 'home') renderHome();
    }
    var next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    var s = Math.max(0, Math.floor((next - now) / 1000));
    var text = pad(Math.floor(s / 3600), 2) + ':' + pad(Math.floor(s % 3600 / 60), 2) + ':' + pad(s % 60, 2);
    $('zd-countdown').textContent = text;
    var home = $('zd-home-countdown');
    if (home) home.textContent = 'Next word in ' + text;
  }

  /* ---------------------------------------------------------------- boot */
  function hexdump() {
    var out = [], hex = '0123456789abcdef';
    for (var l = 0; l < 16; l++) {
      var line = pad((l * 16).toString(16), 6) + '  ';
      for (var b = 0; b < 20; b++) line += hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)] + ' ';
      out.push(line);
    }
    $('zd-hex').textContent = out.join('\n');
  }

  buildKeys();
  hexdump();
  $('zd-start').addEventListener('click', startDaily);
  $('zd-practice').addEventListener('click', startPractice);
  $('zd-again').addEventListener('click', startPractice);
  $('zd-back').addEventListener('click', function () { show('home'); });
  $('zd-hint-btn').addEventListener('click', useHint);
  $('zd-share').addEventListener('click', share);
  renderHome();
  setInterval(tick, 1000);
})();
