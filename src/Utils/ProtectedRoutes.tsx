import React from "react";
import { Redirect, Route } from "react-router-dom";

interface ProtectedRoutesProps {
  children: JSX.Element;
  path: string;
}

function ProtectedRoutes({ children, ...rest }: ProtectedRoutesProps) {
  const isAuth = true;
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
export default ProtectedRoutes;
