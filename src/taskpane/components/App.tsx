import React, { useEffect, useState } from "react";
import Progress from "./Progress";
import { Switch, Route } from "react-router-dom";
import Login from "../pages/login";
import Layout from "./Layout";
import ProtectedRoutes from "../../utils/ProtectedRoutes";
import CiteSupport from "../../utils/citesupport";
import data from "../../Utils/data";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

function App(props: AppProps) {
  const { isOfficeInitialized } = props;
  const [citeSupport] = useState(() => new CiteSupport(data));
  useEffect(() => {
    citeSupport.initDocument();
  }, []);

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
            <Layout citeSupport={citeSupport} />
          </ProtectedRoutes>
        </Switch>
      </div>
    );
  }
}
export default App;
