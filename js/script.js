// Shared scripts for the SudoSchool site.
// Lesson, quiz and terminal logic live in lesson.js, quiz.js and terminal.js.

// Adjustable liquid-glass transparency (accessibility).
(function () {
  var KEY = "sudoSchool.glassAlpha";
  var root = document.documentElement;
  var defaultAlpha = 0.25;
  var MIN = 0.05;
  var MAX = 0.9;

  var stored = null;
  try {
    stored = localStorage.getItem(KEY);
  } catch (e) {}

  var alpha =
    stored !== null && !isNaN(stored) && stored !== ""
      ? Number(stored)
      : defaultAlpha;

  function apply(a) {
    alpha = a;
    root.style.setProperty("--glass-alpha", a);
    try {
      localStorage.setItem(KEY, a);
    } catch (e) {}
    var hint = document.getElementById("glass-hint");
    if (hint) {
      hint.textContent =
        a <= 0.1 ? "More transparent" : a >= 0.6 ? "High contrast" : "Balanced";
    }
  }

  var toggle = document.getElementById("glass-toggle");
  var panel = document.getElementById("glass-panel");
  var range = document.getElementById("glass-range");

  if (toggle && panel && range) {
    panel.hidden = true;
    range.value = Math.round(((alpha - MIN) / (MAX - MIN)) * 100);
    apply(alpha);

    toggle.addEventListener("click", function () {
      var open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
    });

    range.addEventListener("input", function () {
      var a = MIN + (Number(range.value) / 100) * (MAX - MIN);
      apply(Number(a.toFixed(3)));
    });

    document.addEventListener("click", function (e) {
      if (!panel.hidden && !toggle.contains(e.target) && !panel.contains(e.target)) {
        panel.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) {
        panel.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }
})();