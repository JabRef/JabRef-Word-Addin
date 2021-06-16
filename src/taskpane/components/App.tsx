import * as React from "react";
import Progress from "./Progress";
// images references in the manifest
import "../../../assets/icon-16.png";
import "../../../assets/icon-32.png";
import { Route, Switch } from "react-router-dom";
import Login from "../pages/login";
import Layout from "./Layout";
import Dashboard from "../pages/dashboard";
import { ProtectedRoutes } from "../../Utils/ProtectedRoutes";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

const App: React.FC<AppProps> = (props) => {
  const { isOfficeInitialized } = props;

  if (!isOfficeInitialized) {
    return <Progress title="JabRef" message="Loading JabRef..." logo="../../../assets/jabref.svg" />;
  } else {
    return (
      <div>
        <Switch>
          <Route path="/login" component={Login} />
          <ProtectedRoutes path="/" component={Layout} />
          <ProtectedRoutes path="/home" component={Dashboard} />
        </Switch>
      </div>
    );
  }
};
export default App;
