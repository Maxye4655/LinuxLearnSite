(function () {
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('.lesson-section')
  );
  var progressFill = document.getElementById('progressBarFill');
  var progressValue = document.getElementById('progressValue');
  var nextBtn = document.getElementById('nextSectionBtn');
  var nextLessonBtn = document.getElementById('nextLessonBtn');
  var current = 0;

  function update() {
    var pct = Math.round(
      ((current + 1) / sections.length) * 100
    );
    progressFill.style.width = pct + '%';
    progressValue.textContent = pct + '%';
    var completed = current >= sections.length - 1;

    sections.forEach(function (sec, i) {
      sec.classList.toggle('is-active', i === current);
    });

    if (completed) {
      nextBtn.textContent = 'End of Lesson';
      nextBtn.disabled = true;
      nextLessonBtn.classList.add('is-ready');
    } else {
      nextBtn.textContent = 'Next Section';
      nextBtn.disabled = false;
      nextLessonBtn.classList.remove('is-ready');
    }
  }

  function show(index) {
    current = Math.min(Math.max(index, 0), sections.length - 1);
    update();
  }

  nextBtn.addEventListener('click', function () {
    show(current + 1);
  });

  nextLessonBtn.addEventListener('click', function (e) {
    if (!nextLessonBtn.classList.contains('is-ready')) {
      e.preventDefault();
    }
  });

  update();
  show(0);
})();
