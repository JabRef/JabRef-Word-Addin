import { Stack, ActionButton } from '@fluentui/react';
import React, { ReactElement } from 'react';
import { Theme } from '../../../types';

import {
  light,
  dark,
  Signout,
  SyncBib,
  imageProps,
  footerStackStyle,
  contentWrapper,
  footerIconOnlyButton,
} from './Footer.style';

interface FooterProps {
  onSyncBibliography: () => void;
  onLogout: () => void;
  onThemeChange: () => void;
  theme: Theme;
}

function Footer({ onSyncBibliography, onLogout, onThemeChange, theme }: FooterProps): ReactElement {
  return (
    <Stack styles={footerStackStyle}>
      <Stack
        horizontal
        verticalAlign="center"
        styles={contentWrapper}
        horizontalAlign="space-between"
      >
        <img {...imageProps} alt="jabref logo" />
        <Stack horizontal>
          <ActionButton
            iconProps={theme === Theme.LIGHT ? light : dark}
            styles={footerIconOnlyButton}
            ariaLabel="Change theme"
            onClick={onThemeChange}
          />
          <ActionButton
            iconProps={SyncBib}
            styles={footerIconOnlyButton}
            ariaLabel="Add Bibliography"
            onClick={onSyncBibliography}
          />
          <ActionButton
            onClick={onLogout}
            iconProps={Signout}
            ariaLabel="Sign Out"
            styles={footerIconOnlyButton}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Footer;
