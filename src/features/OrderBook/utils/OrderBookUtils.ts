import { OrderType } from '~/components/OrderBook/Row/OrderBookRow';
import { DEFAULT_ORDER_BOOK_STATE } from '../hooks/useOrderBook';
import {
  Levels,
  Order,
  OrderBookState,
  Orders,
  PriceEntry,
  Spread,
} from '../types/OrderBookTypes';

export const buildOrderBook = (
  asksBuffer: PriceEntry,
  bidsBuffer: PriceEntry,
): OrderBookState => {
  const askEntries = getSortedBufferEntries(asksBuffer, OrderType.ASK);
  const bidEntries = getSortedBufferEntries(bidsBuffer, OrderType.BID);
  const asks = buildOrderBookLevels(askEntries);
  const bids = buildOrderBookLevels(bidEntries);
  return {
    asks,
    bids,
    spread: calculateSpread(asks, bids),
  };
};

export const getSortedBufferEntries = (buffer: PriceEntry, type: OrderType) => {
  return Object.entries(buffer).sort(([priceA], [priceB]) => {
    return type === OrderType.ASK
      ? priceA.localeCompare(priceB)
      : priceB.localeCompare(priceA);
  });
};

export const buildOrderBookLevels = (priceEntries: Orders): Levels => {
  return priceEntries.reduce((acc: Levels, [price, size]: Order, i) => {
    const total = (acc[i - 1]?.total ?? 0) + size;
    return [
      ...acc,
      {
        price,
        size,
        total,
      },
    ];
  }, []);
};

export const calculateSpread = (
  sortedAsks: Levels,
  sortedBids: Levels,
): Spread => {
  if (!sortedAsks.length || !sortedBids.length)
    return DEFAULT_ORDER_BOOK_STATE.spread;
  const askPrice = parseFloat(sortedAsks[0].price);
  const bidPrice = parseFloat(sortedBids[0].price);
  const spread = askPrice - bidPrice;
  return {
    value: spread.toFixed(1),
    percentage: (spread / askPrice).toFixed(2),
  };
};

export const mergeOrders = (
  deltas: [number, number][],
  buffer: PriceEntry,
): PriceEntry =>
  deltas.reduce((acc: PriceEntry, [price, size]: [number, number]) => {
    if (size === 0) {
      // TODO: this feels wrong, maybe filter on size 0 if you have time?...
      delete acc[price];
      return acc;
    } else {
      return {
        ...acc,
        [price]: size,
      };
    }
  }, buffer);

// TODO: alternative to delete?
// const mergeOrders = (deltas, buffer) =>
//   Object.keys(buffer).filter(filteForDeleteDeltas).reduce(append / omit keys)
