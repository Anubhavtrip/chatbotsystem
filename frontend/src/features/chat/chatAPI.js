import apiClient from '@/services/axios';
import { API_ENDPOINTS, CHAT_CONFIG, MESSAGE_ROLE } from '@/constants';
import { delay, envFlag, generateId } from '@/utils';

const USE_MOCK = envFlag('VITE_USE_MOCK_API', true);

const MOCK_REPLIES = [
  "That's a great question! Here's what I can tell you based on your input.",
  "I understand. Let me help you with that step by step.",
  'Thanks for reaching out. Is there anything else you would like to explore?',
];

/**
 * Mock AI response — replace with real backend when Kafka + AI pipeline is ready.
 */
async function mockSendMessage(text) {
  await delay(CHAT_CONFIG.MOCK_RESPONSE_DELAY_MS);
  const index = Math.abs(text.length) % MOCK_REPLIES.length;
  return {
    id: generateId('bot'),
    role: MESSAGE_ROLE.BOT,
    content: `${MOCK_REPLIES[index]}\n\n(You said: "${text.slice(0, 120)}")`,
    timestamp: new Date().toISOString(),
  };
}

/**
 * POST message to REST API (fallback / HTTP path for AI services).
 */
export async function sendMessageAPI(text, sessionId) {
  if (USE_MOCK) {
    return mockSendMessage(text);
  }

  const { data } = await apiClient.post(API_ENDPOINTS.SEND_MESSAGE, {
    text,
    sessionId,
  });
  return data;
}

/**
 * Fetch chat history for session restore.
 */
export async function fetchChatHistory(sessionId) {
  if (USE_MOCK) {
    return { messages: [] };
  }

  const { data } = await apiClient.get(API_ENDPOINTS.HISTORY, {
    params: { sessionId },
  });
  return data;
}

/**
 * Health check for backend readiness.
 */
export async function checkApiHealth() {
  if (USE_MOCK) {
    return { status: 'ok', mode: 'mock' };
  }

  const { data } = await apiClient.get(API_ENDPOINTS.HEALTH);
  return data;
}
