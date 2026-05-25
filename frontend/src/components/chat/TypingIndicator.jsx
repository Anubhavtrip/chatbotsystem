import { CHAT_CONFIG } from '@/constants';

export function TypingIndicator() {
  return (
    <div
      className="flex items-center gap-2 px-1 py-2"
      role="status"
      aria-live="polite"
      aria-label={`${CHAT_CONFIG.BOT_NAME} is typing`}
    >
      <div className="flex items-center gap-1 rounded-2xl bg-chat-bot px-4 py-3 shadow-sm">
        <span className="typing-dot h-2 w-2 rounded-full bg-chat-muted" />
        <span className="typing-dot h-2 w-2 rounded-full bg-chat-muted" />
        <span className="typing-dot h-2 w-2 rounded-full bg-chat-muted" />
      </div>
      <span className="text-xs text-chat-muted">typing…</span>
    </div>
  );
}

export default TypingIndicator;
