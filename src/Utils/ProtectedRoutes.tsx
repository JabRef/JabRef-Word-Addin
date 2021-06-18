import React from "react";
import { Redirect } from "react-router-dom";

interface ProtectedRoutesProps {
  children: JSX.Element;
  path: string;
}

function ProtectedRoutes(props: ProtectedRoutesProps) {
  const bool = true;
  return bool ? props.children : <Redirect to={{ pathname: "/login" }} />;
}
export default ProtectedRoutes;
