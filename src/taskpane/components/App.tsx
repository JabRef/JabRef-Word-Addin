import React, { ReactElement } from "react";
import { Switch, Route } from "react-router-dom";
import Progress from "./Progress";
import Login from "../pages/login";
import Layout from "../Layout/Layout";
import ProtectedRoutes from "../../utils/ProtectedRoutes";
import { CitationStoreProvider } from "../context/CitationStoreContext";
import { CiteSupportContextProvider } from "../context/CiteSupportContext";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

function App(props: AppProps): ReactElement {
  const { isOfficeInitialized } = props;

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
          <CiteSupportContextProvider>
            <CitationStoreProvider>
              <Layout />
            </CitationStoreProvider>
          </CiteSupportContextProvider>
        </ProtectedRoutes>
      </Switch>
    </div>
  );
}
export default App;
