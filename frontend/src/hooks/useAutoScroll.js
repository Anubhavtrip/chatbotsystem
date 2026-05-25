import { useEffect, useRef, useCallback } from 'react';

/**
 * Keeps a scroll container pinned to the bottom when new messages arrive.
 */
export function useAutoScroll(deps = []) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior, block: 'end' });
  }, []);

  useEffect(() => {
    scrollToBottom('smooth');
  }, deps);

  return { containerRef, bottomRef, scrollToBottom };
}

export default useAutoScroll;
