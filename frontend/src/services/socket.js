import { io } from 'socket.io-client';
import { SOCKET_EVENTS, CHAT_CONFIG } from '@/constants';
import { envFlag } from '@/utils';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
const USE_MOCK = envFlag('VITE_USE_MOCK_SOCKET', true);

/**
 * Mock socket for local development without a backend.
 * Mirrors real socket.io event names for easy swap to production.
 */
class MockSocket {
  constructor() {
    this.connected = false;
    this.listeners = new Map();
    this._reconnectTimer = null;
  }

  on(event, handler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(handler);
    return this;
  }

  off(event, handler) {
    const set = this.listeners.get(event);
    if (set) set.delete(handler);
    return this;
  }

  emit(event, payload) {
    if (event === SOCKET_EVENTS.SEND_MESSAGE) {
      this._simulateBotReply(payload);
    }
    return this;
  }

  connect() {
    clearTimeout(this._reconnectTimer);
    setTimeout(() => {
      this.connected = true;
      this._dispatch(SOCKET_EVENTS.CONNECT);
    }, 300);
    return this;
  }

  disconnect() {
    this.connected = false;
    this._dispatch(SOCKET_EVENTS.DISCONNECT, 'io client disconnect');
    return this;
  }

  _dispatch(event, ...args) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((fn) => fn(...args));
    }
  }

  _simulateBotReply({ text, messageId }) {
    this._dispatch(SOCKET_EVENTS.TYPING_START, { isTyping: true });

    setTimeout(() => {
      this._dispatch(SOCKET_EVENTS.TYPING_STOP, { isTyping: false });
      this._dispatch(SOCKET_EVENTS.MESSAGE, {
        id: `bot_${Date.now()}`,
        role: 'bot',
        content: this._generateMockReply(text),
        timestamp: new Date().toISOString(),
        replyTo: messageId,
        status: 'delivered',
      });
    }, CHAT_CONFIG.MOCK_RESPONSE_DELAY_MS);
  }

  _generateMockReply(userText) {
    const trimmed = (userText || '').trim();
    if (!trimmed) {
      return "I'm here whenever you're ready. What can I help you with?";
    }
    const lower = trimmed.toLowerCase();
    if (lower.includes('hello') || lower.includes('hi')) {
      return "Hello! I'm your AI assistant. How can I help you today?";
    }
    if (lower.includes('help')) {
      return 'I can answer questions, summarize content, and assist with tasks. Try asking me something specific!';
    }
    if (lower.includes('kafka')) {
      return 'This frontend is built to integrate with a Kafka-backed pipeline — messages flow through REST + WebSocket today, ready for your streaming AI backend.';
    }
    return `Thanks for your message. You asked: "${trimmed.slice(0, 80)}${trimmed.length > 80 ? '…' : ''}"\n\nThis is a mock response. Connect a real AI backend via Socket.io or the REST API to get live answers.`;
  }
}

let socketInstance = null;

/**
 * Create or return singleton socket connection.
 */
export function getSocket() {
  if (socketInstance) return socketInstance;

  if (USE_MOCK) {
    socketInstance = new MockSocket();
    return socketInstance;
  }

  socketInstance = io(SOCKET_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: CHAT_CONFIG.RECONNECT_ATTEMPTS,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    transports: ['websocket', 'polling'],
  });

  return socketInstance;
}

export function connectSocket() {
  const socket = getSocket();
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
}

export function disconnectSocket() {
  if (socketInstance?.connected) {
    socketInstance.disconnect();
  }
}

export function emitMessage(payload) {
  const socket = getSocket();
  socket.emit(SOCKET_EVENTS.SEND_MESSAGE, payload);
}

export function emitTyping(isTyping) {
  const socket = getSocket();
  socket.emit(
    isTyping ? SOCKET_EVENTS.TYPING_START : SOCKET_EVENTS.TYPING_STOP,
    { isTyping }
  );
}

export function subscribeSocketEvents(handlers) {
  const socket = getSocket();
  const entries = Object.entries(handlers);

  entries.forEach(([event, handler]) => {
    if (handler) socket.on(event, handler);
  });

  return () => {
    entries.forEach(([event, handler]) => {
      if (handler) socket.off(event, handler);
    });
  };
}

export default getSocket;
