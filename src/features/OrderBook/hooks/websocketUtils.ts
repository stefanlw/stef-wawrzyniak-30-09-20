import { Market } from '../types/OrderBookTypes';

export const createWebSocketConnection = (address: string): WebSocket =>
  new WebSocket(address);

export const isConnectionOpen = (ws: Pick<WebSocket, 'readyState'>) =>
  [1].includes(ws?.readyState);

export const sendWSMessage = (
  ws: WebSocket,
  event: string,
  product_ids: Market[],
) => {
  if (isConnectionOpen(ws)) {
    ws.send(
      JSON.stringify({
        feed: 'book_ui_1',
        event,
        product_ids,
      }),
    );
  } else {
    throw new Error(
      `Attempted to send ${event} message on closed WS connection`,
    );
  }
};
