import { OrderType } from '~/components/OrderBook/Row/OrderBookRow';
import {
  ASKS_BUFFER_MOCK,
  BIDS_BUFFER_MOCK,
  MOCK_ORDER_BOOK_STATE,
  ASKS_BUFFER_ENTRIES_MOCK,
} from '../../../../../__mocks__/OrderBook';

import {
  buildOrderBook,
  buildOrderBookLevels,
  calculateSpread,
  mergeOrders,
  getSortedBufferEntries,
} from '../OrderBookUtils';

describe('getSortedBufferEntries', () => {
  it('should return asks in the correct order', () => {
    const result = getSortedBufferEntries(ASKS_BUFFER_MOCK, OrderType.ASK);
    expect(result).toMatchSnapshot();
  });

  it('should return bids in the correct order', () => {
    const result = getSortedBufferEntries(BIDS_BUFFER_MOCK, OrderType.BID);
    expect(result).toMatchSnapshot();
  });
});

describe('buildOrderBookLevels', () => {
  it('should return array of Levels type with totals calculated', () => {
    const result = buildOrderBookLevels(ASKS_BUFFER_ENTRIES_MOCK);
    // TODO: use mocks instead of snapshots
    expect(result).toMatchSnapshot();
  });
});

describe('mergeOrders', () => {
  describe('given delete deltas', () => {
    it('should return the buffer without those prices', () => {
      const deleteDeltas: [number, number][] = [
        [10, 0],
        [15, 0],
      ];
      const buffer = {
        10: 20,
        15: 25,
        20: 30,
      };
      const result = mergeOrders(deleteDeltas, buffer);
      expect(result).toEqual({
        20: 30,
      });
    });
  });

  describe('given new level deltas', () => {
    it('should return the buffer with the new prices', () => {
      const newLevelDeltas: [number, number][] = [
        [35, 100],
        [45, 50],
      ];
      const buffer = { 25: 10, 50: 5 };
      const result = mergeOrders(newLevelDeltas, buffer);
      expect(result).toEqual({ 25: 10, 35: 100, 45: 50, 50: 5 });
    });
  });
});

describe('calculateSpread', () => {
  it('should return correct Spread object', () => {
    expect(
      calculateSpread(MOCK_ORDER_BOOK_STATE.asks, MOCK_ORDER_BOOK_STATE.bids),
    ).toEqual({ percentage: '0.00', value: '6.0' });
  });
});

// TODO: fix
// const mockGetSortedBufferEntries = jest.fn()
// const mockBuildOrderBookLevels = jest.fn()
// jest.mock('../OrderBookUtils', () => ({
//   ...jest.requireActual('../OrderBookUtils'),
//   getSortedBufferEntries: mockGetSortedBufferEntries,
//   buildOrderBookLevels: mockBuildOrderBookLevels
// }))

// describe('buildOrderBook', () => {
//     it ('should call getSortedBufferEntries', () => {
//     buildOrderBook(MERGE_ORDERS_ASKS_RESULT_MOCK, MERGE_ORDERS_BIDS_RESULT_MOCK)
//     expect(mockGetSortedBufferEntries).toHaveBeenCalled()
//   })
// });
