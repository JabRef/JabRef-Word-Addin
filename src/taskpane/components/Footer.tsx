import {
  Stack,
  ActionButton,
  DefaultPalette,
  IButtonStyles,
  IStackStyles,
  IIconProps,
  IImageProps,
  ImageFit,
} from "@fluentui/react";
import React, { ReactElement } from "react";
import { useLogoutMutation } from "../../generated/graphql";
import client from "../../utils/apolloClient";
import { useCiteSupport } from "../context/CiteSupportContext";

const SignOutButtonStyle: IButtonStyles = {
  root: {
    color: DefaultPalette.white,
  },
};

const footerStackStyle: IStackStyles = {
  root: {
    background: DefaultPalette.neutralDark,
    boxSizing: "border-box",
    padding: "0.15rem",
    height: "45px",
  },
};

const logoStack: IStackStyles = {
  root: {
    boxSizing: "border-box",
    paddingLeft: 10,
  },
};

const Signout: IIconProps = { iconName: "SignOut" };
const SyncBib: IIconProps = { iconName: "InsertSignatureLine" };

const imageProps: IImageProps = {
  imageFit: ImageFit.contain,
  src: "../../assets/jabref_white.svg",
  width: "24rem",
};

function Footer(): ReactElement {
  const [logoutMutation] = useLogoutMutation();
  const citeSupport = useCiteSupport();
  return (
    <Stack
      horizontal
      verticalAlign="center"
      horizontalAlign="center"
      styles={footerStackStyle}
    >
      <Stack horizontal styles={logoStack} grow horizontalAlign="start">
        <img {...imageProps} alt="jabref logo" />
        <div
          style={{
            color: DefaultPalette.neutralLight,
            fontSize: "1.4rem",
            fontWeight: "normal",
            marginLeft: ".5rem",
          }}
        >
          JabRef
        </div>
      </Stack>
      <Stack grow horizontal horizontalAlign="end">
        <ActionButton
          styles={SignOutButtonStyle}
          iconProps={SyncBib}
          allowDisabledFocus
          onClick={async () => {
            await citeSupport.getBibliography();
          }}
          text="Add Bib"
        />
        <ActionButton
          styles={SignOutButtonStyle}
          iconProps={Signout}
          allowDisabledFocus
          onClick={() => logoutMutation().then(() => client.resetStore())}
          text="Sign Out"
        />
      </Stack>
    </Stack>
  );
}

export default Footer;
