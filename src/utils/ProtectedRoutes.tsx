import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useMeQuery } from "../generated/graphql";
import Progress from "../taskpane/components/Progress";

interface ProtectedRoutesProps {
  children: JSX.Element;
  path: string;
}

function ProtectedRoutes({
  children,
  ...rest
}: ProtectedRoutesProps): JSX.Element {
  const { data, loading } = useMeQuery();
  if (loading) {
    return (
      <Progress
        title="JabRef"
        message="Loading JabRef Addin"
        logo="../../../assets/jabref.svg"
      />
    );
  }
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !data.me ? (
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
