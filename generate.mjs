// Static-site generator for Multiplex.
//
// Reads the single data source (data/routes.mjs) and the page copy
// (data/content.mjs), wraps everything in the shared layout (assets/layout.mjs),
// and writes plain static HTML to the repo. There is NO runtime dependency on
// this script: the output is committed and served statically by Vercel with no
// build step. Run `node generate.mjs` after editing data or content.

import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  allRoutes,
  routesWithPages,
  activePrimarySeed,
  nonContiguousSeed,
  notableAuxSeed,
  slugFromId,
} from "./data/routes.mjs";
import * as C from "./data/content.mjs";
import details from "./data/details.mjs";
import akaMap from "./data/details/aka.mjs";
import { renderPage, escapeHtml, shieldHTML, SITE_URL } from "./assets/layout.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const written = [];

function write(relPath, html) {
  const full = join(ROOT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html, "utf8");
  written.push(relPath);
}

// --- shared small helpers ----------------------------------------------------

const fmt = (n) => (n == null ? null : n.toLocaleString("en-US"));

function statusClass(status) {
  switch (status) {
    case "Active": return "status-active";
    case "Federal program": return "status-program";
    case "Notable": return "status-notable";
    case "Possible": return "status-possible";
    case "Theoretical": return "status-theoretical";
    default: return "status-unassigned";
  }
}

// id -> route record that has its own page (for junction links).
const pageById = new Map(routesWithPages.map((r) => [r.id, r]));

// Merge long-form detail (data/details.mjs) over a base route record. Arrays in
// the detail override the base only when present and non-empty, so a route with
// no detail entry still renders from its base fields.
function enrich(route) {
  const fallbackAka = akaMap[route.id] || [];
  const d = details[route.id];
  if (!d) {
    return { ...route, aka: fallbackAka, description: [route.summary], history: [], auxiliaries: [], features: [] };
  }
  const pick = (a, b) => (Array.isArray(a) && a.length ? a : b);
  return {
    ...route,
    aka: pick(d.aka, fallbackAka),
    description: pick(d.description, [route.summary]),
    history: d.history || [],
    cities: pick(d.cities, route.cities),
    junctions: pick(d.junctions, route.junctions),
    auxiliaries: d.auxiliaries || [],
    features: d.features || [],
    notes: pick(d.notes, route.notes),
  };
}

// Reading order for prev/next: primaries (numeric), non-contiguous, notable aux.
const orderedPages = [...activePrimarySeed, ...nonContiguousSeed, ...notableAuxSeed];
const orderIndex = new Map(orderedPages.map((r, i) => [r.id, i]));

function orderRank(r) {
  return r.category === "Primary" ? 0 : r.category === "Non-contiguous" ? 1 : 2;
}

// Resolve a route's clean postal-code state list (aux strings can hold "OR/WA").
function statesOf(r) {
  const out = new Set();
  for (const part of r.statesList) {
    for (const code of String(part).split("/")) {
      const c = code.trim();
      if (C.stateNames[c]) out.add(c);
    }
  }
  return [...out];
}

const stateSlug = (code) =>
  (C.stateNames[code] || code).toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");

// postal code -> routes that pass through it
const routesByState = new Map();
for (const r of orderedPages) {
  for (const code of statesOf(r)) {
    if (!routesByState.has(code)) routesByState.set(code, []);
    routesByState.get(code).push(r);
  }
}

// Choropleth shade for a state's interstate count (green ramp on the brand accent).
function shadeForCount(c) {
  if (c >= 8) return "#34c074";
  if (c >= 6) return "#1f9d57";
  if (c >= 4) return "#167e44";
  if (c >= 2) return "#0f5d32";
  if (c >= 1) return "#0c3f25";
  return "#161c28";
}

// === HOME ====================================================================

