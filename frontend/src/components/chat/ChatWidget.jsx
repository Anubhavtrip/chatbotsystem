import { useState, useEffect } from 'react';
import { useChat, useSocket } from '@/hooks';
import { ChatButton } from './ChatButton';
import { ChatWindow } from './ChatWindow';

/**
 * Floating chatbot widget — drop into any page layout.
 */
export function ChatWidget() {
  useSocket(true);
  const {
    messages,
    loading,
    connected,
    typing,
    error,
    isOpen,
    hasMessages,
    sendMessage,
    toggleChat,
    closeChat,
    clearError,
    resetChat,
  } = useChat();

  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) setIsClosing(false);
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeChat();
      setIsClosing(false);
    }, 200);
  };

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      toggleChat();
    }
  };

  return (
    <>
      <ChatWindow
        isOpen={isOpen}
        isClosing={isClosing}
        messages={messages}
        loading={loading}
        typing={typing}
        connected={connected}
        error={error}
        hasMessages={hasMessages}
        onClose={handleClose}
        onSend={sendMessage}
        onReset={resetChat}
        onClearError={clearError}
        onSuggestionClick={sendMessage}
      />
      <ChatButton isOpen={isOpen} onClick={handleToggle} />
    </>
  );
}

export default ChatWidget;
