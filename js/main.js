/* =========================
   HARD SKILLS COLLAPSIBLE
========================= */
function initHardSkills(scope = document) {
  const items = scope.querySelectorAll(".hard-skills .skill-item");

  items.forEach(item => {
    const btn = item.querySelector(".skill-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Optional: close siblings (only one open at a time)
      items.forEach(i => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");

      // Update aria-expanded for accessibility
      items.forEach(i => {
        const b = i.querySelector(".skill-btn");
        if (b) b.setAttribute("aria-expanded", i.classList.contains("open"));
      });
    });
  });
}

/* =========================
   SECTION LOADER INTEGRATION
========================= */
const loadSection = async (id, file, callback) => {
  try {
    const res = await fetch(`sections/${file}`);
    const html = await res.text();

    const container = document.getElementById(id);
    if (!container) return;

    container.innerHTML = html;

    // Initialize reveal animations for new content
    observeReveals(container);

    // Initialize callbacks (skills, certifications, etc.)
    if (callback) callback(container);

  } catch (err) {
    console.error(`Error loading ${file}`, err);
  }
};

/* =========================
   REVEAL ANIMATIONS
========================= */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-show");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

function observeReveals(scope = document) {
  scope.querySelectorAll(
    ".section, .reveal-left, .reveal-right, .reveal-fade, .reveal-project"
  ).forEach(el => revealObserver.observe(el));
}

/* =========================
   CERTIFICATIONS CAROUSEL
========================= */
function initCertCarousel(scope = document) {
  const carousel = scope.querySelector(".cert-carousel");
  if (!carousel) return;

  let isDragging = false;
  let startX, scrollLeft;

  carousel.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    carousel.classList.add("dragging");
  });

  ["mouseup", "mouseleave"].forEach(evt =>
    carousel.addEventListener(evt, () => {
      isDragging = false;
      carousel.classList.remove("dragging");
    })
  );

  carousel.addEventListener("mousemove", e => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    carousel.scrollLeft = scrollLeft - (x - startX) * 2;
  });
}

/* =========================
   PROJECT FILTERING
========================= */
document.addEventListener("click", e => {
  if (!e.target.matches("[data-filter]")) return;

  const filter = e.target.dataset.filter;

  document.querySelectorAll(".project-filters button")
    .forEach(btn => btn.classList.remove("active"));

  e.target.classList.add("active");

  document.querySelectorAll(".project-card").forEach(card => {
    card.style.display =
      filter === "all" || card.dataset.category === filter
        ? "block"
        : "none";
  });
});

/* =========================
   THEME TOGGLE
========================= */
document.addEventListener("click", e => {
  if (!e.target.matches("#theme-toggle")) return;

  document.body.classList.toggle("light");
  e.target.textContent =
    document.body.classList.contains("light") ? "🌞" : "🌙";
});

/* =========================
   NAV TOGGLE
========================= */
document.addEventListener("click", e => {
  if (!e.target.matches(".nav-toggle")) return;
  document.querySelector(".nav-menu")?.classList.toggle("active");
});

/* =========================
   LOAD ALL SECTIONS
========================= */
const initPortfolio = () => {
  loadSection("header", "header.html");
  loadSection("hero", "hero.html");
  loadSection("about", "about.html");
  loadSection("education", "education.html");
  loadSection("experience", "experience.html");
  loadSection("skills", "skills.html");
  loadSection("certifications", "certifications.html", initCertCarousel);
  loadSection("projects", "projects.html");
  loadSection("hard-skills", "hard-skills.html", initHardSkills);
  loadSection("contact", "contact.html");
  loadSection("footer", "footer.html");
};

/* =========================
   INITIALIZE EVERYTHING
========================= */
document.addEventListener("DOMContentLoaded", () => {
  initPortfolio();
  observeReveals(); // static content outside sections
});
document.querySelector('.contact-form').addEventListener('submit', e => {
  e.preventDefault();
  alert("Thanks for reaching out! I'll contact you soon.");
});