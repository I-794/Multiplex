// Shared HTML shell used by the static-site generator. One layout function wraps
// every page so the head, header, navigation, and footer stay consistent across
// the whole site. Not loaded in the browser; it runs only at build time.

import { shieldText } from "../data/routes.mjs";
import { nav, footerNav } from "../data/content.mjs";

const SITE_NAME = "Multiplex";
// Used for absolute canonical / OpenGraph URLs. Update if the deploy domain changes.
const SITE_URL = "https://interstate-index.vercel.app";

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function shieldHTML(id, size) {
  const sizeCls = size === "lg" ? "shield shield-lg" : size === "sm" ? "shield shield-sm" : "shield";
  // Alaska and Puerto Rico Interstates are federally recognized but not field-signed,
  // so they get a distinct "unsigned" ghost shield. Hawaii (signed) keeps the standard one.
  const variant = id.startsWith("A-") || id.startsWith("PRI-") ? " shield-unsigned" : "";
  return `<span class="${sizeCls}${variant}" aria-hidden="true"><span class="shield-num">${escapeHtml(shieldText(id))}</span></span>`;
}

// Brand mark: a small interstate shield reading "M" for Multiplex.
function brandShield() {
  return `<span class="shield shield-sm" aria-hidden="true"><span class="shield-num">M</span></span>`;
}

function navHTML(activeKey) {
  const items = nav
    .map((item) => {
      const active = item.match === activeKey ? " is-active" : "";
      const current = active ? ' aria-current="page"' : "";
      return `<a class="nav-link${active}" href="${item.href}"${current}>${escapeHtml(item.label)}</a>`;
    })
    .join("\n          ");

  return `
    <header class="topbar">
      <div class="topbar-inner">
        <a class="brand" href="/" aria-label="${SITE_NAME} home">
          ${brandShield()}
          <span>${SITE_NAME}</span>
        </a>
        <div class="topbar-controls">
          <nav class="nav-links" aria-label="Primary" data-nav>
            ${items}
          </nav>
          <button class="theme-toggle" type="button" aria-label="Toggle light and dark theme" data-theme-toggle>
            <svg class="i-moon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>
            <svg class="i-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>
          </button>
          <button class="nav-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" data-nav-toggle>
            <span></span>
          </button>
        </div>
      </div>
    </header>`;
}

function footerHTML() {
  const cols = footerNav
    .map(
      (col) => `
        <div class="footer-col">
          <h4>${escapeHtml(col.title)}</h4>
          ${col.links.map((l) => `<a href="${l.href}">${escapeHtml(l.label)}</a>`).join("\n          ")}
        </div>`
    )
    .join("");

  return `
    <footer class="site-footer">
      <div class="wrap-wide">
        <div class="footer-top">
          <div class="footer-col">
            <a class="brand" href="/" style="margin-bottom:14px">
              ${brandShield()}
              <span>${SITE_NAME}</span>
            </a>
            <p class="footer-blurb">A reference atlas for the U.S. Interstate Highway System: active routes, the numbering logic, and every possible designation.</p>
          </div>
          ${cols}
        </div>
        <div class="footer-bottom">
          <span>Reference data only. Verify against FHWA, AASHTO, and state DOT records. See <a href="/sources">sources and method</a>.</span>
          <span>Built as a static site. <a href="/sources">About the data</a></span>
        </div>
      </div>
    </footer>`;
}

/**
 * Render a full HTML document.
 * @param {object} opts
 * @param {string} opts.key        - page key (drives active nav)
 * @param {string} opts.title      - <title> contents
 * @param {string} opts.description- meta description
 * @param {string} opts.main       - inner HTML for <main>
 * @param {string} [opts.path]     - canonical path, e.g. "/database"
 * @param {string} [opts.bodyClass]
 * @param {string} [opts.scripts]  - extra <script> tags before </body>
 */
export function renderPage(opts) {
  const { key, title, description, main, path = "/", bodyClass = "", scripts = "" } = opts;
  const canonical = SITE_URL + (path === "/" ? "" : path);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
    <meta name="theme-color" content="#fbfbf8" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#0b0f17" media="(prefers-color-scheme: dark)" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SITE_URL}/assets/og.svg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${SITE_URL}/assets/og.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <script>(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t='light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
    <link rel="stylesheet" href="/assets/styles.css" />
  </head>
  <body class="${bodyClass}">
    <a class="skip-link" href="#main">Skip to content</a>
${navHTML(key)}
    <main id="main">
${main}
    </main>
${footerHTML()}
    <script type="module" src="/assets/ui.mjs"></script>
${scripts}
  </body>
</html>
`;
}

export { SITE_NAME, SITE_URL };
