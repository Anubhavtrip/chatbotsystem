import { createSelector } from '@reduxjs/toolkit';
import { MESSAGE_ROLE } from '@/constants';

const selectChatState = (state) => state.chat;

export const selectMessages = createSelector(
  selectChatState,
  (chat) => chat.messages
);

export const selectIsLoading = createSelector(
  selectChatState,
  (chat) => chat.loading
);

export const selectIsConnected = createSelector(
  selectChatState,
  (chat) => chat.connected
);

export const selectIsTyping = createSelector(
  selectChatState,
  (chat) => chat.typing
);

export const selectChatError = createSelector(
  selectChatState,
  (chat) => chat.error
);

export const selectIsChatOpen = createSelector(
  selectChatState,
  (chat) => chat.isOpen
);

export const selectSessionId = createSelector(
  selectChatState,
  (chat) => chat.sessionId
);

export const selectHasMessages = createSelector(
  selectMessages,
  (messages) => messages.length > 0
);

export const selectLastMessage = createSelector(selectMessages, (messages) =>
  messages.length > 0 ? messages[messages.length - 1] : null
);

export const selectUserMessages = createSelector(selectMessages, (messages) =>
  messages.filter((m) => m.role === MESSAGE_ROLE.USER)
);

export const selectBotMessages = createSelector(selectMessages, (messages) =>
  messages.filter((m) => m.role === MESSAGE_ROLE.BOT)
);

export const selectChatMeta = createSelector(
  selectIsLoading,
  selectIsConnected,
  selectIsTyping,
  selectChatError,
  selectIsChatOpen,
  (loading, connected, typing, error, isOpen) => ({
    loading,
    connected,
    typing,
    error,
    isOpen,
  })
);
