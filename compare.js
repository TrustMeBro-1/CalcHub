/*
 * CalcHub Compare Mode
 * ---------------------------------------------------------------
 * Reuses the SAME {fields, compute, explain} config every calculator
 * already builds for CalcHub.initCalculatorPage — no duplicate logic,
 * no changes to core.js. Renders with core.css's own classes
 * (.calc-card, .field-group, .field-input, .stat-card, etc.) so it
 * looks native and follows dark mode automatically via [data-theme].
 *
 * Usage (in a calculator page's own <script>, after core.js loads):
 *
 *   var calcConfig = { id: 'budget-calculator', fields: [...], compute: fn, explain: fn };
 *   CalcHub.initCalculatorPage(calcConfig);
 *   CalcHub.initCompareMode(calcConfig);
 *
 * Requires two elements in the page body (see template snippet):
 *   <button id="compare-toggle-btn" class="btn-secondary">Compare Scenarios</button>
 *   <div id="calc-compare-root"></div>
 
   To add you need these 

<link rel="stylesheet" href="/assets/compare.css">
<script src="/assets/compare.js"></script>

<button id="compare-toggle-btn" class="btn-secondary" ...>Compare Scenarios</button>
<div id="calc-compare-root"></div>
 */
(function () {
  var esc = (window.CalcHub && CalcHub.escapeHTML) || function (s) { return s; };

  function fieldHTML(f, prefix) {
    var span = f.span2 ? " span-2" : "";
    var id = prefix + f.id;
    var html = '<div class="field-group' + span + '">' +
      '<label class="field-label" for="' + id + '">' + esc(f.label) +
      (f.unit ? ' <span style="color:var(--text-light);font-weight:400">(' + esc(f.unit) + ')</span>' : '') +
      '</label>';
    if (f.type === "select") {
      html += '<select class="field-select" id="' + id + '">' +
        f.options.map(function (o) {
          return '<option value="' + o.value + '"' + (o.value == f.default ? " selected" : "") + '>' + esc(o.label) + '</option>';
        }).join("") + '</select>';
    } else if (f.type === "date") {
      html += '<input class="field-input" type="date" id="' + id + '" value="' + (f.default || "") + '">';
    } else if (f.type === "text") {
      html += '<input class="field-input" type="text" id="' + id + '" value="' + esc(f.default !== undefined ? f.default : "") + '" placeholder="' + esc(f.placeholder || "") + '">';
    } else {
      html += '<input class="field-input" type="number" id="' + id + '" value="' + (f.default !== undefined ? f.default : "") + '"' +
        (f.step ? ' step="' + f.step + '"' : "") + (f.min !== undefined ? ' min="' + f.min + '"' : "") + '>';
    }
    if (f.hint) html += '<span class="field-hint">' + esc(f.hint) + '</span>';
    html += '</div>';
    return html;
  }

  function readFieldValue(f, prefix) {
    var el = document.getElementById(prefix + f.id);
    if (!el) return f.default;
    if (f.type === "text" || f.type === "date") return el.value;
    if (f.type === "select") {
      var v = el.value;
      var match = f.options.find(function (o) { return String(o.value) === v; });
      return match && typeof match.value === "number" ? match.value : v;
    }
    var n = parseFloat(el.value);
    return isNaN(n) ? 0 : n;
  }

  function renderColumn(config, mountEl, label, prefix) {
    mountEl.innerHTML =
      '<div class="calc-card">' +
        '<div class="calc-card-title">' + esc(label) + '</div>' +
        '<div class="field-grid">' + config.fields.map(function (f) { return fieldHTML(f, prefix); }).join("") + '</div>' +
      '</div>' +
      '<div class="calc-card" style="margin-top:var(--sp-md)">' +
        '<div class="result-headline-label" id="' + prefix + 'result-label"></div>' +
        '<div class="result-headline" id="' + prefix + 'result-headline"></div>' +
        '<div class="stat-grid" id="' + prefix + 'result-stats"></div>' +
        '<div class="result-explain" id="' + prefix + 'result-explain" style="display:none"></div>' +
        '<div class="chart-wrap" id="' + prefix + 'chart-wrap" style="display:none;height:160px;margin-top:var(--sp-md)"><canvas id="' + prefix + 'chart"></canvas></div>' +
      '</div>';

    config.fields.forEach(function (f) {
      var el = document.getElementById(prefix + f.id);
      if (el) el.addEventListener("input", recompute);
      if (el) el.addEventListener("change", recompute);
    });

    var lastResult = null;

    function recompute() {
      var values = {};
      config.fields.forEach(function (f) { values[f.id] = readFieldValue(f, prefix); });
      var result;
      try {
        result = config.compute(values);
      } catch (e) {
        result = { headline: "Check your inputs", stats: [] };
      }
      if (!result) return;
      lastResult = result;

      document.getElementById(prefix + "result-label").textContent = result.label || "Result";
      document.getElementById(prefix + "result-headline").textContent = result.headline || "";
      document.getElementById(prefix + "result-stats").innerHTML = (result.stats || []).map(function (s) {
        return '<div class="stat-card' + (s.highlight ? " highlight" : "") + '"><div class="stat-card-label">' + esc(s.label) + '</div><div class="stat-card-value">' + esc(s.value) + '</div></div>';
      }).join("");

      var explainEl = document.getElementById(prefix + "result-explain");
      var explainText = typeof config.explain === "function" ? config.explain(values, result) : null;
      explainEl.textContent = explainText || "";
      explainEl.style.display = explainText ? "" : "none";

      var chartWrap = document.getElementById(prefix + "chart-wrap");
      if (result.chart && window.CalcHub && CalcHub.drawChart) {
        chartWrap.style.display = "";
        requestAnimationFrame(function () { CalcHub.drawChart(document.getElementById(prefix + "chart"), result.chart); });
      } else {
        chartWrap.style.display = "none";
      }

      mountEl.dispatchEvent(new CustomEvent("cmp-recomputed", { detail: result }));
    }

    recompute();
    return { recompute: recompute, getLast: function () { return lastResult; } };
  }

  function updateDiff(diffEl, lastA, lastB) {
    if (!lastA || !lastB) return;
    var rows = [];
    (lastA.stats || []).forEach(function (sa, i) {
      var sb = (lastB.stats || [])[i];
      if (!sb || sb.label !== sa.label) return;
      var na = parseFloat(String(sa.value).replace(/[^0-9.\-]/g, ""));
      var nb = parseFloat(String(sb.value).replace(/[^0-9.\-]/g, ""));
      if (isNaN(na) || isNaN(nb) || na === nb) return;
      var delta = nb - na;
      var cls = delta > 0 ? "cmp-up" : "cmp-down";
      rows.push('<div class="cmp-delta-row ' + cls + '">' + esc(sa.label) + ': B is ' + (delta > 0 ? "+" : "") + delta.toFixed(2) + ' vs A</div>');
    });
    diffEl.innerHTML = rows.join("");
  }

  function initCompareMode(config, opts) {
    opts = opts || {};
    var mount = document.getElementById(opts.mountId || "calc-compare-root");
    var toggleBtn = document.getElementById(opts.toggleId || "compare-toggle-btn");
    if (!mount) return;

    mount.className = "cmp-panel";
    mount.style.display = "none";
    mount.innerHTML =
      '<div class="cmp-grid">' +
        '<div id="cmp-col-a"></div>' +
        '<div id="cmp-col-b"></div>' +
      '</div>' +
      '<div class="calc-card cmp-diff-card" id="cmp-diff-card" style="margin-top:var(--sp-md);display:none">' +
        '<div class="calc-card-title">Difference (B vs A)</div>' +
        '<div id="cmp-diff"></div>' +
      '</div>';

    var colA = renderColumn(config, document.getElementById("cmp-col-a"), "Scenario A", "cmp-a-");
    var colB = renderColumn(config, document.getElementById("cmp-col-b"), "Scenario B", "cmp-b-");

    var diffCard = document.getElementById("cmp-diff-card");
    var diffEl = document.getElementById("cmp-diff");

    function refreshDiff() {
      var lastA = colA.getLast(), lastB = colB.getLast();
      updateDiff(diffEl, lastA, lastB);
      diffCard.style.display = diffEl.innerHTML ? "" : "none";
    }
    document.getElementById("cmp-col-a").addEventListener("cmp-recomputed", refreshDiff);
    document.getElementById("cmp-col-b").addEventListener("cmp-recomputed", refreshDiff);
    refreshDiff();

    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        var isOpen = mount.style.display !== "none";
        mount.style.display = isOpen ? "none" : "block";
        toggleBtn.textContent = isOpen ? "Compare Scenarios" : "Hide Comparison";
        toggleBtn.setAttribute("aria-expanded", String(!isOpen));
      });
    }
  }

  window.CalcHub = window.CalcHub || {};
  window.CalcHub.initCompareMode = initCompareMode;
})();
