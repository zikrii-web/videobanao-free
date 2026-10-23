/* VideoBanao Free — AI video GENERATION tools directory v2:
   batched render, search, 15-category + pricing filters, EN/HI.
   Card click (stretched link) -> tool's OFFICIAL website; "Details" -> our /tools/<slug>/ page. */
(function () {
  "use strict";
  var TOOLS = window.VB_TOOLS || [];
  var CATS = {
    "text-to-video": { en: "Text to Video AI", hi: "Text to Video AI" },
    "image-to-video": { en: "Image to Video AI", hi: "Image to Video AI" },
    "ai-animation": { en: "AI Animation Generator", hi: "AI Animation Generator" },
    "avatar-talking": { en: "AI Avatar & Talking Video", hi: "AI Avatar & Talking Video" },
    "cinematic-video": { en: "AI Cinematic Video Generator", hi: "AI Cinematic Video Generator" },
    "character-video": { en: "AI Character Video Generator", hi: "AI Character Video Generator" },
    "music-video": { en: "AI Music Video Generator", hi: "AI Music Video Generator" },
    "product-video": { en: "AI Product Video Generator", hi: "AI Product Video Generator" },
    "explainer-video": { en: "AI Explainer Video Generator", hi: "AI Explainer Video Generator" },
    "video-from-script": { en: "AI Video from Script", hi: "AI Video from Script" },
    "lip-sync-dubbing": { en: "AI Lip Sync & Dubbing", hi: "AI Lip Sync & Dubbing" },
    "video-ads": { en: "AI Video Ads Generator", hi: "AI Video Ads Generator" },
    "cartoon-video": { en: "AI Cartoon Video Generator", hi: "AI Cartoon Video Generator" },
    "3d-video": { en: "AI 3D Video Generator", hi: "AI 3D Video Generator" },
    "open-source-models": { en: "Open Source AI Video Models", hi: "Open Source AI Video Models" }
  };
  var TXT = {
    en: { all: "All Tools", search: "Search AI video generation tools… (e.g. Runway, avatar, lip sync)", showing: "tools", of: "of", details: "Details →", best: "Best for:", freeplan: "Free plan:", no: "No tools match your search. Try another name or clear the filters.", more: "Load more tools", free: "Free", freemium: "Freemium", paid: "Paid", catlab: "Category", pricelab: "Price", listed: "AI video generation tools listed" },
    hi: { all: "सारे Tools", search: "AI video generation tool खोजो… (जैसे Runway, avatar, lip sync)", showing: "tools", of: "/", details: "Details →", best: "Best for:", freeplan: "Free plan:", no: "कोई tool नहीं मिला। दूसरा नाम डालो या filters हटाओ।", more: "और tools दिखाओ", free: "Free", freemium: "Freemium", paid: "Paid", catlab: "Category", pricelab: "Price", listed: "AI video generation tools listed" }
  };
  var BATCH = 60;
  var state = { q: "", cat: "all", price: "all", shown: 0, list: [] };
  var grid, countEl, moreBtn, catChips, priceChips, searchEl;

  function lang() { return window.VB_LANG || "hi"; }
  function T() { return TXT[lang()] || TXT.hi; }
  function stars(r) {
    var full = Math.round(r), s = "";
    for (var i = 0; i < 5; i++) s += i < full ? "★" : "☆";
    return s;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  window.vbLogoErr = function (img, letter) {
    var d = document.createElement("span");
    d.className = "lt"; d.textContent = letter || "?";
    img.replaceWith(d);
  };

  function logoHTML(t) {
    if (t.logoType === "letter" || !t.logo) return '<span class="lt">' + esc(t.name.charAt(0)) + "</span>";
    return '<img src="' + esc(t.logo) + '" alt="' + esc(t.name) + ' logo" width="36" height="36" loading="lazy" onerror="vbLogoErr(this,\'' + esc(t.name.charAt(0)) + "')\">";
  }

  function cardHTML(t, idx) {
    var L = lang();
    var cat = CATS[t.cat] ? CATS[t.cat][L] : t.cat;
    var desc = L === "en" ? t.descEn : t.descHi;
    var tags = (t.caps || []).slice(0, 3).map(function (c) { return '<span class="tag">' + esc(c) + "</span>"; }).join("");
    return '<article class="tool-card" data-idx="' + idx + '">' +
      '<a class="tc-hit" href="' + esc(t.url) + '" target="_blank" rel="noopener sponsored" aria-label="' + esc(t.name) + ' — official website"></a>' +
      '<div class="tc-top"><div class="tlogo">' + logoHTML(t) + '</div>' +
      '<div><div class="tc-name">' + esc(t.name) + '</div><div class="tc-cat" data-cat="' + t.cat + '">' + esc(cat) + "</div></div></div>" +
      '<div><span class="stars">' + stars(t.rating) + " <b>" + t.rating.toFixed(1) + "</b></span>/5" +
      ' <span class="note">(' + t.rc.toLocaleString("en-IN") + " ratings)</span></div>" +
      '<p class="tc-desc">' + esc(desc) + "</p>" +
      (tags ? '<div class="tc-tags">' + tags + "</div>" : "") +
      '<p class="tc-best">' + T().best + " " + esc(t.best) + "</p>" +
      '<p class="tc-free"><b>' + T().freeplan + "</b> " + esc(t.free) + "</p>" +
      '<div class="tc-row"><span class="pbadge ' + t.price.toLowerCase() + '">' + T()[t.price.toLowerCase()] + "</span>" +
      '<a class="btn ghost sm tc-det" href="/tools/' + t.slug + '/">' + T().details + "</a></div></article>";
  }
  window.vbCardHTML = cardHTML;

  function matches(t, q) {
    if (!q) return true;
    var hay = (t.name + " " + t.descEn + " " + t.descHi + " " + t.best + " " + (t.caps || []).join(" ") + " " + (CATS[t.cat] ? CATS[t.cat].en : "")).toLowerCase();
    return hay.indexOf(q) !== -1;
  }
  function applyFilters() {
    var q = state.q.trim().toLowerCase();
    state.list = TOOLS.filter(function (t) {
      if (state.cat !== "all" && t.cat !== state.cat) return false;
      if (state.price !== "all" && t.price !== state.price) return false;
      return matches(t, q);
    });
    state.shown = 0;
    grid.innerHTML = "";
    renderMore();
    updateCount();
  }
  function renderMore() {
    var next = state.list.slice(state.shown, state.shown + BATCH);
    var html = "";
    next.forEach(function (t) { html += cardHTML(t, TOOLS.indexOf(t)); });
    grid.insertAdjacentHTML("beforeend", html);
    state.shown += next.length;
    moreBtn.style.display = state.shown < state.list.length ? "" : "none";
    var nr = document.getElementById("noresults");
    if (nr) nr.style.display = state.list.length ? "none" : "";
    updateCount();
  }
  function updateCount() {
    if (countEl) countEl.textContent = state.shown + " " + T().of + " " + state.list.length + " " + T().showing + " • " + TOOLS.length + " " + T().listed;
  }
  function buildChips() {
    var L = lang(), counts = {};
    TOOLS.forEach(function (t) { counts[t.cat] = (counts[t.cat] || 0) + 1; });
    var html = '<span class="clab">' + T().catlab + '</span><button type="button" class="fchip' + (state.cat === "all" ? " on" : "") + '" data-cat="all">' + T().all + " (" + TOOLS.length + ")</button>";
    Object.keys(CATS).forEach(function (c) {
      if (!counts[c]) return;
      html += '<button type="button" class="fchip' + (state.cat === c ? " on" : "") + '" data-cat="' + c + '">' + CATS[c][L] + " (" + counts[c] + ")</button>";
    });
    catChips.innerHTML = html;
    var ph = '<span class="clab">' + T().pricelab + "</span>";
    ["all", "Free", "Freemium", "Paid"].forEach(function (p) {
      var lab = p === "all" ? T().all : T()[p.toLowerCase()];
      ph += '<button type="button" class="fchip' + (state.price === p ? " on" : "") + '" data-price="' + p + '">' + lab + "</button>";
    });
    priceChips.innerHTML = ph;
    if (searchEl) searchEl.placeholder = T().search;
    if (moreBtn) moreBtn.textContent = T().more;
  }
  function relabel() {
    buildChips();
    document.querySelectorAll(".tool-card[data-idx]").forEach(function (card) {
      var t = TOOLS[+card.getAttribute("data-idx")];
      if (!t) return;
      var d = card.querySelector(".tc-desc"); if (d) d.textContent = lang() === "en" ? t.descEn : t.descHi;
      var c = card.querySelector(".tc-cat"); if (c) c.textContent = CATS[t.cat] ? CATS[t.cat][lang()] : t.cat;
      var b = card.querySelector(".tc-best"); if (b) b.textContent = T().best + " " + t.best;
      var f = card.querySelector(".tc-free"); if (f) f.innerHTML = "<b>" + T().freeplan + "</b> " + esc(t.free);
      var det = card.querySelector(".tc-det"); if (det) det.textContent = T().details;
      var pb = card.querySelector(".pbadge"); if (pb) pb.textContent = T()[t.price.toLowerCase()];
    });
    updateCount();
  }

  document.addEventListener("DOMContentLoaded", function () {
    grid = document.getElementById("tgrid");
    if (!grid) return;
    countEl = document.getElementById("dcount");
    moreBtn = document.getElementById("moreBtn");
    catChips = document.getElementById("catChips");
    priceChips = document.getElementById("priceChips");
    searchEl = document.getElementById("dsearch");
    buildChips();
    applyFilters();
    var t;
    searchEl.addEventListener("input", function () { clearTimeout(t); t = setTimeout(function () { state.q = searchEl.value; applyFilters(); }, 120); });
    catChips.addEventListener("click", function (e) { var b = e.target.closest("[data-cat]"); if (!b) return; state.cat = b.getAttribute("data-cat"); buildChips(); applyFilters(); });
    priceChips.addEventListener("click", function (e) { var b = e.target.closest("[data-price]"); if (!b) return; state.price = b.getAttribute("data-price"); buildChips(); applyFilters(); });
    moreBtn.addEventListener("click", renderMore);
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting && state.shown < state.list.length) renderMore(); }, { rootMargin: "600px" });
      io.observe(moreBtn);
    }
    document.addEventListener("vb-lang", relabel);
  });
})();
