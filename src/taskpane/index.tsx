/* eslint-disable import/no-extraneous-dependencies */
// Todo upgrade react-hot-loader and re-enable these rules
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client";
import { AppContainer } from "react-hot-loader";
import { initializeIcons, ThemeProvider } from "@fluentui/react";
import { HashRouter as Router } from "react-router-dom";
import App from "./components/App";
import client from "../utils/apolloClient";

initializeIcons();

let isOfficeInitialized = false;

const title = "JabRef Task Pane Add-in";

const render = (Component) => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <AppContainer>
        <ThemeProvider>
          <Router>
            <Component
              title={title}
              isOfficeInitialized={isOfficeInitialized}
            />
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
