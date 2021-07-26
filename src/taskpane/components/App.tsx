<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import Progress from "./Progress";
=======
import React, { ReactElement } from "react";
>>>>>>> 6925e00bb627bdb78e9622ad41f95a2760d0ffed
import { Switch, Route } from "react-router-dom";
import Progress from "./Progress";
import Login from "../pages/login";
import Layout from "./Layout";
import ProtectedRoutes from "../../utils/ProtectedRoutes";
import CiteSupport from "../../utils/citesupport";
import data from "../../Utils/data";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

function App(props: AppProps): ReactElement {
  const { isOfficeInitialized } = props;
  const [citeSupport] = useState(() => new CiteSupport(data));
  useEffect(() => {
    citeSupport.initDocument();
  }, []);

  if (!isOfficeInitialized) {
    return (
<<<<<<< HEAD
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
=======
      <Progress
        title="JabRef"
        message="Loading JabRef..."
        logo="../../../assets/jabref.svg"
      />
>>>>>>> 6925e00bb627bdb78e9622ad41f95a2760d0ffed
    );
  }
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
export default App;
