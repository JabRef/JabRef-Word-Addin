import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useMeQuery } from "../generated/graphql";
import Progress from "../taskpane/components/Progress";

interface ProtectedRoutesProps {
  children: JSX.Element;
  path: string;
}

function ProtectedRoutes({ children, ...rest }: ProtectedRoutesProps) {
  const { data, loading } = useMeQuery();
  if (loading) {
    return <Progress title="JabRef" message="Loading JabRef..." logo="../../../assets/jabref.svg" />;
  }
  return (
    <Route
      {...rest}
      render={({ location }) =>
        data ? (
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
