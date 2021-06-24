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
  ActionButton,
  IIconProps,
  IButtonStyles,
} from "@fluentui/react";
import React from "react";
import { useLogoutMutation } from "../../generated/graphql";
import client from "../../utils/apolloClient";
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

const SignOutButtonStyle: IButtonStyles = {
  root: {
    color: DefaultPalette.white,
  },
};

const footerStackStyle: IStackStyles = {
  root: {
    background: DefaultPalette.neutralDark,
  },
};

const Signout: IIconProps = { iconName: "SignOut" };

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
  const [logoutMutation] = useLogoutMutation();
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
          </Pivot>
        </Stack>
        <Stack grow disableShrink={true} verticalAlign="end">
          <footer>
            <Stack styles={footerStackStyle} horizontal horizontalAlign="space-between">
              <Stack horizontal style={{ padding: 6, paddingLeft: 15 }}>
                <img {...imageProps} alt="jabref logo" width={20} />
                <div
                  style={{
                    color: DefaultPalette.neutralLight,
                    fontSize: FontSizes.size20,
                    fontWeight: "normal",
                    marginLeft: 10,
                    marginTop: 2,
                  }}
                >
                  JabRef
                </div>
              </Stack>
              <Stack style={{ padding: 3 }}>
                <ActionButton
                  styles={SignOutButtonStyle}
                  iconProps={Signout}
                  allowDisabledFocus
                  onClick={() => {
                    logoutMutation().then(() => client.resetStore());
                  }}
                >
                  Signout
                </ActionButton>
              </Stack>
            </Stack>
          </footer>
        </Stack>
      </Stack>
    </Wrapper>
  );
}

export default Layout;
