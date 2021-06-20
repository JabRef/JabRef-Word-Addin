import {
  IStackStyles,
  DefaultPalette,
  IImageProps,
  ImageFit,
  IStackTokens,
  Stack,
  FontSizes,
  PrimaryButton,
  Link,
} from "@fluentui/react";
import { Form, Formik } from "formik";
<<<<<<< HEAD
import * as React from "react";
import { useHistory, withRouter } from "react-router-dom";
import { useLoginMutation } from "../../generated/graphql";
import { InputField } from "../components/InputField";
=======
import React from "react";
import { useHistory, withRouter } from "react-router-dom";
import { useLoginMutation } from "../../generated/graphql";
import InputField from "../components/InputField";
>>>>>>> ce2bb92a61aa940273f1c9049ab3c31cd5eb1010
import Wrapper from "../components/Wrapper";

// Styles definition
const stackStylesHeader: IStackStyles = {
  root: {
    background: DefaultPalette.white,
  },
};

const stackStyles: IStackStyles = {
  root: {
    margin: 20,
    marginTop: 30,
    overflow: "hidden",
  },
};

// Logo
const imageProps: IImageProps = {
  imageFit: ImageFit.contain,
  src: "../../assets/jabref.svg",
};

// Tokens definition
const verticalGapStackTokens: IStackTokens = {
  childrenGap: 8,
  padding: 30,
};

<<<<<<< HEAD
interface loginProps {}

const Login: React.FC<loginProps> = () => {
  const [values, setValues] = React.useState({ email: "", password: "" });
  const history = useHistory();
  const [loginMutation, { error, data }] = useLoginMutation({
    variables: values,
  });
  return (
    <Wrapper>
      <Formik
        initialValues={values}
        onSubmit={async (value, { setErrors }) => {
          setValues(value);
          await loginMutation();
          if (error || !data) {
            setErrors({
              email: "Wrong Email",
              password: "Incorrect Password",
            });
          } else if (data) {
=======
function Login() {
  const history = useHistory();
  const [loginMutation, { error }] = useLoginMutation();
  return (
    <Wrapper>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async (value) => {
          const response = await loginMutation({ variables: value });
          if (response.data?.login.__typename === "User") {
>>>>>>> ce2bb92a61aa940273f1c9049ab3c31cd5eb1010
            history.push({ pathname: "/" });
          }
        }}
      >
        {({ isSubmitting }) => (
          <Stack verticalFill={true} styles={stackStylesHeader}>
            <Form>
              <Stack styles={stackStyles} tokens={verticalGapStackTokens}>
                <Stack.Item align="center">
                  <img {...imageProps} alt="jabref logo" width={80} />
                </Stack.Item>
                <Stack.Item align="center">
                  <div style={{ fontSize: FontSizes.size32, fontWeight: "normal" }}>Log In</div>
                </Stack.Item>
<<<<<<< HEAD
=======
                <Stack.Item align="center">
                  {error ? (
                    <div
                      style={{
                        fontSize: FontSizes.size14,
                        padding: 6,
                        fontWeight: "bold",
                        color: DefaultPalette.red,
                      }}
                    >
                      Incorrect username or password
                    </div>
                  ) : null}
                </Stack.Item>
>>>>>>> ce2bb92a61aa940273f1c9049ab3c31cd5eb1010
                <Stack.Item>
                  <InputField name="email" type="email" label="Email" placeholder="Email" autoFocus />
                  <InputField type="password" name="password" label="Password" placeholder="*********" />
                </Stack.Item>
                <Stack.Item align="end">
                  <Link to="#" target="blank">
                    Need Help?
                  </Link>
                </Stack.Item>
                <Stack.Item align="center">
                  <PrimaryButton type="submit" disabled={isSubmitting}>
                    Login
                  </PrimaryButton>
                </Stack.Item>
                <Stack.Item align="center">
                  <div>Don&apos;t have an account?</div>
                </Stack.Item>
                <Stack.Item align="center">
                  <Link to="#" target="blank">
                    Sign Up
                  </Link>
                </Stack.Item>
              </Stack>
            </Form>
          </Stack>
        )}
      </Formik>
    </Wrapper>
  );
<<<<<<< HEAD
};
=======
}
>>>>>>> ce2bb92a61aa940273f1c9049ab3c31cd5eb1010

export default withRouter(Login);
