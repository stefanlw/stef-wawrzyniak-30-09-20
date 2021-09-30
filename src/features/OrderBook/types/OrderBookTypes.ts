export type FeedMessage = FeedEvent | FeedSnapshot | FeedDeltaMessage;

export type FeedEvent = {
  feed: string;
  event: string;
  product_ids: Market[];
};

export type FeedSnapshot = FeedDeltaMessage & { numLevels: number };

export type FeedDeltaMessage = {
  feed: string;
  product_id: Market;
  bids: [number, number][];
  asks: [number, number][];
};

export type Price = string;
export type Size = number;
export type Total = number;
export type Depth = number;
export type Order = [string, number];
export type Orders = Order[];

export type Market = 'PI_XBTUSD' | 'PI_ETHUSD';

export type Level = { price: Price; size: Size; total: Total };
export type Levels = Level[];

export type PriceEntry = {
  [price: string]: Size;
};

export type Spread = {
  value: string;
  percentage: string;
};

export type OrderBookState = {
  asks: Levels;
  bids: Levels;
  spread: Spread;
};
