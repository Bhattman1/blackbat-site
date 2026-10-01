(function () {
  var data = window.BlackbatCareer;
  var icons = window.BlackbatIcons;
  if (!data || !icons) return;

  var result = data.loadResult() || data.getFallbackResult();
  var path = result.path;
  var weeks = data.roadmapWeeks.slice();

  weeks.forEach(function (w) {
    if (w.dynamicTitle && path.specializationTitle && !result.fallback) {
      w.title = path.specializationTitle;
    }
  });

  var timeline = document.getElementById("roadmap-timeline");
  var pathLabel = document.getElementById("roadmap-path-label");

  if (pathLabel) {
    pathLabel.textContent = result.fallback ?
      "General 12-week foundation (take the career quiz to personalise)"
    : "Tailored toward: " + path.title;
  }

  if (timeline) {
    timeline.innerHTML = weeks
      .map(function (w) {
        var active = w.active ? " is-active" : "";
        return (
          '<article class="bb-card bb-timeline-item' +
          active +
          '">' +
          "<div>" +
          '<p class="bb-timeline-item__week">' +
          w.week +
          "</p>" +
          "<h3>" +
          w.title +
          "</h3>" +
          '<p class="bb-timeline-item__meta">' +
          '<span>' +
          icons.icon("clock", "bb-icon") +
          " " +
          w.hours +
          "</span>" +
          '<span>' +
          icons.icon("user", "bb-icon") +
          " " +
          w.level +
          "</span>" +
          "</p>" +
          "</div>" +
          '<div class="bb-timeline-item__icon">' +
          icons.icon(w.icon, "bb-icon") +
          "</div>" +
          "</article>"
        );
      })
      .join("");
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
