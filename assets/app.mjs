// Browser logic for the interactive pages (database + decoder). Imports the
// shared data module so the live browser and the generated detail pages stay in
// sync. Each page only wires up the widgets it actually contains.

import {
  allRoutes,
  normalizeRouteInput,
  normalizeSearch,
  numericFromId,
  shieldText,
  findRoute,
} from "/data/routes.mjs";

// --- shared helpers ----------------------------------------------------------

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

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

function shieldMarkup(id, size) {
  const sizeCls = size === "lg" ? "shield shield-lg" : size === "sm" ? "shield shield-sm" : "shield";
  const variant = id.startsWith("A-") || id.startsWith("PRI-") ? " shield-unsigned" : "";
  return `<span class="${sizeCls}${variant}" aria-hidden="true"><span class="shield-num">${escapeHtml(shieldText(id))}</span></span>`;
}

const fmt = (n) => (n == null ? null : n.toLocaleString("en-US"));

// ============================================================================
// DATABASE BROWSER
// ============================================================================

const routeList = document.querySelector("#route-list");
const detailPanel = document.querySelector("#route-detail");
const routeSearch = document.querySelector("#route-search");
const routeSort = document.querySelector("#route-sort");
const compareBar = document.querySelector("#compare-bar");
const resultCount = document.querySelector("#result-count");
const resultContext = document.querySelector("#result-context");

