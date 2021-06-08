import * as React from "react";

import Progress from "./Progress";
// images references in the manifest
import "../../../assets/icon-16.png";
import "../../../assets/icon-32.png";
import PivotHeader from "./PivotHeader";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

const App: React.FC<AppProps> = (props) => {
  const { isOfficeInitialized } = props;

  if (!isOfficeInitialized) {
    return <Progress title="JabRef" message="Loading..." logo="../../../assets/jabref.svg" />;
  }
  return <PivotHeader />;
};

export default App;
