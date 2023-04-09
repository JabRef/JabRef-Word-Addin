/* eslint-disable import/no-extraneous-dependencies */
// Todo upgrade react-hot-loader and re-enable these rules
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { initializeIcons, ThemeProvider } from '@fluentui/react';
import App from './components/App';

initializeIcons();

let isOfficeInitialized = false;

const title = 'JabRef Task Pane Add-in';

const render = (Component) => {
  const root = createRoot(document.getElementById('container'));
  root.render(
    <ThemeProvider as={React.Fragment}>
      <Component title={title} isOfficeInitialized={isOfficeInitialized} />
    </ThemeProvider>
  );
};

/* Render application after Office initializes */
// eslint-disable-next-line no-void
void Office.onReady(() => {
  isOfficeInitialized = true;
  render(App);
});

if ((module as any).hot) {
  (module as any).hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default;
    render(NextApp);
  });
}
