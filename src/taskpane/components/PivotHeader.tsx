import { IStyleSet, ILabelStyles, IPivotStyles, DefaultPalette, Pivot, PivotItem, Label } from "@fluentui/react";
import * as React from "react";
import Dashboard from "../pages/dashboard";
import Login from "../pages/login";

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
  root: { marginTop: 10, marginBottom: 0 },
};
const pivotStyle: Partial<IPivotStyles> = {
  root: {
    backgroundColor: DefaultPalette.white,
    marginBottom: 0,
  },
};
const PivotHeader: React.FunctionComponent = () => {
  return (
    <Pivot aria-label="NAV" styles={pivotStyle} linkSize="large">
      <PivotItem
        headerText="My Files"
        headerButtonProps={{
          "data-order": 1,
          "data-title": "My Files Title",
        }}
      >
        <Label styles={labelStyles}>
          <Dashboard />
        </Label>
      </PivotItem>
      <PivotItem headerText="Citation Style">
        <Label styles={labelStyles}>
          <Login />
        </Label>
      </PivotItem>
      <PivotItem headerText="Profile">
        <Label styles={labelStyles}></Label>
      </PivotItem>
    </Pivot>
  );
};

export default PivotHeader;
