import * as React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { colors } from '~/theme/colors';

enum ValueTextType {
  RED = 'red',
  GREEN = 'green',
}

interface BaseText {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

interface PageHeaderTextProps extends BaseText {}

export const PageHeader = ({ children }: PageHeaderTextProps) => (
  <Text style={[styles.header]}>{children}</Text>
);

export const ColumnHeading = ({ children }: BaseText) => (
  <Text style={[styles.columnHeading]}>{children}</Text>
);

interface ValueTextProps extends BaseText {
  type?: ValueTextType;
}

export const ValueText = ({ children, style, type }: ValueTextProps) => {
  return (
    <Text
      style={[
        styles.valueText,
        { color: type ? textColor[type] : colors.white },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const PositiveText = ({ children, ...props }: ValueTextProps) => (
  <ValueText {...props} type={ValueTextType.GREEN}>
    {children}
  </ValueText>
);

export const WarningText = ({ children, ...props }: ValueTextProps) => (
  <ValueText {...props} type={ValueTextType.RED}>
    {children}
  </ValueText>
);

const textColor = {
  [ValueTextType.GREEN]: colors.green1,
  [ValueTextType.RED]: colors.red1,
};

const styles = StyleSheet.create({
  valueText: {
    fontVariant: ['tabular-nums'],
  },
  header: {
    color: colors.white,
    fontSize: 26,
  },
  columnHeading: {
    color: colors.gray,
  },
});
