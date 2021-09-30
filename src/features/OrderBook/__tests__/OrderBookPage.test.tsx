import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { MOCK_ORDER_BOOK_STATE } from '../../../../__mocks__/OrderBook';
import { OrderBookPage } from '../OrderBookPage';
import { useOrderBookVisible } from '../hooks/useOrderBookVisible';
import { useOrderBook } from '../hooks/useOrderBook';
import { noop } from '~/common/noop';

jest.mock('@react-navigation/native');

const mockConnectFn = jest.fn();
const mockDisconnectFn = jest.fn();

// TODO: extract + make utils of the following
jest.mock('../hooks/useOrderBook', () => ({
  ...jest.requireActual('../hooks/useOrderBook'),
  useOrderBook: jest.fn(() => ({
    connect: mockConnectFn,
    disconnect: mockDisconnectFn,
    disconnected: true,
    toggleMarket: jest.fn(),
    orderBook: MOCK_ORDER_BOOK_STATE,
  })),
}));

jest.mock('../hooks/useOrderBookConnection', () => ({
  ...jest.requireActual('../hooks/useOrderBookConnection'),
  useOrderBookConnection: jest.fn(() => ({
    connect: mockConnectFn,
    disconnect: jest.fn(),
    disconnected: true,
    error: jest.fn(),
  })),
}));

jest.mock('../hooks/useOrderBookVisible', () => ({
  ...jest.requireActual('../hooks/useOrderBookVisible'),
  useOrderBookVisible: jest.fn(),
}));

jest.mock('../hooks/useMaxLevels', () => ({
  ...jest.requireActual('../hooks/useMaxLevels'),
  useMaxLevels: jest.fn(() => ({
    trimToMaxLevels: jest.fn(levels => levels.slice(0, 5)),
  })),
}));

describe('OrderBookPage', () => {
  it('should render correctly', () => {
    const component = render(<OrderBookPage />);
    expect(component).toMatchSnapshot();
  });

  it('should call the useOrderBook hook', () => {
    render(<OrderBookPage />);
    expect(useOrderBook).toHaveBeenCalled();
  });

  it('should call the useOrderBookVisible hook', () => {
    render(<OrderBookPage />);
    expect(useOrderBookVisible).toHaveBeenCalledWith(noop, mockDisconnectFn);
  });

  describe('disconnected toast', () => {
    it('should display disconnected toast', () => {
      const component = render(<OrderBookPage />);
      const toast = component.getByText(
        'Feed disconnected, please press reconnect when ready',
      );
      expect(toast).toBeTruthy();
    });

    it('should call connect on reconnect press', () => {
      const component = render(<OrderBookPage />);
      const reconnectBtn = component.getByText('Reconnect');
      fireEvent.press(reconnectBtn);
      expect(mockConnectFn).toHaveBeenCalledTimes(1);
    });
  });
});
