/* eslint-disable no-void */
// Todo upgrade react-hot-loader and re-enable these rules
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import { AppContainer } from 'react-hot-loader';
import { initializeIcons } from '@fluentui/react';
import { HashRouter as Router } from 'react-router-dom';
import App from './components/App';
import client from '../plugins/apollo/apolloClient';
import Preference from '../utils/user-preference';
import { Theme } from '../../types';

initializeIcons();

let theme: Theme;
let isOfficeInitialized = false;
const title = 'JabRef Task Pane Add-in';

const render = (Component) => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <AppContainer>
        <Router>
          <Component title={title} theme={theme} isOfficeInitialized={isOfficeInitialized} />
        </Router>
      </AppContainer>
    </ApolloProvider>,
    document.getElementById('container')
  );
};

/* Render application after Office initializes */
void Office.onReady(() => {
  isOfficeInitialized = true;
  theme = Preference.getItem('theme') === '0' ? Theme.LIGHT : Theme.DARK;
  render(App);
});

if ((module as any).hot) {
  (module as any).hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default;
    render(NextApp);
  });
}