function buildHome() {
  const activeMainlines = activePrimarySeed.length;
  const possible = allRoutes.filter((r) => r.generated).length;
  const nonContig = nonContiguousSeed.length;
  const notableAux = notableAuxSeed.length;

  const metrics = [
    { v: fmt(activeMainlines), label: "active numeric mainlines" },
    { v: fmt(possible), label: "possible number slots, I-1 to I-999" },
    { v: fmt(nonContig), label: "Hawaii, Alaska, and Puerto Rico routes" },
    { v: fmt(notableAux), label: "notable auxiliary examples" },
  ];

  const featured = C.featuredRouteIds
    .map((id) => routesWithPages.find((r) => r.id === id))
    .filter(Boolean)
    .map((r) => {
      const stat = r.lengthMi ? `${fmt(r.lengthMi)} mi` : r.year ? `est. ${r.year}` : r.states;
      return `
          <a class="card card-link route-card" href="/routes/${r.slug}" data-reveal>
            <div class="route-card-head">
              ${shieldHTML(r.id)}
              <div class="route-card-meta">
                <span class="name">${escapeHtml(r.id)}</span>
                <span class="sub">${escapeHtml(r.axis)}</span>
              </div>
            </div>
            <p>${escapeHtml(r.corridor)}.</p>
            <span class="stat mono">${escapeHtml(stat)}</span>
          </a>`;
    })
    .join("");

  const main = `
      <section class="wrap-wide">
        <div class="hero">
          <div class="hero-copy">
            <p class="kicker">U.S. Interstate Highway System</p>
            <h1>Read the map by its <span class="accent">numbers.</span></h1>
            <p class="lead">${escapeHtml(C.home.heroLead)}</p>
            <form class="field hero-search" action="/database" method="get" role="search">
              <label for="q">Route</label>
              <input id="q" name="q" type="search" autocomplete="off" placeholder="Try I-95, 495, H-3, or PRI-1" />
            </form>
            <div class="btn-row">
              <a class="btn btn-primary" href="/database">Browse the database</a>
              <a class="btn btn-secondary" href="/decoder">Decode a number</a>
            </div>
          </div>
          <aside class="board" aria-label="System highlights">
            <div class="board-head">
              <span>System board</span>
              <span class="mono">${fmt(allRoutes.length)} records</span>
            </div>
            <ul class="board-list">
              ${C.featuredRouteIds
                .map((id) => routesWithPages.find((r) => r.id === id))
                .filter(Boolean)
                .map((r) => {
                  const stat = r.lengthMi ? `${fmt(r.lengthMi)} mi` : r.year ? `est. ${r.year}` : r.axis;
                  return `<li>
                <a href="/routes/${r.slug}">
                  ${shieldHTML(r.id, "sm")}
                  <span class="board-meta"><span class="board-name">${escapeHtml(r.id)}</span><span class="board-sub">${escapeHtml(r.corridor)}</span></span>
                  <span class="board-stat mono">${escapeHtml(stat)}</span>
                </a>
              </li>`;
                })
                .join("\n              ")}
            </ul>
            <a class="board-foot" href="/routes">View the full route directory</a>
          </aside>
        </div>
      </section>

      <section class="wrap section-tight">
        <div class="metrics" data-reveal>
          ${metrics
            .map(
              (m) => `<div class="metric"><span class="metric-value mono">${m.v}</span><span class="metric-label">${escapeHtml(m.label)}</span></div>`
            )
            .join("\n          ")}
        </div>
      </section>

      <section class="wrap section">
        <div class="section-head">
          <h2>Three ways in.</h2>
          <p>Search the full index, decode a single number, or learn the rules that govern the whole grid.</p>
        </div>
        <div class="bento">
          <a class="sign col-4" href="${C.home.explore[0].href}" data-reveal style="display:block">
            <h2 style="font-size:1.8rem">${escapeHtml(C.home.explore[0].title)}</h2>
            <p>${escapeHtml(C.home.explore[0].body)}</p>
            <span class="btn btn-secondary" style="margin-top:18px;background:rgba(255,255,255,0.14);border-color:rgba(255,255,255,0.3);color:#fff">${escapeHtml(C.home.explore[0].cta)}</span>
          </a>
          <div class="col-2" style="display:grid;gap:18px">
            <a class="card card-link" href="${C.home.explore[1].href}" data-reveal>
              <h3>${escapeHtml(C.home.explore[1].title)}</h3>
              <p>${escapeHtml(C.home.explore[1].body)}</p>
            </a>
            <a class="card card-link" href="${C.home.explore[2].href}" data-reveal>
              <h3>${escapeHtml(C.home.explore[2].title)}</h3>
              <p>${escapeHtml(C.home.explore[2].body)}</p>
            </a>
          </div>
        </div>
      </section>

      <section class="wrap section">
        <div class="section-head">
          <p class="kicker">Featured corridors</p>
          <h2>A few routes to start with.</h2>
          <p>From the longest Interstate to the shortest two-digit route. Open any card for its full record.</p>
        </div>
        <div class="grid grid-3">
          ${featured}
        </div>
        <div style="margin-top:24px">
          <a class="btn-ghost" href="/routes">See the full route directory</a>
        </div>
      </section>

      <section class="wrap section-tight">
        <div class="sign cta-band" data-reveal>
          <div>
            <h2 style="font-size:1.9rem">Every number, in one index.</h2>
            <p>Active mainlines, federal programs, notable auxiliaries, and every theoretical slot from I-1 to I-999.</p>
          </div>
          <a class="btn btn-secondary" href="/database" style="background:rgba(255,255,255,0.14);border-color:rgba(255,255,255,0.35);color:#fff">Open the database</a>
        </div>
      </section>`;

  return renderPage({
    key: "home",
    title: C.home.metaTitle,
    description: C.home.metaDescription,
    path: "/",
    main,
  });
}

// === DATABASE ================================================================

