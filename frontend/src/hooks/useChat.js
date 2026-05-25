import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  sendMessage,
  toggleChat,
  openChat,
  closeChat,
  clearError,
  resetChat,
} from '@/features/chat/chatSlice';
import {
  selectMessages,
  selectIsLoading,
  selectIsConnected,
  selectIsTyping,
  selectChatError,
  selectIsChatOpen,
  selectHasMessages,
} from '@/features/chat/chatSelectors';

/**
 * Primary chat hook — actions + selectors in one place for components.
 */
export function useChat() {
  const dispatch = useDispatch();

  const messages = useSelector(selectMessages);
  const loading = useSelector(selectIsLoading);
  const connected = useSelector(selectIsConnected);
  const typing = useSelector(selectIsTyping);
  const error = useSelector(selectChatError);
  const isOpen = useSelector(selectIsChatOpen);
  const hasMessages = useSelector(selectHasMessages);

  const handleSend = useCallback(
    (text) => {
      dispatch(sendMessage(text));
    },
    [dispatch]
  );

  const handleToggle = useCallback(() => {
    dispatch(toggleChat());
  }, [dispatch]);

  const handleOpen = useCallback(() => {
    dispatch(openChat());
  }, [dispatch]);

  const handleClose = useCallback(() => {
    dispatch(closeChat());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleReset = useCallback(() => {
    dispatch(resetChat());
  }, [dispatch]);

  return {
    messages,
    loading,
    connected,
    typing,
    error,
    isOpen,
    hasMessages,
    sendMessage: handleSend,
    toggleChat: handleToggle,
    openChat: handleOpen,
    closeChat: handleClose,
    clearError: handleClearError,
    resetChat: handleReset,
  };
}

export default useChat;
