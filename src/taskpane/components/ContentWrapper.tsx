import React from "react";

interface ContentWrapperProps {
  children: React.ReactNode;
}

function ContentWrapper({ children }: ContentWrapperProps): JSX.Element {
  return (
    <div
      style={{
        width: "90%",
        height: "100%",
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
}

export default ContentWrapper;
