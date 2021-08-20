import React, { useEffect, useState, ReactElement } from "react";
import { Switch, Route } from "react-router-dom";
import Progress from "./Progress";
import Login from "../pages/login";
import Layout from "./Layout";
import ProtectedRoutes from "../../utils/ProtectedRoutes";
import CiteSupport from "../../utils/citesupport";
import data from "../../utils/data";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

function App(props: AppProps): ReactElement {
  const { isOfficeInitialized } = props;
  const [citeSupport] = useState(() => new CiteSupport(data));
  useEffect(() => {
    // eslint-disable-next-line no-void
    void citeSupport.initDocument();
  });

  if (!isOfficeInitialized) {
    return (
      <Progress
        title="JabRef"
        message="Loading JabRef Addin"
        logo="../../../assets/jabref.svg"
      />
    );
  }
  return (
    <div>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <ProtectedRoutes path="/">
          <Layout citeSupport={citeSupport} />
        </ProtectedRoutes>
      </Switch>
    </div>
  );
}
export default App;
