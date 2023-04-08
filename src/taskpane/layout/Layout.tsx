import { Pivot, PivotItem, Stack } from '@fluentui/react';
import React, { useState } from 'react';
import { MetaData } from 'citeproc';
import CitationStyle from '../pages/CitationStyle';
import Dashboard from '../pages/Dashboard';
import Footer from '../components/Footer';
import { pivotStyle, scrollableStack } from './Layout.style';
import { useCiteSupport } from '../contexts/CiteSupportContext';
import data from '../../utils/data';

type pivotItem = 'citationStyle' | 'dashboard';

const getTabId = (itemKey: string) => {
  return `appTabs${itemKey}`;
};

function Layout(): JSX.Element {
  const [selectedKey, setSelectedKey] = useState<pivotItem>('dashboard');

  const handleLinkClick = (item?: PivotItem) => {
    if (item) setSelectedKey(item.props.itemKey as pivotItem);
  };

  const citeSupport = useCiteSupport();

  const onSyncBibliography = async () => {
    await citeSupport.getBibliography();
  };

  const [jabRefItems, setJabRefItems] = useState<Array<MetaData>>(data);

  const fetchJabRefData = async () => {
    try {
      const librariesListResponse = await fetch('https://localhost:6051/libraries');
      const librariesList = (await librariesListResponse.json()) as string[];
      const libraryId = librariesList[0];
      const libraryContentResponse = await fetch(`https://localhost:6051/libraries/${libraryId}`, {
        headers: {
          Accept: 'application/x-bibtex-library-csl+json',
        },
      });
      const libraryContent = (await libraryContentResponse.json()) as Array<MetaData>;
      console.debug('Fetched content', libraryContent);
      setJabRefItems(libraryContent);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  return (
    <Stack verticalFill>
      <Stack.Item>
        <Pivot
          aria-label="NAV"
          linkSize="normal"
          getTabId={getTabId}
          styles={pivotStyle}
          onLinkClick={handleLinkClick}
        >
          <PivotItem headerText="Library" itemKey="dashboard" />
          <PivotItem headerText="Citation Style" itemKey="citationStyles" />
        </Pivot>
      </Stack.Item>
      <Stack.Item styles={scrollableStack} grow>
        {selectedKey === 'dashboard' ? <Dashboard jabRefItems={jabRefItems} /> : <CitationStyle />}
      </Stack.Item>
      <Stack.Item>
        <Footer onSyncBibliography={onSyncBibliography} onFetchJabRefData={fetchJabRefData} />
      </Stack.Item>
    </Stack>
  );
}

export default Layout;
