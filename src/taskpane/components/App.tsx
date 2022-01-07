import React, { ReactElement } from 'react';
import { Switch, Route } from 'react-router-dom';
import Progress from './Progress';
import Login from '../pages/login';
import Layout from '../Layout/Layout';
import ProtectedRoutes from '../routes/ProtectedRoutes';
import Wrapper from './Wrapper';
import Context from '../contexts/index';

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

function App(props: AppProps): ReactElement {
  const { isOfficeInitialized } = props;

  if (!isOfficeInitialized) {
    return (
      <Progress title="JabRef" message="Loading JabRef Addin" logo="../../../assets/jabref.svg" />
    );
  }
  return (
    <Wrapper>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <ProtectedRoutes path="/">
          <Context>
            <Layout />
          </Context>
        </ProtectedRoutes>
      </Switch>
    </Wrapper>
  );
}
export default App;
