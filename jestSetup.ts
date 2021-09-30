import * as ReactNative from 'react-native';

export const mockAppStateAddListener = jest.fn();

jest.doMock('react-native', () =>
  Object.setPrototypeOf(
    {
      AppState: {
        addEventListener: mockAppStateAddListener,
      },
    },
    ReactNative,
  ),
);
