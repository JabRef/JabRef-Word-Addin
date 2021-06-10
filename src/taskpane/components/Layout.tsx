import { IStyleSet, ILabelStyles, IPivotStyles, DefaultPalette, Pivot, PivotItem, Label } from "@fluentui/react";
import * as React from "react";
import Wrapper from "./Wrapper";

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
  root: { marginTop: 10, marginBottom: 0 },
};
const pivotStyle: Partial<IPivotStyles> = {
  root: {
    backgroundColor: DefaultPalette.white,
    marginBottom: 0,
  },
};

interface LayoutProps {
  dashboard: React.ReactNode;
  citationStyle: React.ReactNode;
  profile: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
  return (
    <Wrapper>
      <Pivot aria-label="NAV" styles={pivotStyle} linkSize="normal">
        <PivotItem
          headerText="My Files"
          headerButtonProps={{
            "data-order": 1,
            "data-title": "My Files Title",
          }}
        >
          <Label styles={labelStyles}>{props.dashboard}</Label>
        </PivotItem>
        <PivotItem headerText="Citation Style">
          <Label styles={labelStyles}>{props.citationStyle}</Label>
        </PivotItem>
        <PivotItem headerText="Profile">
          <Label styles={labelStyles}>{props.profile}</Label>
        </PivotItem>
      </Pivot>
    </Wrapper>
  );
};

export default Layout;
