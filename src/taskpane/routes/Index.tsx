import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Context from '../contexts';
import Layout from '../layout/Layout';
import Auth from '../pages/Auth';
import ProtectedRoutes from './ProtectedRoutes';

function Index(): React.ReactElement {
  return (
    <Switch>
      <Route path="/login">
        <Auth />
      </Route>
      <ProtectedRoutes path="/">
        <Context>
          <Layout />
        </Context>
      </ProtectedRoutes>
    </Switch>
  );
}

export default Index;
