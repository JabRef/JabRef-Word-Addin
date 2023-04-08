import { Spinner, SpinnerSize, Stack } from '@fluentui/react';
import React from 'react';
import { spinnerStyle, stackToken } from './Progress.style';

export interface ProgressProps {
  logo: string;
  message: string;
  title: string;
}

function Progress({ message, title, logo }: ProgressProps): React.ReactElement {
  return (
    <Stack verticalFill verticalAlign="center" tokens={stackToken}>
      <Stack.Item align="center">
        <img width="80" height="80" src={logo} alt={title} title={title} />
      </Stack.Item>
      <Stack.Item align="center">
        <Spinner size={SpinnerSize.large} label={message} styles={spinnerStyle} />
      </Stack.Item>
    </Stack>
  );
}
export default Progress;
