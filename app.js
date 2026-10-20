const $ = id => document.getElementById(id);

const chapters = [
  {
    title: "Making of the Constitution",
    subject: "Polity",
    file: "chapters/Chapter_1_Making_of_the_Constitution.html"
  },
  {
    title: "Salient Features of the Indian Constitution",
    subject: "Polity",
    file: "chapters/Chapter_2_Salient_Features.html"
  }
];

let count = 20;
let duration = 15;
let difficulty = "Mixed";

function showPage(id) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.toggle("active", page.id === id);
  });

  document.querySelectorAll(".navlink").forEach(button => {
    button.classList.toggle("active", button.dataset.page === id);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function loadChapters() {
  const subject = $("subject");
  const chapterSelect = $("chapter");

  if (!subject || !chapterSelect) return;

  const available = chapters.filter(
    chapter => chapter.subject === subject.value
  );

  chapterSelect.innerHTML = "";

  if (!available.length) {
    chapterSelect.innerHTML =
      '<option value="">Chapters coming soon</option>';

    if ($("chapterHint")) {
      $("chapterHint").textContent =
        "This subject’s chapter bank will be added soon.";
    }
    return;
  }

  available.forEach(chapter => {
    const option = document.createElement("option");
    option.value = chapter.file;
    option.textContent = chapter.title;
    chapterSelect.appendChild(option);
  });

  if ($("chapterHint")) {
    $("chapterHint").textContent =
      `${available.length} chapters available for ${subject.value}.`;
  }
}

function setupForExam() {
  if ($("subject")) $("subject").value = "Polity";
  loadChapters();
  showPage("setup");
}

function setChoices(containerId, attribute, value) {
  const container = $(containerId);
  if (!container) return;

  container.querySelectorAll("button").forEach(button => {
    button.classList.toggle(
      "selected",
      button.dataset[attribute] === String(value)
    );
  });
}

function startTest() {
  const file = $("chapter")?.value;

  if (!file) {
    if ($("setupError")) {
      $("setupError").textContent = "Please choose an available chapter.";
    }
    return;
  }

  if ($("setupError")) $("setupError").textContent = "";

  const target = new URL(file, window.location.href);
  target.searchParams.set("count", count);
  target.searchParams.set("duration", duration);
  target.searchParams.set("difficulty", difficulty);

  window.location.href = target.href;
}

document.querySelectorAll(".navlink").forEach(button => {
  button.addEventListener("click", () => {
    if (button.dataset.page === "setup") {
      setupForExam();
    } else {
      showPage(button.dataset.page);
    }
  });
});

document.querySelectorAll(".exam-card").forEach(button => {
  button.addEventListener("click", setupForExam);
});

if ($("homeStart")) {
  $("homeStart").addEventListener("click", setupForExam);
}

if ($("backHome")) {
  $("backHome").addEventListener("click", () => showPage("home"));
}

if ($("aboutPractice")) {
  $("aboutPractice").addEventListener("click", setupForExam);
}

if ($("subject")) {
  $("subject").addEventListener("change", loadChapters);
}

if ($("startTest")) {
  $("startTest").addEventListener("click", startTest);
}

document.querySelectorAll("#questionChoices button").forEach(button => {
  button.addEventListener("click", () => {
    count = Number(button.dataset.count);
    setChoices("questionChoices", "count", count);
  });
});

document.querySelectorAll("#timeChoices button").forEach(button => {
  button.addEventListener("click", () => {
    duration = Number(button.dataset.time);
    setChoices("timeChoices", "time", duration);
  });
});

document.querySelectorAll("#difficultyChoices button").forEach(button => {
  button.addEventListener("click", () => {
    difficulty = button.dataset.level;
    setChoices("difficultyChoices", "level", difficulty);
  });
});

loadChapters();
