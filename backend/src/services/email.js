import { config } from '../config.js';

export async function sendEmail({ to, subject, text, html }) {
  if (config.emailProvider === 'console' && config.nodeEnv !== 'production') {
    console.info(`Development email for ${to}\nSubject: ${subject}\n${text}`);
    return;
  }
  if (config.emailProvider !== 'resend' || !config.resendApiKey || !config.emailFrom) {
    throw new Error('Email delivery is not configured. Set EMAIL_PROVIDER=resend, RESEND_API_KEY, and EMAIL_FROM.');
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.resendApiKey}`, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(10000),
    body: JSON.stringify({ from: config.emailFrom, to: [to], subject, text, html }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Email provider returned ${response.status}: ${detail.slice(0, 300)}`);
  }
}
