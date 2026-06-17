// Shared client UI: mobile nav toggle and scroll-reveal. Loaded on every page.
// Motion is intentionally light and fully degrades under reduced-motion.

// --- Mobile navigation -------------------------------------------------------
const toggle = document.querySelector("[data-nav-toggle]");
const navEl = document.querySelector("[data-nav]");

if (toggle && navEl) {
  toggle.addEventListener("click", () => {
    const open = navEl.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Close the menu after following a link.
  navEl.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navEl.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// --- Theme toggle ------------------------------------------------------------
const themeBtn = document.querySelector("[data-theme-toggle]");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* ignore storage errors */
    }
  });
}

// --- Scroll reveal -----------------------------------------------------------
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const targets = document.querySelectorAll("[data-reveal]");

if (reduce || !("IntersectionObserver" in window)) {
  targets.forEach((el) => el.classList.add("is-in"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  targets.forEach((el) => observer.observe(el));
}

// --- Small HTML escaper for values re-inserted via innerHTML -----------------
function esc(value) {
  return String(value ?? "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
  );
}

// --- Route index (lazy; shared by the palette, random, and favorites) --------
let routeIndexPromise = null;
function loadRouteIndex() {
  if (!routeIndexPromise) {
    routeIndexPromise = fetch("/assets/routes-index.json")
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []);
  }
  return routeIndexPromise;
}

// --- Favorites (localStorage) ------------------------------------------------
const FAV_KEY = "mx:favorites";
function readFavs() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch {
    return [];
  }
}
function writeFavs(list) {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(list));
  } catch {
    /* ignore storage errors */
  }
}

function syncFavButton(btn) {
  const on = readFavs().some((f) => f.id === btn.dataset.id);
  btn.classList.toggle("is-saved", on);
  btn.setAttribute("aria-pressed", String(on));
  const text = btn.querySelector(".fav-text");
  if (text) text.textContent = on ? "Saved" : "Save";
}

document.querySelectorAll("[data-fav]").forEach((btn) => {
  syncFavButton(btn);
  btn.addEventListener("click", () => {
    const list = readFavs();
    const i = list.findIndex((f) => f.id === btn.dataset.id);
    if (i >= 0) list.splice(i, 1);
    else list.unshift({ id: btn.dataset.id, slug: btn.dataset.slug, label: btn.dataset.label });
    writeFavs(list);
    syncFavButton(btn);
  });
});

// Saved-routes list on the home page (only shown if there are any).
const favSection = document.querySelector("[data-fav-section]");
const favList = document.querySelector("[data-fav-list]");
if (favSection && favList) {
  const favs = readFavs();
  if (favs.length) {
    favList.innerHTML = favs
      .map(
        (f) =>
          `<a class="card card-link route-card" href="/routes/${encodeURIComponent(f.slug)}"><span class="name" style="font-family:var(--font-display);font-weight:700;font-size:1.2rem">${esc(f.id)}</span><p style="margin:8px 0 0">${esc(f.label)}.</p></a>`
      )
      .join("");
    favSection.hidden = false;
  }
}

// --- Copy-link buttons -------------------------------------------------------
document.querySelectorAll("[data-copy-link]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const text = btn.querySelector(".copy-text");
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this link:", url);
      return;
    }
    if (text) {
      const prev = text.textContent;
      text.textContent = "Copied!";
      btn.classList.add("is-copied");
      setTimeout(() => {
        text.textContent = prev;
        btn.classList.remove("is-copied");
      }, 1600);
    }
  });
});

// --- Random route ------------------------------------------------------------
document.querySelectorAll("[data-random-route]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const idx = await loadRouteIndex();
    if (!idx.length) return;
    const pick = idx[Math.floor(Math.random() * idx.length)];
    window.location.href = "/routes/" + pick.slug;
  });
});

// --- Quick-search command palette (/ or Cmd/Ctrl-K) --------------------------
let palette = null;
let paletteInput = null;
let paletteResults = null;
let paletteItems = [];
let activeIdx = -1;

function buildPalette() {
  palette = document.createElement("div");
  palette.className = "cmdk";
  palette.hidden = true;
  palette.innerHTML = `
    <div class="cmdk-backdrop" data-cmdk-close></div>
    <div class="cmdk-panel" role="dialog" aria-modal="true" aria-label="Search routes">
      <div class="cmdk-field">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="search" autocomplete="off" placeholder="Search routes — try I-95, 495, or H-3" aria-label="Search routes" />
        <kbd>esc</kbd>
      </div>
      <ul class="cmdk-results" role="listbox"></ul>
      <div class="cmdk-hint mono">Enter to open · ↑ ↓ to move</div>
    </div>`;
  document.body.appendChild(palette);
  paletteInput = palette.querySelector("input");
  paletteResults = palette.querySelector(".cmdk-results");
  palette.addEventListener("click", (e) => {
    if (e.target.closest("[data-cmdk-close]")) closePalette();
  });
  paletteInput.addEventListener("input", () => renderResults(paletteInput.value));
  paletteInput.addEventListener("keydown", onPaletteKey);
}

