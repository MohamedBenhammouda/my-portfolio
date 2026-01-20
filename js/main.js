const loadSection = (id, file) => {
  fetch(`sections/${file}`)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
      initRevealAnimations(); // 🔥 ADD THIS

    })
    .catch(error => console.error(`Error loading ${file}:`, error));
};

// Load all sections
loadSection("header", "header.html");
loadSection("hero", "hero.html");
loadSection("about", "about.html");
loadSection("education", "education.html");
loadSection("experience", "experience.html");
loadSection("skills", "skills.html");
loadSection("certifications", "certifications.html");
loadSection("projects", "projects.html");
loadSection("contact", "contact.html");
loadSection("footer", "footer.html");
// Reveal sections on scroll
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.15 }
);

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".section").forEach(section => {
    observer.observe(section);
  });
});
// Project filtering
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
// Dark / Light mode
const toggle = document.getElementById("theme-toggle");

toggle.addEventListener("click", () => {
  document.body.classList.toggle("light");

  toggle.textContent = document.body.classList.contains("light")
    ? "🌞"
    : "🌙";
});

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

function initRevealAnimations() {
  const elements = document.querySelectorAll(
    ".reveal-left, .reveal-right, .reveal-fade, .reveal-project"
  );

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-show");
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach(el => observer.observe(el));
}

const carousel = document.querySelector(".cert-carousel");
let isDragging = false;
let startX;
let scrollLeft;

carousel.addEventListener("mousedown", (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  startX = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});
carousel.addEventListener("mouseleave", () => {
  isDragging = false;
  carousel.classList.remove("dragging");
});
carousel.addEventListener("mouseup", () => {
  isDragging = false;
  carousel.classList.remove("dragging");
});
carousel.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - carousel.offsetLeft;
  const walk = (x - startX) * 2; // Scroll-fast multiplier
  carousel.scrollLeft = scrollLeft - walk;
});
