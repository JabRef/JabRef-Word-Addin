/* eslint-disable react/prop-types */
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
import * as React from "react";
import { useLoginMutation } from "../../generated/graphql";
import { InputField } from "../components/InputField";

// Styles definition
const stackStyles: IStackStyles = {
  root: {
    background: DefaultPalette.white,
  },
};
const stackStylesHeader: IStackStyles = {
  root: {
    padding: 20,
    paddingBottom: 30,
    paddingTop: 60,
  },
};

// Logo
const imageProps: IImageProps = {
  imageFit: ImageFit.contain,
  src: "../../assets/jabref.svg",
};

// Tokens definition
const verticalGapStackTokens: IStackTokens = {
  childrenGap: 10,
  padding: 30,
};

interface loginProps {}

const Login: React.FC<loginProps> = () => {
  const [values, setValues] = React.useState({ email: "", password: "" });
  const [loginMutation] = useLoginMutation({ variables: values });
  return (
    <Formik
      initialValues={values}
      onSubmit={async (value, { setErrors }) => {
        setValues(value);
        await loginMutation();
        const boolean = true;
        if (!boolean) {
          setErrors({
            email: "Wrong Email",
            password: "Incorrect Password",
          });
        }
      }}
    >
      {() => (
        <Stack styles={stackStylesHeader}>
          <Form>
            <Stack styles={stackStyles} tokens={verticalGapStackTokens}>
              <Stack.Item align="center">
                <img {...imageProps} alt="jabref logo" width={80} />
              </Stack.Item>
              <Stack.Item align="center">
                <div style={{ fontSize: FontSizes.size32, fontWeight: "bolder" }}>Log In</div>
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
              <PrimaryButton type="submit">Login</PrimaryButton>
              <Stack.Item align="center">
                <div>Don&apos;t have an account?</div>
              </Stack.Item>
              <Stack.Item align="center">
                <Link to="https://www.JabRef.com" target="blank">
                  Sign Up
                </Link>
              </Stack.Item>
            </Stack>
          </Form>
        </Stack>
      )}
    </Formik>
  );
};

export default Login;