function buildDatabase() {
  const main = `
      <section class="wrap-wide section">
        <div class="section-head">
          <p class="kicker">Reference database</p>
          <h1>Find any Interstate designation.</h1>
          <p>Seeded active routes sit alongside generated records for every possible number, so assigned highways and theoretical slots can be compared in one place. Select a row for details, or open its full page.</p>
        </div>

        <div class="browser">
          <div class="browser-main">
            <div class="toolbar">
              <div class="field">
                <label for="route-search">Search</label>
                <input id="route-search" type="search" autocomplete="off" placeholder="Route, state, parent, or corridor" />
              </div>
              <div class="filters" role="group" aria-label="Route filters">
                <button class="filter is-active" data-filter="all" type="button">All</button>
                <button class="filter" data-filter="primary" type="button">Primary</button>
                <button class="filter" data-filter="auxiliary" type="button">Auxiliary</button>
                <button class="filter" data-filter="possible" type="button">Possible</button>
                <button class="filter" data-filter="noncontiguous" type="button">Non-contiguous</button>
              </div>
            </div>
            <div class="result-meta">
              <span><span id="result-count">0 results</span> <span id="result-context">Showing the full index</span></span>
              <label class="sort-control">Sort by
                <select id="route-sort">
                  <option value="relevance">Relevance</option>
                  <option value="number">Number</option>
                  <option value="length">Length</option>
                  <option value="year">Year designated</option>
                  <option value="states">States crossed</option>
                </select>
              </label>
            </div>
            <div class="route-list" id="route-list" aria-live="polite"></div>
          </div>
          <aside class="detail-panel" id="route-detail" aria-label="Selected route detail"></aside>
        </div>
        <div id="compare-bar" class="compare-bar" hidden aria-live="polite"></div>
      </section>`;

  return renderPage({
    key: "database",
    title: "Interstate route database | Multiplex",
    description:
      "Search and filter every active U.S. Interstate route plus every theoretical number slot from I-1 to I-999.",
    path: "/database",
    main,
    scripts: '    <script type="module" src="/assets/app.mjs"></script>',
  });
}

// === DECODER =================================================================

function buildDecoder() {
  const main = `
      <section class="wrap section">
        <div class="section-head">
          <p class="kicker">Number decoder</p>
          <h1>Read the system at a glance.</h1>
          <p>Odd one and two-digit numbers generally run north-south, even numbers generally run east-west, and three-digit auxiliaries inherit their final two digits from a parent route. Enter a designation to decode it.</p>
        </div>

        <div class="decoder">
          <div class="decoder-form">
            <div class="field">
              <label for="decoder-input">Designation</label>
              <input id="decoder-input" type="search" autocomplete="off" placeholder="Enter I-270 or 270" />
            </div>
            <div class="decoder-examples" aria-label="Examples">
              <button type="button" data-example="I-95">I-95</button>
              <button type="button" data-example="270">270</button>
              <button type="button" data-example="I-495">I-495</button>
              <button type="button" data-example="H-3">H-3</button>
              <button type="button" data-example="PRI-1">PRI-1</button>
              <button type="button" data-example="I-238">I-238</button>
            </div>
          </div>
          <div class="decoder-out" id="decoder-output"></div>
        </div>

        <div class="note" style="margin-top:36px">
          <span aria-hidden="true">&#9888;</span>
          <span>The decoder reads the numbering convention. A number following the rules is not always an assigned, built route. Use the <a class="btn-ghost" href="/database">database</a> to check status.</span>
        </div>
      </section>`;

  return renderPage({
    key: "decoder",
    title: "Interstate number decoder | Multiplex",
    description: "Enter any Interstate number and read its direction, parent route, and whether it is a loop or a spur.",
    path: "/decoder",
    main,
    scripts: '    <script type="module" src="/assets/app.mjs"></script>',
  });
}

// === ROUTE DETAIL ============================================================

function junctionLinks(route) {
  if (!route.junctions.length) return '<span class="chip">None recorded</span>';
  return route.junctions
    .map((id) => {
      const target = pageById.get(id);
      const href = target ? `/routes/${target.slug}` : `/database?q=${encodeURIComponent(id)}`;
      return `<a href="${href}">${shieldHTML(id, "sm")}<span>${escapeHtml(id)}</span></a>`;
    })
    .join("\n            ");
}

// Render the chips for child auxiliary routes, linking those that have a page.
function auxLinks(route) {
  if (!route.auxiliaries.length) return "";
  return route.auxiliaries
    .map((id) => {
      const target = pageById.get(id);
      const href = target ? `/routes/${target.slug}` : `/database?q=${encodeURIComponent(id)}`;
      return `<a href="${href}">${shieldHTML(id, "sm")}<span>${escapeHtml(id)}</span></a>`;
    })
    .join("\n            ");
}

