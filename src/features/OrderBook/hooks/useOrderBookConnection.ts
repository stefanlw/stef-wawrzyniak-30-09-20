import { useCallback, useEffect, useRef, useState } from 'react';
import { WEBSOCKET_ADDRESS } from '../constants';
import {
  FeedDeltaMessage,
  FeedEvent,
  FeedSnapshot,
  Market,
} from '../types/OrderBookTypes';
import {
  createWebSocketConnection,
  isConnectionOpen,
  sendWSMessage,
} from './websocketUtils';

type UseOrderBookConnectionReturnType = {
  connect: () => void;
  disconnect: () => void;
  disconnected: boolean;
  error: string;
};

export const useOrderBookConnection = (
  market: Market,
  handleOrderBookUpdate: (data: FeedSnapshot | FeedDeltaMessage) => void,
  onNewSubscription: () => void,
): UseOrderBookConnectionReturnType => {
  const [disconnected, setDisconnected] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (ws.current && isConnectionOpen(ws.current)) {
      handleContractChange();
    }
  }, [market]);

  useEffect(() => {
    connect();
    return disconnect;
  }, []);

  const connect = () => {
    if (ws.current && isConnectionOpen(ws.current)) return;
    setError('');
    setDisconnected(false);

    if (!WEBSOCKET_ADDRESS) {
      throw new Error('WEBSOCKET_ADDRESS environment variable is missing');
    }

    ws.current = createWebSocketConnection(WEBSOCKET_ADDRESS);

    ws.current.onopen = () => {
      sendWSMessage(ws.current, 'subscribe', [market]);
    };

    ws.current.onmessage = e => {
      try {
        const data = JSON.parse(e.data);
        if (data.event) {
          handleSubcriptionEvent(data);
        } else {
          handleOrderBookUpdate(data);
        }
      } catch (e) {
        setError(`Caught onMessage handler error: ${e.message}`);
      }
    };

    const handleSubcriptionEvent = (data: FeedEvent) => {
      if (data.event === 'subscribed') {
        onNewSubscription();
      } else if (data.event === 'unsubscribed') {
        onNewSubscription();
      }
    };

    ws.current.onerror = e => {
      console.log(`WebSocket error: ${e.message}`);
      setError(e.message);
      ws.current = null;
    };

    ws.current.onclose = e => {
      console.log(`WebSocket connection closed ${e.code}: ${e.reason}`);
      setDisconnected(true);
      ws.current = null;
    };
  };

  const disconnect = useCallback(() => {
    if (ws.current && isConnectionOpen(ws.current)) {
      ws.current.close();
    }
  }, [ws.current]);

  const handleContractChange = () => {
    sendWSMessage(ws.current, 'unsubscribe', [
      market === 'PI_XBTUSD' ? 'PI_ETHUSD' : 'PI_XBTUSD',
    ]);

    sendWSMessage(ws.current, 'subscribe', [market]);
  };

  return {
    connect,
    disconnect,
    disconnected,
    error,
  };
};
