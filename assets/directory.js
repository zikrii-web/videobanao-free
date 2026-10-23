/* VideoBanao Free — AI tools directory: batched render, search, category + pricing filters, EN/HI */
(function () {
  "use strict";
  var TOOLS = window.VB_TOOLS || [];
  var CATS = {
    "text-to-video": { en: "Text-to-Video", hi: "Text-to-Video जनरेटर" },
    "ai-video-editors": { en: "AI Video Editors", hi: "AI वीडियो एडिटर" },
    "avatar-presenter": { en: "AI Avatar & Presenter", hi: "AI अवतार और प्रेज़ेंटर" },
    "faceless": { en: "Faceless & Text-to-Video", hi: "Faceless और Text-to-Video" },
    "shorts-clips": { en: "Shorts & Clip Makers", hi: "Shorts और Clip मेकर" },
    "ai-animation": { en: "AI Animation", hi: "AI एनिमेशन" },
    "enhancement": { en: "Enhancement & Upscale", hi: "वीडियो Enhancement" },
    "ads-ugc": { en: "AI Video Ads & UGC", hi: "AI वीडियो Ads और UGC" },
    "screen-recording": { en: "Screen Recording & Explainer", hi: "स्क्रीन रिकॉर्डिंग" },
    "dubbing-translation": { en: "Dubbing & Translation", hi: "वीडियो Dubbing और अनुवाद" },
    "broll-stock": { en: "AI B-Roll & Stock Video", hi: "AI B-Roll और Stock वीडियो" },
    "slideshow": { en: "Slideshow & Photo Video", hi: "Slideshow और Photo Video" }
  };
  var TXT = {
    en: { all: "All Tools", search: "Search AI video tools… (e.g. Runway, avatar, free)", showing: "tools", of: "of", details: "Details", visit: "Visit Tool ↗", open: "Open Editor — Free", best: "Best for:", no: "No tools match your search. Try another name or clear the filters.", more: "Load more tools", free: "Free", freemium: "Freemium", paid: "Paid", catlab: "Category", pricelab: "Price" },
    hi: { all: "सारे Tools", search: "AI video tool खोजो… (जैसे Runway, avatar, free)", showing: "tools", of: "/", details: "पूरी जानकारी", visit: "Tool खोलो ↗", open: "Editor खोलो — Free", best: "Best for:", no: "कोई tool नहीं मिला। दूसरा नाम डालो या filters हटाओ।", more: "और tools दिखाओ", free: "Free", freemium: "Freemium", paid: "Paid", catlab: "Category", pricelab: "Price" }
  };
  var BATCH = 60;
  var state = { q: "", cat: "all", price: "all", shown: 0, list: [] };
  var grid, countEl, moreBtn, catChips, priceChips, searchEl;

  function lang() { return window.VB_LANG || "hi"; }
  function T() { return TXT[lang()] || TXT.hi; }
  function stars(r) {
    var full = Math.round(r);
    var s = "";
    for (var i = 0; i < 5; i++) s += i < full ? "★" : "☆";
    return s;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  window.vbLogoErr = function (img, letter) {
    var d = document.createElement("span");
    d.className = "lt"; d.textContent = letter || "?";
    img.replaceWith(d);
  };

  function cardHTML(t, idx) {
    var L = lang();
    var cat = CATS[t.cat] ? CATS[t.cat][L] : t.cat;
    var desc = L === "en" ? t.descEn : t.descHi;
    var priceKey = t.price.toLowerCase();
    var visit = t.internal
      ? '<a class="btn sm" href="' + t.url + '">' + T().open + '</a>'
      : '<a class="btn sm" href="' + esc(t.url) + '" target="_blank" rel="noopener sponsored">' + T().visit + '</a>';
    return '<article class="tool-card' + (t.featured ? " featured" : "") + '" data-idx="' + idx + '">' +
      '<div class="tc-top"><div class="tlogo"><img src="' + esc(t.logo) + '" alt="' + esc(t.name) + ' logo" width="36" height="36" loading="lazy" onerror="vbLogoErr(this,\'' + esc(t.name.charAt(0)) + '\')"></div>' +
      '<div><div class="tc-name">' + esc(t.name) + '</div><div class="tc-cat" data-cat="' + t.cat + '">' + esc(cat) + '</div></div></div>' +
      '<div><span class="stars">' + stars(t.rating) + ' <b>' + t.rating.toFixed(1) + '</span>/5</b> <span class="note">(' + t.rc.toLocaleString("en-IN") + ' ratings)</span></div>' +
      '<span class="pbadge ' + priceKey + '">' + T()[priceKey] + '</span>' +
      '<p class="tc-desc">' + esc(desc) + '</p>' +
      '<p class="tc-best">' + T().best + ' ' + esc(t.best) + '</p>' +
      '<div class="tc-btns"><a class="btn ghost sm" href="/tools/' + t.slug + '/">' + T().details + '</a>' + visit + '</div></article>';
  }

  function applyFilters() {
    var q = state.q.trim().toLowerCase();
    state.list = TOOLS.filter(function (t) {
      if (state.cat !== "all" && t.cat !== state.cat) return false;
      if (state.price !== "all" && t.price !== state.price) return false;
      if (q) {
        var hay = (t.name + " " + t.descEn + " " + t.descHi + " " + t.best + " " + (CATS[t.cat] ? CATS[t.cat].en : "")).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
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
    if (countEl) countEl.textContent = state.shown + " " + T().of + " " + state.list.length + " " + T().showing + " • " + TOOLS.length + " AI video tools listed";
  }
  function buildChips() {
    var L = lang(), counts = {};
    TOOLS.forEach(function (t) { counts[t.cat] = (counts[t.cat] || 0) + 1; });
    var html = '<span class="clab">' + T().catlab + '</span><button type="button" class="fchip' + (state.cat === "all" ? " on" : "") + '" data-cat="all">' + T().all + ' (' + TOOLS.length + ')</button>';
    Object.keys(CATS).forEach(function (c) {
      if (!counts[c]) return;
      html += '<button type="button" class="fchip' + (state.cat === c ? " on" : "") + '" data-cat="' + c + '">' + CATS[c][L] + ' (' + counts[c] + ')</button>';
    });
    catChips.innerHTML = html;
    var ph = '<span class="clab">' + T().pricelab + '</span>';
    ["all", "Free", "Freemium", "Paid"].forEach(function (p) {
      var lab = p === "all" ? T().all : T()[p.toLowerCase()];
      ph += '<button type="button" class="fchip' + (state.price === p ? " on" : "") + '" data-price="' + p + '">' + lab + '</button>';
    });
    priceChips.innerHTML = ph;
    if (searchEl) searchEl.placeholder = T().search;
    if (moreBtn) moreBtn.textContent = T().more;
  }
  function relabel() {
    buildChips();
    grid.querySelectorAll(".tool-card").forEach(function (card) {
      var t = TOOLS[+card.getAttribute("data-idx")];
      if (!t) return;
      var d = card.querySelector(".tc-desc"); if (d) d.textContent = lang() === "en" ? t.descEn : t.descHi;
      var c = card.querySelector(".tc-cat"); if (c) c.textContent = CATS[t.cat] ? CATS[t.cat][lang()] : t.cat;
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
