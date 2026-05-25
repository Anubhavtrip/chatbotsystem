import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  MESSAGE_ROLE,
  MESSAGE_STATUS,
  CHAT_CONFIG,
} from '@/constants';
import { generateId, envFlag } from '@/utils';
import { sendMessageAPI } from './chatAPI';
import { emitMessage } from '@/services/socket';

const USE_MOCK_SOCKET = envFlag('VITE_USE_MOCK_SOCKET', true);

const SESSION_KEY = 'chat_session_id';

function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = generateId('session');
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

const initialState = {
  messages: [],
  loading: false,
  connected: false,
  typing: false,
  error: null,
  isOpen: false,
  sessionId: getSessionId(),
};

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (text, { getState, rejectWithValue }) => {
    const trimmed = text?.trim();
    if (!trimmed) return rejectWithValue('Message cannot be empty');

    const { sessionId } = getState().chat;

    try {
      // WebSocket path — primary for Kafka/streaming AI backends
      emitMessage({
        text: trimmed,
        sessionId,
        messageId: generateId('pending'),
      });

      // REST fallback when socket is disabled or for HTTP-only deployments
      if (USE_MOCK_SOCKET) {
        return { viaSocket: true };
      }

      const response = await sendMessageAPI(trimmed, sessionId);
      return response;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to send message');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleChat(state) {
      state.isOpen = !state.isOpen;
    },
    openChat(state) {
      state.isOpen = true;
    },
    closeChat(state) {
      state.isOpen = false;
    },
    setConnected(state, action) {
      state.connected = action.payload;
    },
    setTyping(state, action) {
      state.typing = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    addUserMessage(state, action) {
      state.messages.push(action.payload);
    },
    addBotMessage(state, action) {
      state.messages.push({
        id: action.payload.id || generateId('bot'),
        role: MESSAGE_ROLE.BOT,
        content: action.payload.content,
        timestamp: action.payload.timestamp || new Date().toISOString(),
        status: MESSAGE_STATUS.DELIVERED,
      });
      state.typing = false;
      state.loading = false;
    },
    updateMessageStatus(state, action) {
      const { id, status } = action.payload;
      const msg = state.messages.find((m) => m.id === id);
      if (msg) msg.status = status;
    },
    receiveSocketMessage(state, action) {
      const { id, content, timestamp, role } = action.payload;
      const exists = state.messages.some((m) => m.id === id);
      if (exists) return;

      state.messages.push({
        id: id || generateId('bot'),
        role: role || MESSAGE_ROLE.BOT,
        content,
        timestamp: timestamp || new Date().toISOString(),
        status: MESSAGE_STATUS.DELIVERED,
      });
      state.typing = false;
      state.loading = false;
    },
    setMessages(state, action) {
      state.messages = action.payload;
    },
    resetChat(state) {
      state.messages = [];
      state.error = null;
      state.loading = false;
      state.typing = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        const userMsg = {
          id: generateId('user'),
          role: MESSAGE_ROLE.USER,
          content: action.meta.arg,
          timestamp: new Date().toISOString(),
          status: MESSAGE_STATUS.SENDING,
        };
        state.messages.push(userMsg);
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const lastUser = [...state.messages]
          .reverse()
          .find((m) => m.role === MESSAGE_ROLE.USER);
        if (lastUser) lastUser.status = MESSAGE_STATUS.SENT;

        if (action.payload?.viaSocket) {
          state.loading = false;
          return;
        }

        // REST response — avoid duplicate if socket already delivered
        const payload = action.payload;
        if (payload?.content) {
          const duplicate = state.messages.some((m) => m.id === payload.id);
          if (!duplicate) {
            state.messages.push({
              id: payload.id || generateId('bot'),
              role: MESSAGE_ROLE.BOT,
              content: payload.content,
              timestamp: payload.timestamp || new Date().toISOString(),
              status: MESSAGE_STATUS.DELIVERED,
            });
          }
        }
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to send message';
        const lastUser = [...state.messages]
          .reverse()
          .find((m) => m.role === MESSAGE_ROLE.USER);
        if (lastUser) lastUser.status = MESSAGE_STATUS.FAILED;
      });
  },
});

export const {
  toggleChat,
  openChat,
  closeChat,
  setConnected,
  setTyping,
  setError,
  clearError,
  addUserMessage,
  addBotMessage,
  updateMessageStatus,
  receiveSocketMessage,
  setMessages,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
