import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { cn } from '@/utils';

export function ChatWindow({
  isOpen,
  isClosing,
  messages,
  loading,
  typing,
  connected,
  error,
  hasMessages,
  onClose,
  onSend,
  onReset,
  onClearError,
  onSuggestionClick,
}) {
  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={cn(
        'fixed bottom-24 right-4 z-50 flex flex-col overflow-hidden',
        'h-[min(560px,calc(100vh-8rem))] w-[min(400px,calc(100vw-2rem))]',
        'rounded-2xl border border-chat-border/50 bg-chat-surface shadow-2xl shadow-black/40',
        'sm:bottom-28 sm:right-6',
        isClosing ? 'chat-widget-exit' : 'chat-widget-enter'
      )}
      role="dialog"
      aria-modal="true"
      aria-label="AI Chat Assistant"
    >
      <ChatHeader
        connected={connected}
        onClose={onClose}
        onReset={onReset}
      />
      {error && (
        <div className="flex items-center justify-between gap-2 bg-chat-error/10 px-4 py-2 text-xs text-chat-error">
          <span>{error}</span>
          <button
            type="button"
            onClick={onClearError}
            className="shrink-0 underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}
      <MessageList
        messages={messages}
        loading={loading}
        typing={typing}
        hasMessages={hasMessages}
        onSuggestionClick={onSuggestionClick}
      />
      <MessageInput onSend={onSend} disabled={!connected} loading={loading} />
    </div>
  );
}

export default ChatWindow;
