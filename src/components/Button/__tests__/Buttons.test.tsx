import React from 'react';
import renderer from 'react-test-renderer';
import { Button } from '../';

describe('Button', () => {
  it('should match snapshot', () => {
    const component = renderer
      .create(<Button onPress={() => {}}>Some Text</Button>)
      .toJSON();
    expect(component).toMatchSnapshot();
  });
});
