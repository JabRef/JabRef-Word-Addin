import {
  IPivotStyles,
  DefaultPalette,
  Pivot,
  PivotItem,
  Stack,
  FontSizes,
  IImageProps,
  ImageFit,
  IStackStyles,
  ActionButton,
  IIconProps,
  IButtonStyles,
} from "@fluentui/react";
import React, { ReactElement } from "react";
import { useLogoutMutation } from "../../generated/graphql";
import client from "../../utils/apolloClient";
import Dashboard from "../pages/dashboard";
import Wrapper from "./Wrapper";
import CiteSupport from "../../utils/citesupport";

interface LayoutProps {
  citeSupport: CiteSupport;
}

const wrapperStack: IStackStyles = {
  root: {
    height: "calc(100vh - 5.3rem)",
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
    boxSizing: "border-box",
    height: 40,
  },
};

const Signout: IIconProps = { iconName: "SignOut" };
const SyncBib: IIconProps = { iconName: "InsertSignatureLine" };

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

<<<<<<< HEAD
function Layout({ citeSupport }: LayoutProps) {
=======
function Layout(): ReactElement {
>>>>>>> 6925e00bb627bdb78e9622ad41f95a2760d0ffed
  const [logoutMutation] = useLogoutMutation();
  return (
    <Wrapper>
      <Stack grow verticalAlign="start">
        <Pivot aria-label="NAV" styles={pivotStyle} linkSize="normal">
          <PivotItem
            headerText="Library"
            headerButtonProps={{
              "data-order": 1,
              "data-title": "Library title",
            }}
          >
            <Stack styles={wrapperStack}>
              <Dashboard citeSupport={citeSupport} />
            </Stack>
          </PivotItem>
          <PivotItem headerText="Citation Style">
            <Stack styles={wrapperStack}>
              <div>Under Construction</div>
            </Stack>
          </PivotItem>
        </Pivot>
      </Stack>
      <Stack grow disableShrink styles={footerStackStyle} verticalAlign="end">
        <Stack
          horizontal
          style={{ height: "100%" }}
          horizontalAlign="space-between"
        >
          <Stack
            horizontal
            style={{ alignItems: "center", padding: 8, paddingLeft: 10 }}
          >
            <img {...imageProps} alt="jabref logo" width={20} />
            <div
              style={{
                color: DefaultPalette.neutralLight,
                fontSize: FontSizes.size20,
                fontWeight: "normal",
                marginLeft: 8,
                marginBottom: 3,
              }}
            >
              JabRef
            </div>
          </Stack>
          <ActionButton
            styles={SignOutButtonStyle}
            iconProps={SyncBib}
            allowDisabledFocus
            onClick={() => {
              citeSupport.getBibliography();
            }}
          >
            Sync Bib
          </ActionButton>
          <ActionButton
            styles={SignOutButtonStyle}
            iconProps={Signout}
            allowDisabledFocus
            onClick={() => logoutMutation().then(() => client.resetStore())}
          >
            Signout
          </ActionButton>
        </Stack>
      </Stack>
    </Wrapper>
  );
}

export default Layout;
