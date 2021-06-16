import { IStyleSet, ILabelStyles, IPivotStyles, DefaultPalette, Pivot, PivotItem, Label } from "@fluentui/react";
import * as React from "react";
import { ProtectedRoutes } from "../../Utils/ProtectedRoutes";
import Dashboard from "../pages/dashboard";

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
  root: {},
};
const pivotStyle: Partial<IPivotStyles> = {
  root: {
    backgroundColor: DefaultPalette.white,
    marginBottom: 0,
    borderBottom: "1px solid rgba(29, 4, 4, 0.11)",
  },
};

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {
  return (
    <Pivot aria-label="NAV" styles={pivotStyle} linkSize="normal">
      <PivotItem
        headerText="Library"
        headerButtonProps={{
          "data-order": 1,
          "data-title": "Library title",
        }}
      >
        <Label styles={labelStyles}>
          <ProtectedRoutes path="/" component={Dashboard} />
        </Label>
      </PivotItem>
      <PivotItem headerText="Citation Style">
        <Label styles={labelStyles}>
          <div>Under Construction</div>
        </Label>
      </PivotItem>
      <PivotItem headerText="Profile">
        <Label styles={labelStyles}>
          <div>Under Construction</div>
        </Label>
      </PivotItem>
    </Pivot>
  );
};

export default Layout;
