import { Stack, ActionButton } from '@fluentui/react';
import React, { ReactElement } from 'react';

import {
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
}

function Footer({ onSyncBibliography, onLogout }: FooterProps): ReactElement {
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
