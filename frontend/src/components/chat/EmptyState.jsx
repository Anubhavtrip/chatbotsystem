import { CHAT_CONFIG } from '@/constants';

const SUGGESTIONS = [
  'How can you help me?',
  'Tell me about your features',
  'Explain Kafka integration',
];

export function EmptyState({ onSuggestionClick }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-8 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-chat-primary/20 text-3xl shadow-lg">
        {CHAT_CONFIG.BOT_AVATAR}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-chat-text">
        {CHAT_CONFIG.BOT_NAME}
      </h3>
      <p className="mb-6 max-w-xs text-sm text-chat-muted leading-relaxed">
        {CHAT_CONFIG.WELCOME_MESSAGE}
      </p>
      <div className="flex w-full max-w-sm flex-col gap-2">
        {SUGGESTIONS.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => onSuggestionClick?.(text)}
            className="rounded-xl border border-chat-border/60 bg-chat-surface-elevated/50 px-4 py-2.5 text-left text-sm text-chat-text transition-all hover:border-chat-primary/50 hover:bg-chat-primary/10 hover:shadow-md"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default EmptyState;
