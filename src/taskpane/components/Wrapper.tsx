import React, { ReactElement } from "react";

interface WrapperProps {
  children: React.ReactNode;
}

function Wrapper({ children }: WrapperProps): ReactElement {
  return (
    <div
      style={{
        height: "100vh",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {children}
    </div>
  );
}

export default Wrapper;
