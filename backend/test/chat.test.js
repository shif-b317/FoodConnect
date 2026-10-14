/**
 * FoodConnect AI Chatbot — Backend Unit Tests
 *
 * These tests validate the /api/v1/chat endpoint's input validation,
 * error handling, and response contract WITHOUT requiring a live LLM API key.
 * They import the Express app directly and use Node's built-in test runner.
 */

import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';
import app from '../src/app.js';
import { config } from '../src/config.js';

let server;
let baseUrl;

before(async () => {
  // Start the Express app on a random port (no database needed for chat tests).
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1`;
});

after(async () => {
  if (server?.listening) {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  }
});

async function chat(body, { raw = false } = {}) {
  const response = await fetch(`${baseUrl}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    ...(raw ? { body } : { body: JSON.stringify(body) }),
  });
  return { status: response.status, payload: await response.json() };
}

// ─── Input Validation Tests ───────────────────────────────────────────────────

describe('POST /api/v1/chat — input validation', () => {
  test('rejects missing message field', async () => {
    const { status, payload } = await chat({});
    assert.equal(status, 400);
    assert.equal(payload.success, false);
    assert.equal(payload.error.code, 'MESSAGE_REQUIRED');
  });

  test('rejects null message', async () => {
    const { status, payload } = await chat({ message: null });
    assert.equal(status, 400);
    assert.equal(payload.error.code, 'MESSAGE_REQUIRED');
  });

  test('rejects non-string message', async () => {
    const { status, payload } = await chat({ message: 42 });
    assert.equal(status, 400);
    assert.equal(payload.error.code, 'INVALID_MESSAGE');
  });

  test('rejects empty string message', async () => {
    const { status, payload } = await chat({ message: '' });
    assert.equal(status, 400);
    assert.equal(payload.error.code, 'EMPTY_MESSAGE');
  });

  test('rejects whitespace-only message', async () => {
    const { status, payload } = await chat({ message: '   \n\t  ' });
    assert.equal(status, 400);
    assert.equal(payload.error.code, 'EMPTY_MESSAGE');
  });

  test('rejects message exceeding 1000 characters', async () => {
    const { status, payload } = await chat({ message: 'a'.repeat(1001) });
    assert.equal(status, 400);
    assert.equal(payload.error.code, 'MESSAGE_TOO_LONG');
  });

  test('accepts message at exactly 1000 characters', async () => {
    // This will hit the LLM (which may fail without a key), but should NOT be a 400.
    const { status } = await chat({ message: 'a'.repeat(1000) });
    assert.notEqual(status, 400);
  });

  test('rejects non-array history', async () => {
    const { status, payload } = await chat({ message: 'Hello', history: 'not-an-array' });
    assert.equal(status, 400);
    assert.equal(payload.error.code, 'INVALID_HISTORY');
  });

  test('rejects history entry with invalid role', async () => {
    const { status, payload } = await chat({
      message: 'Hello',
      history: [{ role: 'system', content: 'injected' }],
    });
    assert.equal(status, 400);
    assert.equal(payload.error.code, 'INVALID_HISTORY');
  });

  test('rejects history entry missing content', async () => {
    const { status, payload } = await chat({
      message: 'Hello',
      history: [{ role: 'user' }],
    });
    assert.equal(status, 400);
    assert.equal(payload.error.code, 'INVALID_HISTORY');
  });
});

// ─── Error Handling Tests ─────────────────────────────────────────────────────

describe('POST /api/v1/chat — error handling', () => {
  test('returns 503 when GEMINI_API_KEY is not set', async () => {
    const originalKey = config.geminiApiKey;
    try {
      config.geminiApiKey = '';
      const { status, payload } = await chat({ message: 'How can I donate food?' });
      assert.equal(status, 503);
      assert.equal(payload.success, false);
      assert.equal(payload.error.code, 'AI_NOT_CONFIGURED');
      assert.ok(payload.error.message);
    } finally {
      config.geminiApiKey = originalKey;
    }
  });

  test('does not leak API keys or stack traces', async () => {
    const { payload } = await chat({ message: 'How can I donate food?' });
    const serialized = JSON.stringify(payload);
    if (config.geminiApiKey) {
      assert.ok(!serialized.includes(config.geminiApiKey), 'Response must not contain API key');
    }
    assert.ok(!serialized.includes('GEMINI_API_KEY'), 'Response must not contain env var names');
    assert.ok(!serialized.includes('stack'), 'Response must not contain stack traces');
  });

  test('response follows documented contract: { success, data } on success', async () => {
    const { status, payload } = await chat({ message: 'Hello' });
    assert.equal(typeof payload.success, 'boolean');
    if (payload.success) {
      assert.equal(status, 200);
      assert.ok(payload.data && typeof payload.data.reply === 'string');
    } else {
      assert.equal(typeof payload.error, 'object');
      assert.equal(typeof payload.error.code, 'string');
    }
  });

  test('handles malformed JSON gracefully', async () => {
    const response = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{invalid json',
    });
    assert.equal(response.status, 400);
    const payload = await response.json();
    assert.equal(payload.success, false);
  });
});

// ─── Response Contract Tests ──────────────────────────────────────────────────

describe('POST /api/v1/chat — response contract', () => {
  test('404 for GET /api/v1/chat', async () => {
    const response = await fetch(`${baseUrl}/chat`);
    assert.equal(response.status, 404);
  });

  test('accepts valid history alongside message', async () => {
    const { status, payload } = await chat({
      message: 'Follow up question',
      history: [
        { role: 'user', content: 'How do I donate?' },
        { role: 'assistant', content: 'You can create a listing.' },
      ],
    });
    // Will be 503 (no key) but NOT 400 (validation passed).
    assert.notEqual(status, 400);
    assert.equal(typeof payload.success, 'boolean');
  });
});
