import React from 'react';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import { Toast } from '.';
import CenterView from '../../../storybook/stories/CenterView';

storiesOf('Toast', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('standard', () => (
    <Toast
      message={text('message', 'A toast message')}
      ctaText={text('ctaText', 'CTA')}
      callback={action('CTA pressed')}
    />
  ));
