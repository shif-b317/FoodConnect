export class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error?.type === 'entity.parse.failed') return res.status(400).json({ success: false, error: { code: 'INVALID_JSON', message: 'Request body must contain valid JSON.' } });
  if (error?.type === 'entity.too.large') return res.status(413).json({ success: false, error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request body is too large.' } });
  if (error?.code === 11000) return res.status(409).json({ success: false, error: { code: 'EMAIL_IN_USE', message: 'An account with this email already exists.' } });
  if (error?.name === 'ValidationError' || error?.name === 'CastError') {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: error.message } });
  }
  const status = error.status || 500;
  if (status >= 500) console.error(JSON.stringify({ type: 'api_error', requestId: req.requestId, name: error.name, message: error.message, stack: error.stack }));
  res.status(status).json({ success: false, error: { code: error.code || 'INTERNAL_ERROR', message: status >= 500 ? 'An unexpected server error occurred.' : error.message } });
}
