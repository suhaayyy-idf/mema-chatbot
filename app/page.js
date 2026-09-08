'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = 'mema-chatbot-chats-v1';
const MODEL_LABEL = 'OpenAI GPT-OSS 20B';

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function makeChat() {
  const now = Date.now();
  return {
    id: makeId(),
    title: 'New chat',
    createdAt: now,
    updatedAt: now,
    messages: []
  };
}

function makeTitle(text) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return 'New chat';
  return clean.length > 34 ? `${clean.slice(0, 34)}…` : clean;
}

export default function Home() {
  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const textareaRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChats(parsed);
          setActiveId(parsed[0].id);
        } else {
          const first = makeChat();
          setChats([first]);
          setActiveId(first.id);
        }
      } else {
        const first = makeChat();
        setChats([first]);
        setActiveId(first.id);
      }
    } catch {
      const first = makeChat();
      setChats([first]);
      setActiveId(first.id);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats, isReady]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeId, isSending]);

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeId) || null,
    [chats, activeId]
  );

  const sortedChats = useMemo(
    () => [...chats].sort((a, b) => b.updatedAt - a.updatedAt),
    [chats]
  );

  function updateChat(id, updater) {
    setChats((current) =>
      current.map((chat) => (chat.id === id ? updater(chat) : chat))
    );
  }

  function createChat() {
    const next = makeChat();
    setChats((current) => [next, ...current]);
    setActiveId(next.id);
    setInput('');
    setError('');
    setSidebarOpen(false);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  function selectChat(id) {
    setActiveId(id);
    setError('');
    setSidebarOpen(false);
  }

  function deleteChat(id) {
    const target = chats.find((chat) => chat.id === id);
    if (!target) return;

    const confirmed = window.confirm(`Delete “${target.title}”? This cannot be undone.`);
    if (!confirmed) return;

    setChats((current) => {
      const remaining = current.filter((chat) => chat.id !== id);
      if (remaining.length === 0) {
        const fresh = makeChat();
        setActiveId(fresh.id);
        return [fresh];
      }
      if (id === activeId) setActiveId(remaining[0].id);
      return remaining;
    });
  }

  async function sendMessage(event) {
    event?.preventDefault();
    const text = input.trim();
    if (!text || !activeChat || isSending) return;

    setError('');
    setInput('');
    const userMessage = { role: 'user', content: text };
    const nextMessages = [...activeChat.messages, userMessage];

    updateChat(activeChat.id, (chat) => ({
      ...chat,
      title: chat.messages.length === 0 ? makeTitle(text) : chat.title,
      messages: nextMessages,
      updatedAt: Date.now()
    }));

    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong.');

      const assistantMessage = { role: 'assistant', content: data.reply };
      updateChat(activeChat.id, (chat) => ({
        ...chat,
        messages: [...chat.messages, assistantMessage],
        updatedAt: Date.now()
      }));
    } catch (err) {
      setError(err.message || 'Unable to reach the chatbot.');
    } finally {
      setIsSending(false);
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage(event);
    }
  }

  if (!isReady || !activeChat) {
    return <div className="loading-screen">Loading Mema…</div>;
  }

  return (
    <main className="app-shell">
      <div
        className={`mobile-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark">M</div>
          <div>
            <div className="brand-name">Mema</div>
            <div className="brand-subtitle">your little AI space</div>
          </div>
          <button
            className="icon-button mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>

        <button className="new-chat-button" onClick={createChat}>
          <span className="plus">+</span>
          <span>New chat</span>
        </button>

        <div className="history-heading">Your chats</div>
        <div className="chat-list">
          {sortedChats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${chat.id === activeId ? 'active' : ''}`}
            >
              <button className="chat-select" onClick={() => selectChat(chat.id)}>
                <span className="chat-dot" />
                <span className="chat-title">{chat.title}</span>
              </button>
              <button
                className="delete-button"
                onClick={() => deleteChat(chat.id)}
                aria-label={`Delete ${chat.title}`}
                title="Delete chat"
              >
                <span aria-hidden="true">⌫</span>
              </button>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="memory-pill">
            <span className="memory-dot" />
            Memory on
          </div>
          <p>Chats are saved in this browser so they remain after you close the page.</p>
        </div>
      </aside>

      <section className="chat-panel">
        <header className="topbar">
          <button
            className="icon-button menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            ☰
          </button>
          <div className="topbar-title">
            <div className="current-chat-title">{activeChat.title}</div>
            <div className="model-badge">{MODEL_LABEL}</div>
          </div>
          <button className="top-new-chat" onClick={createChat}>
            <span>+</span> New
          </button>
        </header>

        <div className="messages-area">
          {activeChat.messages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-orb">✦</div>
              <p className="eyebrow">Mema Chatbot</p>
              <h1>What can I help you with?</h1>
              <p className="welcome-copy">
                Ask a question, brainstorm an idea, explain something, or just start a conversation.
              </p>
              <div className="suggestions">
                <button onClick={() => setInput('Help me plan my week')}>Plan my week</button>
                <button onClick={() => setInput('Explain a difficult topic simply')}>Explain something</button>
                <button onClick={() => setInput('Give me three creative ideas')}>Brainstorm ideas</button>
              </div>
            </div>
          ) : (
            <div className="messages">
              {activeChat.messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`message-row ${message.role}`}>
                  <div className={`avatar ${message.role}`}>
                    {message.role === 'user' ? 'Y' : 'M'}
                  </div>
                  <div className="message-content">
                    <div className="message-name">{message.role === 'user' ? 'You' : 'Mema'}</div>
                    <div className="message-text">{message.content}</div>
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="message-row assistant">
                  <div className="avatar assistant">M</div>
                  <div className="message-content">
                    <div className="message-name">Mema</div>
                    <div className="typing"><span /><span /><span /></div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <div className="composer-wrap">
          {error && <div className="error-message">{error}</div>}
          <form className="composer" onSubmit={sendMessage}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Mema…"
              rows={1}
              aria-label="Message Mema"
              disabled={isSending}
            />
            <button
              className="send-button"
              type="submit"
              disabled={!input.trim() || isSending}
              aria-label="Send message"
            >
              ↑
            </button>
          </form>
          <div className="composer-hint">Enter to send · Shift + Enter for a new line</div>
        </div>
      </section>
    </main>
  );
}
