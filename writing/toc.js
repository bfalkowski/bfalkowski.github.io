// Section tree and reading progress for a writing post.
// Builds a list from the article's <h2> headings, highlights the section in view,
// and shows how far down the page the reader is. Shown only on screens wide enough
// to fit it beside the 760px column; narrow screens get nothing.
(function () {
  const article = document.querySelector("article");
  if (!article) return;
  const headings = Array.from(article.querySelectorAll("h2"));
  if (headings.length < 2) return;

  const css = `
    .toc { display: none; }
    @media (min-width: 1200px) {
      .toc {
        display: block; position: fixed; top: 96px; width: 190px;
        left: calc(50% - 380px - 230px);
        font: 12px/1.5 "Roboto Mono", ui-monospace, monospace; color: var(--muted);
      }
      .toc-label { letter-spacing: 0.08em; margin: 0 0 6px; color: var(--text); }
      .toc ol { list-style: none; margin: 0 0 18px; padding: 0; }
      .toc li { margin: 0; }
      .toc a { display: flex; gap: 6px; color: var(--muted); padding: 2px 0; }
      .toc a:hover { color: var(--accent); text-decoration: none; }
      .toc a::before { content: "\\2514"; flex: none; }
      .toc a.read { color: var(--text); }
      .toc a.here { color: var(--accent); font-weight: 600; }
      .toc-bar { white-space: nowrap; overflow: hidden; color: var(--accent); }
      .toc-meta { display: flex; justify-content: space-between; margin-top: 2px; }
    }
    article h2 { scroll-margin-top: 24px; }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const nav = document.createElement("nav");
  nav.className = "toc";
  nav.setAttribute("aria-label", "Sections");
  const label = document.createElement("p");
  label.className = "toc-label";
  label.textContent = "TREE";
  const list = document.createElement("ol");
  const links = headings.map((h) => {
    if (!h.id) h.id = slug(h.textContent);
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#" + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    list.appendChild(li);
    return a;
  });

  const bar = document.createElement("div");
  bar.className = "toc-bar";
  bar.setAttribute("aria-hidden", "true");
  const meta = document.createElement("div");
  meta.className = "toc-meta";
  const pct = document.createElement("span");
  const words = article.innerText.trim().split(/\s+/).length;
  const mins = document.createElement("span");
  mins.textContent = Math.max(1, Math.round(words / 230)) + " MIN READ";
  meta.append(pct, mins);
  nav.append(label, list, bar, meta);
  document.body.appendChild(nav);

  const CELLS = 26;
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1;
    const filled = Math.round(p * CELLS);
    bar.textContent = "▓".repeat(filled) + "░".repeat(CELLS - filled);
    pct.textContent = String(Math.round(p * 100)).padStart(2, "0") + "%";

    // The current section is the last heading above a line 30% down the window.
    // At the very bottom, the last section counts as current even if it is short.
    let here = -1;
    const line = window.innerHeight * 0.3;
    headings.forEach((h, i) => { if (h.getBoundingClientRect().top <= line) here = i; });
    if (p >= 0.999) here = headings.length - 1;
    links.forEach((a, i) => {
      a.classList.toggle("here", i === here);
      a.classList.toggle("read", i < here);
      if (i === here) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; update(); });
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("load", update);
  update();
})();
