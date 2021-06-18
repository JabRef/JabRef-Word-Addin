import React from "react";
import { Redirect } from "react-router-dom";

interface ProtectedRoutesProps {
  component: React.FunctionComponent;
  path: string;
}

function ProtectedRoutes(props: ProtectedRoutesProps) {
  const bool = true;
  const { component: Component } = props;
  return bool ? <Component /> : <Redirect to={{ pathname: "/login" }} />;
}
export default ProtectedRoutes;
