/* =========================
   GLOBAL REVEAL OBSERVER
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
   HARD SKILLS COLLAPSIBLE
========================= */
function initHardSkills(scope) {
  const items = scope.querySelectorAll(".hard-skills .skill-item");

  items.forEach(item => {
    const btn = item.querySelector(".skill-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      items.forEach(i => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");

      items.forEach(i => {
        const b = i.querySelector(".skill-btn");
        if (b) b.setAttribute("aria-expanded", i.classList.contains("open"));
      });
    });
  });
}

/* =========================
   CERTIFICATIONS CAROUSEL
========================= */
function initCertCarousel(scope) {
  const carousel = scope.querySelector(".cert-carousel");
  if (!carousel) return;

  let isDragging = false, startX, scrollLeft;

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
function initProjectFilters(scope) {
  scope.querySelectorAll("[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      scope.querySelectorAll(".project-filters button")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");

      scope.querySelectorAll(".project-card").forEach(card => {
        card.style.display =
          filter === "all" || card.dataset.category === filter
            ? "block"
            : "none";
      });
    });
  });
}

/* =========================
   DYNAMIC PAGE LOADER (FINAL CLEAN)
========================= */
function loadPage(page) {
  const container = document.getElementById("page-content");
  if (!container) return;

  fetch(`pages/${page}.html`)
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;

      /* =========================
         PAGE HERO CONTROL
      ========================= */
      const hero = document.getElementById("page-hero");
      const title = hero.querySelector(".page-title");
      const subtitle = hero.querySelector(".page-subtitle");

      const pageConfig = {
        about: null,

        experience: {
          title: "Experience",
          subtitle: "My professional journey & impact"
        },
        skills: {
          title: "Skills",
          subtitle: "Soft skills & Hard skills "
        },
        "hard-skills": {
          title: "Technical Skills",
          subtitle: "Blue Team, DevSecOps & Security expertise"
        },
        projects: {
          title: "Projects",
          subtitle: "Real-world implementations & innovation"
        },
        certifications: {
          title: "Certifications",
          subtitle: "Continuous learning & achievements"
        },
        contact: {
          title: "Contact",
          subtitle: "Let’s connect and collaborate"
        },
        education: {
          title: "Education",
          subtitle: "Academic background & achievements"
        }
      };

      // Hide hero for About page
        if (page === "about") {
          hero.classList.add("hidden");
        } else if (!pageConfig[page]) {
          hero.classList.add("hidden");
        } else {
          hero.classList.remove("hidden");

          title.textContent = pageConfig[page].title;
          typeWriter(subtitle, pageConfig[page].subtitle, 25);
        }

      /* =========================
         PAGE-SPECIFIC FEATURES
      ========================= */
      if (page === "hard-skills") initHardSkills(container);
      if (page === "certifications") initCertCarousel(container);
      if (page === "projects") initProjectFilters(container);

      /* =========================
         ANIMATIONS
      ========================= */
      observeReveals(container);
      window.scrollTo({ top: 1, behavior: 'smooth' });
    })
    .catch(err => console.error(`Error loading page: ${page}`, err));
}
/* =========================
   NAVIGATION
========================= */
document.addEventListener("click", e => {
  const link = e.target.closest(".nav-link");
  if (!link) return;

  e.preventDefault();
  const page = link.dataset.page;
  if (page) loadPage(page);
});

document.querySelectorAll('.footer-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const page = link.dataset.page;
    if (page) loadPage(page);
  });
});
/* =========================
   NAV MENU (MOBILE)
========================= */
document.addEventListener("click", e => {
  if (!e.target.matches(".nav-toggle")) return;

  document.querySelector(".nav-menu")?.classList.toggle("active");
});

/* =========================
   INIT APP
========================= */
document.addEventListener("DOMContentLoaded", () => {
  // Load header
  fetch("sections/header.html")
    .then(r => r.text())
    .then(html => {
      document.getElementById("header").innerHTML = html;
    });

  // Load footer
  fetch("sections/footer.html")
    .then(r => r.text())
    .then(html => {
      document.getElementById("footer").innerHTML = html;
    });

  // ✅ Default page = ABOUT
  loadPage("about");
});


/* =========================
   TYPEWRITER EFFECT
========================= */
function typeWriter(element, text, speed = 30) {
  let i = 0;
  element.textContent = "";

  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }

  typing();
}