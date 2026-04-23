'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const contactRouter = require('./routes/contact');
const trackRouter = require('./routes/track');

const app = express();
const PORT = process.env.PORT || 3001;

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allow requests from the portfolio frontend (file:// during dev + any
// localhost origin).  In production replace with your real domain.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, cb) {
        // Allow requests with no origin (curl, Postman, file://)
        if (!origin) return cb(null, true);
        if (
            allowedOrigins.includes(origin) ||
            /^http:\/\/localhost(:\d+)?$/.test(origin) ||
            /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)
        ) return cb(null, true);
        cb(new Error(`CORS: origin "${origin}" not allowed`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));

// ── BODY PARSING ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '16kb' }));

// ── GLOBAL RATE LIMIT ─────────────────────────────────────────────────────────
// 10 requests per IP per 15 minutes across all routes
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' },
}));

// ── ROUTES ────────────────────────────────────────────────────────────────────
app.use('/api/contact', contactRouter);
app.use('/api/track', trackRouter);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// 404 fallback
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// ── START ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅  Portfolio backend running on http://localhost:${PORT}`);
    console.log(`    Email recipient : ${process.env.RECIPIENT_EMAIL || '(not set)'}`);
    console.log(`    Stats endpoint  : GET /api/track (key required: ${process.env.STATS_SECRET ? 'yes' : 'no'})`);
});
