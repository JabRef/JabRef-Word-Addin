import React, { ReactElement } from 'react';
import Progress from './Progress';
import Wrapper from './Wrapper';
import { ThemeContextProvider } from '../contexts/ThemeContext';
import { Theme } from '../../../types';
import Index from '../routes/Index';

export interface AppProps {
  title: string;
  theme: Theme;
  isOfficeInitialized: boolean;
}

function App({ isOfficeInitialized, theme }: AppProps): ReactElement {
  if (!isOfficeInitialized) {
    return (
      <Progress title="JabRef" message="Loading JabRef Addin" logo="../../../assets/jabref.svg" />
    );
  }
  return (
    <ThemeContextProvider initTheme={theme}>
      <Wrapper>
        <Index />
      </Wrapper>
    </ThemeContextProvider>
  );
}
export default App;
