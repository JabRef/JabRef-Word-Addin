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
import React from "react";
import { useHistory, withRouter } from "react-router-dom";
import { useLoginMutation } from "../../generated/graphql";
import { InputField } from "../components/InputField";
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

interface loginProps {}

const Login: React.FC<loginProps> = () => {
  const history = useHistory();
  const [loginMutation] = useLoginMutation();
  return (
    <Wrapper>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async (value, { setErrors }) => {
          const response = await loginMutation({ variables: value });
          if (response.data?.login.__typename === "User") {
            history.push({ pathname: "/" });
          } else {
            setErrors({
              email: "Wrong Email",
              password: "Incorrect Password",
            });
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
};

export default withRouter(Login);
