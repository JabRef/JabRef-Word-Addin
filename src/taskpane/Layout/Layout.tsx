import {
  IPivotStyles,
  DefaultPalette,
  Pivot,
  PivotItem,
  Stack,
} from "@fluentui/react";
import React, { ReactElement } from "react";
import CitationStyle from "../pages/citationStyle";
import Dashboard from "../pages/dashboard";
import Footer from "../components/Footer";

const pivotItemStyles = {
  height: "calc(100vh - 90px)",
  overflow: "hidden",
};

const pivotStyle: Partial<IPivotStyles> = {
  root: {
    display: "flex",
    overflow: "hidden",
    justifyContent: "center",
    backgroundColor: DefaultPalette.white,
    borderBottom: "1px solid rgba(29, 4, 4, 0.11)",
  },
};

function Layout(): ReactElement {
  return (
    <>
      <Stack grow>
        <Pivot aria-label="NAV" styles={pivotStyle} linkSize="normal">
          <PivotItem headerText="Library" style={pivotItemStyles}>
            <Dashboard />
          </PivotItem>
          <PivotItem headerText="Citation Style" style={pivotItemStyles}>
            <CitationStyle />
          </PivotItem>
        </Pivot>
      </Stack>
      <Footer />
    </>
  );
}

export default Layout;
