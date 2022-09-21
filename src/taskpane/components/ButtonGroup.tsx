/* eslint-disable react/require-default-props */
import { Stack, PrimaryButton, DefaultButton, IStackStyles } from '@fluentui/react';
import React from 'react';
import buttonContainerStack, { buttonItemStyle } from './ButtonGroup.style';

interface ButtonGroupProps {
  label1: string;
  label2: string;
  onClick1: () => void;
  onClick2: () => void;
  disabled1: boolean;
  disabled2: boolean;
  styles?: IStackStyles;
}

function ButtonGroup({
  label1,
  onClick1,
  disabled1 = false,
  label2,
  onClick2,
  disabled2 = false,
  styles = buttonContainerStack,
}: ButtonGroupProps): JSX.Element {
  return (
    <Stack horizontal verticalAlign="center" styles={styles}>
      <Stack.Item>
        <PrimaryButton onClick={onClick1} text={label1} disabled={disabled1} />
      </Stack.Item>
      <Stack.Item styles={buttonItemStyle}>
        <DefaultButton onClick={onClick2} text={label2} disabled={disabled2} />
      </Stack.Item>
    </Stack>
  );
}

export default ButtonGroup;
