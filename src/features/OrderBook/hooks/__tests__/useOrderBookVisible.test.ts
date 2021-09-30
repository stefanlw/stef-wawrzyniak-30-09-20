import { renderHook } from '@testing-library/react-hooks';
// TODO add alias
import { mockAppStateAddListener } from '../../../../../jestSetup';
import { useOrderBookVisible } from '../useOrderBookVisible';

let reactNavigationListeners = {};

const mockNavigationAddListener = jest.fn((event, cb) => {
  reactNavigationListeners[event] = cb;
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    addListener: mockNavigationAddListener,
  }),
}));

describe('useOrderBookVisible', () => {
  const mockOnFocus = jest.fn();
  const mockOnBlur = jest.fn();

  describe('React Navigation', () => {
    beforeEach(() => {
      mockNavigationAddListener.mockClear();
      mockOnFocus.mockClear();
      mockOnBlur.mockClear();
    });

    it('should add listeners', () => {
      renderHook(() => useOrderBookVisible(mockOnFocus, mockOnBlur));
      expect(mockNavigationAddListener).toHaveBeenCalledTimes(2);
      expect(mockNavigationAddListener.mock.calls[0].length).toEqual(2);
      expect(mockNavigationAddListener.mock.calls[0][0]).toEqual('focus');
      expect(mockNavigationAddListener.mock.calls[1].length).toEqual(2);
      expect(mockNavigationAddListener.mock.calls[1][0]).toEqual('blur');
    });

    it('should call onFocus handler on focus', () => {
      renderHook(() => useOrderBookVisible(mockOnFocus, mockOnBlur));
      reactNavigationListeners.focus();
      expect(mockOnFocus).toHaveBeenCalled();
      expect(mockOnBlur).toHaveBeenCalledTimes(0);
    });

    it('should call onBlur handler on blur', () => {
      renderHook(() => useOrderBookVisible(mockOnFocus, mockOnBlur));
      reactNavigationListeners.blur();
      expect(mockOnBlur).toHaveBeenCalled();
      expect(mockOnFocus).toHaveBeenCalledTimes(0);
    });
  });

  describe('AppState', () => {
    it('should add listener', () => {
      renderHook(() => useOrderBookVisible(mockOnFocus, mockOnBlur));
      expect(mockAppStateAddListener).toHaveBeenCalledTimes(1);
      expect(mockAppStateAddListener.mock.calls[0][0]).toEqual('change');
      expect(mockAppStateAddListener.mock.calls[0].length).toEqual(2);
    });

    // TODO: add more tests
  });
});
