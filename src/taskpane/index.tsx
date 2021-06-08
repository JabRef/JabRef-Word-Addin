import App from "./components/App";
import { AppContainer } from "react-hot-loader";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client";
import client from "../Utils/apolloClient";
import { initializeIcons, ThemeProvider } from "@fluentui/react";
/* global document, Office, module, require */

initializeIcons();

let isOfficeInitialized = false;

const title = "Contoso Task Pane Add-in";

const render = (Component) => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <ThemeProvider>
        <AppContainer>
          <Component title={title} isOfficeInitialized={isOfficeInitialized} />
        </AppContainer>
      </ThemeProvider>
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
