
 // SSC Mania — app.js
// Handles navigation, practice setup and opening the selected chapter.

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

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
    document.querySelectorAll(".page").forEach((page) => {
      page.classList.toggle("active", page.id === id);
    });

    document.querySelectorAll(".navlink").forEach((button) => {
      button.classList.toggle("active", button.dataset.page === id);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function loadChapters() {
    const subject = $("subject");
    const chapterSelect = $("chapter");

    if (!subject || !chapterSelect) return;

    const selectedSubject = subject.value;
    const available = chapters.filter(
      (chapter) => chapter.subject === selectedSubject
    );

    chapterSelect.replaceChildren();

    if (available.length === 0) {
      chapterSelect.add(new Option("Chapters coming soon", ""));

      if ($("chapterHint")) {
        $("chapterHint").textContent =
          "This subject's chapter bank will be added soon.";
      }

      if ($("setupError")) {
        $("setupError").textContent =
          "No chapters are available for this subject yet.";
      }

      return;
    }

    available.forEach((chapter) => {
      chapterSelect.add(new Option(chapter.title, chapter.file));
    });

    if ($("chapterHint")) {
      $("chapterHint").textContent =
        `${available.length} chapters available for ${selectedSubject}. More chapters will be added.`;
    }

    if ($("setupError")) {
      $("setupError").textContent = "";
    }
  }

  function setupForExam() {
    if ($("subject")) {
      $("subject").value = "Polity";
    }

    loadChapters();
    showPage("setup");
  }

  function setChoices(containerId, dataAttribute, selectedValue) {
    const container = $(containerId);

    if (!container) return;

    container.querySelectorAll("button").forEach((button) => {
      button.classList.toggle(
        "selected",
        button.dataset[dataAttribute] === String(selectedValue)
      );
    });
  }

  function startTest() {
    const chapterSelect = $("chapter");
    const chapterPath = chapterSelect ? chapterSelect.value : "";

    if (!chapterPath) {
      if ($("setupError")) {
        $("setupError").textContent =
          "Please select an available chapter before starting the test.";
      }
      return;
    }

    if ($("setupError")) {
      $("setupError").textContent = "";
    }

    const target = new URL(chapterPath, document.baseURI);

    target.searchParams.set("count", String(count));
    target.searchParams.set("duration", String(duration));
    target.searchParams.set("difficulty", difficulty);

    // Open the selected chapter page.
    window.location.assign(target.href);
  }

  function init() {
    // Header navigation
    document.querySelectorAll(".navlink").forEach((button) => {
      button.addEventListener("click", () => {
        const page = button.dataset.page;

        if (page === "setup") {
          setupForExam();
        } else {
          showPage(page);
        }
      });
    });

    // Home page exam cards
    document.querySelectorAll(".exam-card").forEach((button) => {
      button.addEventListener("click", setupForExam);
    });

    // Main navigation buttons
    $("homeStart")?.addEventListener("click", setupForExam);

    $("backHome")?.addEventListener("click", () => {
      showPage("home");
    });

    $("aboutPractice")?.addEventListener("click", setupForExam);

    // Subject and chapter selection
    $("subject")?.addEventListener("change", loadChapters);

    // Start Test: delegated handler, so it still works if the button
    // is recreated or other page code changes the DOM.
    document.addEventListener(
      "click",
      (event) => {
        const button = event.target.closest("#startTest");

        if (!button) return;

        event.preventDefault();
        startTest();
      },
      true
    );

    // Number of questions
    document.querySelectorAll("#questionChoices button").forEach((button) => {
      button.addEventListener("click", () => {
        count = Number(button.dataset.count);

        setChoices("questionChoices", "count", count);
      });
    });

    // Test duration
    document.querySelectorAll("#timeChoices button").forEach((button) => {
      button.addEventListener("click", () => {
        duration = Number(button.dataset.time);

        setChoices("timeChoices", "time", duration);
      });
    });

    // Difficulty
    document.querySelectorAll("#difficultyChoices button").forEach((button) => {
      button.addEventListener("click", () => {
        difficulty = button.dataset.level;

        setChoices("difficultyChoices", "level", difficulty);
      });
    });

    // Populate the chapter dropdown on page load.
    loadChapters();
  }

  // Run after the HTML has loaded.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
