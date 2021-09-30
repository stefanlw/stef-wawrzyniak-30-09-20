import * as websocketUtils from '../websocketUtils';
import { WebSocket } from 'mock-socket';
import * as CONSTANTS from '../../constants';

window.WebSocket = WebSocket;
CONSTANTS.WEBSOCKET_ADDRESS = 'wss://host.com';

describe('websocketUtils', () => {
  describe('isConnectionOpen', () => {
    it('should return true for an open ready state', () => {
      expect(websocketUtils.isConnectionOpen({ readyState: 1 })).toEqual(true);
    });

    it('should return false for any other ready state', () => {
      expect(websocketUtils.isConnectionOpen({ readyState: 0 })).toEqual(false);
      expect(websocketUtils.isConnectionOpen({ readyState: 2 })).toEqual(false);
      expect(websocketUtils.isConnectionOpen({ readyState: 3 })).toEqual(false);
      expect(websocketUtils.isConnectionOpen({ readyState: 4 })).toEqual(false);
    });
  });

  describe('sendWSMessage', () => {
    it('should call send with the correct args on an open WS connection', () => {
      const ws = new WebSocket(CONSTANTS.WEBSOCKET_ADDRESS);
      ws.readyState = 1;
      ws.send = jest.fn();
      websocketUtils.sendWSMessage(ws, 'subscribe', ['PI_XBTUSD']);
      expect(ws.send).toHaveBeenCalledWith(
        '{"feed":"book_ui_1","event":"subscribe","product_ids":["PI_XBTUSD"]}',
      );
    });

    it('should throw an erorr when called with a closed WS connection', () => {
      const ws = new WebSocket(CONSTANTS.WEBSOCKET_ADDRESS);
      ws.readyState = 2;
      ws.send = jest.fn();
      expect(() =>
        websocketUtils.sendWSMessage(ws, 'subscribe', ['PI_XBTUSD']),
      ).toThrow('Attempted to send subscribe message on closed WS connection');
      expect(ws.send).toHaveBeenCalledTimes(0);
    });
  });
});
