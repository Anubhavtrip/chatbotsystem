export const MESSAGE_ROLE = {
  USER: 'user',
  BOT: 'bot',
  SYSTEM: 'system',
};

export const MESSAGE_STATUS = {
  SENDING: 'sending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  FAILED: 'failed',
};

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  RECONNECT: 'reconnect',
  RECONNECT_ATTEMPT: 'reconnect_attempt',
  MESSAGE: 'chat:message',
  TYPING_START: 'chat:typing:start',
  TYPING_STOP: 'chat:typing:stop',
  SEND_MESSAGE: 'chat:send',
  JOIN_ROOM: 'chat:join',
};

export const API_ENDPOINTS = {
  SEND_MESSAGE: '/chat/message',
  HISTORY: '/chat/history',
  HEALTH: '/health',
};

export const CHAT_CONFIG = {
  BOT_NAME: 'AI Assistant',
  BOT_AVATAR: '🤖',
  WELCOME_MESSAGE:
    "Hi! I'm your AI assistant. Ask me anything — I'm here to help.",
  MOCK_RESPONSE_DELAY_MS: 1200,
  TYPING_DURATION_MS: 900,
  MAX_MESSAGE_LENGTH: 2000,
  RECONNECT_ATTEMPTS: 5,
};
