/* =========================
   VISITOR TRACKING
   Fire-and-forget: one ping per session, no PII sent.
   Uses sessionStorage to prevent duplicate counts on refresh.
========================= */
(function trackVisit() {
  const TRACK_URL = 'http://localhost:3001/api/track';
  const STORAGE_KEY = 'mbh_session_tracked';

  // Already tracked this tab session — skip
  if (sessionStorage.getItem(STORAGE_KEY)) return;

  // Generate a random session ID (no fingerprinting, no PII)
  const sessionId = crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

  const page = document.referrer
    ? new URL(document.referrer).pathname.replace(/\//g, '') || 'direct'
    : 'direct';

  fetch(TRACK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, page }),
  })
    .then(r => {
      if (r.ok) sessionStorage.setItem(STORAGE_KEY, '1');
    })
    .catch(() => { /* silent fail — tracking must never break the site */ });
})();

/* =========================
   VISITOR STATS WIDGET
   Shows when URL hash is #stats (owner-only view).
   Fetches GET /api/track and renders totals + 7-day bar chart.
========================= */
const TRACK_STATS_URL = 'http://localhost:3001/api/track';

function initVisitorWidget() {
  const widget = document.getElementById('visitor-widget');
  if (!widget) return;

  // Show only when #stats is in the URL
  if (window.location.hash !== '#stats') return;
  widget.classList.remove('hidden');

  const statusEl = document.getElementById('visitor-widget-status');
  const totalEl = document.getElementById('vw-total');
  const todayEl = document.getElementById('vw-today');
  const weekEl = document.getElementById('vw-week');
  const chartEl = document.getElementById('vw-chart');
  const labelsEl = document.getElementById('vw-labels');

  fetch(TRACK_STATS_URL, {
    headers: { 'x-stats-key': '' }   // add your STATS_SECRET here if set
  })
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(data => {
      const last7 = data.last7Days || [];

      // ── Numbers ──────────────────────────────────────────────────────────
      const todayKey = new Date().toISOString().slice(0, 10);
      const todayVal = data.dailyStats?.[todayKey]?.visits || 0;
      const weekTotal = last7.reduce((s, d) => s + d.visits, 0);

      totalEl.textContent = (data.totalVisits || 0).toLocaleString();
      todayEl.textContent = todayVal.toLocaleString();
      weekEl.textContent = weekTotal.toLocaleString();

      // ── Bar chart ─────────────────────────────────────────────────────────
      const maxVal = Math.max(...last7.map(d => d.visits), 1);
      chartEl.innerHTML = '';
      labelsEl.innerHTML = '';

      last7.forEach(({ date, visits }) => {
        const isToday = date === todayKey;
        const heightPx = Math.round((visits / maxVal) * 48) || 3;

        // Bar
        const wrap = document.createElement('div');
        wrap.className = 'vw-bar-wrap';

        const bar = document.createElement('div');
        bar.className = `vw-bar${isToday ? ' today' : ''}`;
        bar.style.height = `${heightPx}px`;
        bar.setAttribute('data-tip', `${visits} visit${visits !== 1 ? 's' : ''}`);
        wrap.appendChild(bar);
        chartEl.appendChild(wrap);

        // Label (Mon, Tue … or "Today")
        const label = document.createElement('div');
        label.className = `vw-label${isToday ? ' today' : ''}`;
        label.textContent = isToday
          ? 'Today'
          : new Date(date + 'T12:00:00Z').toLocaleDateString('en', { weekday: 'short' });
        labelsEl.appendChild(label);
      });

      if (statusEl) statusEl.textContent = 'Live';
    })
    .catch(err => {
      console.warn('Visitor widget error:', err.message);
      if (statusEl) statusEl.textContent = 'Offline';
      if (totalEl) totalEl.textContent = '—';
    });
}

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


// Hamburger toggle
document.addEventListener('click', function (e) {
  const toggle = e.target.closest('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (!menu) return;

  if (toggle) {
    menu.classList.toggle('active');
  } else if (!e.target.closest('.nav-menu')) {
    // Close when clicking outside
    menu.classList.remove('active');
  }
});

// Close menu when a nav link is clicked
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('nav-link')) {
    const menu = document.querySelector('.nav-menu');
    if (menu) menu.classList.remove('active');
  }
});
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
      // B4 fix: skills page (not "hard-skills") contains hard skills accordion
      if (page === "skills") initHardSkills(container);
      if (page === "experience") initCertCarousel(container);
      if (page === "certifications") initCertCarousel(container);
      if (page === "projects") initProjectFilters(container);

      // Re-attach contact form handler after dynamic load
      if (page === "contact") initContactForm(container);

      // Init visitor stats widget on about page
      if (page === "about") initVisitorWidget();

      /* =========================
         ANIMATIONS
      ========================= */
      observeReveals(container);
      setActiveNav(page);
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

  // If URL has #stats on load, widget will init inside loadPage → initVisitorWidget
});


/* =========================
   ACTIVE NAV LINK
========================= */
function setActiveNav(page) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });
}

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