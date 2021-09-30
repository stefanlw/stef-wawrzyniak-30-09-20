import React from 'react';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import { Button } from '.';
import CenterView from '../../../storybook/stories/CenterView';

storiesOf('Button', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('standard', () => (
    <Button onPress={action('clicked-text')}>
      {text('Button text', 'Toggle Feed')}
    </Button>
  ));
