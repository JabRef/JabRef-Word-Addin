import { DefaultButton, Icon, Stack } from '@fluentui/react';
import React from 'react';
import { container, heading, iconStyle, logo, logoStyle, textOnlyButton } from '../styles/auth';

function Auth(): JSX.Element {
  return (
    <Stack verticalFill horizontalAlign="center" styles={container}>
      <Stack.Item styles={logoStyle} align="start">
        <img style={logo} src="../../../assets/svgs/authlogo.svg" alt="JabRef" />
      </Stack.Item>
      <Stack.Item align="start" styles={heading}>
        Stay on top of your Literature
      </Stack.Item>
      <Stack.Item grow>
        <Stack verticalFill verticalAlign="center" horizontalAlign="center">
          <DefaultButton styles={textOnlyButton} text="Get Started">
            <Icon styles={iconStyle} iconName="Forward" />
          </DefaultButton>
        </Stack>
      </Stack.Item>
    </Stack>
  );
}

export default Auth;
