/* Iter — idioma compartido (index, support, privacy).
   Prioridad: ?lang=  >  elección guardada  >  idioma del navegador. */
(function () {
  var root = document.documentElement;
  var listeners = [];

  function detect() {
    var l = "";
    try { l = new URLSearchParams(location.search).get("lang") || localStorage.getItem("iter.lang") || ""; } catch (e) {}
    if (l !== "es" && l !== "en") l = /^es/i.test(navigator.language || "") ? "es" : "en";
    return l;
  }
  function lang() { return root.getAttribute("data-lang") === "en" ? "en" : "es"; }

  function apply(l, save) {
    root.lang = l;
    root.setAttribute("data-lang", l);
    if (save) { try { localStorage.setItem("iter.lang", l); } catch (e) {} }
    var t = root.getAttribute("data-title-" + l); if (t) document.title = t;
    var d = root.getAttribute("data-desc-" + l), m = document.querySelector('meta[name="description"]');
    if (d && m) m.content = d;
    document.querySelectorAll(".langs button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-set") === l));
    });
    /* Enlaces internos que arrastran el idioma */
    document.querySelectorAll("a[data-href]").forEach(function (a) {
      var h = a.getAttribute("data-href");
      a.href = h + (l === "en" ? (h.indexOf("?") < 0 ? "?lang=en" : "&lang=en") : "");
    });
    listeners.forEach(function (fn) { fn(l); });
  }

  window.Iter = {
    lang: lang,
    onLang: function (fn) { listeners.push(fn); },
    mail: function (subjectEs, subjectEn) {
      location.href = "mailto:memorias-gris.7x@icloud.com?subject=" + encodeURIComponent(lang() === "es" ? subjectEs : subjectEn);
    }
  };

  /* Antes de pintar, para evitar el parpadeo */
  root.setAttribute("data-lang", detect());
  root.lang = lang();

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".langs button").forEach(function (b) {
      b.addEventListener("click", function () { apply(b.getAttribute("data-set"), true); });
    });
    var y = document.getElementById("yr"); if (y) y.textContent = new Date().getFullYear();
    document.querySelectorAll("[data-mail]").forEach(function (b) {
      b.addEventListener("click", function () {
        var p = b.getAttribute("data-mail").split("|");
        window.Iter.mail(p[0], p[1]);
      });
    });
    apply(lang(), false);
  });
})();
