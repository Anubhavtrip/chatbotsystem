import { useState, useRef, useCallback } from 'react';
import { CHAT_CONFIG } from '@/constants';
import { cn } from '@/utils';

export function MessageInput({ onSend, disabled, loading }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const canSend =
    value.trim().length > 0 &&
    !disabled &&
    !loading &&
    value.length <= CHAT_CONFIG.MAX_MESSAGE_LENGTH;

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled || loading) return;
    onSend(trimmed);
    setValue('');
    textareaRef.current?.focus();
  }, [value, disabled, loading, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-chat-border/60 bg-chat-surface p-3">
      {value.length > CHAT_CONFIG.MAX_MESSAGE_LENGTH * 0.9 && (
        <p className="mb-1 text-right text-[10px] text-chat-muted">
          {value.length}/{CHAT_CONFIG.MAX_MESSAGE_LENGTH}
        </p>
      )}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          rows={1}
          disabled={disabled || loading}
          maxLength={CHAT_CONFIG.MAX_MESSAGE_LENGTH}
          className={cn(
            'scrollbar-thin max-h-28 min-h-[44px] flex-1 resize-none rounded-xl',
            'border border-chat-border/60 bg-chat-surface-elevated px-4 py-2.5',
            'text-sm text-chat-text placeholder:text-chat-muted',
            'transition-colors focus:border-chat-primary focus:outline-none focus:ring-1 focus:ring-chat-primary/40',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          aria-label="Message input"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
            'bg-chat-primary text-white shadow-lg transition-all',
            'hover:bg-chat-primary-hover hover:shadow-xl active:scale-95',
            'disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none'
          )}
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </div>
      <p className="mt-1.5 text-center text-[10px] text-chat-muted">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}

export default MessageInput;
