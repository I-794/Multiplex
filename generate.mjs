// Static-site generator for Multiplex.
//
// Reads the single data source (data/routes.mjs) and the page copy
// (data/content.mjs), wraps everything in the shared layout (assets/layout.mjs),
// and writes plain static HTML to the repo.

import { writeFileSync, mkdirSync, readFileSync, cpSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  allRoutes,
  routesWithPages,
  activePrimarySeed,
  nonContiguousSeed,
  notableAuxSeed,
  slugFromId,
  normalizeRouteInput,
} from "./data/routes.mjs";
import * as C from "./data/content.mjs";
import details from "./data/details.mjs";
import akaMap from "./data/details/aka.mjs";
import { renderPage, escapeHtml, shieldHTML, SITE_URL } from "./assets/layout.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "dist");
const written = [];

function write(relPath, html) {
  const full = join(ROOT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html, "utf8");
  written.push(relPath);
}

// --- shared small helpers ----------------------------------------------------

const fmt = (n) => (n == null ? null : n.toLocaleString("en-US", { minimumFractionDigits: 1 }));

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

const pageById = new Map(routesWithPages.map((r) => [r.id, r]));

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

const orderedPages = [...activePrimarySeed, ...nonContiguousSeed, ...notableAuxSeed];
const orderIndex = new Map(orderedPages.map((r, i) => [r.id, i]));

function orderRank(r) {
  return r.category === "Primary" ? 0 : r.category === "Non-contiguous" ? 1 : 2;
}

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

const routesByState = new Map();
for (const r of orderedPages) {
  for (const code of statesOf(r)) {
    if (!routesByState.has(code)) routesByState.set(code, []);
    routesByState.get(code).push(r);
  }
}

function shadeForCount(c) {
  if (c >= 8) return "#006A4E";
  if (c >= 6) return "#008B67";
  if (c >= 4) return "#004D39";
  if (c >= 2) return "#1A1D23";
  if (c >= 1) return "#121417";
  return "#0B0C10";
}

// === HOME ====================================================================

