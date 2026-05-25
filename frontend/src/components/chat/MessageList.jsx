import { useAutoScroll } from '@/hooks';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { EmptyState } from './EmptyState';
import { Loader } from '@/components/common/Loader';

export function MessageList({
  messages,
  loading,
  typing,
  hasMessages,
  onSuggestionClick,
}) {
  const { containerRef, bottomRef } = useAutoScroll([
    messages.length,
    typing,
    loading,
  ]);

  if (!hasMessages && !loading && !typing) {
    return <EmptyState onSuggestionClick={onSuggestionClick} />;
  }

  return (
    <div
      ref={containerRef}
      className="scrollbar-thin flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {typing && <TypingIndicator />}
      {loading && !typing && (
        <div className="flex justify-start px-1 py-2">
          <div className="flex items-center gap-2 rounded-2xl bg-chat-bot px-4 py-3">
            <Loader size="sm" />
            <span className="text-xs text-chat-muted">Thinking…</span>
          </div>
        </div>
      )}
      <div ref={bottomRef} className="h-px shrink-0" aria-hidden="true" />
    </div>
  );
}

export default MessageList;
