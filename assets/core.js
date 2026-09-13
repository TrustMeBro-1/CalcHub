var CalcHub = (function () {
  "use strict";

  var HISTORY_KEY  = "calchub_history_v1";
  var FAV_KEY       = "calchub_favorites_v1";
  var RECENT_KEY    = "calchub_recents_v1";
  var LASTIN_PREFIX = "calchub_lastinputs_";
  var HISTORY_CAP   = 300;
  var RECENT_CAP    = 10;

  var CATEGORY_LABELS = {
    finance: "Finance & Investment",
    math: "Mathematics & Algebra",
    science: "Science & Physics",
    health: "Health & Wellness",
    education: "Education & Grades",
    tools: "Quick Tools"
  };

  var CATEGORY_COLORVAR = {
    finance: "--finance", math: "--math", science: "--science",
    health: "--health", education: "--education", tools: "--tools"
  };

  /* ---------------- REGISTRY (all 47 calculators + quick calc) --------- */
  var REGISTRY = [{"id": "quick-calculator", "name": "Quick Calculator", "category": "tools", "url": "#quick-calc"}, {"id": "mortgage-calculator", "name": "Mortgage Calculator", "category": "finance", "url": "calculators/mortgage-calculator.html"}, {"id": "loan-repayment-planner", "name": "Loan Repayment Planner", "category": "finance", "url": "calculators/loan-repayment-planner.html"}, {"id": "compound-interest-calculator", "name": "Compound Interest Calculator", "category": "finance", "url": "calculators/compound-interest-calculator.html"}, {"id": "retirement-401k-estimator", "name": "Retirement & 401(k) Estimator", "category": "finance", "url": "calculators/retirement-401k-estimator.html"}, {"id": "credit-card-debt-payoff", "name": "Credit Card Debt Payoff", "category": "finance", "url": "calculators/credit-card-debt-payoff.html"}, {"id": "auto-loan-lease-finder", "name": "Auto Loan & Lease Finder", "category": "finance", "url": "calculators/auto-loan-lease-finder.html"}, {"id": "simple-income-tax-estimator", "name": "Simple Income Tax Estimator", "category": "finance", "url": "calculators/simple-income-tax-estimator.html"}, {"id": "budget-calculator", "name": "Budget Calculator", "category": "finance", "url": "calculators/budget-calculator.html"}, {"id": "sales-tax-calculator", "name": "Sales Tax Calculator", "category": "finance", "url": "calculators/sales-tax-calculator.html"}, {"id": "income-tax-calculator", "name": "Income Tax Calculator", "category": "finance", "url": "calculators/income-tax-calculator.html"}, {"id": "investment-calculator", "name": "Investment Calculator", "category": "finance", "url": "calculators/investment-calculator.html"}, {"id": "net-worth-calculator", "name": "Net Worth Calculator", "category": "finance", "url": "calculators/net-worth-calculator.html"}, {"id": "take-home-paycheck-calculator", "name": "Take-Home Paycheck Calculator", "category": "finance", "url": "calculators/take-home-paycheck-calculator.html"}, {"id": "interest-rate-calculator", "name": "Interest Rate Calculator", "category": "finance", "url": "calculators/interest-rate-calculator.html"}, {"id": "emergency-fund-calculator", "name": "Emergency Fund Calculator", "category": "finance", "url": "calculators/emergency-fund-calculator.html"}, {"id": "wage-calculator", "name": "Wage Calculator", "category": "finance", "url": "calculators/wage-calculator.html"}, {"id": "rent-vs-buy-calculator", "name": "Rent vs Buy Calculator", "category": "finance", "url": "calculators/rent-vs-buy-calculator.html"}, {"id": "refinance-calculator", "name": "Refinance Calculator", "category": "finance", "url": "calculators/refinance-calculator.html"}, {"id": "scientific-calculator", "name": "Advanced Scientific Calculator", "category": "math", "url": "calculators/scientific-calculator.html"}, {"id": "fraction-decimal-converter", "name": "Fraction & Decimal Converter", "category": "math", "url": "calculators/fraction-decimal-converter.html"}, {"id": "percentage-ratio-calculator", "name": "Percentage & Ratio Calculator", "category": "math", "url": "calculators/percentage-ratio-calculator.html"}, {"id": "statistics-standard-deviation", "name": "Statistics & Standard Deviation", "category": "math", "url": "calculators/statistics-standard-deviation.html"}, {"id": "matrix-multiplier-solver", "name": "Matrix Multiplier & Solver", "category": "math", "url": "calculators/matrix-multiplier-solver.html"}, {"id": "geometry-area-volume", "name": "Geometry Area & Volume Maker", "category": "math", "url": "calculators/geometry-area-volume.html"}, {"id": "random-number-generator", "name": "Random Number Generator", "category": "math", "url": "calculators/random-number-generator.html"}, {"id": "graphing-calculator", "name": "Graphing Calculator", "category": "math", "url": "calculators/graphing-calculator.html"}, {"id": "algebra-solver", "name": "Algebra and Calculus Solver", "category": "math", "url": "calculators/algebra-solver.html"}, {"id": "hp-42s-rpn-calculator", "name": "HP-42S RPN Calculator", "category": "math", "url": "calculators/hp-42s-rpn-calculator.html"}, {"id": "unit-converter", "name": "Comprehensive Unit Converter", "category": "science", "url": "calculators/unit-converter.html"}, {"id": "temperature-converter", "name": "Temperature Scales Converter", "category": "science", "url": "calculators/temperature-converter.html"}, {"id": "ideal-gas-law", "name": "Ideal Gas Law Workspace", "category": "science", "url": "calculators/ideal-gas-law.html"}, {"id": "speed-distance-time", "name": "Speed, Distance & Time Solver", "category": "science", "url": "calculators/speed-distance-time.html"}, {"id": "molar-mass-calculator", "name": "Molar Mass Calculator", "category": "science", "url": "calculators/molar-mass-calculator.html"}, {"id": "ohms-law-calculator", "name": "Ohm's Law & Circuit Analyzer", "category": "science", "url": "calculators/ohms-law-calculator.html"}, {"id": "half-life-decay", "name": "Half-Life Decay Simulator", "category": "science", "url": "calculators/half-life-decay.html"}, {"id": "projectile-motion-calculator", "name": "Projectile Motion Calculator", "category": "science", "url": "calculators/projectile-motion-calculator.html"}, {"id": "bmi-calculator", "name": "BMI (Body Mass Index) Calculator", "category": "health", "url": "calculators/bmi-calculator.html"}, {"id": "calorie-tdee-tracker", "name": "Calorie Burn & TDEE Tracker", "category": "health", "url": "calculators/calorie-tdee-tracker.html"}, {"id": "body-fat-percentage", "name": "Body Fat Percentage Estimator", "category": "health", "url": "calculators/body-fat-percentage.html"}, {"id": "macro-nutrient-split", "name": "Macro Nutrient Split Ratio", "category": "health", "url": "calculators/macro-nutrient-split.html"}, {"id": "ideal-weight-calculator", "name": "Ideal Weight Calculator", "category": "health", "url": "calculators/ideal-weight-calculator.html"}, {"id": "pregnancy-due-date", "name": "Pregnancy & Due Date Tracker", "category": "health", "url": "calculators/pregnancy-due-date.html"}, {"id": "blood-pressure-evaluator", "name": "Blood Pressure Metric Evaluator", "category": "health", "url": "calculators/blood-pressure-evaluator.html"}, {"id": "gpa-calculator", "name": "GPA & Weighted GPA Calculator", "category": "education", "url": "calculators/gpa-calculator.html"}, {"id": "final-grade-calculator", "name": "Final Grade Calculator Estimator", "category": "education", "url": "calculators/final-grade-calculator.html"}, {"id": "test-score-percentage", "name": "Test Score Percentage Finder", "category": "education", "url": "calculators/test-score-percentage.html"}, {"id": "college-admissions-tracker", "name": "College Admissions Tracker", "category": "education", "url": "calculators/college-admissions-tracker.html"}, {"id": "words-to-pages-converter", "name": "Words-To-Pages Document Converter", "category": "education", "url": "calculators/words-to-pages-converter.html"}, {"id": "scientific-notation-translator", "name": "Scientific Notation Translator", "category": "education", "url": "calculators/scientific-notation-translator.html"}, {"id": "binary-hex-translator", "name": "Binary & Hexadecimal Translator", "category": "education", "url": "calculators/binary-hex-translator.html"}, {"id": "college-cost-calculator", "name": "College Cost Calculator", "category": "finance", "url": "calculators/college-cost-calculator.html"}, {"id": "fuel-cost-calculator", "name": "Fuel Cost Calculator", "category": "tools", "url": "calculators/fuel-cost-calculator.html"}, {"id": "electricity-cost-calculator", "name": "Electricity Cost Calculator", "category": "tools", "url": "calculators/electricity-cost-calculator.html"}, {"id": "qr-code-generator", "name": "QR Code Generator", "category": "tools", "url": "calculators/qr-code-generator.html"}, {"id": "password-generator", "name": "Password Generator", "category": "tools", "url": "calculators/password-generator.html"}, {"id": "time-zone-calculator", "name": "Time Zone Calculator", "category": "tools", "url": "calculators/time-zone-calculator.html"}, {"id": "robux-to-usd-calculator", "name": "Robux to USD Calculator", "category": "tools", "url": "calculators/robux-to-usd-calculator.html"}];

  var REGISTRY_MAP = {};
  REGISTRY.forEach(function (c) { REGISTRY_MAP[c.id] = c; });

  function getCalcMeta(id) { return REGISTRY_MAP[id] || null; }

  /* ---------------- storage helpers ---------------- */
  function readJSON(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) { return fallback; }
  }
  function writeJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
  function uid() { return "h_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8); }

  /* ---------------- formatting ---------------- */
  function fmtUSD(n) {
    if (!isFinite(n)) return "$0";
    var sign = n < 0 ? "-" : "";
    n = Math.abs(n);
    return sign + "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function fmtUSD0(n) {
    if (!isFinite(n)) return "$0";
    var sign = n < 0 ? "-" : "";
    n = Math.abs(n);
    return sign + "$" + Math.round(n).toLocaleString("en-US");
  }
  function fmtNum(n, dec) {
    if (!isFinite(n)) return "0";
    dec = dec === undefined ? 2 : dec;
    return n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }
  function fmtPct(n, dec) {
    if (!isFinite(n)) return "0%";
    dec = dec === undefined ? 1 : dec;
    return n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + "%";
  }
  function fmtRelTime(iso) {
    var then = new Date(iso).getTime();
    var now = Date.now();
    var diff = Math.max(0, now - then);
    var min = Math.floor(diff / 60000);
    if (min < 1) return "just now";
    if (min < 60) return min + "m ago";
    var hr = Math.floor(min / 60);
    if (hr < 24) return hr + "h ago";
    var day = Math.floor(hr / 24);
    if (day < 7) return day + "d ago";
    var d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------- history ---------------- */
  function getHistory() { return readJSON(HISTORY_KEY, []); }
  function getHistoryFor(calcId) { return getHistory().filter(function (e) { return e.calcId === calcId; }); }
  function addHistory(entry) {
    var list = getHistory();
    var full = Object.assign({ id: uid(), timestamp: new Date().toISOString() }, entry);
    list.unshift(full);
    if (list.length > HISTORY_CAP) list.length = HISTORY_CAP;
    writeJSON(HISTORY_KEY, list);
    fire("history-changed");
    return full;
  }
  function deleteHistoryEntry(id) {
    var list = getHistory().filter(function (e) { return e.id !== id; });
    writeJSON(HISTORY_KEY, list);
    fire("history-changed");
  }
  function clearHistory(calcId) {
    var list = calcId ? getHistory().filter(function (e) { return e.calcId !== calcId; }) : [];
    writeJSON(HISTORY_KEY, list);
    fire("history-changed");
  }

  /* ---------------- favorites ---------------- */
  function getFavorites() { return readJSON(FAV_KEY, []); }
  function isFavorite(id) { return getFavorites().indexOf(id) !== -1; }
  function toggleFavorite(id) {
    var favs = getFavorites();
    var idx = favs.indexOf(id);
    if (idx === -1) favs.push(id); else favs.splice(idx, 1);
    writeJSON(FAV_KEY, favs);
    fire("favorites-changed");
    return favs.indexOf(id) !== -1;
  }

  /* ---------------- recents ---------------- */
  function getRecents() { return readJSON(RECENT_KEY, []); }
  function addRecent(id) {
    var list = getRecents().filter(function (r) { return r.calcId !== id; });
    list.unshift({ calcId: id, timestamp: new Date().toISOString() });
    if (list.length > RECENT_CAP) list.length = RECENT_CAP;
    writeJSON(RECENT_KEY, list);
    fire("recents-changed");
  }
  function clearRecents() {
    writeJSON(RECENT_KEY, []);
    fire("recents-changed");
  }

  /* ---------------- last inputs (continue where you left off) ---------- */
  function saveLastInputs(calcId, values) { writeJSON(LASTIN_PREFIX + calcId, values); }
  function getLastInputs(calcId) { return readJSON(LASTIN_PREFIX + calcId, null); }

  /* ---------------- events ---------------- */
  function fire(name) { document.dispatchEvent(new CustomEvent("calchub:" + name)); }
  function on(name, fn) { document.addEventListener("calchub:" + name, fn); }

  /* ---------------- toast ---------------- */
  var toastTimer = null;
  function toast(msg) {
    var el = document.getElementById("calchub-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "calchub-toast";
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("visible"); }, 1800);
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast("Copied to clipboard"); })
        .catch(function () { fallbackCopy(text); });
    } else {
      fallbackCopy(text);
    }
  }
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); toast("Copied to clipboard"); } catch (e) { toast("Could not copy"); }
    document.body.removeChild(ta);
  }

  /* ============================================================
     ANALYTICS
     One place to configure GA4 for the whole site — replace the
     placeholder ID below with your real Measurement ID once, here,
     instead of pasting a tracking snippet into every page's <head>.
     ============================================================ */
  var GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; // <-- replace with your real GA4 ID
  var analyticsLoaded = false;
  function initAnalytics() {
    if (analyticsLoaded || GA_MEASUREMENT_ID.indexOf("XXXX") !== -1) {
      if (GA_MEASUREMENT_ID.indexOf("XXXX") !== -1) {
        console.warn("CalcHub: set a real GA_MEASUREMENT_ID in assets/core.js to enable analytics.");
      }
      return;
    }
    analyticsLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID);
    window.gtag = gtag;
  }

  /* ============================================================
     THEME TOGGLE
     ============================================================ */
  function initTheme() {
    var btn = document.getElementById("theme-toggle");
    var root = document.documentElement;
    var saved = null;
    try { saved = localStorage.getItem("calchub_theme"); } catch (e) {}
    if (saved === "dark") root.setAttribute("data-theme", "dark");
    if (btn) {
      btn.addEventListener("click", function () {
        var isDark = root.getAttribute("data-theme") === "dark";
        if (isDark) { root.removeAttribute("data-theme"); } else { root.setAttribute("data-theme", "dark"); }
        try { localStorage.setItem("calchub_theme", isDark ? "light" : "dark"); } catch (e) {}
      });
    }
  }

  /* ============================================================
     LIVE SEARCH (homepage directory)
     ============================================================ */
  function initSearch() {
    var input = document.getElementById("calc-search");
    if (!input) return;
    input.addEventListener("input", function () {
      var term = input.value.trim().toLowerCase();
      var rows = document.querySelectorAll(".calc-row");
      rows.forEach(function (row) {
        var link = row.querySelector(".calc-link");
        var text = link ? link.textContent.toLowerCase() : "";
        var match = term === "" || text.indexOf(term) !== -1;
        row.style.display = match ? "" : "none";
      });
      var cards = document.querySelectorAll(".category-card");
      cards.forEach(function (card) {
        var visibleRows = card.querySelectorAll(".calc-row");
        var anyVisible = Array.prototype.some.call(visibleRows, function (r) { return r.style.display !== "none"; });
        card.style.display = (visibleRows.length === 0 || anyVisible) ? "" : "none";
      });
    });
  }

  /* ============================================================
     SCROLL FADE-IN
     ============================================================ */
  function initScrollFade() {
    var cards = document.querySelectorAll(".category-card");
    if (!cards.length || !("IntersectionObserver" in window)) return;
    cards.forEach(function (c) { c.classList.add("fade-init"); });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          entry.target.classList.remove("fade-init");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    cards.forEach(function (c) { obs.observe(c); });
  }

  /* ============================================================
     FAVORITE STAR BUTTON
     ============================================================ */
  function starSVG(filled) {
    return '<svg class="icon" viewBox="0 0 24 24" width="16" height="16" fill="' + (filled ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="1.8"><polygon points="12 2.5 15.1 9 22.2 10 17.1 15 18.3 22 12 18.6 5.7 22 6.9 15 1.8 10 8.9 9"/></svg>';
  }
  function renderFavoriteStar(el, calcId, opts) {
    if (!el) return;
    opts = opts || {};
    var persistent = opts.persistent !== false;
    function paint() {
      var fav = isFavorite(calcId);
      el.innerHTML = starSVG(fav);
      el.classList.toggle("is-fav", fav);
      el.setAttribute("aria-label", fav ? "Remove from favorites" : "Add to favorites");
      el.title = fav ? "Remove from favorites" : "Add to favorites";
    }
    paint();
    el.addEventListener("click", function (e) {
      e.preventDefault(); e.stopPropagation();
      var nowFav = toggleFavorite(calcId);
      paint();
      toast(nowFav ? "Added to favorites" : "Removed from favorites");
    });
    /* Only register a permanent document-level listener for stars that live
       on the page long-term (the calc-row grid). Stars inside a modal/list
       get destroyed and rebuilt on every repaint via bindPillStars(), so
       giving THOSE a persistent listener too would leak one more listener
       into memory on every single toggle, forever. */
    if (persistent) on("favorites-changed", paint);
  }

  /* ============================================================
     HISTORY PANEL  (used on homepage = global, and on calc pages = filtered)
     ============================================================ */
  function historyItemHTML(entry) {
    var meta = getCalcMeta(entry.calcId);
    var name = entry.calcName || (meta ? meta.name : "Calculator");
    var cat = entry.category || (meta ? meta.category : "tools");
    return (
      '<div class="history-item" data-id="' + entry.id + '">' +
        '<div class="history-item-main">' +
          '<div class="history-item-label">' + escapeHTML(entry.label) + '</div>' +
          '<div class="history-item-meta">' +
            '<span class="badge-category badge-' + cat + '">' + escapeHTML(name) + '</span>' +
            '<span class="history-item-time">' + fmtRelTime(entry.timestamp) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="history-item-actions">' +
          '<button class="icon-btn copy-btn" title="Copy result" aria-label="Copy result">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>' +
          '</button>' +
          '<button class="icon-btn danger delete-btn" title="Delete entry" aria-label="Delete entry">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>'
    );
  }

  function renderHistoryPanel(el, opts) {
    if (!el) return;
    opts = opts || {};
    var calcId = opts.calcId || null;
    var limit = opts.limit || 60;
    var emptyText = opts.emptyText || "Your calculations will show up here as you use CalcHub's tools.";
    var emptyHTML = opts.emptyHTML || null;
    var title = opts.title !== undefined ? opts.title : "Calculation History";

    el.innerHTML =
      '<div class="history-toolbar">' +
        (title ? '' : '') +
        '<button class="btn-text-small clear-all-btn">Clear all</button>' +
      '</div>' +
      '<div class="history-list"></div>';

    var listEl = el.querySelector(".history-list");
    var clearBtn = el.querySelector(".clear-all-btn");

    function paint() {
      var items = calcId ? getHistoryFor(calcId) : getHistory();
      items = items.slice(0, limit);
      if (!items.length) {
        listEl.innerHTML = emptyHTML ? emptyHTML : '<div class="empty-state">' + escapeHTML(emptyText) + '</div>';
        clearBtn.style.display = "none";
        bindPillStars(listEl);
        return;
      }
      clearBtn.style.display = "";
      listEl.innerHTML = items.map(historyItemHTML).join("");
    }

    listEl.addEventListener("click", function (e) {
      var copyBtn = e.target.closest(".copy-btn");
      var delBtn = e.target.closest(".delete-btn");
      var item = e.target.closest(".history-item");
      if (!item) return;
      var id = item.getAttribute("data-id");
      if (copyBtn) {
        var entry = getHistory().find(function (h) { return h.id === id; });
        if (entry) copyText(entry.resultValue || entry.label);
      } else if (delBtn) {
        deleteHistoryEntry(id);
      }
    });

    clearBtn.addEventListener("click", function () {
      clearHistory(calcId || undefined);
      toast("History cleared");
    });

    paint();
    on("history-changed", paint);
  }

  /* ============================================================
     FAVORITES / RECENTS SECTIONS (homepage)
     ============================================================ */
  function pillRowHTML(meta) {
    var colorVar = CATEGORY_COLORVAR[meta.category] || "--tools";
    return (
      '<div class="pill-row">' +
        '<span class="pill-dot" style="background:var(' + colorVar + ')"></span>' +
        '<a class="pill-link" href="' + meta.url + '">' + escapeHTML(meta.name) + '</a>' +
        '<span class="pill-meta">' + escapeHTML(CATEGORY_LABELS[meta.category] || "") + '</span>' +
        '<button class="fav-star-btn" data-calc-id="' + meta.id + '" aria-label="Toggle favorite"></button>' +
      '</div>'
    );
  }

  function bindPillStars(el) {
    el.querySelectorAll(".fav-star-btn").forEach(function (btn) {
      renderFavoriteStar(btn, btn.getAttribute("data-calc-id"), { persistent: false });
    });
  }

  function renderPicksHTML(ids, opts) {
    opts = opts || {};
    var metas = ids.map(getCalcMeta).filter(Boolean);
    if (!metas.length) return "";
    var heading = opts.heading || "Nothing here yet \u2014 today's picks:";
    return (
      '<div class="empty-state recommend-block">' +
        '<div class="recommend-title">' + escapeHTML(heading) + '</div>' +
        '<div class="pill-list">' + metas.map(pillRowHTML).join("") + '</div>' +
      '</div>'
    );
  }

  function renderFavoritesSection(el, opts) {
    if (!el) return;
    opts = opts || {};
    var emptyHTML = opts.emptyHTML || null;
    function paint() {
      var favs = getFavorites().map(getCalcMeta).filter(Boolean);
      if (!favs.length) {
        el.innerHTML = emptyHTML || '<div class="empty-state">Star a calculator to pin it here for quick access.</div>';
        bindPillStars(el);
        return;
      }
      el.innerHTML = '<div class="pill-list">' + favs.map(pillRowHTML).join("") + '</div>';
      bindPillStars(el);
    }
    paint();
    on("favorites-changed", paint);
  }

  function renderRecentsSection(el, opts) {
    if (!el) return;
    opts = opts || {};
    var emptyHTML = opts.emptyHTML || null;
    var showClear = !!opts.showClear;

    if (showClear) {
      el.innerHTML = '<div class="history-toolbar"><button class="btn-text-small clear-all-btn">Clear all</button></div><div class="recents-list"></div>';
    } else {
      el.innerHTML = '<div class="recents-list"></div>';
    }
    var listEl = el.querySelector(".recents-list");
    var clearBtn = el.querySelector(".clear-all-btn");

    function paint() {
      var recents = getRecents().map(function (r) { return getCalcMeta(r.calcId); }).filter(Boolean);
      if (!recents.length) {
        listEl.innerHTML = emptyHTML || '<div class="empty-state">Calculators you use will show up here for quick access.</div>';
        if (clearBtn) clearBtn.style.display = "none";
        bindPillStars(listEl);
        return;
      }
      if (clearBtn) clearBtn.style.display = "";
      listEl.innerHTML = '<div class="pill-list">' + recents.map(pillRowHTML).join("") + '</div>';
      bindPillStars(listEl);
    }
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        clearRecents();
        toast("Cleared");
      });
    }
    paint();
    on("recents-changed", paint);
    on("favorites-changed", paint);
  }

  /* ============================================================
     CHARTS (dependency-free canvas)
     ============================================================ */
  var PALETTE = ["#1a5f85", "#1a6e3c", "#b84f00", "#5a1a8a", "#a32020", "#0d6e91", "#8a6a1a", "#3a7d44"];

  function setupCanvas(canvas) {
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    var w = Math.max(rect.width, 240);
    var h = Math.max(rect.height, 180);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    return { ctx: ctx, w: w, h: h };
  }

  function isDark() { return document.documentElement.getAttribute("data-theme") === "dark"; }
  function axisColor() { return isDark() ? "#3a4a63" : "#dbe4ee"; }
  function textColor() { return isDark() ? "#94a3b8" : "#64748b"; }

  /* ============================================================
     CHART PDF EXPORT
     Requires jsPDF (window.jspdf.jsPDF) to be loaded on the page —
     only include the jsPDF <script> tag on pages that actually have
     a chart/graph, not site-wide.
     ============================================================ */
  function downloadCanvasAsPDF(canvas, filename) {
    if (!canvas) { return; }
    if (!window.jspdf || !window.jspdf.jsPDF) {
      console.warn("CalcHub: jsPDF isn't loaded on this page, can't export a PDF.");
      toast("PDF export isn't available on this page.");
      return;
    }
    var imgData = canvas.toDataURL("image/png", 1.0);
    var pxW = canvas.width, pxH = canvas.height;
    var orientation = pxW >= pxH ? "landscape" : "portrait";
    var doc = new window.jspdf.jsPDF({ orientation: orientation, unit: "pt", format: "letter" });
    var pageW = doc.internal.pageSize.getWidth() - 72;  // 36pt margin each side
    var pageH = doc.internal.pageSize.getHeight() - 108; // room for a title line
    var scale = Math.min(pageW / pxW, pageH / pxH);
    var drawW = pxW * scale, drawH = pxH * scale;
    var x = (doc.internal.pageSize.getWidth() - drawW) / 2;
    doc.setFontSize(14);
    doc.text("CalcHub", 36, 36);
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(new Date().toLocaleDateString(), 36, 52);
    doc.addImage(imgData, "PNG", x, 64, drawW, drawH);
    doc.save(filename || "calchub-chart.pdf");
  }

  function drawChart(canvas, cfg) {
    if (!canvas) return;
    var setup = setupCanvas(canvas);
    var ctx = setup.ctx, w = setup.w, h = setup.h;
    ctx.font = "11px Inter, sans-serif";
    if (cfg.type === "donut" || cfg.type === "pie") drawDonut(ctx, w, h, cfg);
    else if (cfg.type === "line") drawLineOrBar(ctx, w, h, cfg, "line");
    else drawLineOrBar(ctx, w, h, cfg, "bar");
  }

  function drawDonut(ctx, w, h, cfg) {
    var labels = cfg.labels || [];
    var data = cfg.data || [];
    var total = data.reduce(function (a, b) { return a + Math.max(0, b); }, 0) || 1;
    var cx = w * 0.32, cy = h / 2, r = Math.min(cx, cy) * 0.82, inner = r * 0.6;
    var start = -Math.PI / 2;
    for (var i = 0; i < data.length; i++) {
      var val = Math.max(0, data[i]);
      var slice = (val / total) * Math.PI * 2;
      var color = (cfg.colors && cfg.colors[i]) || PALETTE[i % PALETTE.length];
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + slice);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      start += slice;
    }
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.arc(cx, cy, inner, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    var lx = w * 0.62, ly = h * 0.22, lh = 20;
    ctx.textBaseline = "middle";
    for (var j = 0; j < labels.length; j++) {
      var c = (cfg.colors && cfg.colors[j]) || PALETTE[j % PALETTE.length];
      var y = ly + j * lh;
      if (y > h - 10) break;
      ctx.fillStyle = c;
      ctx.fillRect(lx, y - 5, 10, 10);
      ctx.fillStyle = textColor();
      var pct = total ? Math.round((Math.max(0, data[j]) / total) * 100) : 0;
      ctx.fillText(labels[j] + " (" + pct + "%)", lx + 16, y);
    }
  }

  function drawLineOrBar(ctx, w, h, cfg, kind) {
    var labels = cfg.labels || [];
    var series = cfg.series || (cfg.data ? [{ name: "", data: cfg.data, color: PALETTE[0] }] : []);
    var padL = 40, padB = 26, padT = 14, padR = 12;
    var plotW = w - padL - padR, plotH = h - padT - padB;
    var allVals = [];
    series.forEach(function (s) { allVals = allVals.concat(s.data); });
    var maxV = Math.max.apply(null, allVals.concat([0]));
    var minV = Math.min.apply(null, allVals.concat([0]));
    if (maxV === minV) maxV = minV + 1;
    var range = maxV - minV;

    ctx.strokeStyle = axisColor();
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    ctx.fillStyle = textColor();
    ctx.font = "10px Inter, sans-serif";
    var gridN = 4;
    for (var g = 0; g <= gridN; g++) {
      var val = minV + (range * g) / gridN;
      var y = padT + plotH - (plotH * g) / gridN;
      ctx.strokeStyle = axisColor();
      ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + plotW, y); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillText(shortNum(val), 2, y + 3);
    }

    var n = labels.length || (series[0] ? series[0].data.length : 0);
    var stepX = plotW / Math.max(1, n - (kind === "line" ? 1 : 0));

    if (kind === "bar") {
      var groupW = stepX * 0.66;
      var barW = groupW / series.length;
      for (var i = 0; i < n; i++) {
        for (var s = 0; s < series.length; s++) {
          var v = series[s].data[i] || 0;
          var barH = ((v - Math.min(0, minV)) / range) * plotH;
          var x = padL + i * stepX + stepX * 0.17 + s * barW;
          var y2 = padT + plotH - barH;
          ctx.fillStyle = series[s].color || PALETTE[s % PALETTE.length];
          ctx.fillRect(x, y2, Math.max(1, barW - 3), barH);
        }
      }
    } else {
      for (var s2 = 0; s2 < series.length; s2++) {
        ctx.beginPath();
        ctx.strokeStyle = series[s2].color || PALETTE[s2 % PALETTE.length];
        ctx.lineWidth = 2.2;
        for (var p = 0; p < series[s2].data.length; p++) {
          var xp = padL + p * stepX;
          var yp = padT + plotH - ((series[s2].data[p] - minV) / range) * plotH;
          if (p === 0) ctx.moveTo(xp, yp); else ctx.lineTo(xp, yp);
        }
        ctx.stroke();
        ctx.fillStyle = series[s2].color || PALETTE[s2 % PALETTE.length];
        for (var p2 = 0; p2 < series[s2].data.length; p2++) {
          var xp2 = padL + p2 * stepX;
          var yp2 = padT + plotH - ((series[s2].data[p2] - minV) / range) * plotH;
          ctx.beginPath(); ctx.arc(xp2, yp2, 2.6, 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    ctx.fillStyle = textColor();
    ctx.font = "10px Inter, sans-serif";
    var showEvery = Math.ceil(n / 6);
    for (var l = 0; l < labels.length; l++) {
      if (l % showEvery !== 0 && l !== labels.length - 1) continue;
      var lx2 = padL + l * stepX + (kind === "bar" ? stepX / 2 : 0);
      ctx.textAlign = "center";
      ctx.fillText(String(labels[l]), lx2, h - 8);
    }
    ctx.textAlign = "left";
  }

  function shortNum(n) {
    var abs = Math.abs(n);
    if (abs >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (abs >= 1e3) return (n / 1e3).toFixed(1) + "k";
    if (Number.isInteger(n)) return String(n);
    return n.toFixed(1);
  }

  function renderLegend(el, cfg) {
    if (!el) return;
    var labels = cfg.labels || (cfg.series ? cfg.series.map(function (s) { return s.name; }) : []);
    var colors = cfg.colors || (cfg.series ? cfg.series.map(function (s, i) { return s.color || PALETTE[i % PALETTE.length]; }) : labels.map(function (_, i) { return PALETTE[i % PALETTE.length]; }));
    el.innerHTML = labels.map(function (l, i) {
      return '<div class="chart-legend-item"><span class="chart-legend-swatch" style="background:' + colors[i] + '"></span>' + escapeHTML(l) + '</div>';
    }).join("");
  }

  /* function plotter for graphing calculator */
  function plotFunction(canvas, opts) {
    var setup = setupCanvas(canvas);
    var ctx = setup.ctx, w = setup.w, h = setup.h;
    var padL = 34, padB = 22, padT = 12, padR = 12;
    var plotW = w - padL - padR, plotH = h - padT - padB;
    var xMin = opts.xMin, xMax = opts.xMax, samples = opts.samples || 200;
    var pts = [];
    var yMin = Infinity, yMax = -Infinity;
    for (var i = 0; i <= samples; i++) {
      var x = xMin + ((xMax - xMin) * i) / samples;
      var y = opts.fn(x);
      if (isFinite(y)) { pts.push([x, y]); if (y < yMin) yMin = y; if (y > yMax) yMax = y; }
      else pts.push([x, null]);
    }
    if (!isFinite(yMin) || !isFinite(yMax)) { yMin = -1; yMax = 1; }
    if (yMin === yMax) { yMin -= 1; yMax += 1; }
    var yPad = (yMax - yMin) * 0.1;
    yMin -= yPad; yMax += yPad;

    function toX(x) { return padL + ((x - xMin) / (xMax - xMin)) * plotW; }
    function toY(y) { return padT + plotH - ((y - yMin) / (yMax - yMin)) * plotH; }

    ctx.strokeStyle = axisColor(); ctx.lineWidth = 1;
    ctx.strokeRect(padL, padT, plotW, plotH);
    if (yMin < 0 && yMax > 0) {
      ctx.beginPath(); ctx.moveTo(padL, toY(0)); ctx.lineTo(padL + plotW, toY(0)); ctx.stroke();
    }
    if (xMin < 0 && xMax > 0) {
      ctx.beginPath(); ctx.moveTo(toX(0), padT); ctx.lineTo(toX(0), padT + plotH); ctx.stroke();
    }

    ctx.strokeStyle = "#1a5f85";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    var started = false;
    pts.forEach(function (p) {
      if (p[1] === null) { started = false; return; }
      var px = toX(p[0]), py = toY(p[1]);
      if (!started) { ctx.moveTo(px, py); started = true; } else { ctx.lineTo(px, py); }
    });
    ctx.stroke();

    ctx.fillStyle = textColor();
    ctx.font = "10px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(shortNum(xMin), padL, h - 6);
    ctx.fillText(shortNum(xMax), padL + plotW, h - 6);
    ctx.textAlign = "left";
    ctx.fillText(shortNum(yMax), 2, padT + 8);
    ctx.fillText(shortNum(yMin), 2, padT + plotH);
  }

  /* ============================================================
     GENERIC CALCULATOR ENGINE  (form mode)
     ============================================================ */
  function fieldHTML(f) {
    var span = f.span2 ? " span-2" : "";
    var html = '<div class="field-group' + span + '">' +
      '<label class="field-label" for="f-' + f.id + '">' + escapeHTML(f.label) + (f.unit ? ' <span style="color:var(--text-light);font-weight:400">(' + escapeHTML(f.unit) + ')</span>' : '') + '</label>';
    if (f.type === "select") {
      html += '<select class="field-select" id="f-' + f.id + '" name="' + f.id + '">' +
        f.options.map(function (o) { return '<option value="' + o.value + '"' + (o.value == f.default ? " selected" : "") + '>' + escapeHTML(o.label) + '</option>'; }).join("") +
        '</select>';
    } else if (f.type === "date") {
      html += '<input class="field-input" type="date" id="f-' + f.id + '" name="' + f.id + '" value="' + (f.default || "") + '">';
    } else if (f.type === "text") {
      html += '<input class="field-input" type="text" id="f-' + f.id + '" name="' + f.id + '" value="' + escapeHTML(f.default !== undefined ? f.default : "") + '" placeholder="' + escapeHTML(f.placeholder || "") + '">';
    } else {
      html += '<input class="field-input" type="number" id="f-' + f.id + '" name="' + f.id + '" value="' + (f.default !== undefined ? f.default : "") + '"' + (f.step ? ' step="' + f.step + '"' : "") + (f.min !== undefined ? ' min="' + f.min + '"' : "") + '>';
    }
    if (f.hint) html += '<span class="field-hint">' + escapeHTML(f.hint) + '</span>';
    html += '</div>';
    return html;
  }

  function readFieldValue(f, formEl) {
    var el = formEl.querySelector("#f-" + f.id);
    if (!el) return f.default;
    if (f.type === "text" || f.type === "date") return el.value;
    if (f.type === "select") {
      var v = el.value;
      var numMatch = f.options.find(function (o) { return String(o.value) === v; });
      return numMatch && typeof numMatch.value === "number" ? numMatch.value : v;
    }
    var n = parseFloat(el.value);
    return isNaN(n) ? 0 : n;
  }

  // Reads the current form and builds a URL that re-opens this calculator
  // with the same numbers pre-filled.
  function buildShareURL(config, formEl) {
    var params = new URLSearchParams();
    config.fields.forEach(function (f) {
      var v = readFieldValue(f, formEl);
      if (v !== undefined && v !== null && v !== "") params.set("f-" + f.id, v);
    });
    return window.location.origin + window.location.pathname + "?" + params.toString();
  }

  // Calculators that actually have a built /embed/<id>.html page. The Embed
  // button only appears for these — add to this list as you build more embed
  // pages, otherwise the button would link to a 404 for everything else.
  var EMBEDDABLE = ["mortgage-calculator"];

  // Generates the <iframe> embed snippet for a given calculator id.
  function buildEmbedSnippet(calcId) {
    var origin = window.location.origin;
    var src = origin + "/embed/" + calcId + ".html";
    return '<iframe src="' + src + '" width="100%" height="640" style="border:1px solid #e2e8f0;border-radius:10px;" loading="lazy" title="CalcHub calculator"></iframe>\n' +
           '<p style="font:12px/1.4 sans-serif;color:#94a3b8;margin-top:6px;">Powered by ' +
           '<a href="' + origin + '/" style="color:#1a5f85;">CalcHub</a></p>';
  }

  // If the URL has ?f-<id>=<value> params (from a shared link), those win
  // over locally-saved last-used values.
  function applyURLParams(config) {
    var params = new URLSearchParams(window.location.search);
    config.fields.forEach(function (f) {
      var key = "f-" + f.id;
      if (params.has(key)) {
        var raw = params.get(key);
        f.default = (f.type === "text" || f.type === "date" || f.type === "select") ? raw : parseFloat(raw);
      }
    });
  }

  function initCalculatorPage(config) {
    var root = document.getElementById("calc-root");
    if (!root) return;
    var meta = getCalcMeta(config.id) || { name: config.id, category: "tools" };

    var last = getLastInputs(config.id) || {};
    config.fields.forEach(function (f) { if (last[f.id] !== undefined) f.default = last[f.id]; });
    applyURLParams(config); // shared-link values override saved last-used values

    root.innerHTML =
      '<div class="calc-form-col">' +
        '<div class="calc-card">' +
          '<div class="calc-card-title">Inputs</div>' +
          '<form id="calc-form">' +
            '<div class="field-grid">' + config.fields.map(fieldHTML).join("") + '</div>' +
            '<button type="submit" class="btn-primary">Calculate</button>' +
            '<div class="share-embed-row">' +
              '<button type="button" class="btn-secondary" id="btn-share">Share these numbers</button>' +
              (EMBEDDABLE.indexOf(config.id) !== -1 ? '<button type="button" class="btn-secondary" id="btn-embed">Embed this calculator</button>' : '') +
            '</div>' +
          '</form>' +
        '</div>' +
        '<div class="calc-card result-panel" id="result-panel">' +
          '<div class="result-headline-label" id="result-label"></div>' +
          '<div class="result-headline" id="result-headline"></div>' +
          '<div class="stat-grid" id="result-stats"></div>' +
          '<div class="result-explain" id="result-explain" style="display:none"></div>' +
        '</div>' +
      '</div>' +
      '<div class="calc-side-col">' +
        '<div class="calc-card" id="chart-card" style="display:none">' +
          '<div class="calc-card-title">Visual Breakdown</div>' +
          '<div class="chart-wrap"><canvas id="result-chart"></canvas></div>' +
          '<div class="chart-legend" id="chart-legend"></div>' +
          '<button type="button" class="btn-secondary" id="btn-chart-pdf" style="margin-top:10px">Download chart as PDF</button>' +
        '</div>' +
        '<div class="calc-card">' +
          '<div class="calc-card-title">Your History &mdash; ' + escapeHTML(meta.name) + '</div>' +
          '<div id="calc-history"></div>' +
        '</div>' +
      '</div>';

    var form = document.getElementById("calc-form");
    var chartCard = document.getElementById("chart-card");
    var lastChartCfg = null;

    var chartPdfBtn = document.getElementById("btn-chart-pdf");
    if (chartPdfBtn) chartPdfBtn.addEventListener("click", function () {
      downloadCanvasAsPDF(document.getElementById("result-chart"), config.id + "-chart.pdf");
    });

    renderHistoryPanel(document.getElementById("calc-history"), {
      calcId: config.id,
      title: "",
      emptyText: "Run a calculation above and it'll be saved here automatically."
    });

    function runCompute() {
      var values = {};
      config.fields.forEach(function (f) { values[f.id] = readFieldValue(f, form); });
      var result;
      try {
        result = config.compute(values);
      } catch (e) {
        result = { headline: "Check your inputs", stats: [], historyLabel: null };
      }
      if (!result) return;

      saveLastInputs(config.id, values);

      document.getElementById("result-label").textContent = result.label || "Result";
      document.getElementById("result-headline").textContent = result.headline || "";
      var statsEl = document.getElementById("result-stats");
      statsEl.innerHTML = (result.stats || []).map(function (s) {
        return '<div class="stat-card' + (s.highlight ? " highlight" : "") + '"><div class="stat-card-label">' + escapeHTML(s.label) + '</div><div class="stat-card-value">' + escapeHTML(s.value) + '</div></div>';
      }).join("");
      document.getElementById("result-panel").classList.add("visible");

      var explainEl = document.getElementById("result-explain");
      var explainText = typeof config.explain === "function" ? config.explain(values, result) : null;
      if (explainEl) {
        explainEl.textContent = explainText || "";
        explainEl.style.display = explainText ? "" : "none";
      }

      if (result.chart) {
        chartCard.style.display = "";
        lastChartCfg = result.chart;
        requestAnimationFrame(function () {
          drawChart(document.getElementById("result-chart"), result.chart);
          renderLegend(document.getElementById("chart-legend"), result.chart);
        });
      } else {
        chartCard.style.display = "none";
      }

      if (result.historyLabel) {
        addHistory({
          calcId: config.id,
          calcName: meta.name,
          category: meta.category,
          label: result.historyLabel,
          resultValue: result.copyValue || result.historyLabel
        });
        addRecent(config.id);
      }
    }

    form.addEventListener("submit", function (e) { e.preventDefault(); runCompute(); });

    var shareBtn = document.getElementById("btn-share");
    if (shareBtn) shareBtn.addEventListener("click", function () {
      copyText(buildShareURL(config, form));
      toast("Link copied — opens with these exact numbers filled in.");
    });
    var embedBtn = document.getElementById("btn-embed");
    if (embedBtn) embedBtn.addEventListener("click", function () {
      copyText(buildEmbedSnippet(config.id));
      toast("Embed code copied.");
    });

    window.addEventListener("resize", debounce(function () {
      if (lastChartCfg) drawChart(document.getElementById("result-chart"), lastChartCfg);
    }, 200));

    on("history-changed", function () {}); // panel handles its own repaint

    if (config.autoRun !== false) runCompute();
  }

  function debounce(fn, ms) {
    var t;
    return function () { clearTimeout(t); var args = arguments; t = setTimeout(function () { fn.apply(null, args); }, ms); };
  }

  /* ============================================================
     PUBLIC API
     ============================================================ */
  return {
    REGISTRY: REGISTRY,
    CATEGORY_LABELS: CATEGORY_LABELS,
    getCalcMeta: getCalcMeta,
    fmtUSD: fmtUSD, fmtUSD0: fmtUSD0, fmtNum: fmtNum, fmtPct: fmtPct, fmtRelTime: fmtRelTime, escapeHTML: escapeHTML, shortNum: shortNum,
    getHistory: getHistory, getHistoryFor: getHistoryFor, addHistory: addHistory, deleteHistoryEntry: deleteHistoryEntry, clearHistory: clearHistory,
    getFavorites: getFavorites, isFavorite: isFavorite, toggleFavorite: toggleFavorite,
    getRecents: getRecents, addRecent: addRecent, clearRecents: clearRecents,
    buildRecommendedHTML: renderPicksHTML,
    saveLastInputs: saveLastInputs, getLastInputs: getLastInputs,
    on: on, toast: toast, copyText: copyText,
    initTheme: initTheme, initSearch: initSearch, initScrollFade: initScrollFade,
    renderFavoriteStar: renderFavoriteStar, renderHistoryPanel: renderHistoryPanel,
    renderFavoritesSection: renderFavoritesSection, renderRecentsSection: renderRecentsSection,
    drawChart: drawChart, plotFunction: plotFunction, renderLegend: renderLegend,
    initCalculatorPage: initCalculatorPage,
    buildShareURL: buildShareURL, buildEmbedSnippet: buildEmbedSnippet, applyURLParams: applyURLParams,
    initAnalytics: initAnalytics, downloadCanvasAsPDF: downloadCanvasAsPDF
  };
})();
