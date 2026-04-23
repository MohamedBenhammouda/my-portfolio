'use strict';

/**
 * Visitor Tracking Route
 * ──────────────────────
 * POST /api/track  — record a new visit (called once per session from frontend)
 * GET  /api/track  — return aggregated stats (for owner dashboard use)
 *
 * Privacy guarantees:
 *  - NO IP addresses stored
 *  - NO user-agent stored
 *  - NO cookies set by the backend
 *  - Only anonymous session IDs (random UUID generated client-side) are stored
 *    temporarily to detect duplicates within a rolling 30-minute window,
 *    then purged automatically.
 *  - Only aggregated counts and dates are persisted long-term.
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../data/visits.json');

// ── RATE LIMIT ────────────────────────────────────────────────────────────────
// Very generous — this is a fire-and-forget ping, not a sensitive endpoint.
// 60 requests per IP per hour (covers legitimate page navigations).
router.use(rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Rate limit exceeded.' },
}));

// ── HELPERS ───────────────────────────────────────────────────────────────────
function readData() {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch {
        return { totalVisits: 0, sessions: [], dailyStats: {} };
    }
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Purge session records older than 30 minutes.
 * These are only used for deduplication — not stored long-term.
 */
function purgeOldSessions(sessions) {
    const cutoff = Date.now() - 30 * 60 * 1000;
    return sessions.filter(s => s.ts > cutoff);
}

/** Returns today's date string in YYYY-MM-DD format (UTC). */
function todayKey() {
    return new Date().toISOString().slice(0, 10);
}

// ── POST /api/track ───────────────────────────────────────────────────────────
router.post('/', (req, res) => {
    const { sessionId, page } = req.body || {};

    // Basic input validation
    if (
        typeof sessionId !== 'string' ||
        sessionId.length < 8 ||
        sessionId.length > 64 ||
        !/^[a-zA-Z0-9_-]+$/.test(sessionId)
    ) {
        return res.status(400).json({ error: 'Invalid session ID.' });
    }

    const safePage = typeof page === 'string'
        ? page.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50) || 'unknown'
        : 'unknown';

    const data = readData();

    // Purge stale sessions first
    data.sessions = purgeOldSessions(data.sessions || []);

    // Deduplication: if this sessionId was seen in the last 30 min, skip
    const alreadySeen = data.sessions.some(s => s.id === sessionId);
    if (alreadySeen) {
        return res.status(200).json({ recorded: false, reason: 'duplicate' });
    }

    // Record the session ID temporarily (for dedup only — no PII)
    data.sessions.push({ id: sessionId, ts: Date.now() });

    // Increment total
    data.totalVisits = (data.totalVisits || 0) + 1;

    // Increment daily stat
    const today = todayKey();
    if (!data.dailyStats[today]) {
        data.dailyStats[today] = { visits: 0, pages: {} };
    }
    data.dailyStats[today].visits += 1;
    data.dailyStats[today].pages[safePage] =
        (data.dailyStats[today].pages[safePage] || 0) + 1;

    // Keep only last 90 days of daily stats to prevent unbounded growth
    const keys = Object.keys(data.dailyStats).sort();
    if (keys.length > 90) {
        keys.slice(0, keys.length - 90).forEach(k => delete data.dailyStats[k]);
    }

    writeData(data);

    console.log(`[track] visit recorded — page: ${safePage} | total: ${data.totalVisits}`);

    return res.status(201).json({ recorded: true, total: data.totalVisits });
});

// ── GET /api/track ────────────────────────────────────────────────────────────
// Returns aggregated stats. Protect this in production with a secret key.
router.get('/', (req, res) => {
    // Optional: simple secret key check for the stats endpoint
    const secret = process.env.STATS_SECRET;
    if (secret && req.headers['x-stats-key'] !== secret) {
        return res.status(401).json({ error: 'Unauthorized.' });
    }

    const data = readData();

    // Return stats without the raw session list (privacy)
    return res.json({
        totalVisits: data.totalVisits || 0,
        dailyStats: data.dailyStats || {},
        last7Days: getLast7Days(data.dailyStats || {}),
    });
});

function getLast7Days(dailyStats) {
    const result = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setUTCDate(d.getUTCDate() - i);
        const key = d.toISOString().slice(0, 10);
        result.push({ date: key, visits: dailyStats[key]?.visits || 0 });
    }
    return result;
}

module.exports = router;
