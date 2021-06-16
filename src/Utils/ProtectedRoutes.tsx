import * as React from "react";
import { Redirect, Route } from "react-router-dom";

interface ProtectedRoutesProps {
  component: any;
  path: string;
}

export const ProtectedRoutes: React.FC<ProtectedRoutesProps> = (props: ProtectedRoutesProps) => {
  const isAuth = true;
  const { component: Component, ...rest } = props;
  return <Route {...rest} render={(props) => (isAuth ? <Component {...props} /> : <Redirect to="/login" />)} />;
};