function buildHome() {
  const activeMainlines = activePrimarySeed.length;
  const possible = allRoutes.filter((r) => r.generated).length;
  const nonContig = nonContiguousSeed.length;
  const notableAux = notableAuxSeed.length;

  const metrics = [
    { v: activeMainlines.toLocaleString(), label: "active numeric mainlines" },
    { v: possible.toLocaleString(), label: "possible number slots, I-1 to I-999" },
    { v: nonContig.toLocaleString(), label: "Hawaii, Alaska, and Puerto Rico routes" },
    { v: notableAux.toLocaleString(), label: "notable auxiliary examples" },
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
              <span class="mono">${allRoutes.length.toLocaleString()} records</span>
            </div>
            <ul class="board-list">
              ${C.featuredRouteIds
                .map((id) => routesWithPages.find((r) => r.id === id))
                .filter(Boolean)
                .map((r) => {
                  const stat = r.lengthMi ? `${fmt(r.lengthMi)} mi` : r.year ? `est. ${r.year}` : r.axis;
                  return \`<li>
                <a href="/routes/${r.slug}">
                  \${shieldHTML(r.id, "sm")}
                  <span class="board-meta"><span class="board-name">\${escapeHtml(r.id)}</span><span class="board-sub">\${escapeHtml(r.corridor)}</span></span>
                  <span class="board-stat mono">\${escapeHtml(stat)}</span>
                </a>
              </li>\`;
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
      </section>\`;

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
  const main = \`
      <section class="wrap-wide section">
        <div class="section-head">
          <p class="kicker">Reference database</p>
          <h1>Find any Interstate designation.</h1>
          <p>Seeded active routes sit alongside generated records for every possible number.</p>
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
            <div class="route-list" id="route-list"></div>
          </div>
          <aside class="detail-panel" id="route-detail"></aside>
        </div>
      </section>\`;

  return renderPage({
    key: "database",
    title: "Interstate route database | Multiplex",
    description: "Search and filter every active U.S. Interstate route plus every theoretical number slot from I-1 to I-999.",
    path: "/database",
    main,
    scripts: '    <script type="module" src="/assets/app.mjs"></script>',
  });
}

// === DECODER =================================================================

function buildDecoder() {
  const main = \`
      <section class="wrap section">
        <div class="section-head">
          <p class="kicker">Number decoder</p>
          <h1>Read the system at a glance.</h1>
          <p>Enter a designation to decode its direction and role.</p>
        </div>
        <div class="decoder">
          <div class="decoder-form">
            <div class="field">
              <label for="decoder-input">Designation</label>
              <input id="decoder-input" type="search" autocomplete="off" placeholder="Enter I-270 or 270" />
            </div>
            <div class="decoder-examples">
              <button type="button" data-example="I-95">I-95</button>
              <button type="button" data-example="270">270</button>
              <button type="button" data-example="I-495">I-495</button>
            </div>
          </div>
          <div class="decoder-out" id="decoder-output"></div>
        </div>
      </section>\`;

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

function buildMileageTable(route) {
  if (!route.mileage || !route.mileage.length) return "";
  const rows = route.mileage
    .map(m => \`
      <tr>
        <td class="state-col">\${escapeHtml(C.stateNames[m.state] || m.state)}</td>
        <td class="miles-col">\${m.miles.toFixed(1)}</td>
      </tr>\`)
    .join("");
  
  return \`
    <div class="prose" style="margin-top:32px">
      <h3>State-by-state mileage</h3>
      <table class="mileage-table">
        <thead>
          <tr>
            <th>State</th>
            <th style="text-align:right">Miles</th>
          </tr>
        </thead>
        <tbody>
          \${rows}
          <tr style="background:var(--surface-2);font-weight:700">
            <td>Total</td>
            <td class="miles-col">\${fmt(route.lengthMi)}</td>
          </tr>
        </tbody>
      </table>
    </div>\`;
}

function junctionLinks(route) {
  if (!route.junctions.length) return '<span class="chip">None recorded</span>';
  return route.junctions
    .map((rawId) => {
      const id = normalizeRouteInput(rawId);
      const target = pageById.get(id);
      const href = target ? \`/routes/\${target.slug}\` : \`/database?q=\${encodeURIComponent(id)}\`;
      return \`<a href="\${href}">\${shieldHTML(id, "sm")}<span>\${escapeHtml(id)}</span></a>\`;
    })
    .join("\n            ");
}

function auxLinks(route) {
  if (!route.auxiliaries.length) return "";
  return route.auxiliaries
    .map((rawId) => {
      const id = normalizeRouteInput(rawId);
      const target = pageById.get(id);
      const href = target ? \`/routes/\${target.slug}\` : \`/database?q=\${encodeURIComponent(id)}\`;
      return \`<a href="\${href}">\${shieldHTML(id, "sm")}<span>\${escapeHtml(id)}</span></a>\`;
    })
    .join("\n            ");
}

function buildRoutePage(base) {
  const route = enrich(base);
  const idx = orderIndex.get(route.id);
  const prev = idx > 0 ? orderedPages[idx - 1] : null;
  const next = idx < orderedPages.length - 1 ? orderedPages[idx + 1] : null;

  const stat = (k, v, unit) =>
    \`<div class="cell"><span class="k">\${escapeHtml(k)}</span><span class="v mono">\${v == null ? "n/a" : escapeHtml(String(v))}\${unit ? \`<small> \${escapeHtml(unit)}</small>\` : ""}</span></div>\`;

  const statgrid = [
    stat("Length", route.lengthMi == null ? "n/a" : fmt(route.lengthMi), route.lengthMi == null ? "" : "mi"),
    stat("Designated", route.year ?? "n/a"),
    stat("States", route.statesList.length || "n/a"),
    stat("Junctions", route.junctions.length || "n/a"),
  ].join("\n          ");

  const description = route.description.map((para) => \`<p>\${escapeHtml(para)}</p>\`).join("\n            ");
  const historyBlock = route.history.length
    ? \`<h3>History</h3>\${route.history.map((p) => \`<p>\${escapeHtml(p)}</p>\`).join("\n            ")}\`
    : "";

  const cities = route.cities.length
    ? \`<div class="chip-set">\${route.cities.map((c) => \`<span class="chip">\${escapeHtml(c)}</span>\`).join("")}</div>\`
    : "<p>Not recorded.</p>";

  const facts = route.notes.length
    ? \`<h3>Did you know</h3><ul class="fact-list">\${route.notes.map((n) => \`<li>\${escapeHtml(n)}</li>\`).join("")}</ul>\`
    : "";

  const main = \`
      <section class="wrap-wide">
        <nav style="padding-top:22px"><a class="btn-ghost" href="/routes">All routes</a></nav>
        <div class="route-hero">
          \${shieldHTML(route.id, "lg")}
          <div>
            <p class="kicker">\${escapeHtml(route.category)} route</p>
            <h1>\${escapeHtml(route.id)}</h1>
            <p class="lead">\${escapeHtml(route.corridor)}</p>
            <div class="meta-row">
              <span class="status \${statusClass(route.status)}">\${escapeHtml(route.status)}</span>
              <span class="chip">\${escapeHtml(route.axis)}</span>
            </div>
          </div>
        </div>

        <div class="route-statgrid" data-reveal>
          \${statgrid}
        </div>

        <div class="route-body section">
          <div class="prose">
            <h2>About \${escapeHtml(route.id)}</h2>
            \${description}
            \${buildMileageTable(route)}
            \${historyBlock}
            <h3>Major cities and places</h3>
            \${cities}
            \${facts}
          </div>
          <aside>
            <div class="card">
              <h3 style="font-size:1rem">Interstate junctions</h3>
              <div class="junction-links">
                \${junctionLinks(route)}
              </div>
            </div>
          </aside>
        </div>

        <div class="prevnext section-tight">
          \${prev ? \`<a href="/routes/\${prev.slug}"><span class="dir">Previous</span><span class="to-name">\${escapeHtml(prev.id)}</span></a>\` : "<span></span>"}
          \${next ? \`<a class="next" href="/routes/\${next.slug}"><span class="dir">Next</span><span class="to-name">\${escapeHtml(next.id)}</span></a>\` : "<span></span>"}
        </div>
      </section>\`;

  return renderPage({
    key: "routes",
    title: \`\${route.id}: \${route.corridor} | Multiplex\`,
    description: route.summary,
    path: \`/routes/\${route.slug}\`,
    main,
  });
}

// === RUN =====================================================================

write("index.html", buildHome());
write("database/index.html", buildDatabase());
write("decoder/index.html", buildDecoder());
write("routes/index.html", (function() {
  const groups = [
    { title: "Primary mainlines", items: activePrimarySeed },
    { title: "Non-contiguous programs", items: nonContiguousSeed },
    { title: "Notable auxiliary routes", items: notableAuxSeed },
  ];
  const groupsHTML = groups.map(g => {
    const tiles = g.items.map(r => \`
      <a class="dir-tile" href="/routes/\${r.slug}">
        \${shieldHTML(r.id, "sm")}
        <span class="label">\${escapeHtml(r.id)}<small>\${escapeHtml(r.statesList[0] || r.axis)}</small></span>
      </a>\`).join("");
    return \`<h2 class="dir-group-title">\${escapeHtml(g.title)}</h2><div class="dir-grid">\${tiles}</div>\`;
  }).join("");
  return renderPage({ key: "routes", title: "Route directory", description: "All routes", path: "/routes", main: \`<section class="wrap-wide section">\${groupsHTML}</section>\` });
})());

for (const route of routesWithPages) {
  write(\`routes/\${route.slug}.html\`, buildRoutePage(route));
}

console.log(\`Generated \${written.length} files.\`);

// --- copy assets -------------------------------------------------------------
const srcAssets = join(dirname(fileURLToPath(import.meta.url)), "assets");
const destAssets = join(ROOT, "assets");
cpSync(srcAssets, destAssets, { recursive: true });
console.log("Assets copied to dist/assets.");
