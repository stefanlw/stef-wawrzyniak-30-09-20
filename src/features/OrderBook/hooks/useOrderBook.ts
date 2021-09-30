import { useCallback, useEffect, useRef, useState } from 'react';
import { useOrderBookConnection } from './useOrderBookConnection';
import { buildOrderBook, mergeOrders } from '../utils/OrderBookUtils';
import { UPDATE_INTERVAL } from '../constants';
import {
  FeedDeltaMessage,
  FeedMessage,
  FeedSnapshot,
  Market,
  OrderBookState,
} from '../types/OrderBookTypes';

type UseOrderBookReturnType = {
  connect: () => void;
  disconnect: () => void;
  disconnected: boolean;
  toggleMarket: () => void;
  orderBook: OrderBookState;
  error: string;
};

export const DEFAULT_ORDER_BOOK_STATE = {
  asks: [],
  bids: [],
  spread: {
    value: '',
    percentage: '',
  },
};

export const useOrderBook = (): UseOrderBookReturnType => {
  const [market, setMarket] = useState<Market>('PI_XBTUSD');
  const [orderBook, setOrderBook] = useState<OrderBookState>(
    DEFAULT_ORDER_BOOK_STATE,
  );

  const bidsBuffer = useRef({});
  const asksBuffer = useRef({});
  const updateInterval = useRef<number>(0);

  useEffect(() => {
    updateInterval.current = setInterval(() => {
      updateOrderBook();
    }, UPDATE_INTERVAL);
    return () => {
      clearInterval(updateInterval.current);
    };
  }, []);

  const updateOrderBook = () => {
    const newOrderBook = buildOrderBook(asksBuffer.current, bidsBuffer.current);
    setOrderBook(newOrderBook);
  };

  const handleOrderBookUpdate = (
    data: FeedSnapshot | FeedDeltaMessage,
  ): void => {
    const { asks, bids } = data;
    bidsBuffer.current = mergeOrders(bids, bidsBuffer.current);
    asksBuffer.current = mergeOrders(asks, asksBuffer.current);

    if (isSnapshot(data)) {
      updateOrderBook();
    }
    // TODO: test performance on low end device
  };

  const resetOrderBookState = () => {
    bidsBuffer.current = {};
    asksBuffer.current = {};
    setOrderBook(DEFAULT_ORDER_BOOK_STATE);
  };

  const { connect, disconnect, disconnected, error } = useOrderBookConnection(
    market,
    handleOrderBookUpdate,
    resetOrderBookState,
  );

  useEffect(() => {
    if (error) {
      setOrderBook(DEFAULT_ORDER_BOOK_STATE);
    }
  }, [error]);

  const toggleMarket = useCallback(() => {
    if (market === 'PI_XBTUSD') {
      setMarket('PI_ETHUSD');
    } else if (market === 'PI_ETHUSD') {
      setMarket('PI_XBTUSD');
    } else {
      console.warn('Unhanled market state', market);
    }
  }, [market]);

  return {
    connect,
    disconnect,
    disconnected,
    toggleMarket,
    orderBook,
    error,
  };
};

const isSnapshot = (data: FeedMessage) => data.feed.includes('snapshot');
