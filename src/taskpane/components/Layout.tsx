import {
  IStyleSet,
  ILabelStyles,
  IPivotStyles,
  DefaultPalette,
  Pivot,
  PivotItem,
  Label,
  Stack,
  FontSizes,
  IImageProps,
  ImageFit,
  IStackStyles,
} from "@fluentui/react";
import React from "react";
import Dashboard from "../pages/dashboard";
import Wrapper from "./Wrapper";

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
  root: {},
};

const stackStyles: IStackStyles = {
  root: {
    overflow: "hidden",
  },
};

const imageProps: IImageProps = {
  imageFit: ImageFit.contain,
  src: "../../assets/jabref_white.svg",
};

const pivotStyle: Partial<IPivotStyles> = {
  root: {
    backgroundColor: DefaultPalette.white,
    marginBottom: 0,
    borderBottom: "1px solid rgba(29, 4, 4, 0.11)",
  },
};

function Layout() {
  return (
    <Wrapper>
      <Stack verticalFill={true}>
        <Stack grow verticalFill={true} disableShrink={false} verticalAlign="start" styles={stackStyles}>
          <Pivot aria-label="NAV" styles={pivotStyle} linkSize="normal">
            <PivotItem
              headerText="Library"
              headerButtonProps={{
                "data-order": 1,
                "data-title": "Library title",
              }}
            >
              <Label styles={labelStyles}>
                <Dashboard />
              </Label>
            </PivotItem>
            <PivotItem headerText="Citation Style">
              <Label styles={labelStyles}>
                <div>Under Construction</div>
              </Label>
            </PivotItem>
            <PivotItem headerText="Log out">
              <Label styles={labelStyles}>
                <div>Under Construction</div>
              </Label>
            </PivotItem>
          </Pivot>
        </Stack>
        <Stack grow disableShrink={true} verticalAlign="end">
          <footer>
            <div style={{ background: DefaultPalette.neutralDark, padding: 10, display: "flex", paddingLeft: 15 }}>
              <img {...imageProps} alt="jabref logo" width={24} />
              <div
                style={{
                  color: DefaultPalette.neutralLight,
                  fontSize: FontSizes.size18,
                  fontWeight: "bolder",
                  paddingLeft: 12,
                }}
              >
                JabRef
              </div>
            </div>
          </footer>
        </Stack>
      </Stack>
    </Wrapper>
  );
}

export default Layout;
