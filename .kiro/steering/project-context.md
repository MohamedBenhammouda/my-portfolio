---
inclusion: always
---

# Project Context — Mohamed Ben Hamouda Portfolio

## Project Overview
Personal portfolio website for Mohamed Ben Hamouda, a Software Engineering student specializing in Cybersecurity (Blue Team / SOC / DevSecOps). Built as a Single Page Application (SPA) with dynamic HTML partial loading.

## Owner
- **Name:** Mohamed Ben Hamouda
- **Role:** Software Engineer / Cybersecurity Researcher
- **Email:** mohamed.benhamouda@medtech.tn | ezz.bnhammouda@gmail.com
- **GitHub:** github.com/MohamedBenhammouda
- **LinkedIn:** linkedin.com/in/mohamed-benhamouda

## Tech Stack
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+) — no framework
- **Architecture:** SPA with `fetch()` loading HTML partials into `#page-content`
- **Backend (planned):** Node.js + Express (package.json present)
- **Dependencies:** express, body-parser, cors, node-fetch
- **No build tool** — plain files served statically

## File Structure
```
index.html              — Shell: loads header, footer, main content div
css/
  style.css             — Global styles, animations, contact, projects
  header.css            — Navbar styles
  footer.css            — Footer styles
  about.css             — About section, services, companies
  education.css         — Timeline styles
  experience.css        — Experience items, cert carousel (⚠ has fixed-width bugs)
  skills.css            — Soft skills, hard skills accordion
js/
  main.js               — SPA router, page loader, all init functions
  contact-form.js       — Contact form submission handler
sections/
  header.html           — Static navbar (loaded once)
  footer.html           — Static footer with contact form
pages/
  about.html            — Hero, services, companies sections
  education.html        — Timeline
  experience.html       — Jobs, certifications carousel, volunteer
  skills.html           — Soft skills + hard skills accordion
  projects.html         — Project articles
  certifications.html   — Cert carousel (standalone)
  contact.html          — Contact details + contact form
assets/
  icons/                — SVG/PNG social and company icons
  images/               — Profile photos
_bmad/                  — BMAD method configuration
_bmad-output/           — BMAD artifacts (planning, implementation)
docs/                   — Project documentation
```

## Architecture Pattern
- `index.html` is the shell — never changes content directly
- `fetch('sections/header.html')` and `fetch('sections/footer.html')` load persistent UI once on DOMContentLoaded
- `loadPage(page)` fetches `pages/{page}.html` and injects into `#page-content`
- Page-specific JS (`initHardSkills`, `initCertCarousel`, etc.) is called after each page load
- Scroll animations use `IntersectionObserver` with `.reveal-show` class toggling
- Page hero (`#page-hero`) shows/hides per page with typewriter subtitle effect

## Known Bugs (Sprint 1 Backlog)
| ID | Bug | Severity |
|----|-----|----------|
| B1 | `css/experience.css` sets `.section { width: 1700px }` — breaks all screens | 🔴 Critical |
| B2 | `css/experience.css` sets `.container { width: 1200px }` — not responsive | 🔴 Critical |
| B3 | `js/header.js` referenced in `index.html` but doesn't exist — 404 error | 🔴 Critical |
| B4 | `initHardSkills` called only when `page === "hard-skills"` but page key is `"skills"` — accordion never works | 🔴 Critical |
| B5 | Contact form action points to `https://yourserver.com/api/contact` — always fails | 🔴 Critical |
| B6 | `css/projects.css` and `css/contact.css` linked in `index.html` but don't exist — 404s | 🟡 Medium |
| B7 | Footer contact form has no JS submit handler | 🟡 Medium |
| B8 | All social links use `href="#"` — dead links | 🟡 Medium |
| B9 | `certifications` page unreachable from nav | 🟡 Medium |
| B10 | `contact-form.js` uses DOMContentLoaded but form loads dynamically — handler never attaches | 🔴 Critical |

## Coding Conventions
- **CSS variables** defined in `:root` in `style.css` — always use them (`--bg-main`, `--accent-main`, etc.)
- **No CSS frameworks** — pure CSS only
- **Responsive breakpoints:** 992px (tablet), 768px (mobile), 400px (small mobile)
- **Animation classes:** `.reveal-right`, `.reveal-left`, `.reveal-fade`, `.reveal-project` + `.reveal-show`
- **Page init pattern:** each page's JS init function receives `container` (the loaded DOM scope), not `document`
- **Color palette:**
  - Background: `#d0e4f6` (main), `#e6f0fa` (light), `#f0f7fc` (lighter)
  - Accent: `#7ea9ff` (main), `#a0c4e8` (hover)
  - Text: `#1e3a8a` (primary), `#2a4d8f` (secondary)
  - Dark: `#2a3d66` (footer, headings)

## Do / Don't
✅ DO use `var(--accent-main)` instead of hardcoded `#7ea9ff`  
✅ DO scope JS queries to `container` parameter, not `document`  
✅ DO use `fetch()` for all page loads — no direct DOM manipulation of `#page-content`  
✅ DO add responsive styles at 992px, 768px, 400px breakpoints  
✅ DO use `max-width` with `margin: 0 auto` for containers — never fixed pixel widths  

🚫 DON'T add new CSS frameworks or JS libraries without PO + Architect approval  
🚫 DON'T use fixed pixel widths for layout containers  
🚫 DON'T attach event listeners on `DOMContentLoaded` for dynamically loaded content  
🚫 DON'T modify `index.html` shell structure without Architect review  
🚫 DON'T hardcode personal data (phone, email) in new components — reference existing patterns  
