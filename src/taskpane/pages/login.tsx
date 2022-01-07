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
} from '@fluentui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { useLoginMutation } from '../../generated/graphql';
import ContentWrapper from '../components/ContentWrapper';
import InputField from '../components/InputField';

// Styles definition
const stackStylesHeader: IStackStyles = {
  root: {
    height: '100%',
    width: '80%',
    margin: 'auto',
    overflow: 'auto',
  },
};

// Logo
const imageProps: IImageProps = {
  imageFit: ImageFit.contain,
  src: '../../assets/jabref.svg',
};

// Tokens definition
const verticalGapStackTokens: IStackTokens = {
  childrenGap: 8,
};

function Login() {
  const history = useHistory();
  const [loginMutation, { error }] = useLoginMutation();
  return (
    <ContentWrapper>
      <Stack styles={stackStylesHeader} verticalAlign="center">
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={async (value) => {
            const response = await loginMutation({
              variables: value,
            });
            // eslint-disable-next-line no-underscore-dangle
            if (response.data?.login.__typename === 'User') {
              history.push({ pathname: '/' });
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Stack
                verticalAlign="center"
                horizontalAlign="space-around"
                tokens={verticalGapStackTokens}
              >
                <Stack.Item align="center">
                  <img {...imageProps} alt="jabref logo" width={80} />
                </Stack.Item>
                <Stack.Item align="center">
                  <div style={{ fontSize: FontSizes.size32, fontWeight: 'normal' }}>Log In</div>
                </Stack.Item>
                <Stack.Item align="center">
                  {error ? (
                    <div
                      style={{
                        fontSize: FontSizes.size14,
                        padding: 6,
                        fontWeight: 'bold',
                        color: DefaultPalette.red,
                      }}
                    >
                      Incorrect username or password
                    </div>
                  ) : null}
                </Stack.Item>
                <Stack.Item>
                  <InputField
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="Email"
                    autoFocus
                  />
                  <InputField
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="*********"
                  />
                </Stack.Item>
                <Stack.Item align="end">
                  <Link to="www.jabref.org" target="blank">
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
                  <Link to="www.jabref.org" target="blank">
                    Sign Up
                  </Link>
                </Stack.Item>
              </Stack>
            </Form>
          )}
        </Formik>
      </Stack>
    </ContentWrapper>
  );
}

export default withRouter(Login);
