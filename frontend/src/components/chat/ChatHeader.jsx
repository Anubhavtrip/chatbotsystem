import { CHAT_CONFIG } from '@/constants';
import { cn } from '@/utils';

export function ChatHeader({ connected, onClose, onReset }) {
  return (
    <header className="flex items-center justify-between border-b border-chat-border/60 bg-chat-surface px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-chat-primary/20 text-xl">
          {CHAT_CONFIG.BOT_AVATAR}
          <span
            className={cn(
              'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-chat-surface',
              connected ? 'bg-chat-success' : 'bg-chat-muted'
            )}
            title={connected ? 'Online' : 'Offline'}
            aria-label={connected ? 'Online' : 'Offline'}
          />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-chat-text">
            {CHAT_CONFIG.BOT_NAME}
          </h2>
          <p className="text-xs text-chat-muted">
            {connected ? 'Online · Typically replies instantly' : 'Connecting…'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg p-2 text-chat-muted transition-colors hover:bg-chat-surface-elevated hover:text-chat-text"
            aria-label="Clear conversation"
            title="Clear chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.97l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.182 0 1.5 1.5 0 0 0 1.357-1.433v-.224a51.194 51.194 0 0 0-6.214 0v.227a1.5 1.5 0 0 0 1.357 1.432Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-chat-muted transition-colors hover:bg-chat-surface-elevated hover:text-chat-text"
          aria-label="Close chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 0 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default ChatHeader;