if (routeList && detailPanel) {
  const MAX_COMPARE = 4;
  let currentFilter = "all";
  let currentQuery = new URLSearchParams(location.search).get("q") || "";
  let currentSort = "relevance";
  let selectedId = "I-95";
  const compareItems = new Map(); // id -> route

  if (currentQuery && routeSearch) routeSearch.value = currentQuery;

  const statusRank = (item) => {
    if (item.status === "Active") return 0;
    if (item.status === "Federal program") return 1;
    if (item.status === "Notable") return 2;
    if (item.status === "Possible") return 3;
    return 4;
  };

  const sortNumber = (item) => {
    if (Number.isFinite(item.number) && !item.id.startsWith("H-") && !item.id.startsWith("A-") && !item.id.startsWith("PRI-")) {
      return item.number;
    }
    if (item.id.startsWith("H-")) return 1000 + Number(item.id.split("-")[1]);
    if (item.id.startsWith("A-")) return 1100 + Number(item.id.split("-")[1]);
    if (item.id.startsWith("PRI-")) return 1200 + Number(item.id.split("-")[1]);
    return 9999;
  };

  // Subsequence test for light fuzzy matching ("i9" matches "i-95").
  function subseq(needle, hay) {
    let i = 0;
    for (let j = 0; j < hay.length && i < needle.length; j += 1) {
      if (hay[j] === needle[i]) i += 1;
    }
    return i === needle.length;
  }

  function getFilteredRoutes() {
    const query = currentQuery.trim().toLowerCase();
    const normalizedQuery = normalizeSearch(query);
    const fuzzyNeedle = query.replace(/[^0-9a-z]/g, "");

    return allRoutes.filter((item) => {
      const filterMatch =
        currentFilter === "all" ||
        (currentFilter === "primary" && item.category === "Primary" && item.status !== "Unassigned") ||
        (currentFilter === "auxiliary" && item.category === "Auxiliary" && item.status === "Notable") ||
        (currentFilter === "possible" && item.generated) ||
        (currentFilter === "noncontiguous" && item.category === "Non-contiguous");

      if (!filterMatch) return false;
      if (!query) return true;

      const haystack = [
        item.id, item.baseId, String(item.number || ""), item.category, item.status,
        item.states, item.corridor, item.summary, item.parent, item.axis,
        ...(item.cities || []),
      ]
        .join(" ")
        .toLowerCase();

      if (haystack.includes(query)) return true;
      if (normalizeSearch(item.id) === normalizedQuery || String(item.number) === normalizedQuery) return true;
      // fuzzy fallback: subsequence against id + corridor + cities (needs 2+ chars)
      if (fuzzyNeedle.length >= 2) {
        const focus = `${item.id} ${item.corridor} ${(item.cities || []).join(" ")}`.toLowerCase().replace(/[^0-9a-z]/g, "");
        if (subseq(fuzzyNeedle, focus)) return true;
      }
      return false;
    });
  }

  function prioritize(items) {
    return [...items].sort((a, b) => {
      const rankDiff = statusRank(a) - statusRank(b);
      if (rankDiff !== 0) return rankDiff;
      return sortNumber(a) - sortNumber(b) || a.id.localeCompare(b.id);
    });
  }

  function sortRoutes(items) {
    const arr = [...items];
    const nullsLast = (av, bv, dir) => {
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return dir * (av - bv);
    };
    switch (currentSort) {
      case "number":
        return arr.sort((a, b) => sortNumber(a) - sortNumber(b) || a.id.localeCompare(b.id));
      case "length":
        return arr.sort((a, b) => nullsLast(a.lengthMi, b.lengthMi, -1) || sortNumber(a) - sortNumber(b));
      case "year":
        return arr.sort((a, b) => nullsLast(a.year, b.year, 1) || sortNumber(a) - sortNumber(b));
      case "states":
        return arr.sort((a, b) => b.statesList.length - a.statesList.length || sortNumber(a) - sortNumber(b));
      default:
        return prioritize(arr);
    }
  }

  function rowTemplate(item, selected) {
    return `
      <button class="route-row ${item.id === selected ? "is-selected" : ""}" type="button" data-id="${escapeHtml(item.id)}">
        ${shieldMarkup(item.id, "sm")}
        <span>
          <span class="kick">${escapeHtml(item.category)} / ${escapeHtml(item.axis)}</span>
          <span class="name">${escapeHtml(item.id)}</span>
          <p class="desc">${escapeHtml(item.summary)}</p>
        </span>
        <span class="status ${statusClass(item.status)}">${escapeHtml(item.status)}</span>
      </button>`;
  }

  function compareToggleHTML(item) {
    const inSet = compareItems.has(item.id);
    const label = inSet ? "Remove from compare" : "Add to compare";
    return `<button class="btn btn-secondary" type="button" data-cmp="${escapeHtml(item.id)}" style="width:100%;margin-top:10px">${label}</button>`;
  }

  function renderDetail(item) {
    if (!item) {
      detailPanel.innerHTML = `<div class="empty"><h3>No route found</h3><p>Try another number or filter.</p></div>`;
      return;
    }

    const open = item.hasPage
      ? `<a class="btn btn-primary" href="/routes/${item.slug}" style="width:100%;margin-top:18px">Open full page for ${escapeHtml(item.id)}</a>`
      : `<p class="note" style="margin-top:18px">This is a generated number slot, not a documented route, so it has no detail page.</p>`;

    const lengthRow = item.lengthMi != null
      ? `<li><span class="k">Length</span><span class="v mono">${fmt(item.lengthMi)} mi</span></li>`
      : "";
    const yearRow = item.year != null
      ? `<li><span class="k">Designated</span><span class="v mono">${item.year}</span></li>`
      : "";

    detailPanel.innerHTML = `
      <div class="detail-top">
        ${shieldMarkup(item.id, "lg")}
        <span class="status ${statusClass(item.status)}">${escapeHtml(item.status)}</span>
      </div>
      <h3 class="title">${escapeHtml(item.id)}</h3>
      <p>${escapeHtml(item.summary)}</p>
      <ul class="data-list">
        <li><span class="k">Type</span><span class="v">${escapeHtml(item.category)}</span></li>
        <li><span class="k">Axis</span><span class="v">${escapeHtml(item.axis)}</span></li>
        <li><span class="k">States</span><span class="v">${escapeHtml(item.states)}</span></li>
        ${lengthRow}
        ${yearRow}
        <li><span class="k">Parent</span><span class="v">${escapeHtml(item.parent || "None")}</span></li>
      </ul>
      ${open}
      ${compareToggleHTML(item)}`;

    const cmpBtn = detailPanel.querySelector("[data-cmp]");
    if (cmpBtn) {
      cmpBtn.addEventListener("click", () => toggleCompare(item));
    }
  }

  function toggleCompare(item) {
    if (compareItems.has(item.id)) {
      compareItems.delete(item.id);
    } else if (compareItems.size < MAX_COMPARE) {
      compareItems.set(item.id, item);
    }
    renderCompareBar();
    renderDetail(findRoute(allRoutes, selectedId));
  }

  function renderCompareBar() {
    if (!compareBar) return;
    if (compareItems.size === 0) {
      compareBar.hidden = true;
      compareBar.innerHTML = "";
      return;
    }
    const chips = [...compareItems.values()]
      .map((it) => `<button class="cmp-chip" type="button" data-rm="${escapeHtml(it.id)}">${escapeHtml(it.id)} <span aria-hidden="true">&times;</span></button>`)
      .join("");
    compareBar.hidden = false;
    compareBar.innerHTML = `
      <div class="cmp-inner">
        <span class="cmp-count mono">${compareItems.size}/${MAX_COMPARE} selected</span>
        <div class="cmp-chips">${chips}</div>
        <div class="cmp-actions">
          <button class="btn btn-primary" type="button" data-cmp-go ${compareItems.size < 2 ? "disabled" : ""}>Compare</button>
          <button class="btn-ghost" type="button" data-cmp-clear>Clear</button>
        </div>
      </div>`;
  }

  function renderCompareTable() {
    const items = [...compareItems.values()];
    if (items.length < 2) return;
    const head = items.map((it) => `<th>${shieldMarkup(it.id, "sm")}<span>${escapeHtml(it.id)}</span></th>`).join("");
    const row = (label, fn) => `<tr><th scope="row">${escapeHtml(label)}</th>${items.map((it) => `<td>${fn(it)}</td>`).join("")}</tr>`;
    detailPanel.innerHTML = `
      <div class="cmp-table-head">
        <h3 style="margin:0">Compare</h3>
        <button class="btn-ghost" type="button" data-cmp-close>Close</button>
      </div>
      <div style="overflow:auto">
      <table class="cmp-table">
        <thead><tr><th></th>${head}</tr></thead>
        <tbody>
          ${row("Status", (it) => `<span class="status ${statusClass(it.status)}">${escapeHtml(it.status)}</span>`)}
          ${row("Length", (it) => (it.lengthMi != null ? `<span class="mono">${fmt(it.lengthMi)} mi</span>` : "n/a"))}
          ${row("Designated", (it) => (it.year != null ? `<span class="mono">${it.year}</span>` : "n/a"))}
          ${row("States", (it) => `<span class="mono">${it.statesList.length || "n/a"}</span>`)}
          ${row("Axis", (it) => escapeHtml(it.axis))}
          ${row("Parent", (it) => escapeHtml(it.parent || "None"))}
          ${row("Corridor", (it) => escapeHtml(it.corridor))}
        </tbody>
      </table>
      </div>`;
    const close = detailPanel.querySelector("[data-cmp-close]");
    if (close) close.addEventListener("click", () => renderDetail(findRoute(allRoutes, selectedId)));
  }

  function render() {
    const filtered = getFilteredRoutes();
    const limited = sortRoutes(filtered).slice(0, 200);
    const selected = filtered.find((r) => r.id === selectedId) || limited[0] || null;

    resultCount.textContent = `${filtered.length.toLocaleString()} result${filtered.length === 1 ? "" : "s"}`;
    resultContext.textContent = currentQuery
      ? `Matching "${currentQuery.trim()}"`
      : currentFilter === "all"
        ? "Showing the full index"
        : `Filtered by ${currentFilter}`;

    if (!limited.length) {
      routeList.innerHTML = `<div class="empty">No route records match that search.</div>`;
      renderDetail(null);
      return;
    }

    routeList.innerHTML = limited.map((item) => rowTemplate(item, selected ? selected.id : "")).join("");
    routeList.querySelectorAll(".route-row").forEach((button) => {
      button.addEventListener("click", () => {
        selectedId = button.dataset.id;
        render();
        renderDetail(findRoute(allRoutes, selectedId));
      });
    });

    if (selected) {
      selectedId = selected.id;
      renderDetail(selected);
    }
  }

  // Keyboard navigation across the result list.
  routeList.addEventListener("keydown", (event) => {
    const rows = [...routeList.querySelectorAll(".route-row")];
    const idx = rows.indexOf(document.activeElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      (rows[idx + 1] || rows[0]).focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      (idx <= 0 ? rows[rows.length - 1] : rows[idx - 1]).focus();
    } else if (event.key === "Enter" && idx >= 0) {
      const route = findRoute(allRoutes, rows[idx].dataset.id);
      if (route && route.hasPage) {
        event.preventDefault();
        window.location.href = "/routes/" + route.slug;
      }
    }
  });

  if (routeSearch) {
    routeSearch.addEventListener("input", (event) => {
      currentQuery = event.target.value;
      render();
    });
    routeSearch.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        const first = routeList.querySelector(".route-row");
        if (first) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  if (routeSort) {
    routeSort.addEventListener("change", (event) => {
      currentSort = event.target.value;
      render();
    });
  }

  if (compareBar) {
    compareBar.addEventListener("click", (event) => {
      const rm = event.target.closest("[data-rm]");
      if (rm) {
        compareItems.delete(rm.dataset.rm);
        renderCompareBar();
        renderDetail(findRoute(allRoutes, selectedId));
        return;
      }
      if (event.target.closest("[data-cmp-clear]")) {
        compareItems.clear();
        renderCompareBar();
        renderDetail(findRoute(allRoutes, selectedId));
        return;
      }
      if (event.target.closest("[data-cmp-go]")) {
        renderCompareTable();
      }
    });
  }

  document.querySelectorAll(".filter").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach((b) => b.classList.remove("is-active"));
      button.classList.add("is-active");
      currentFilter = button.dataset.filter;
      render();
    });
  });

  render();
  renderCompareBar();
}