function buildRoutePage(base) {
  const route = enrich(base);
  const idx = orderIndex.get(route.id);
  const prev = idx > 0 ? orderedPages[idx - 1] : null;
  const next = idx < orderedPages.length - 1 ? orderedPages[idx + 1] : null;

  const stat = (k, v, unit) =>
    `<div class="cell"><span class="k">${escapeHtml(k)}</span><span class="v mono">${v == null ? "n/a" : escapeHtml(String(v))}${unit ? `<small> ${escapeHtml(unit)}</small>` : ""}</span></div>`;

  const statgrid = [
    stat("Length", route.lengthMi == null ? "n/a" : fmt(route.lengthMi), route.lengthMi == null ? "" : "mi"),
    stat("Designated", route.year ?? "n/a"),
    stat("States", route.statesList.length || "n/a"),
    stat("Junctions", route.junctions.length || "n/a"),
  ].join("\n          ");

  const description = route.description.map((para) => `<p>${escapeHtml(para)}</p>`).join("\n            ");

  const akaRow = route.aka.length
    ? `<p class="route-aka">Also known as ${route.aka.map((n) => `<strong>${escapeHtml(n)}</strong>`).join(", ")}.</p>`
    : "";

  const termini =
    route.from && route.to
      ? `<p class="route-termini"><span class="k mono">From</span> ${escapeHtml(route.from)} <span class="k mono">to</span> ${escapeHtml(route.to)}</p>`
      : "";

  const historyBlock = route.history.length
    ? `<h3>History</h3>${route.history.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n            ")}`
    : "";

  const cities = route.cities.length
    ? `<div class="chip-set">${route.cities.map((c) => `<span class="chip">${escapeHtml(c)}</span>`).join("")}</div>`
    : "<p>Not recorded.</p>";

  const featuresBlock = route.features.length
    ? `<h3>Notable features</h3><ul class="fact-list">${route.features.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>`
    : "";

  const facts = route.notes.length
    ? `<h3>Did you know</h3><ul class="fact-list">${route.notes.map((n) => `<li>${escapeHtml(n)}</li>`).join("")}</ul>`
    : "";

  const parentRow = route.parent
    ? `<li><span class="k">Parent</span><span class="v"><a class="btn-ghost" href="/routes/${slugFromId(route.parent)}">${escapeHtml(route.parent)}</a></span></li>`
    : "";

  const auxCard = route.auxiliaries.length
    ? `<div class="card" style="margin-top:18px">
              <h3 style="font-size:1rem">Auxiliary routes</h3>
              <div class="junction-links">
                ${auxLinks(route)}
              </div>
            </div>`
    : "";

  const main = `
      <section class="wrap-wide">
        <nav style="padding-top:22px" aria-label="Breadcrumb">
          <a class="btn-ghost" href="/routes">All routes</a>
        </nav>
        <div class="route-hero">
          ${shieldHTML(route.id, "lg")}
          <div>
            <p class="kicker">${escapeHtml(route.category)} route</p>
            <h1>${escapeHtml(route.id)}</h1>
            <p class="lead" style="margin-bottom:0">${escapeHtml(route.corridor)}</p>
            <div class="meta-row">
              <span class="status ${statusClass(route.status)}">${escapeHtml(route.status)}</span>
              <span class="chip">${escapeHtml(route.axis)}</span>
              <span class="chip">${escapeHtml(route.states)}</span>
            </div>
          </div>
        </div>

        <div class="route-statgrid" data-reveal>
          ${statgrid}
        </div>

        <div class="route-body section">
          <div class="prose" style="max-width:none">
            <h2>About ${escapeHtml(route.id)}</h2>
            ${akaRow}
            ${termini}
            ${description}
            ${historyBlock}
            <h3>Major cities and places</h3>
            ${cities}
            ${featuresBlock}
            ${facts}
          </div>
          <aside>
            <div class="card">
              <h3 style="font-size:1rem">Quick facts</h3>
              <ul class="data-list">
                <li><span class="k">Type</span><span class="v">${escapeHtml(route.category)}</span></li>
                <li><span class="k">Axis</span><span class="v">${escapeHtml(route.axis)}</span></li>
                <li><span class="k">Length</span><span class="v mono">${route.lengthMi == null ? "n/a" : fmt(route.lengthMi) + " mi"}</span></li>
                <li><span class="k">Designated</span><span class="v mono">${route.year ?? "n/a"}</span></li>
                <li><span class="k">States</span><span class="v">${escapeHtml(route.states)}</span></li>
                ${parentRow}
              </ul>
            </div>
            <div class="card" style="margin-top:18px">
              <h3 style="font-size:1rem">Interstate junctions</h3>
              <div class="junction-links">
                ${junctionLinks(route)}
              </div>
            </div>
            ${auxCard}
          </aside>
        </div>

        <div class="prevnext section-tight">
          ${
            prev
              ? `<a href="/routes/${prev.slug}"><span class="dir">Previous</span><span class="to-name">${escapeHtml(prev.id)}</span></a>`
              : "<span></span>"
          }
          ${
            next
              ? `<a class="next" href="/routes/${next.slug}"><span class="dir">Next</span><span class="to-name">${escapeHtml(next.id)}</span></a>`
              : "<span></span>"
          }
        </div>
      </section>`;

  const lengthBit = route.lengthMi ? `${route.lengthMi} miles, ` : "";
  const metaDesc = `${route.id} (${route.states}). ${lengthBit}${route.description[0] || route.summary}`.slice(0, 300);
  return renderPage({
    key: "routes",
    title: `${route.id}: ${route.corridor} | Multiplex`,
    description: metaDesc,
    path: `/routes/${route.slug}`,
    main,
  });
}

