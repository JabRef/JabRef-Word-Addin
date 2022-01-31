import { PrimaryButton, Stack } from '@fluentui/react';
import React from 'react';
import { heading, logo, logoStyle, svg } from '../styles/auth';

function Auth(): JSX.Element {
  return (
    <Stack verticalFill horizontalAlign="center">
      <Stack.Item styles={logoStyle} align="center">
        <img style={logo} src="../../../assets/svgs/authlogo.svg" alt="JabRef" />
      </Stack.Item>
      <Stack.Item align="center" styles={heading}>
        Stay on top of your Literature
      </Stack.Item>
      <Stack.Item>
        <img style={svg} src="../../../assets/svgs/auth.svg" alt="JabRef" />
      </Stack.Item>
      <Stack.Item grow>
        <Stack verticalFill verticalAlign="center" horizontalAlign="center">
          <PrimaryButton text="Sign In" />
        </Stack>
      </Stack.Item>
    </Stack>
  );
}

export default Auth;
