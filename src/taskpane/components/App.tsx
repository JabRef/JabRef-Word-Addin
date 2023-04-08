import React, { ReactElement } from 'react';
import Progress from './Progress';
import Layout from '../layout/Layout';
import { CitationStoreProvider } from '../contexts/CitationStoreContext';
import { CiteSupportProvider } from '../contexts/CiteSupportContext';

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

function App(props: AppProps): ReactElement {
  const { isOfficeInitialized, title } = props;

  if (!isOfficeInitialized) {
    return (
      <Progress title={title} message="Loading JabRef Addin..." logo="../../../assets/jabref.svg" />
    );
  }

  return (
    <CiteSupportProvider>
      <CitationStoreProvider>
        <Layout />
      </CitationStoreProvider>
    </CiteSupportProvider>
  );
}
export default App;
