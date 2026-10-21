
 // SSC Mania — app.js
// Handles navigation, practice setup and opening the selected chapter.

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  // The chapter catalogue lives in chapters/manifest.json.
  // This fallback keeps the setup page usable if the catalogue cannot load.
  const fallbackChapters = [
    {
      title: "Making of the Constitution",
      subject: "Polity",
      file: "chapters/making-of-constitution.json"
    },
    {
      title: "Salient Features of the Indian Constitution",
      subject: "Polity",
      file: "chapters/salient-features.json"
    }
  ];
  let chapters = fallbackChapters.slice();

  async function loadChapterCatalogue() {
    try {
      const response = await fetch("chapters/manifest.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (!data || !Array.isArray(data.chapters)) {
        throw new Error("Invalid chapter catalogue format");
      }

      const validChapters = data.chapters.filter((chapter) =>
        chapter &&
        typeof chapter.title === "string" &&
        typeof chapter.subject === "string" &&
        typeof chapter.file === "string" &&
        chapter.title.trim() &&
        chapter.subject.trim() &&
        chapter.file.trim()
      );

      if (!validChapters.length) throw new Error("No valid chapters in catalogue");
      chapters = validChapters;
    } catch (error) {
      console.warn("SSC Mania: Could not load chapters/manifest.json; using built-in chapter list.", error);
      chapters = fallbackChapters.slice();
    }
  }

  const count = 30;

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

    // All chapters use the same test interface. Only the JSON question bank changes.
    const target = new URL("test.html", document.baseURI);

    target.searchParams.set("chapter", chapterPath);
    target.searchParams.set("count", String(count));

    // Language is intentionally passed only for this test; it is not persisted.
    const languageSelect = $("testLanguage");
    const language = languageSelect && ["en", "hi", "both"].includes(languageSelect.value)
      ? languageSelect.value
      : "both";
    target.searchParams.set("lang", language);

    window.location.assign(target.href);
  }

  function init() {
    // Never carry the previous test's language choice into a fresh setup visit.
    window.addEventListener("pageshow", () => {
      const languageSelect = $("testLanguage");
      if (languageSelect) languageSelect.value = "both";
    });

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

    // Show the built-in list immediately, then refresh it from the editable catalogue.
    loadChapters();
    loadChapterCatalogue().then(loadChapters);
  }

  // Run after the HTML has loaded.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
