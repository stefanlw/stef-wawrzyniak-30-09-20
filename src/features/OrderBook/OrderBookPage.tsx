import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '~/theme/colors';
import { spacing } from '~/theme/spacing';
import { useOrderBookVisible } from './hooks/useOrderBookVisible';
import { useOrderBook } from './hooks/useOrderBook';
import { Toast } from '~/components/Toast/Toast';
import { OrderBook } from '~/components/OrderBook/OrderBook';
import { PageHeader } from '~/components/Text/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/Button';
import { noop } from '~/common/noop';

export const OrderBookPage = () => {
  const { connect, disconnect, disconnected, orderBook, toggleMarket, error } =
    useOrderBook();

  useOrderBookVisible(noop, disconnect);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <PageHeader>Order Book</PageHeader>
        </View>
        <OrderBook orderBook={orderBook} />
      </View>
      <View style={styles.center}>
        <Button onPress={toggleMarket}>Toggle Feed</Button>
      </View>

      {/* TODO: improve error handling */}
      {(disconnected || !!error) && (
        <Toast
          message={`${
            disconnected ? 'Feed disconnected' : 'An error occurred'
          }, please press reconnect when ready`}
          ctaText="Reconnect"
          callback={connect}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.darkBlue,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    marginHorizontal: spacing.xlarge,
    marginBottom: spacing.medium,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
