import { ActionButton, Image, Stack } from '@fluentui/react';
import React, { ReactElement } from 'react';

import {
  contentWrapper,
  footerIconOnlyButton,
  footerStackStyle,
  imageProps,
  light,
  SyncBib,
} from './Footer.style';

interface FooterProps {
  onSyncBibliography: () => void;
  onFetchJabRefData: () => void;
}

function Footer({ onSyncBibliography, onFetchJabRefData }: FooterProps): ReactElement {
  return (
    <Stack
      horizontal
      horizontalAlign="space-between"
      verticalAlign="center"
      styles={{ ...contentWrapper, ...footerStackStyle }}
    >
      <Image {...imageProps} />
      <Stack.Item>
        <ActionButton
          iconProps={light}
          styles={footerIconOnlyButton}
          ariaLabel="Fetch JabRef Data"
          onClick={onFetchJabRefData}
        />
        <ActionButton
          iconProps={SyncBib}
          styles={footerIconOnlyButton}
          ariaLabel="Add Reference List"
          onClick={onSyncBibliography}
        />
      </Stack.Item>
    </Stack>
  );
}

export default Footer;
