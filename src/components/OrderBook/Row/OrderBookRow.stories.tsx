import React from 'react';
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import { OrderBookRow } from '.';
import { Text, View } from 'react-native';
import { spacing } from '~/theme/spacing';

storiesOf('Row', module)
  .add('single', () => (
    <View style={centre}>
      <OrderBookRow>
        <Text> {text('Column 1', 'Price')}</Text>
        <Text> {text('Column 2', 'Size')}</Text>
        <Text> {text('Column 3', 'Total')}</Text>
      </OrderBookRow>
    </View>
  ))
  .add('multiple', () => (
    <View style={centre}>
      <OrderBookRow>
        <Text> {text('Column 1', 'Price')}</Text>
        <Text> {text('Column 2', 'Size')}</Text>
        <Text> {text('Column 3', 'Total')}</Text>
      </OrderBookRow>
      <OrderBookRow>
        <Text> {text('Column 4', 'Column 4')}</Text>
        <Text> {text('Column 5', 'Column 5')}</Text>
        <Text> {text('Column 6', 'Column 6')}</Text>
      </OrderBookRow>
      <OrderBookRow>
        <Text> {text('Column 7', 'Column 7')}</Text>
        <Text> {text('Column 8', 'Column 8')}</Text>
        <Text> {text('Column 9', 'Column 9')}</Text>
      </OrderBookRow>
    </View>
  ));

const centre = {
  flex: 1,
  alignItems: 'center',
  marginHorizontal: spacing.xlarge,
};
