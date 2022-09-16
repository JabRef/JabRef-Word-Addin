import {
  Stack,
  Spinner,
  SpinnerSize,
  IStackTokens,
  IStackStyles,
  DefaultPalette,
  ISpinnerStyles,
} from '@fluentui/react';
import React from 'react';
import Wrapper from './Wrapper';

export interface ProgressProps {
  title: string;
  message: string;
}
const stackStyles: IStackStyles = {
  root: {
    background: DefaultPalette.white,
  },
};

const stackToken: IStackTokens = {
  childrenGap: 45,
};

const spinnerStyle: ISpinnerStyles = {
  root: {
    color: DefaultPalette.blueMid,
  },
  label: {
    fontSize: '1em',
    color: DefaultPalette.blueMid,
  },
};

function Progress({ message, title }: ProgressProps): React.ReactElement {
  return (
    <Wrapper>
      <Stack verticalFill verticalAlign="center" styles={stackStyles} tokens={stackToken}>
        <Stack.Item align="center">
          <img
            width="80"
            height="80"
            src="../../../assets/svgs/jabref.svg"
            alt={title}
            title={title}
          />
        </Stack.Item>
        <Stack.Item align="center">
          <Spinner size={SpinnerSize.large} label={message} styles={spinnerStyle} />
        </Stack.Item>
      </Stack>
    </Wrapper>
  );
}

export default Progress;
