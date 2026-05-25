import { MESSAGE_ROLE, MESSAGE_STATUS } from '@/constants';
import { formatTimestamp, cn } from '@/utils';

const STATUS_ICONS = {
  [MESSAGE_STATUS.SENDING]: '○',
  [MESSAGE_STATUS.SENT]: '✓',
  [MESSAGE_STATUS.DELIVERED]: '✓✓',
  [MESSAGE_STATUS.FAILED]: '!',
};

function MessageStatus({ status }) {
  if (!status || status === MESSAGE_STATUS.DELIVERED) return null;

  const isFailed = status === MESSAGE_STATUS.FAILED;

  return (
    <span
      className={cn(
        'ml-1 text-[10px]',
        isFailed ? 'text-chat-error' : 'text-chat-muted'
      )}
      title={status}
      aria-label={`Message status: ${status}`}
    >
      {STATUS_ICONS[status] || ''}
    </span>
  );
}

export function MessageBubble({ message }) {
  const isUser = message.role === MESSAGE_ROLE.USER;
  const timestamp = formatTimestamp(message.timestamp);

  return (
    <div
      className={cn(
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'flex max-w-[85%] flex-col gap-1 sm:max-w-[78%]',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-md transition-colors',
            isUser
              ? 'rounded-br-md bg-chat-user text-white'
              : 'rounded-bl-md bg-chat-bot text-chat-text border border-chat-border/50'
          )}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <div
          className={cn(
            'flex items-center gap-0.5 px-1 text-[10px] text-chat-muted',
            isUser && 'flex-row-reverse'
          )}
        >
          <time dateTime={message.timestamp}>{timestamp}</time>
          {isUser && <MessageStatus status={message.status} />}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
