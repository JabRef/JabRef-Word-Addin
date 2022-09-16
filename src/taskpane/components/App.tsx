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

function App(props: AppProps): ReactElement {
  const { isOfficeInitialized, title, theme } = props;

  if (!isOfficeInitialized) {
    return <Progress title={title} message="Loading JabRef Addin" />;
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
