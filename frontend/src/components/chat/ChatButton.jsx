import { cn } from '@/utils';

export function ChatButton({ isOpen, onClick, unreadCount = 0 }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center',
        'rounded-full bg-chat-primary text-white shadow-xl shadow-chat-primary/30',
        'transition-all duration-300 hover:scale-105 hover:bg-chat-primary-hover hover:shadow-2xl',
        'active:scale-95 sm:bottom-8 sm:right-6',
        !isOpen && 'chat-button-pulse'
      )}
      aria-label={isOpen ? 'Close chat' : 'Open chat assistant'}
      aria-expanded={isOpen}
    >
      {unreadCount > 0 && !isOpen && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-chat-error px-1 text-[10px] font-bold text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
      {isOpen ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 transition-transform duration-300"
        >
          <path
            fillRule="evenodd"
            d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 0 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path
            fillRule="evenodd"
            d="M4.848 2.771A49.456 49.456 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}

export default ChatButton;
