import * as React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Depth } from '~/features/OrderBook/types/OrderBookTypes';
import { Dimensions } from 'react-native';
import { colors } from '~/theme/colors';

export enum OrderType {
  ASK,
  BID,
}

type Props = {
  children: React.ReactNode[] | React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  depth?: Depth;
  orderType?: OrderType;
};

export const ORDER_BOOK_ROW_HEIGHT = 25;

const DEVICE_WIDTH = Dimensions.get('window').width;

export const OrderBookRow = ({
  children,
  containerStyle,
  depth,
  orderType,
}: Props) => (
  <View style={[styles.container, containerStyle]}>
    {!!depth && (
      <View
        style={[
          styles.depth,
          {
            backgroundColor:
              orderType === OrderType.ASK ? colors.red2 : colors.green2,
            width: DEVICE_WIDTH * depth,
          },
        ]}
      />
    )}
    {React.Children.map(children, child => (
      <Column style={React.Children.count(children) === 1 && styles.center}>
        {child}
      </Column>
    ))}
  </View>
);

type ColumnProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const Column = ({ children, style }: ColumnProps) => (
  <View style={[styles.column, style]}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ORDER_BOOK_ROW_HEIGHT,
    paddingHorizontal: 40,
  },
  column: {
    flex: 3,
    alignItems: 'flex-end',
  },
  center: {
    alignItems: 'center',
  },
  depth: { position: 'absolute', height: ORDER_BOOK_ROW_HEIGHT },
});
