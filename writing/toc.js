// Section tree and reading progress for a writing post (styles in toc.css).
// Builds the tree from the article's <h2> headings, highlights the section in view,
// fills a text progress bar as the reader scrolls and shows an estimated reading time.
(function () {
  var article = document.querySelector('article');
  if (!article) return;
  var headings = Array.prototype.slice.call(article.querySelectorAll('h2'));
  if (headings.length < 2) return;

  var BAR_WIDTH = 28;
  var WORDS_PER_MINUTE = 265; // Medium's reading speed

  function headingText(h) {
    var num = h.querySelector('.num');
    var text = h.textContent;
    if (num) text = num.textContent.trim() + ' ' + text.replace(num.textContent, '');
    return text.replace(/\s+/g, ' ').trim();
  }
  function slug(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  var nav = document.createElement('nav');
  nav.className = 'toc';
  nav.setAttribute('aria-label', 'Contents');

  var h1 = article.querySelector('h1');
  if (h1) {
    var title = document.createElement('p');
    title.className = 'toc-title';
    title.textContent = h1.textContent.trim();
    nav.appendChild(title);
  }

  var toggle = document.createElement('button');
  toggle.className = 'toc-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'toc-list');
  toggle.innerHTML = 'TREE<span class="caret" aria-hidden="true"> ▾</span>';
  nav.appendChild(toggle);

  var list = document.createElement('ol');
  list.id = 'toc-list';
  var links = headings.map(function (h) {
    var text = headingText(h);
    if (!h.id) {
      var id = slug(text) || 'section';
      var n = 2;
      while (document.getElementById(id)) id = slug(text) + '-' + n++;
      h.id = id;
    }
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = text;
    a.addEventListener('click', function () { setOpen(false); });
    li.appendChild(a);
    list.appendChild(li);
    return a;
  });
  nav.appendChild(list);

  var progress = document.createElement('div');
  progress.className = 'toc-progress';
  progress.setAttribute('role', 'progressbar');
  progress.setAttribute('aria-label', 'Reading progress');
  progress.setAttribute('aria-valuemin', '0');
  progress.setAttribute('aria-valuemax', '100');
  var bar = document.createElement('span');
  bar.className = 'toc-bar';
  bar.setAttribute('aria-hidden', 'true');
  var pct = document.createElement('span');
  pct.className = 'toc-pct';
  progress.appendChild(bar);
  progress.appendChild(pct);
  nav.appendChild(progress);

  // Where the reading ends: after an element marked data-read-end, or else at the
  // References heading, or else at the end of the article. Both the word count and
  // the progress bar stop there.
  function readingEnd(root) {
    var mark = root.querySelector('[data-read-end]');
    if (mark) return { el: mark, after: true };
    var refs = Array.prototype.filter.call(root.querySelectorAll('h2'), function (h) {
      return /^references$/i.test(h.textContent.trim());
    })[0];
    return refs ? { el: refs, after: false } : null;
  }
  var end = readingEnd(article);

  // Count the words a reader reads, leaving out tables, diagrams and scripts.
  var copy = article.cloneNode(true);
  var copyEnd = readingEnd(copy);
  if (copyEnd && copy.lastChild) {
    var cut = document.createRange();
    if (copyEnd.after) cut.setStartAfter(copyEnd.el);
    else cut.setStartBefore(copyEnd.el);
    cut.setEndAfter(copy.lastChild);
    cut.deleteContents();
  }
  Array.prototype.forEach.call(copy.querySelectorAll('table, svg, script, style'), function (el) { el.remove(); });
  var words = copy.textContent.trim().split(/\s+/).length;
  var time = document.createElement('p');
  time.className = 'toc-time';
  time.textContent = Math.max(1, Math.round(words / WORDS_PER_MINUTE)) + ' MIN READ';
  nav.appendChild(time);

  // Put the tree beside the page's top-level wrapper, so the sticky bar spans the page.
  var anchor = article;
  while (anchor.parentElement && anchor.parentElement !== document.body) anchor = anchor.parentElement;
  document.body.insertBefore(nav, anchor);

  function setOpen(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }
  toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });

  // The bar is full once the end point reaches the bottom of the window.
  function endY() {
    if (!end) return article.getBoundingClientRect().bottom;
    var r = end.el.getBoundingClientRect();
    return end.after ? r.bottom : r.top;
  }

  function update() {
    var rect = article.getBoundingClientRect();
    var stop = endY();
    var scrollable = (stop - rect.top) - window.innerHeight;
    var p = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 1;
    var filled = Math.round(p * BAR_WIDTH);
    var percent = Math.round(p * 100);
    bar.textContent = '▓'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled);
    pct.textContent = (percent < 10 ? '0' : '') + percent + '%';
    progress.setAttribute('aria-valuenow', String(percent));

    var current = -1;
    headings.forEach(function (h, i) {
      if (h.getBoundingClientRect().top <= 140) current = i;
    });
    // At 100%, the last section that starts before the end point is the one being read,
    // even if its heading never scrolled to the top.
    if (percent === 100) {
      headings.forEach(function (h, i) {
        if (h.getBoundingClientRect().top < stop && i > current) current = i;
      });
    }
    // At the very bottom of the page the last heading may never reach the top.
    var root = document.documentElement;
    if (window.scrollY + window.innerHeight >= root.scrollHeight - 2) current = headings.length - 1;
    links.forEach(function (a, i) {
      if (i === current) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  var queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; update(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
