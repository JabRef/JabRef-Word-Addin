import App from "./components/App";
import { AppContainer } from "react-hot-loader";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client";
import client from "../Utils/apolloClient";
import { initializeIcons, ThemeProvider } from "@fluentui/react";
import { HashRouter as Router } from "react-router-dom";
/* global Office */

initializeIcons();

let isOfficeInitialized = false;

const title = "JabRef Task Pane Add-in";

const render = (Component) => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <AppContainer>
        <ThemeProvider>
          <Router>
            <Component title={title} isOfficeInitialized={isOfficeInitialized} />
          </Router>
        </ThemeProvider>
      </AppContainer>
    </ApolloProvider>,
    document.getElementById("container")
  );
};

/* Render application after Office initializes */
Office.initialize = () => {
  isOfficeInitialized = true;
  render(App);
};

if ((module as any).hot) {
  (module as any).hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    render(NextApp);
  });
}
