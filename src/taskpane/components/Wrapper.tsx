import { IStackStyles, Stack } from "@fluentui/react";
import React, { ReactElement } from "react";

interface WrapperProps {
  children: React.ReactNode;
}
const wrapperStackStyles: IStackStyles = {
  root: {
    height: "100vh",
  },
};

function Wrapper({ children }: WrapperProps): ReactElement {
  return (
    <Stack verticalFill styles={wrapperStackStyles}>
      {children}
    </Stack>
  );
}

export default Wrapper;
