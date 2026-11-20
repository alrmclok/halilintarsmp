// HalilintarSMP search box (Part L). Plain JavaScript, no library. Base.astro loads it on every page.
// Two jobs:
// 1) The dropdown. It loads /search.json (a list made when the site builds) and shows the best matches while typing.
// 2) The filter. /members/, /fandoms/ and /news/ hide the rows that do not match when the address ends in ?q=words.
(function () {
  'use strict';

  var FILTER_PAGES = ['/members', '/fandoms', '/news'];
  var SEARCH_IN = [
    { label: 'Fandoms', path: '/fandoms/' },
    { label: 'Members', path: '/members/' },
    { label: 'Posts', path: '/news/' },
  ];
  var KIND_ORDER = { member: 0, fandom: 1, post: 2 };
  var MAX_MATCHES = 6; // most matches shown in the dropdown
  var MIN_SCORE = 30; // a match scoring less than this is not shown

  // ---------- matching ----------

  // Lowercase, no accents, only letters and numbers: "Pokémon  Go!" becomes "pokemon go".
  function norm(s) {
    return String(s)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  // How many small mistakes are allowed for a typed word of this length.
  function allowedTypos(word) {
    return word.length <= 3 ? 0 : word.length <= 5 ? 1 : 2;
  }

  // How many single-letter changes turn a into b (a wrong, missing, extra or swapped letter counts as 1).
  function dist(a, b) {
    var d = [], i, j;
    for (i = 0; i <= a.length; i++) d[i] = [i];
    for (j = 0; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) {
      for (j = 1; j <= b.length; j++) {
        var cost = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
        }
      }
    }
    return d[a.length][b.length];
  }

  // Are the letters of q inside t in the same order, with gaps allowed? ("grn" is inside "grian")
  function inOrder(q, t) {
    var k = 0;
    for (var i = 0; i < t.length && k < q.length; i++) {
      if (t[i] === q[k]) k++;
    }
    return k === q.length;
  }

  // How well does the typed text q match the text t? Both are already cleaned with norm(). 0 = not at all.
  function scoreText(q, t) {
    if (!q || !t) return 0;
    if (t === q) return 100; // the same
    if (t.indexOf(q) === 0) return 90; // t starts with it
    var words = t.split(' ');
    var qWords = q.split(' ');
    var i, j;
    for (i = 0; i < words.length; i++) {
      if (words[i].indexOf(q) === 0) return 80; // a word in t starts with it
    }
    if (qWords.length > 1) {
      var every = qWords.every(function (qw) {
        return words.some(function (w) { return w.indexOf(qw) === 0; });
      });
      if (every) return 75; // every typed word starts a word in t, in any order
    }
    if (t.indexOf(q) > -1) return 70; // it is somewhere inside t
    var squeezed = q.replace(/ /g, '');
    if (squeezed.length >= 3 && t.length <= 30 && inOrder(squeezed, t.replace(/ /g, ''))) return 50; // letters in order, gaps allowed
    if (q.length >= 4) {
      // a few typos: compare with the start of t and with the start of each word in t
      var allowed = allowedTypos(q);
      var best = dist(q, t.slice(0, q.length));
      for (j = 0; j < words.length; j++) {
        best = Math.min(best, dist(q, words[j]), dist(q, words[j].slice(0, q.length)));
      }
      if (best <= allowed) return 40 - best * 5;
    }
    return 0;
  }

  // The best score of an entry: its name counts fully, its extra words (handle, fandoms) count a bit less.
  function scoreEntry(q, entry) {
    var best = scoreText(q, entry.n);
    for (var i = 0; i < entry.x.length; i++) {
      best = Math.max(best, scoreText(q, entry.x[i]) - 10);
    }
    return best;
  }

  function prepare(list) {
    return list.map(function (it) {
      return { kind: it.kind, name: it.name, url: it.url, n: norm(it.name), x: (it.extra || []).map(norm) };
    });
  }

  function findMatches(q, data) {
    return data
      .map(function (entry) { return { entry: entry, score: scoreEntry(q, entry) }; })
      .filter(function (m) { return m.score >= MIN_SCORE; })
      .sort(function (a, b) {
        return b.score - a.score ||
          KIND_ORDER[a.entry.kind] - KIND_ORDER[b.entry.kind] ||
          a.entry.name.localeCompare(b.entry.name);
      })
      .slice(0, MAX_MATCHES)
      .map(function (m) { return m.entry; });
  }

  // ---------- the filter on /members/, /fandoms/ and /news/ ----------

  function rowMatches(words, text) {
    var rowWords = text.split(' ');
    return words.every(function (w) {
      if (text.indexOf(w) > -1) return true;
      if (w.length < 4) return false;
      var allowed = allowedTypos(w);
      return rowWords.some(function (rw) { return dist(w, rw.slice(0, w.length)) <= allowed; });
    });
  }

  // The text of a row that the filter looks at. Each list only searches its own kind:
  // Members: name and handle (not fandoms). Fandoms: the fandom name. Posts: title and summary (not the author or date).
  function searchedText(path, row) {
    var title = row.querySelector('.row-title');
    var subs = row.querySelectorAll('.row-sub');
    var t = title ? title.textContent : '';
    if (path === '/members' && subs[0]) return t + ' ' + subs[0].textContent.split('\u00B7')[0]; // "handle \u00B7 fandoms": keep the handle
    if (path === '/news' && subs[1]) return t + ' ' + subs[1].textContent; // second line is the summary
    return t;
  }

  function filterPage() {
    var path = location.pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '');
    if (FILTER_PAGES.indexOf(path) < 0) return;
    var raw = (new URLSearchParams(location.search).get('q') || '').trim();
    var q = norm(raw);
    if (!q) return;
    var rows = document.querySelectorAll('.page .row');
    if (!rows.length) return;

    var box = document.getElementById('site-search');
    if (box) box.value = raw;

    var words = q.split(' ');
    var visible = [];
    rows.forEach(function (row) {
      var show = rowMatches(words, norm(searchedText(path, row)));
      row.hidden = !show;
      row.style.borderBottom = '';
      if (show) visible.push(row);
    });
    if (visible.length) visible[visible.length - 1].style.borderBottom = '0';

    var note = document.createElement('p');
    note.className = 'filter-note';
    note.textContent = visible.length
      ? 'Showing ' + visible.length + ' of ' + rows.length + ' for \u201C' + raw + '\u201D. '
      : 'Nothing found for \u201C' + raw + '\u201D. ';
    var all = document.createElement('a');
    all.href = location.pathname;
    all.textContent = 'Show all';
    note.appendChild(all);
    rows[0].parentNode.insertBefore(note, rows[0]);
  }

  // ---------- the dropdown ----------

  function startDropdown() {
    var form = document.querySelector('form.search');
    var input = document.getElementById('site-search');
    var drop = document.getElementById('search-drop');
    if (!form || !input || !drop) return;

    var data = null; // the prepared search list; null until it is loaded
    var loading = false;
    var items = []; // the links in the dropdown, top to bottom
    var matchCount = 0; // how many of them are real matches (the rest are the "Search in" lines)
    var active = -1; // the highlighted link, -1 = none

    function load() {
      if (loading) return;
      loading = true;
      fetch('/search.json')
        .then(function (r) { return r.json(); })
        .then(function (list) { data = prepare(list); render(); })
        .catch(function () { data = []; render(); }); // no list: only the "Search in" lines show
    }

    function close() {
      drop.hidden = true;
      active = -1;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
    }

    function setActive(i) {
      if (items[active]) {
        items[active].classList.remove('active');
        items[active].removeAttribute('aria-selected');
      }
      active = i;
      if (items[active]) {
        items[active].classList.add('active');
        items[active].setAttribute('aria-selected', 'true');
        input.setAttribute('aria-activedescendant', items[active].id);
        items[active].scrollIntoView({ block: 'nearest' });
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    }

    function addItem(name, kind, href, extraClass) {
      var a = document.createElement('a');
      a.className = 'sd-item' + (extraClass ? ' ' + extraClass : '');
      a.id = 'sd-' + items.length;
      a.href = href;
      a.tabIndex = -1;
      a.setAttribute('role', 'option');
      var n = document.createElement('span');
      n.className = 'sd-name';
      n.textContent = name;
      a.appendChild(n);
      if (kind) {
        var k = document.createElement('span');
        k.className = 'sd-kind';
        k.textContent = kind;
        a.appendChild(k);
      }
      drop.appendChild(a);
      items.push(a);
    }

    function render() {
      var raw = input.value.trim();
      var q = norm(raw);
      drop.textContent = '';
      items = [];
      active = -1;
      input.removeAttribute('aria-activedescendant');
      if (!q) { close(); return; }

      var matches = data ? findMatches(q, data) : [];
      matchCount = matches.length;
      matches.forEach(function (m) { addItem(m.name, m.kind, m.url); });
      SEARCH_IN.forEach(function (s, i) {
        addItem('Search \u201C' + raw + '\u201D in ' + s.label, '', s.path + '?q=' + encodeURIComponent(raw), i === 0 && matches.length ? 'sd-sep' : '');
      });
      drop.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }

    // Enter or GO: the highlighted link; if none, the first match; if there are no matches, search the Members.
    function go() {
      var raw = input.value.trim();
      if (!norm(raw)) return;
      if (items[active]) { location.href = items[active].href; return; }
      if (matchCount) { location.href = items[0].href; return; }
      location.href = '/members/?q=' + encodeURIComponent(raw);
    }

    input.addEventListener('focus', function () {
      load();
      if (input.value.trim()) render();
    });
    input.addEventListener('input', function () {
      load();
      render();
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      if (drop.hidden) render();
      if (!items.length) return;
      e.preventDefault();
      var next = e.key === 'ArrowDown' ? active + 1 : active - 1;
      if (next >= items.length) next = 0;
      if (next < 0) next = items.length - 1;
      setActive(next);
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      go();
    });
    document.addEventListener('pointerdown', function (e) {
      if (!form.contains(e.target)) close();
    });
    document.addEventListener('focusin', function (e) {
      if (!form.contains(e.target)) close();
    });
  }

  filterPage();
  startDropdown();
})();
