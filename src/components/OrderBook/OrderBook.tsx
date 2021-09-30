import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useMaxLevels } from '~/features/OrderBook/hooks/useMaxLevels';
import { OrderBookState } from '~/features/OrderBook/types/OrderBookTypes';
import { colors } from '~/theme/colors';
import {
  ColumnHeading,
  PositiveText,
  ValueText,
  WarningText,
} from '../Text/Text';
import { OrderBookRow } from './Row';
import { OrderType } from './Row/OrderBookRow';
import { formatValue } from './utils';

type Props = {
  orderBook: OrderBookState;
};

export const OrderBook = ({ orderBook }: Props) => {
  const { asks, bids, spread } = orderBook;
  const { getMaxLevelsOnLayout, trimToMaxLevels } = useMaxLevels();

  const asksToDisplay = trimToMaxLevels(asks).reverse();
  const bidsToDisplay = trimToMaxLevels(bids);
  const highestTotal = useMemo(
    () =>
      Math.max(
        ...asksToDisplay.map(({ total }) => total),
        ...bidsToDisplay.map(({ total }) => total),
      ),
    [asksToDisplay, bidsToDisplay],
  );

  return (
    <View onLayout={getMaxLevelsOnLayout} style={[styles.container]}>
      <OrderBookRow containerStyle={styles.headerRow}>
        <ColumnHeading>PRICE</ColumnHeading>
        <ColumnHeading>SIZE</ColumnHeading>
        <ColumnHeading>TOTAL</ColumnHeading>
      </OrderBookRow>

      {asksToDisplay.map(({ price, total, size }) => {
        return (
          <OrderBookRow
            key={price}
            orderType={OrderType.ASK}
            depth={total / highestTotal}
          >
            <WarningText>{formatValue(price)}</WarningText>
            <ValueText>{formatValue(size)}</ValueText>
            <ValueText>{formatValue(total)}</ValueText>
          </OrderBookRow>
        );
      })}

      <OrderBookRow>
        <ColumnHeading>
          Spread: {spread.value} ({spread.percentage}%)
        </ColumnHeading>
      </OrderBookRow>

      {bidsToDisplay.map(({ price, total, size }) => {
        return (
          <OrderBookRow
            key={price}
            depth={total / highestTotal}
            orderType={OrderType.BID}
          >
            <PositiveText>{formatValue(price)}</PositiveText>
            <ValueText>{formatValue(size)}</ValueText>
            <ValueText>{formatValue(total)}</ValueText>
          </OrderBookRow>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    borderTopColor: colors.gray,
    borderTopWidth: 0.5,
    borderBottomColor: colors.gray,
    borderBottomWidth: 0.5,
  },
});
