import Config from 'react-native-config';
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StorybookUI from './storybook/storybook';

import { OrderBookPage } from '~/features/OrderBook/OrderBookPage';

const Stack = createNativeStackNavigator();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      {/* TODO: theme support */}
      <StatusBar barStyle="light-content" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={OrderBookPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// TODO: add hidden storybook button for no production envs
// export default Config.ENABLE_STORYBOOK === 'true' ? StorybookUI : App;
export default App;
