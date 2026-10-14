import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { IoChatbubbleEllipsesOutline, IoClose, IoSend, IoRefresh, IoSparklesSharp } from 'react-icons/io5';
import { apiRequest } from '../../services/api';
import './FoodConnectChatbot.css';

// ── Constants ────────────────────────────────────────────────────────────────
const SUGGESTED_QUESTIONS = [
  'How can I donate food?',
  'How do NGOs receive donations?',
  'What can volunteers do?',
  'How does food pickup work?',
];

// ── Simple markdown-like renderer ────────────────────────────────────────────
// Handles **bold**, line breaks, and bullet points without adding a dependency.
function renderAssistantText(text) {
  if (!text) return null;

  // Split into paragraphs by double-newline.
  const paragraphs = text.split(/\n{2,}/);
  return paragraphs.map((para, pIdx) => {
    // Detect bullet-list blocks.
    const lines = para.split('\n');
    const isList = lines.every((l) => /^[\s]*[-*•]\s/.test(l) || l.trim() === '');
    if (isList) {
      const items = lines.filter((l) => l.trim());
      return (
        <ul key={pIdx}>
          {items.map((item, i) => (
            <li key={i}>{renderInlineFormatting(item.replace(/^[\s]*[-*•]\s/, ''))}</li>
          ))}
        </ul>
      );
    }
    // Regular paragraph — handle line breaks and inline formatting.
    return <p key={pIdx}>{renderInlineFormatting(para)}</p>;
  });
}

function renderInlineFormatting(text) {
  // Replace **bold** markers.
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

// ── Component ────────────────────────────────────────────────────────────────
export default function FoodConnectChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]); // { role: 'user'|'assistant'|'error', content: string }
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [failedMessage, setFailedMessage] = useState(null); // last user message that failed

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const location = useLocation();

  // Don't show on login / register pages (consistent with Navbar hiding).
  const hideOnPaths = ['/login', '/register'];
  if (hideOnPaths.includes(location.pathname)) return null;

  // ── Auto-scroll to bottom ──────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // ── Focus input when panel opens ───────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      // Small delay so the panel animation starts first.
      const id = setTimeout(() => textareaRef.current?.focus(), 150);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  // ── Auto-resize textarea ──────────────────────────────────────────────
  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 100)}px`;
  }, []);

  // ── Send message ──────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const trimmed = (text ?? inputValue).trim();
    if (!trimmed || isLoading) return;

    setInputValue('');
    setFailedMessage(null);

    // Reset textarea height.
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const userMsg = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build history from current messages (exclude error messages).
      const history = [...messages, userMsg]
        .filter((m) => m.role !== 'error')
        .map((m) => ({ role: m.role, content: m.content }));

      const result = await apiRequest('/chat', {
        method: 'POST',
        body: { message: trimmed, history: history.slice(0, -1) }, // history doesn't include the current message
        token: null, // No auth required for chatbot
      });

      setMessages((prev) => [...prev, { role: 'assistant', content: result.data.reply }]);
    } catch (err) {
      setFailedMessage(trimmed);
      setMessages((prev) => [
        ...prev,
        {
          role: 'error',
          content: err.message || 'Something went wrong. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, messages]);

  // ── Retry failed message ──────────────────────────────────────────────
  const handleRetry = useCallback(() => {
    if (!failedMessage || isLoading) return;
    // Remove the last error message from the conversation.
    setMessages((prev) => {
      const copy = [...prev];
      // Remove trailing error message.
      if (copy.length && copy[copy.length - 1].role === 'error') copy.pop();
      // Remove the last user message (the failed one) — sendMessage will re-add it.
      if (copy.length && copy[copy.length - 1].role === 'user') copy.pop();
      return copy;
    });
    sendMessage(failedMessage);
  }, [failedMessage, isLoading, sendMessage]);

  // ── Keyboard handling ─────────────────────────────────────────────────
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // ── Suggested question click ──────────────────────────────────────────
  const handleSuggestionClick = useCallback((question) => {
    sendMessage(question);
  }, [sendMessage]);

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <>
      {/* Floating toggle button */}
      <button
        id="fc-chatbot-toggle"
        className="fc-chat-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close FoodConnect AI chat' : 'Open FoodConnect AI chat'}
        title="FoodConnect AI"
      >
        {isOpen ? <IoClose /> : <IoChatbubbleEllipsesOutline />}
        {!isOpen && <span className="fc-chat-toggle-badge" />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          id="fc-chatbot-panel"
          className="fc-chat-panel"
          role="dialog"
          aria-label="FoodConnect AI Chat"
        >
          {/* Header */}
          <div className="fc-chat-header">
            <div className="fc-chat-header-icon">
              <IoSparklesSharp />
            </div>
            <div className="fc-chat-header-text">
              <h4 className="fc-chat-header-title">FoodConnect AI</h4>
              <p className="fc-chat-header-subtitle">Your Food Donation Assistant</p>
            </div>
            <button
              className="fc-chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <IoClose />
            </button>
          </div>

          {/* Messages */}
          <div className="fc-chat-messages">
            {/* Welcome card when no messages */}
            {messages.length === 0 && !isLoading && (
              <div className="fc-chat-welcome">
                <div className="fc-chat-welcome-icon">🍽️</div>
                <h4>Welcome to FoodConnect AI!</h4>
                <p>I can help you with food donations, NGO coordination, volunteer assistance, and more.</p>
                <div className="fc-chat-suggestions">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      className="fc-chat-suggestion-btn"
                      onClick={() => handleSuggestionClick(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation messages */}
            {messages.map((msg, idx) => {
              if (msg.role === 'error') {
                return (
                  <div key={idx} className="fc-chat-message fc-chat-message--error">
                    <p>{msg.content}</p>
                    <button className="fc-chat-retry-btn" onClick={handleRetry} disabled={isLoading}>
                      <IoRefresh /> Retry
                    </button>
                  </div>
                );
              }
              return (
                <div
                  key={idx}
                  className={`fc-chat-message fc-chat-message--${msg.role}`}
                >
                  {msg.role === 'assistant' ? renderAssistantText(msg.content) : msg.content}
                </div>
              );
            })}

            {/* Loading indicator */}
            {isLoading && (
              <div className="fc-chat-loading" aria-label="FoodConnect AI is thinking">
                <span className="fc-chat-loading-dot" />
                <span className="fc-chat-loading-dot" />
                <span className="fc-chat-loading-dot" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="fc-chat-input-area">
            <textarea
              ref={textareaRef}
              className="fc-chat-input"
              placeholder="Ask about food donations..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isLoading}
              aria-label="Type your message"
              maxLength={1000}
            />
            <button
              className="fc-chat-send"
              onClick={() => sendMessage()}
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message"
              title="Send"
            >
              <IoSend />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
