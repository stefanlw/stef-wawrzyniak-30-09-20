import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { colors } from '~/theme/colors';
import { spacing } from '~/theme/spacing';

type Props = {
  children: React.ReactNode;
  onPress: () => void;
};

export const Button = ({ children, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[styles.container, { backgroundColor: colors.buttonPrimary }]}
      >
        <Text style={styles.text}>{children}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.large,
    paddingHorizontal: spacing.xlarge,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
