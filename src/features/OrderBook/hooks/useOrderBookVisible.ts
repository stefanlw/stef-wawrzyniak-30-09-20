import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useOrderBookVisible = (
  onFocus: () => void,
  onBlur: () => void,
) => {
  const navigation = useNavigation();
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        onFocus();
      } else {
        onBlur();
      }
    });

    return subscription.remove;
  }, [onFocus, onBlur]);

  useEffect(() => {
    // handle change between screens
    const unsubscribeFocus = navigation.addListener('focus', () => {
      onFocus();
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      onBlur();
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation, onFocus, onBlur]);
};
