import React from "react";
import Progress from "./Progress";
import { Switch, Route } from "react-router-dom";
import Login from "../pages/login";
import Layout from "./Layout";
import ProtectedRoutes from "../../utils/ProtectedRoutes";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

function App(props: AppProps) {
  const { isOfficeInitialized } = props;

  if (!isOfficeInitialized) {
    return <Progress title="JabRef" message="Loading JabRef..." logo="../../../assets/jabref.svg" />;
  } else {
    return (
      <div>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <ProtectedRoutes path="/">
            <Layout />
          </ProtectedRoutes>
        </Switch>
      </div>
    );
  }
}
export default App;
