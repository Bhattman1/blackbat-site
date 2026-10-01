(function () {
  var data = window.BlackbatCareer;
  var icons = window.BlackbatIcons;
  if (!data || !icons) return;

  var result = data.loadResult() || data.getFallbackResult();
  var path = result.path;

  var pathRoot = document.getElementById("results-path");
  var stepsRoot = document.getElementById("results-steps");
  var resourcesRoot = document.getElementById("results-resources");
  var fallbackNote = document.getElementById("results-fallback");

  if (fallbackNote && result.fallback) {
    fallbackNote.hidden = false;
  }

  if (pathRoot) {
    pathRoot.innerHTML =
      '<div class="bb-path-card__main">' +
      '<p class="bb-path-card__label">RECOMMENDED PATH</p>' +
      '<div class="bb-path-card__icon-wrap">' +
      icons.icon(path.icon, "bb-icon") +
      "</div>" +
      '<h2 class="bb-path-card__title">' +
      path.title +
      "</h2>" +
      '<p class="bb-path-card__desc">' +
      path.description +
      "</p>" +
      '<div class="bb-tags">' +
      path.tags
        .map(function (t) {
          return '<span class="bb-tag">' + t + "</span>";
        })
        .join("") +
      "</div>" +
      "</div>" +
      '<div class="bb-path-visual">' +
      icons.pathVisual(path.visual) +
      "</div>";
  }

  if (stepsRoot) {
    stepsRoot.innerHTML = path.steps
      .map(function (step) {
        return (
          '<article class="bb-card bb-step-card">' +
          '<span class="bb-step-card__num">' +
          step.num +
          "</span>" +
          '<div class="bb-step-card__icon">' +
          icons.icon(step.icon, "bb-icon") +
          "</div>" +
          "<h3>" +
          step.title +
          "</h3>" +
          "<p>" +
          step.description +
          "</p>" +
          "</article>"
        );
      })
      .join("");
  }

  if (resourcesRoot) {
    resourcesRoot.innerHTML = data.defaultResources
      .map(function (r) {
        var ext =
          r.external ?
            '<span class="bb-resource__ext">' +
            icons.icon("external-link", "bb-icon") +
            "</span>"
          : "";
        var ic =
          r.icon === "bat" ?
            '<img src="assets/bat.png" alt="" width="24" height="24" style="object-fit:contain" />'
          : icons.icon(r.icon, "bb-icon");
        return (
          '<a class="bb-card bb-resource" href="' +
          r.href +
          '"' +
          (r.external ? ' target="_blank" rel="noopener noreferrer"' : "") +
          ">" +
          '<span class="bb-resource__icon">' +
          ic +
          "</span>" +
          '<span class="bb-resource__body">' +
          "<h3>" +
          r.name +
          "</h3>" +
          "<p>" +
          r.description +
          "</p>" +
          "</span>" +
          ext +
          "</a>"
        );
      })
      .join("");
  }

  var roadmapLink = document.getElementById("results-roadmap-link");
  if (roadmapLink) {
    roadmapLink.href = "roadmap.html";
  }

  var menuBtn = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector(".bb-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
})();
