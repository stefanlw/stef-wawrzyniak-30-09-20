import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Toast } from '../';

describe('Toast', () => {
  const mockCallback = jest.fn();
  const setup = () =>
    render(
      <Toast
        message="A toast message"
        ctaText="CTA test"
        callback={mockCallback}
      />,
    );

  it('should match snapshot', () => {
    const { toJSON } = setup();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should invoke callback on ctaText press', () => {
    const { getByText } = setup();
    fireEvent.press(getByText('CTA test'));
    expect(mockCallback).toBeCalledTimes(1);
  });
});
