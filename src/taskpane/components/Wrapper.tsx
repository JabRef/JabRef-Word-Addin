import * as React from "react";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }: WrapperProps) => {
  return <div style={{ height: "100vh" }}>{children}</div>;
};

export default Wrapper;
