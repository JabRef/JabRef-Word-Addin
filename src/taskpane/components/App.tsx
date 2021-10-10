import React, { useEffect, useState, ReactElement } from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
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
      <ToastContainer
        position="top-center"
        closeButton={false}
        hideProgressBar
        newestOnTop
        closeOnClick
        limit={5}
        rtl={false}
        draggable={false}
        pauseOnHover
        autoClose={3000} // 3 seconds
        bodyStyle={{ padding: 0 }}
        style={{ marginTop: 45, padding: 0 }}
        toastClassName={() =>
          "relative flex p-1 overflow-auto min-h-100vh box-border rounded-md justify-between cursor-pointer"
        }
      />
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
