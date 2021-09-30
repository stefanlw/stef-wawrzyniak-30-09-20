import React from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import { spacing } from '~/theme/spacing';

type Props = {
  message: string;
  ctaText: string;
  callback: () => void;
};

// TODO: animate
export const Toast = ({ message, ctaText, callback }: Props) => {
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.container]}>
      <View style={[styles.toast, { width: width - spacing.xlarge * 2 }]}>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
        <TouchableOpacity style={styles.ctaContainer} onPress={callback}>
          <Text style={styles.ctaText}>{ctaText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    bottom: 50,
    height: 50,
    paddingHorizontal: spacing.xlarge,
    position: 'absolute',
    alignItems: 'center',
  },
  toast: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.medium,
    justifyContent: 'space-between',
  },
  messageContainer: { flex: 3 },
  messageText: {},
  ctaContainer: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  ctaText: {},
});
