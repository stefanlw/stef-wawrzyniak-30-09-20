import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { OrderBook } from '.';
import { MOCK_ORDER_BOOK_STATE } from '../../../__mocks__/OrderBook';
import { colors } from '~/theme/colors';

storiesOf('OrderBook', module)
  .addDecorator(getStory => <Background>{getStory()}</Background>)
  .add('default', () => <OrderBook orderBook={MOCK_ORDER_BOOK_STATE} />);

const Background = ({ children }) => (
  <View style={{ backgroundColor: colors.darkBlue, flex: 1 }}>{children}</View>
);
