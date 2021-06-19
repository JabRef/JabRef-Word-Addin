import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { ApolloProvider } from "@apollo/client";
import { AppContainer } from "react-hot-loader";
import { initializeIcons, ThemeProvider } from "@fluentui/react";
import { HashRouter as Router } from "react-router-dom";
import client from "../utils/apolloClient";
/* global document, Office, module, require */

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