// ============================================================================
// DECODER
// ============================================================================

const decoderInput = document.querySelector("#decoder-input");
const decoderOutput = document.querySelector("#decoder-output");

if (decoderInput && decoderOutput) {
  function renderDecoder(value) {
    const normalized = normalizeRouteInput(value);
    const item = normalized ? findRoute(allRoutes, normalized) : null;
    const numeric = numericFromId(normalized || "");

    if (!normalized || !numeric) {
      decoderOutput.innerHTML = `<h3>Enter a route number</h3><p>Examples: I-95, 95, I-495, 495, H-3, or PRI-1.</p>`;
      return;
    }

    if (item) {
      const dirBit = item.axis === "North-south" || item.axis === "East-west"
        ? ` It runs roughly ${item.axis.toLowerCase()}.`
        : "";
      const parentBit = item.parent ? ` Parent route: ${escapeHtml(item.parent)}.` : "";
      const pageBit = item.hasPage
        ? ` <a class="btn-ghost" href="/routes/${item.slug}">Open the full ${escapeHtml(item.id)} page</a>`
        : "";

      // Show the route's place in the family: its parent + sibling auxiliaries
      // (other children of the same parent), or, for a two-digit mainline, its
      // own auxiliary children.
      const relatedLink = (rel) => {
        const href = rel.hasPage ? `/routes/${rel.slug}` : `/database?q=${encodeURIComponent(rel.id)}`;
        return `<a href="${href}">${shieldMarkup(rel.id, "sm")}<span>${escapeHtml(rel.id)}</span></a>`;
      };
      let family = "";
      if (item.parent) {
        const parent = findRoute(allRoutes, item.parent);
        const siblings = allRoutes
          .filter((r) => r.parent === item.parent && r.id !== item.id)
          .sort((a, b) => numericFromId(a.id) - numericFromId(b.id));
        family = `
        <div class="decoder-family">
          ${parent ? `<p class="k mono">Parent</p><div class="junction-links">${relatedLink(parent)}</div>` : ""}
          ${siblings.length ? `<p class="k mono" style="margin-top:14px">Sibling auxiliaries</p><div class="junction-links">${siblings.map(relatedLink).join("")}</div>` : ""}
        </div>`;
      } else {
        const children = allRoutes
          .filter((r) => r.parent === item.id)
          .sort((a, b) => numericFromId(a.id) - numericFromId(b.id));
        if (children.length) {
          family = `
        <div class="decoder-family">
          <p class="k mono">Auxiliary routes</p>
          <div class="junction-links">${children.map(relatedLink).join("")}</div>
        </div>`;
        }
      }

      decoderOutput.innerHTML = `
        <div class="detail-top" style="margin-bottom:14px">
          ${shieldMarkup(item.id)}
          <span class="status ${statusClass(item.status)}">${escapeHtml(item.status)}</span>
        </div>
        <h3>${escapeHtml(item.id)} is ${escapeHtml(item.status.toLowerCase())}.</h3>
        <p>${escapeHtml(item.summary)}${dirBit}${parentBit}${pageBit}</p>${family}`;
      return;
    }

    decoderOutput.innerHTML = `
      <h3>${escapeHtml(normalized)} is outside the generated index.</h3>
      <p>Numeric Interstate patterns run from I-1 through I-999, excluding three-digit numbers ending in 00, which have no parent route.</p>`;
  }

  decoderInput.addEventListener("input", () => renderDecoder(decoderInput.value));

  document.querySelectorAll(".decoder-examples button").forEach((button) => {
    button.addEventListener("click", () => {
      decoderInput.value = button.dataset.example;
      renderDecoder(decoderInput.value);
      decoderInput.focus();
    });
  });

  renderDecoder("I-270");
}