// === ROUTE DIRECTORY =========================================================

function buildDirectory() {
  const groups = [
    { title: "Primary mainlines", items: activePrimarySeed },
    { title: "Non-contiguous programs", items: nonContiguousSeed },
    { title: "Notable auxiliary routes", items: notableAuxSeed },
  ];

  const groupsHTML = groups
    .map((g) => {
      const tiles = g.items
        .map(
          (r) => `
          <a class="dir-tile" href="/routes/${r.slug}">
            ${shieldHTML(r.id, "sm")}
            <span class="label">${escapeHtml(r.id)}<small>${escapeHtml(r.statesList[0] || r.axis)}</small></span>
          </a>`
        )
        .join("");
      return `<h2 class="dir-group-title">${escapeHtml(g.title)} (${g.items.length})</h2><div class="dir-grid">${tiles}</div>`;
    })
    .join("\n        ");

  const main = `
      <section class="wrap-wide section">
        <div class="section-head">
          <p class="kicker">Route directory</p>
          <h1>Every route with a full record.</h1>
          <p>The ${routesWithPages.length} routes documented in detail, grouped by type. For theoretical number slots, use the <a class="btn-ghost" href="/database">database</a>.</p>
        </div>
        ${groupsHTML}
      </section>`;

  return renderPage({
    key: "routes",
    title: "Interstate route directory | Multiplex",
    description: "An A to Z directory of every documented U.S. Interstate route, grouped by primary, non-contiguous, and auxiliary type.",
    path: "/routes",
    main,
  });
}

// === GUIDE ===================================================================

function buildGuide() {
  const sections = C.guide.sections
    .map(
      (s, i) => `
        <article class="prose" style="margin-bottom:8px" data-reveal>
          <h2>${escapeHtml(s.h)}</h2>
          ${s.p.map((para) => `<p>${escapeHtml(para)}</p>`).join("\n          ")}
        </article>`
    )
    .join("");

  // Two small inline diagrams: the odd/even grid, and loop vs spur.
  const diagrams = `
        <div class="grid grid-2" style="margin:8px 0 40px">
          <div class="diagram" data-reveal>
            <h3 style="font-size:1rem">Mainline grid</h3>
            <svg viewBox="0 0 320 200" role="img" aria-label="Odd numbers run north-south, even numbers run east-west">
              <line x1="60" y1="20" x2="60" y2="180" stroke="#2f6fd6" stroke-width="5" stroke-linecap="round"/>
              <line x1="160" y1="20" x2="160" y2="180" stroke="#2f6fd6" stroke-width="5" stroke-linecap="round"/>
              <line x1="20" y1="70" x2="300" y2="70" stroke="#d8453c" stroke-width="5" stroke-linecap="round"/>
              <line x1="20" y1="140" x2="300" y2="140" stroke="#d8453c" stroke-width="5" stroke-linecap="round"/>
              <text x="60" y="14" fill="#9aabc0" font-size="11" text-anchor="middle" font-family="monospace">odd N-S</text>
              <text x="305" y="70" fill="#9aabc0" font-size="11" text-anchor="end" font-family="monospace">even E-W</text>
            </svg>
          </div>
          <div class="diagram" data-reveal>
            <h3 style="font-size:1rem">Loop vs spur</h3>
            <svg viewBox="0 0 320 200" role="img" aria-label="An even first digit loops back to the parent, an odd first digit spurs off once">
              <line x1="20" y1="100" x2="300" y2="100" stroke="#1f9d57" stroke-width="5" stroke-linecap="round"/>
              <path d="M90 100 C90 40 200 40 200 100" fill="none" stroke="#2f6fd6" stroke-width="5" stroke-linecap="round"/>
              <path d="M250 100 C250 150 280 160 295 175" fill="none" stroke="#d8453c" stroke-width="5" stroke-linecap="round"/>
              <text x="145" y="36" fill="#9aabc0" font-size="11" text-anchor="middle" font-family="monospace">even = loop</text>
              <text x="270" y="190" fill="#9aabc0" font-size="11" text-anchor="middle" font-family="monospace">odd = spur</text>
              <text x="30" y="120" fill="#9aabc0" font-size="11" font-family="monospace">parent</text>
            </svg>
          </div>
        </div>`;

  const main = `
      <section class="wrap section">
        <div class="section-head">
          <p class="kicker">Numbering guide</p>
          <h1>How Interstate numbering works.</h1>
          <p class="lead">${escapeHtml(C.guide.intro)}</p>
        </div>
        ${diagrams}
        ${sections}
        <div class="sign cta-band section-tight" data-reveal style="margin-top:24px">
          <div><h2 style="font-size:1.7rem">Put it to the test.</h2><p>Type any number into the decoder and watch the rules apply.</p></div>
          <a class="btn btn-secondary" href="/decoder" style="background:rgba(255,255,255,0.14);border-color:rgba(255,255,255,0.35);color:#fff">Open the decoder</a>
        </div>
      </section>`;

  return renderPage({
    key: "guide",
    title: C.guide.metaTitle,
    description: C.guide.metaDescription,
    path: "/guide",
    main,
  });
}