async function openPalette() {
  if (!palette) buildPalette();
  await loadRouteIndex();
  palette.hidden = false;
  document.documentElement.style.overflow = "hidden";
  paletteInput.value = "";
  renderResults("");
  paletteInput.focus();
}

function closePalette() {
  if (!palette || palette.hidden) return;
  palette.hidden = true;
  document.documentElement.style.overflow = "";
}

function setActive(i) {
  activeIdx = i;
  paletteResults.querySelectorAll(".cmdk-item").forEach((el, j) => {
    const on = j === i;
    el.classList.toggle("is-active", on);
    if (on) el.scrollIntoView({ block: "nearest" });
  });
}

async function renderResults(query) {
  const idx = await loadRouteIndex();
  const q = query.trim().toLowerCase();
  let list;
  if (!q) {
    list = idx.slice(0, 8);
  } else {
    const digits = q.replace(/[^0-9]/g, "");
    list = idx
      .filter((r) => {
        const id = r.id.toLowerCase();
        return id.includes(q) || (digits && id.includes(digits)) || r.corridor.toLowerCase().includes(q);
      })
      .slice(0, 8);
  }
  paletteItems = list;
  activeIdx = list.length ? 0 : -1;
  paletteResults.innerHTML = list.length
    ? list
        .map(
          (r, i) =>
            `<li role="option" class="cmdk-item${i === 0 ? " is-active" : ""}" data-slug="${esc(r.slug)}"><span class="cmdk-id mono">${esc(r.id)}</span><span class="cmdk-corr">${esc(r.corridor)}</span><span class="cmdk-axis mono">${esc(r.axis)}</span></li>`
        )
        .join("")
    : `<li class="cmdk-empty">No route matches “${esc(query)}”. Press Enter to search the database.</li>`;
  paletteResults.querySelectorAll(".cmdk-item").forEach((el, i) => {
    el.addEventListener("click", () => {
      window.location.href = "/routes/" + el.dataset.slug;
    });
    el.addEventListener("mousemove", () => setActive(i));
  });
}

function onPaletteKey(e) {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (paletteItems.length) setActive((activeIdx + 1) % paletteItems.length);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (paletteItems.length) setActive((activeIdx - 1 + paletteItems.length) % paletteItems.length);
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (activeIdx >= 0 && paletteItems[activeIdx]) {
      window.location.href = "/routes/" + paletteItems[activeIdx].slug;
    } else {
      const q = paletteInput.value.trim();
      window.location.href = q ? "/database?q=" + encodeURIComponent(q) : "/database";
    }
  } else if (e.key === "Escape") {
    e.preventDefault();
    closePalette();
  }
}

document.addEventListener("keydown", (e) => {
  const el = e.target;
  const tag = (el.tagName || "").toLowerCase();
  const typing = tag === "input" || tag === "textarea" || tag === "select" || el.isContentEditable;
  const slash = e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey;
  const cmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
  if (slash || cmdK) {
    e.preventDefault();
    openPalette();
  }
});

document.querySelectorAll("[data-search-open]").forEach((b) => b.addEventListener("click", openPalette));

// --- Interactive state map ---------------------------------------------------
const mapEl = document.querySelector("[data-statemap]");
if (mapEl) {
  let info = {};
  try {
    info = JSON.parse(mapEl.dataset.statemap);
  } catch {
    info = {};
  }
  const svg = mapEl.querySelector("svg");
  if (svg) {
    for (const [code, d] of Object.entries(info)) {
      const el = svg.querySelector("#" + (window.CSS && CSS.escape ? CSS.escape(code) : code));
      if (!el) continue;
      el.style.cursor = "pointer";
      el.setAttribute("role", "link");
      el.setAttribute("tabindex", "0");
      el.setAttribute("aria-label", `${d.name}: ${d.n} interstate${d.n === 1 ? "" : "s"}`);
      const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
      title.textContent = `${d.name}: ${d.n} interstate${d.n === 1 ? "" : "s"}`;
      el.appendChild(title);
      const go = () => { window.location.href = "/states/" + d.slug; };
      el.addEventListener("click", go);
      el.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          go();
        }
      });
    }
  }
}
