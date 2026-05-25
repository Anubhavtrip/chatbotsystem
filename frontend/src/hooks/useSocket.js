import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SOCKET_EVENTS } from '@/constants';
import {
  setConnected,
  setTyping,
  receiveSocketMessage,
  setError,
} from '@/features/chat/chatSlice';
import {
  connectSocket,
  disconnectSocket,
  subscribeSocketEvents,
} from '@/services/socket';

/**
 * Wire socket.io (or mock) events into Redux chat state.
 */
export function useSocket(enabled = true) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!enabled) return undefined;

    const socket = connectSocket();

    const unsubscribe = subscribeSocketEvents({
      [SOCKET_EVENTS.CONNECT]: () => {
        dispatch(setConnected(true));
        dispatch(setError(null));
      },
      [SOCKET_EVENTS.DISCONNECT]: () => {
        dispatch(setConnected(false));
      },
      [SOCKET_EVENTS.CONNECT_ERROR]: () => {
        dispatch(setConnected(false));
        dispatch(setError('Connection error. Retrying…'));
      },
      [SOCKET_EVENTS.RECONNECT]: () => {
        dispatch(setConnected(true));
        dispatch(setError(null));
      },
      [SOCKET_EVENTS.MESSAGE]: (payload) => {
        dispatch(
          receiveSocketMessage({
            id: payload.id,
            content: payload.content,
            timestamp: payload.timestamp,
            role: payload.role,
          })
        );
      },
      [SOCKET_EVENTS.TYPING_START]: () => {
        dispatch(setTyping(true));
      },
      [SOCKET_EVENTS.TYPING_STOP]: () => {
        dispatch(setTyping(false));
      },
    });

    return () => {
      unsubscribe();
      disconnectSocket();
    };
  }, [dispatch, enabled]);
}

export default useSocket;
