'use strict';

/**
 * Sanitise a string: trim whitespace and strip HTML tags.
 * Prevents stored-XSS if the data is ever rendered back.
 */
function sanitise(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/<[^>]*>/g, '');
}

/**
 * Validate & sanitise the contact form body.
 * Attaches `req.cleanBody` on success, or returns 422 with field errors.
 */
function validateContact(req, res, next) {
    const { user_name, user_email, message } = req.body || {};

    const errors = {};

    // ── name ──────────────────────────────────────────────────────────────────
    const name = sanitise(user_name);
    if (!name) errors.user_name = 'Name is required.';
    else if (name.length > 100) errors.user_name = 'Name must be 100 characters or fewer.';

    // ── email ─────────────────────────────────────────────────────────────────
    const email = sanitise(user_email);
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) errors.user_email = 'Email is required.';
    else if (!emailRe.test(email)) errors.user_email = 'Please enter a valid email address.';
    else if (email.length > 254) errors.user_email = 'Email address is too long.';

    // ── message ───────────────────────────────────────────────────────────────
    const msg = sanitise(message);
    if (!msg) errors.message = 'Message is required.';
    else if (msg.length < 10) errors.message = 'Message must be at least 10 characters.';
    else if (msg.length > 5000) errors.message = 'Message must be 5 000 characters or fewer.';

    if (Object.keys(errors).length > 0) {
        return res.status(422).json({ error: 'Validation failed.', fields: errors });
    }

    req.cleanBody = { name, email, message: msg };
    next();
}

module.exports = { validateContact };
