/**
 * FoodConnect AI Chatbot — POST /api/v1/chat
 *
 * Accepts a user message (and optional conversation history), forwards it
 * to the Gemini LLM via the chatbot service, and returns the reply.
 *
 * No authentication required — the chatbot answers general informational
 * questions and never exposes private data.
 */

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getAIResponse } from '../services/chatbot.js';

const router = Router();

// ── Rate limiting (per IP) ──────────────────────────────────────────────────
// More restrictive than the general auth limiter because each request calls
// a paid LLM API.
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  limit: 50,                   // 50 messages per window per IP
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many chat requests. Please wait a few minutes before trying again.' } },
});

router.use(chatLimiter);

// ── Validation constants ────────────────────────────────────────────────────
const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_LENGTH = 40; // 20 turns × 2 (user + assistant)

// ── POST /api/v1/chat ───────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  // --- Input validation ---
  const { message, history } = req.body ?? {};

  if (message === undefined || message === null) {
    return res.status(400).json({ success: false, error: { code: 'MESSAGE_REQUIRED', message: 'A "message" field is required.' } });
  }
  if (typeof message !== 'string') {
    return res.status(400).json({ success: false, error: { code: 'INVALID_MESSAGE', message: 'The "message" field must be a string.' } });
  }
  const trimmedMessage = message.trim();
  if (trimmedMessage.length === 0) {
    return res.status(400).json({ success: false, error: { code: 'EMPTY_MESSAGE', message: 'The message must not be empty.' } });
  }
  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ success: false, error: { code: 'MESSAGE_TOO_LONG', message: `The message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` } });
  }

  // --- History validation (optional) ---
  let validatedHistory = [];
  if (history !== undefined) {
    if (!Array.isArray(history)) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_HISTORY', message: 'The "history" field must be an array.' } });
    }
    if (history.length > MAX_HISTORY_LENGTH) {
      // Silently trim rather than reject — the frontend may drift.
      validatedHistory = history.slice(-MAX_HISTORY_LENGTH);
    } else {
      validatedHistory = history;
    }
    // Validate each turn.
    for (const turn of validatedHistory) {
      if (!turn || typeof turn.role !== 'string' || !['user', 'assistant'].includes(turn.role) || typeof turn.content !== 'string') {
        return res.status(400).json({ success: false, error: { code: 'INVALID_HISTORY', message: 'Each history entry must have a "role" (user or assistant) and a "content" string.' } });
      }
    }
  }

  // --- Call the LLM ---
  try {
    const reply = await getAIResponse(trimmedMessage, validatedHistory);
    return res.json({ success: true, data: { reply } });
  } catch (err) {
    const status = err.status || 500;
    const code = err.code || 'INTERNAL_ERROR';
    // Only log details for unexpected errors.
    if (status >= 500) {
      console.error(JSON.stringify({ type: 'chat_error', requestId: req.requestId, code, message: err.message }));
    }
    return res.status(status).json({
      success: false,
      error: {
        code,
        message: status >= 500 ? 'An unexpected error occurred while processing your message.' : err.message,
      },
    });
  }
});

export default router;
