import React, { ReactElement } from 'react';
import { Switch, Route } from 'react-router-dom';
import Progress from './Progress';
import Login from '../pages/Login';
import Layout from '../layout/Layout';
import ProtectedRoutes from '../../utils/ProtectedRoutes';
import { CitationStoreProvider } from '../contexts/CitationStoreContext';
import { CiteSupportProvider } from '../contexts/CiteSupportContext';
import Wrapper from './Wrapper';

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

function App(props: AppProps): ReactElement {
  const { isOfficeInitialized, title } = props;

  if (!isOfficeInitialized) {
    return (
      <Progress title={title} message="Loading JabRef Addin" logo="../../../assets/jabref.svg" />
    );
  }

  return (
    <Wrapper>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <ProtectedRoutes path="/">
          <CiteSupportProvider>
            <CitationStoreProvider>
              <Layout />
            </CitationStoreProvider>
          </CiteSupportProvider>
        </ProtectedRoutes>
      </Switch>
    </Wrapper>
  );
}
export default App;
