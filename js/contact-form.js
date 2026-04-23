'use strict';

// ── CONFIG ────────────────────────────────────────────────────────────────────
// Backend URL. During local development the backend runs on port 3001.
// Change this to your deployed URL when you go live.
const API_URL = 'http://localhost:3001/api/contact';

// ── SHARED SUBMIT HANDLER ─────────────────────────────────────────────────────
/**
 * Attach a submit handler to a contact form found inside `scope`.
 * Works for both the Contact page form (#contactForm) and the
 * footer quick-message form (#footerContactForm).
 *
 * @param {Document|Element} scope  - DOM scope to search within
 * @param {string}           formId - ID of the <form> element
 * @param {string|null}      msgId  - ID of the feedback <p> element (optional)
 */
function attachFormHandler(scope, formId, msgId) {
  const form = scope.querySelector(`#${formId}`);
  if (!form) return;

  // Prevent double-binding if the footer is already in the DOM
  if (form.dataset.bound === 'true') return;
  form.dataset.bound = 'true';

  const msgEl = msgId ? scope.querySelector(`#${msgId}`) : null;
  const submitBtn = form.querySelector('[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // ── UI: loading state ──────────────────────────────────────────────────
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }
    setMessage(msgEl, '', 'neutral');

    // ── Collect & validate client-side ────────────────────────────────────
    const data = {
      user_name: form.querySelector('[name="user_name"]')?.value.trim() || '',
      user_email: form.querySelector('[name="user_email"]')?.value.trim() || '',
      message: form.querySelector('[name="message"]')?.value.trim() || '',
    };

    const clientError = clientValidate(data);
    if (clientError) {
      setMessage(msgEl, `⚠️ ${clientError}`, 'error');
      resetBtn(submitBtn);
      return;
    }

    // ── POST to backend ───────────────────────────────────────────────────
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok) {
        setMessage(msgEl, '✅ Message sent! I\'ll get back to you soon.', 'success');
        form.reset();
      } else if (res.status === 422 && result.fields) {
        // Server-side field errors
        const fieldMsgs = Object.values(result.fields).join(' ');
        setMessage(msgEl, `⚠️ ${fieldMsgs}`, 'error');
      } else if (res.status === 429) {
        setMessage(msgEl, '⏳ Too many messages. Please wait 15 minutes and try again.', 'error');
      } else {
        setMessage(msgEl, `❌ ${result.error || 'Something went wrong. Please try again.'}`, 'error');
      }

    } catch (err) {
      console.error('Contact form error:', err);
      setMessage(
        msgEl,
        '❌ Could not reach the server. Email me directly at ezz.bnhammouda@gmail.com',
        'error'
      );
    } finally {
      resetBtn(submitBtn);
    }
  });
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function clientValidate({ user_name, user_email, message }) {
  if (!user_name) return 'Name is required.';
  if (!user_email) return 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user_email)) return 'Please enter a valid email.';
  if (!message || message.length < 10) return 'Message must be at least 10 characters.';
  return null;
}

function setMessage(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.style.color =
    type === 'success' ? 'var(--accent-main)' :
      type === 'error' ? '#ef4444' : '';
}

function resetBtn(btn) {
  if (!btn) return;
  btn.disabled = false;
  btn.textContent = btn.dataset.label || 'Send';
}

// ── INIT ──────────────────────────────────────────────────────────────────────
/**
 * Called by main.js after the Contact page is dynamically loaded.
 */
function initContactForm(scope = document) {
  // Store original button label before first disable
  scope.querySelectorAll('[type="submit"]').forEach(btn => {
    btn.dataset.label = btn.textContent.trim();
  });
  attachFormHandler(scope, 'contactForm', 'contactMessage');
}

/**
 * Called once on DOMContentLoaded for the footer form which is
 * always present after the footer partial loads.
 */
function initFooterForm() {
  // Footer loads via fetch — poll briefly until it appears
  let attempts = 0;
  const interval = setInterval(() => {
    const footer = document.querySelector('#footerContactForm');
    if (footer || ++attempts > 20) {
      clearInterval(interval);
      if (footer) {
        footer.querySelector('[type="submit"]').dataset.label = 'Send';
        attachFormHandler(document, 'footerContactForm', 'footerContactMessage');
      }
    }
  }, 150);
}

document.addEventListener('DOMContentLoaded', initFooterForm);
