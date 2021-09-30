export const formatValue = (price: string | number) =>
  (typeof price === 'string' ? parseFloat(price) : price).toLocaleString(
    'en-US',
    {
      minimumFractionDigits: 2,
    },
  );
