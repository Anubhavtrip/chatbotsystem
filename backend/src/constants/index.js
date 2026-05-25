const SOCKET_EVENTS = {
  CONNECT: 'connect',
  CONNECTED: 'CONNECTED',
  DISCONNECT: 'disconnect',
  SEND_MESSAGE: 'SEND_MESSAGE',
  RECEIVE_MESSAGE: 'RECEIVE_MESSAGE',
  BOT_TYPING: 'BOT_TYPING',
  USER_TYPING: 'USER_TYPING',
  JOIN_BRAND_ROOM: 'JOIN_BRAND_ROOM',
  ERROR: 'ERROR',
  RECONNECT: 'reconnect',
};

const KAFKA_TOPICS = {
  CHAT_MESSAGES: 'chat_messages',
  BOT_RESPONSES: 'bot_responses',
  TYPING_EVENTS: 'typing_events',
  ANALYTICS_EVENTS: 'analytics_events',
  WORKFLOW_EVENTS: 'workflow_events',
};

const MESSAGE_SENDERS = {
  USER: 'user',
  BOT: 'bot',
  SYSTEM: 'system',
};

const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  QUICK_REPLY: 'quick_reply',
};

const WORKFLOW_NODE_TYPES = {
  INPUT: 'input',
  INTENT: 'intent',
  MEMORY: 'memory',
  PROMPT: 'prompt',
  AI: 'ai',
  RESPONSE: 'response',
};

const REDIS_KEYS = {
  socketSession: (socketId) => `socket:session:${socketId}`,
  brandRoom: (brandId) => `brand:room:${brandId}`,
  typing: (brandId, conversationId) => `typing:${brandId}:${conversationId}`,
  activeUsers: (brandId) => `brand:active:${brandId}`,
  rateLimit: (ip) => `ratelimit:${ip}`,
  brandCache: (brandId) => `cache:brand:${brandId}`,
  chatbotCache: (brandId) => `cache:chatbot:${brandId}`,
};

const BRAND_ROOM_PREFIX = 'brand:';

function getBrandRoom(brandId) {
  return `${BRAND_ROOM_PREFIX}${brandId}`;
}

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports = {
  SOCKET_EVENTS,
  KAFKA_TOPICS,
  MESSAGE_SENDERS,
  MESSAGE_TYPES,
  WORKFLOW_NODE_TYPES,
  REDIS_KEYS,
  BRAND_ROOM_PREFIX,
  getBrandRoom,
  HTTP_STATUS,
};
