import { renderHook, act } from '@testing-library/react-hooks';
import { useOrderBookConnection } from '../useOrderBookConnection';
import * as websocketUtils from '../websocketUtils';
import * as CONSTANTS from '../../constants';
import { WebSocket, Server } from 'mock-socket';
import { Market } from '../../types/OrderBookTypes';

CONSTANTS.WEBSOCKET_ADDRESS = 'ws://localhost:8080';
window.WebSocket = WebSocket;

const createMockUseOrderBookConnection = () => {
  const handleOrderBookUpdate = jest.fn();
  const onNewSubscription = jest.fn();
  const hook = renderHook(
    ({ market }: { market: Market }) =>
      useOrderBookConnection(market, handleOrderBookUpdate, onNewSubscription),
    { initialProps: { market: 'PI_ETHUSD' } },
  );
  return {
    handleOrderBookUpdate,
    onNewSubscription,
    ...hook,
  };
};

describe('useOrderBookConnection', () => {
  const mockWebSocket = {
    send: jest.fn(),
  };
  beforeEach(() => {
    websocketUtils.createWebSocketConnection = jest.fn(() => mockWebSocket);
    websocketUtils.sendWSMessage = jest.fn();
  });

  afterEach(() => {
    websocketUtils.sendWSMessage.mockClear();
  });

  it('should return object of UseOrderBookConnectionReturnType', () => {
    const { result } = createMockUseOrderBookConnection();
    expect(result.current).toHaveProperty('connect');
    expect(result.current).toHaveProperty('disconnect');
    expect(result.current).toHaveProperty('disconnected');
    expect(result.current).toHaveProperty('error');
  });

  it('should connect to the websocket on initial invocation', () => {
    createMockUseOrderBookConnection();
    expect(websocketUtils.createWebSocketConnection).toHaveBeenCalledWith(
      CONSTANTS.WEBSOCKET_ADDRESS,
    );
  });

  it('should subscribe to a market on connection open', () => {
    createMockUseOrderBookConnection();
    mockWebSocket.onopen();
    expect(websocketUtils.sendWSMessage).toHaveBeenCalledWith(
      mockWebSocket,
      'subscribe',
      ['PI_ETHUSD'],
    );
  });

  it('should handle receiving subscribed events', () => {
    const { result, onNewSubscription } = createMockUseOrderBookConnection();
    const payload = {
      feed: 'book_ui_1',
      event: 'subscribed',
      product_id: 'PI_ETHUSD',
    };
    act(() => mockWebSocket.onmessage({ data: JSON.stringify(payload) }));
    expect(onNewSubscription).toHaveBeenCalled();
    expect(result.current.error).toBeFalsy();
  });

  it('should handle receiving subscribed events', () => {
    const { result, onNewSubscription } = createMockUseOrderBookConnection();
    const payload = {
      feed: 'book_ui_1',
      event: 'unsubscribed',
      product_id: 'PI_ETHUSD',
    };
    act(() => mockWebSocket.onmessage({ data: JSON.stringify(payload) }));
    expect(onNewSubscription).toHaveBeenCalled();
    expect(result.current.error).toBeFalsy();
  });

  it('should call handleOrderBookUpdate on feed update messages', () => {
    const { result, handleOrderBookUpdate } =
      createMockUseOrderBookConnection();
    const payload = {
      feed: 'book_ui_1',
      product_id: 'PI_ETHUSD',
      bids: [[123, 456]],
      asks: [[789, 1011]],
    };
    act(() => mockWebSocket.onmessage({ data: JSON.stringify(payload) }));
    expect(handleOrderBookUpdate).toHaveBeenCalledWith(payload);
    expect(result.current.error).toBeFalsy();
  });

  it('should handle closed connections', () => {
    const { result } = createMockUseOrderBookConnection();
    act(() => mockWebSocket.onclose({ code: 0, reason: 'Test' }));
    expect(result.current.disconnected).toEqual(true);
  });

  it('should handle contract changes', () => {
    const mockOpenWebSocket = {
      send: jest.fn(),
      close: jest.fn(),
      readyState: 1,
    };
    websocketUtils.createWebSocketConnection = jest.fn(() => mockOpenWebSocket);
    const { rerender, handleOrderBookUpdate, onNewSubscription } =
      createMockUseOrderBookConnection();
    act(() => rerender({ market: 'PI_XBTUSD' }));
    expect(websocketUtils.sendWSMessage.mock.calls[0]).toEqual([
      mockOpenWebSocket,
      'unsubscribe',
      ['PI_ETHUSD'],
    ]);
    expect(websocketUtils.sendWSMessage.mock.calls[1]).toEqual([
      mockOpenWebSocket,
      'subscribe',
      ['PI_XBTUSD'],
    ]);
  });

  it('calling disconnect should close the websocket', () => {
    const mockOpenWebSocket = {
      send: jest.fn(),
      close: jest.fn(),
      readyState: 1,
    };
    websocketUtils.createWebSocketConnection = jest.fn(() => mockOpenWebSocket);
    const { result } = createMockUseOrderBookConnection();
    act(() => result.current.disconnect());
    expect(mockOpenWebSocket.close).toHaveBeenCalled();
    expect(result.current.error).toBeFalsy();
  });
});
