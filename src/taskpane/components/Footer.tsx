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
import client from "../../plugins/apollo/apolloClient";
import { useCiteSupport } from "../contexts/CiteSupportContext";

const SignOutButtonStyle: IButtonStyles = {
  icon: {
    color: "rgba(255,255,255,.8)",
  },
  iconHovered: {
    color: "rgba(255, 255, 255,.9)",
    transform: "scale(1.05)",
  },
  iconPressed: {
    transform: "scale(0.95)",
    color: "rgba(255, 255, 255,.9)",
  },
};

const footerStackStyle: IStackStyles = {
  root: {
    background: DefaultPalette.neutralPrimary,
    boxSizing: "border-box",
    padding: "0.15rem",
    height: "42px",
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
          ariaLabel="Add Bibliography"
          iconProps={SyncBib}
          allowDisabledFocus
          onClick={async () => {
            await citeSupport.getBibliography();
          }}
        />
        <ActionButton
          styles={SignOutButtonStyle}
          iconProps={Signout}
          ariaLabel="Sign Out"
          allowDisabledFocus
          onClick={() => logoutMutation().then(() => client.resetStore())}
        />
      </Stack>
    </Stack>
  );
}

export default Footer;