// === HISTORY =================================================================

function buildHistory() {
  const timeline = C.history.timeline
    .map(
      (t) => `
          <li data-reveal>
            <span class="year mono">${escapeHtml(t.year)}</span>
            <div><h3>${escapeHtml(t.h)}</h3><p>${escapeHtml(t.p)}</p></div>
          </li>`
    )
    .join("");

  const standards = C.history.standards.map((s) => `<li>${escapeHtml(s)}</li>`).join("\n            ");

  const main = `
      <section class="wrap section">
        <div class="section-head">
          <p class="kicker">System history</p>
          <h1>How the Interstate system was built.</h1>
          <p class="lead">${escapeHtml(C.history.intro)}</p>
        </div>

        <ol class="timeline" style="margin-bottom:48px">
          ${timeline}
        </ol>

        <div class="prose">
          <h2>What makes a road an Interstate</h2>
          <p>From the start, Interstate highways had to meet a common set of engineering standards so the network would feel consistent across every state:</p>
          <ul>
            ${standards}
          </ul>
        </div>
      </section>`;

  return renderPage({
    key: "history",
    title: C.history.metaTitle,
    description: C.history.metaDescription,
    path: "/history",
    main,
  });
}

// === MAP (real US states choropleth) =========================================

function buildMap() {
  let svg = readFileSync(join(ROOT, "assets/us-map.svg"), "utf8");
  svg = svg.replace(/<\?xml[\s\S]*?\?>/g, "").trim();
  // Rebuild the opening <svg> tag: keep only viewBox, add our class + a11y label.
  svg = svg.replace(/<svg\b[^>]*>/, (tag) => {
    const vb = (tag.match(/viewBox="[^"]*"/) || ['viewBox="174 100 959 593"'])[0];
    return `<svg xmlns="http://www.w3.org/2000/svg" ${vb} class="usmap" role="img" aria-label="Map of the United States; select a state to see its Interstates">`;
  });

  const codes = Object.keys(C.stateNames);
  const counts = {};
  for (const code of codes) counts[code] = (routesByState.get(code) || []).length;

  const styleRules = codes
    .map((code) => {
      const fill = shadeForCount(counts[code]);
      return `.usmap #${code},.usmap #${code} *{fill:${fill}}.usmap #${code}:hover,.usmap #${code}:hover *{fill:var(--green-bright)}`;
    })
    .join("");

  const clickMap = {};
  for (const code of codes) clickMap[code] = { slug: stateSlug(code), name: C.stateNames[code], n: counts[code] };

  const main = `
      <section class="wrap-wide section">
        <div class="section-head">
          <p class="kicker">Interactive map</p>
          <h1>Browse the system by state.</h1>
          <p class="lead">${escapeHtml(C.map.intro)}</p>
        </div>
        <style>${styleRules}</style>
        <div class="map-stage" data-statemap="${escapeHtml(JSON.stringify(clickMap))}" data-reveal>
          ${svg}
        </div>
        <div class="map-legend">
          <span><i style="background:#0c3f25"></i> 1 to 2</span>
          <span><i style="background:#167e44"></i> 4 to 5</span>
          <span><i style="background:#1f9d57"></i> 6 to 7</span>
          <span><i style="background:#34c074"></i> 8 or more</span>
          <span>Select a state to open its page.</span>
        </div>
      </section>`;

  return renderPage({
    key: "map",
    title: C.map.metaTitle,
    description: C.map.metaDescription,
    path: "/map",
    main,
  });
}

// === STATES ==================================================================

function buildStatesIndex() {
  const codes = [...routesByState.keys()].sort((a, b) =>
    (C.stateNames[a] || a).localeCompare(C.stateNames[b] || b)
  );
  const tiles = codes
    .map((code) => {
      const n = routesByState.get(code).length;
      return `
          <a class="dir-tile" href="/states/${stateSlug(code)}">
            <span class="state-badge mono">${escapeHtml(code)}</span>
            <span class="label">${escapeHtml(C.stateNames[code] || code)}<small>${n} interstate${n === 1 ? "" : "s"}</small></span>
          </a>`;
    })
    .join("");

  const main = `
      <section class="wrap-wide section">
        <div class="section-head">
          <p class="kicker">Browse by state</p>
          <h1>Interstates in every state.</h1>
          <p>Select a state or territory to see every Interstate that runs through it, or open the <a class="btn-ghost" href="/map">interactive map</a>.</p>
        </div>
        <div class="dir-grid">${tiles}</div>
      </section>`;

  return renderPage({
    key: "states",
    title: "Interstates by state | Multiplex",
    description: "Browse every U.S. Interstate Highway grouped by the state or territory it passes through.",
    path: "/states",
    main,
  });
}

function buildStatePage(code) {
  const name = C.stateNames[code] || code;
  const list = [...routesByState.get(code)].sort(
    (a, b) => orderRank(a) - orderRank(b) || (a.number || 999) - (b.number || 999)
  );
  const prim = list.filter((r) => r.category === "Primary").length;
  const aux = list.filter((r) => r.category === "Auxiliary").length;
  const ncon = list.filter((r) => r.category === "Non-contiguous").length;

  const rows = list
    .map(
      (r) => `
          <a class="route-row" href="/routes/${r.slug}">
            ${shieldHTML(r.id)}
            <span>
              <span class="kick">${escapeHtml(r.category)} / ${escapeHtml(r.axis)}</span>
              <span class="name">${escapeHtml(r.id)}</span>
              <p class="desc">${escapeHtml(r.corridor)}</p>
            </span>
            <span class="status ${statusClass(r.status)}">${escapeHtml(r.status)}</span>
          </a>`
    )
    .join("");

  const parts = [];
  if (prim) parts.push(`${prim} primary`);
  if (aux) parts.push(`${aux} auxiliary`);
  if (ncon) parts.push(`${ncon} non-contiguous`);

  const main = `
      <section class="wrap-wide section">
        <nav style="padding-top:22px" aria-label="Breadcrumb"><a class="btn-ghost" href="/states">All states</a></nav>
        <div class="section-head">
          <p class="kicker">${escapeHtml(code)}</p>
          <h1>Interstates in ${escapeHtml(name)}</h1>
          <p class="lead">${list.length} Interstate route${list.length === 1 ? "" : "s"} run through ${escapeHtml(name)}${parts.length ? `: ${parts.join(", ")}` : ""}.</p>
        </div>
        <div class="browser-main" style="max-width:780px">
          ${rows}
        </div>
      </section>`;

  return renderPage({
    key: "states",
    title: `Interstates in ${name} | Multiplex`,
    description: `Every Interstate Highway that runs through ${name}, with status and corridor.`,
    path: `/states/${stateSlug(code)}`,
    main,
  });
}

// === SUPERLATIVES ============================================================

function buildSuperlatives() {
  const prim = activePrimarySeed;
  const withLen = prim.filter((r) => r.lengthMi != null);
  const longest = withLen.reduce((a, b) => (b.lengthMi > a.lengthMi ? b : a));
  const shortest = withLen.filter((r) => r.number < 100).reduce((a, b) => (b.lengthMi < a.lengthMi ? b : a));
  const mostStates = prim.reduce((a, b) => (statesOf(b).length > statesOf(a).length ? b : a));
  const mostJunctions = prim.reduce((a, b) => (b.junctions.length > a.junctions.length ? b : a));
  const withYear = prim.filter((r) => r.year != null);
  const oldest = withYear.reduce((a, b) => (b.year < a.year ? b : a));
  const newest = withYear.reduce((a, b) => (b.year > a.year ? b : a));

  let mostAux = null;
  let mostAuxN = -1;
  for (const r of prim) {
    const n = (details[r.id]?.auxiliaries || []).length;
    if (n > mostAuxN) { mostAuxN = n; mostAux = r; }
  }

  const card = (label, r, valueText) => `
          <a class="card card-link route-card" href="/routes/${r.slug}" data-reveal>
            <div class="route-card-head">${shieldHTML(r.id)}<div class="route-card-meta"><span class="name">${escapeHtml(r.id)}</span><span class="sub">${escapeHtml(label)}</span></div></div>
            <p>${escapeHtml(r.corridor)}.</p>
            <span class="stat mono">${escapeHtml(valueText)}</span>
          </a>`;

  const cards = [
    card("Longest Interstate", longest, `${fmt(longest.lengthMi)} mi`),
    card("Shortest two-digit", shortest, `${fmt(shortest.lengthMi)} mi`),
    card("Most states crossed", mostStates, `${statesOf(mostStates).length} states`),
    card("Most interstate junctions", mostJunctions, `${mostJunctions.junctions.length} junctions`),
    card("Earliest designation", oldest, `${oldest.year}`),
    card("Newest designation", newest, `${newest.year}`),
    mostAux ? card("Most auxiliary routes", mostAux, `${mostAuxN} auxiliaries`) : "",
  ].join("");

  const totalMi = withLen.reduce((s, r) => s + r.lengthMi, 0);

  const main = `
      <section class="wrap-wide section">
        <div class="section-head">
          <p class="kicker">Superlatives</p>
          <h1>The records of the system.</h1>
          <p class="lead">Computed from the route data: the longest and shortest, the most-connected, and the oldest and newest designations among the active two-digit Interstates.</p>
        </div>
        <div class="grid grid-3">${cards}</div>
        <div class="note" style="margin-top:28px"><span aria-hidden="true">&#9432;</span><span>Combined length of the active two-digit mainlines in this index: <strong class="mono">${fmt(totalMi)}</strong> miles.</span></div>
      </section>`;

  return renderPage({
    key: "superlatives",
    title: "Interstate superlatives | Multiplex",
    description: "The longest, shortest, most-connected, oldest, and newest U.S. Interstate Highways, computed from route data.",
    path: "/superlatives",
    main,
  });
}

// === FAQ =====================================================================

function buildFaq() {
  const items = C.faq.items
    .map(
      (it) => `
          <div class="faq-item" data-reveal>
            <h3>${escapeHtml(it.q)}</h3>
            <p>${escapeHtml(it.a)}</p>
          </div>`
    )
    .join("");

  const main = `
      <section class="wrap section">
        <div class="section-head">
          <p class="kicker">Questions</p>
          <h1>Frequently asked.</h1>
          <p class="lead">The questions that come up most about how the Interstate system is numbered and built.</p>
        </div>
        <div style="max-width:78ch">
          ${items}
        </div>
      </section>`;

  return renderPage({
    key: "faq",
    title: C.faq.metaTitle,
    description: C.faq.metaDescription,
    path: "/faq",
    main,
  });
}

// === GLOSSARY ================================================================

function buildGlossary() {
  const terms = C.glossary.terms
    .map((t) => `<div><dt>${escapeHtml(t.t)}</dt><dd>${escapeHtml(t.d)}</dd></div>`)
    .join("\n          ");

  const main = `
      <section class="wrap section">
        <div class="section-head">
          <p class="kicker">Glossary</p>
          <h1>The terms, defined.</h1>
          <p class="lead">A short reference for the highway and numbering terms used across this site.</p>
        </div>
        <dl class="glossary">
          ${terms}
        </dl>
      </section>`;

  return renderPage({
    key: "glossary",
    title: C.glossary.metaTitle,
    description: C.glossary.metaDescription,
    path: "/glossary",
    main,
  });
}

// === SOURCES =================================================================

function buildSources() {
  const links = C.sources.links
    .map((l) => `<li><a href="${l.href}" target="_blank" rel="noreferrer">${escapeHtml(l.label)}</a></li>`)
    .join("\n            ");

  const main = `
      <section class="wrap section">
        <div class="section-head">
          <p class="kicker">Sources and method</p>
          <h1>Built for public reference.</h1>
          <p class="lead">${escapeHtml(C.sources.intro)}</p>
        </div>
        <div class="prose">
          ${C.sources.body.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n          ")}
          <h2>References</h2>
          <ul>
            ${links}
          </ul>
        </div>
      </section>`;

  return renderPage({
    key: "sources",
    title: C.sources.metaTitle,
    description: C.sources.metaDescription,
    path: "/sources",
    main,
  });
}

// === 404 =====================================================================

function build404() {
  const main = `
      <section class="wrap section" style="text-align:center;min-height:60vh;display:grid;place-content:center;justify-items:center">
        ${shieldHTML("I-1", "lg").replace(">1<", ">404<")}
        <h1 style="margin-top:24px">No route at this exit.</h1>
        <p class="lead">The page you wanted is not on this map. Head back to the index and try again.</p>
        <div class="btn-row" style="justify-content:center">
          <a class="btn btn-primary" href="/">Back home</a>
          <a class="btn btn-secondary" href="/database">Open the database</a>
        </div>
      </section>`;

  return renderPage({
    key: "",
    title: "Page not found | Multiplex",
    description: "The page you requested could not be found.",
    path: "/404",
    main,
  });
}

// === SITEMAP / ROBOTS ========================================================

function buildSitemap() {
  const paths = [
    "/", "/database", "/decoder", "/routes", "/states", "/superlatives", "/guide", "/map",
    "/history", "/faq", "/glossary", "/sources",
    ...[...routesByState.keys()].map((c) => `/states/${stateSlug(c)}`),
    ...routesWithPages.map((r) => `/routes/${r.slug}`),
  ];
  const urls = paths
    .map((p) => `  <url><loc>${SITE_URL}${p === "/" ? "" : p}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

// === RUN =====================================================================

write("index.html", buildHome());
write("database/index.html", buildDatabase());
write("decoder/index.html", buildDecoder());
write("routes/index.html", buildDirectory());
write("states/index.html", buildStatesIndex());
write("superlatives/index.html", buildSuperlatives());
write("guide/index.html", buildGuide());
write("history/index.html", buildHistory());
write("map/index.html", buildMap());
write("faq/index.html", buildFaq());
write("glossary/index.html", buildGlossary());
write("sources/index.html", buildSources());
write("404.html", build404());

for (const route of routesWithPages) {
  write(`routes/${route.slug}.html`, buildRoutePage(route));
}

const stateCodes = [...routesByState.keys()];
for (const code of stateCodes) {
  write(`states/${stateSlug(code)}.html`, buildStatePage(code));
}

write("sitemap.xml", buildSitemap());
write("robots.txt", buildRobots());

const routePages = routesWithPages.length;
console.log(`Generated ${written.length} files:`);
console.log(`  - ${routePages} route detail pages`);
console.log(`  - ${stateCodes.length} state pages`);
console.log(`  - sitemap.xml + robots.txt`);
