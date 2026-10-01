(function () {
  var data = window.BlackbatCareer;
  var icons = window.BlackbatIcons;
  if (!data || !icons) return;

  var shell = document.getElementById("quiz-shell");
  var progressEl = document.getElementById("quiz-progress");
  var btnPrev = document.getElementById("quiz-prev");
  var btnNext = document.getElementById("quiz-next");
  if (!shell || !progressEl || !btnPrev || !btnNext) return;

  var questions = data.quizQuestions;
  var index = 0;
  var answers = data.loadAnswers();
  var transitioning = false;

  function renderProgress() {
    progressEl.innerHTML = questions
      .map(function (_, i) {
        var cls = "bb-progress__seg";
        if (i < index) cls += " is-done";
        if (i === index) cls += " is-current";
        return '<div class="' + cls + '" aria-hidden="true"></div>';
      })
      .join("");
    progressEl.setAttribute("aria-valuenow", String(index + 1));
    progressEl.setAttribute("aria-valuemax", String(questions.length));
    progressEl.setAttribute(
      "aria-label",
      "Question " + (index + 1) + " of " + questions.length
    );
  }

  function renderQuestion(direction) {
    var q = questions[index];
    var selected = answers[q.id] || null;

    var optionsHtml = q.options
      .map(function (opt) {
        var sel = selected === opt.value ? " is-selected" : "";
        return (
          '<button type="button" class="bb-quiz-option' +
          sel +
          '" data-value="' +
          opt.value +
          '" aria-pressed="' +
          (selected === opt.value) +
          '">' +
          '<span class="bb-quiz-option__check">' +
          icons.icon("check", "") +
          "</span>" +
          '<span class="bb-quiz-option__icon">' +
          icons.icon(opt.icon, "bb-icon") +
          "</span>" +
          '<span class="bb-quiz-option__title">' +
          opt.title +
          "</span>" +
          '<span class="bb-quiz-option__desc">' +
          opt.description +
          "</span>" +
          "</button>"
        );
      })
      .join("");

    var panel = document.createElement("div");
    panel.className = "bb-quiz-panel";
    if (direction === "forward") panel.classList.add("is-entering");
    panel.innerHTML =
      '<p class="bb-eyebrow">// ASSESS</p>' +
      "<h1 class=\"bb-title\">" +
      q.question +
      "</h1>" +
      '<p class="bb-lede">' +
      q.description +
      "</p>" +
      '<div class="bb-quiz-grid" role="group" aria-label="' +
      q.question +
      '">' +
      optionsHtml +
      "</div>";

    var old = shell.querySelector(".bb-quiz-panel");
    if (old && direction) {
      old.classList.add("is-exiting");
      transitioning = true;
      setTimeout(function () {
        old.remove();
        shell.appendChild(panel);
        requestAnimationFrame(function () {
          panel.classList.remove("is-entering");
          transitioning = false;
          bindOptions(panel);
        });
      }, 220);
    } else {
      shell.innerHTML = "";
      shell.appendChild(panel);
      bindOptions(panel);
    }

    renderProgress();
    btnPrev.disabled = index === 0;
    btnNext.disabled = !selected;
    btnNext.innerHTML =
      (index === questions.length - 1 ? "See results" : "Next") +
      ' <span class="bb-arrow" aria-hidden="true">→</span>';
  }

  function bindOptions(panel) {
    panel.querySelectorAll(".bb-quiz-option").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var q = questions[index];
        var value = btn.getAttribute("data-value");
        answers[q.id] = value;
        data.saveAnswers(answers);
        panel.querySelectorAll(".bb-quiz-option").forEach(function (b) {
          var on = b.getAttribute("data-value") === value;
          b.classList.toggle("is-selected", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        btnNext.disabled = false;
      });
    });
  }

  btnPrev.addEventListener("click", function () {
    if (transitioning || index === 0) return;
    index -= 1;
    renderQuestion("back");
  });

  btnNext.addEventListener("click", function () {
    if (transitioning || btnNext.disabled) return;
    var q = questions[index];
    if (!answers[q.id]) return;

    if (index >= questions.length - 1) {
      var result = data.computeResult(answers);
      data.saveResult(result);
      window.location.href = "career-results.html";
      return;
    }
    index += 1;
    renderQuestion("forward");
  });

  renderQuestion(null);

  var menuBtn = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector(".bb-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
})();
