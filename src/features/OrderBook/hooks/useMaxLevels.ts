import { useCallback, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { ORDER_BOOK_ROW_HEIGHT } from '~/components/OrderBook/Row/OrderBookRow';
import { Levels } from '../types/OrderBookTypes';

type UseMaxLevelsReturnType = {
  getMaxLevelsOnLayout: (event: LayoutChangeEvent) => void;
  trimToMaxLevels: (levels: Levels) => Levels;
};

export const useMaxLevels = (): UseMaxLevelsReturnType => {
  const [maxLevels, setMaxLevels] = useState<number>(0);

  const getMaxLevelsOnLayout = useCallback(({ nativeEvent }) => {
    const headerRows = ORDER_BOOK_ROW_HEIGHT * 2;
    setMaxLevels(
      Math.floor(
        (nativeEvent.layout.height - headerRows) / ORDER_BOOK_ROW_HEIGHT,
      ) / 2,
    );
  }, []);

  const trimToMaxLevels = useCallback(
    (levels: Levels) => {
      return levels.slice(0, maxLevels);
    },
    [maxLevels],
  );

  return {
    getMaxLevelsOnLayout,
    trimToMaxLevels,
  };
};
