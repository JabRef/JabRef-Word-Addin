import {
  DefaultPalette,
  IStackStyles,
  IStackTokens,
  Spinner,
  SpinnerSize,
  Stack,
} from "@fluentui/react";
import React from "react";
import Wrapper from "./Wrapper";

export interface ProgressProps {
  logo: string;
  message: string;
  title: string;
}
const stackStyles: IStackStyles = {
  root: {
    background: DefaultPalette.white,
  },
};

const stackToken: IStackTokens = {
  childrenGap: 50,
};

export default class Progress extends React.PureComponent<ProgressProps> {
  render(): JSX.Element {
    const { logo, message, title } = this.props;

    return (
      <Wrapper>
        <Stack
          verticalFill
          verticalAlign="center"
          styles={stackStyles}
          tokens={stackToken}
        >
          <Stack.Item align="center">
            <img width="80" height="80" src={logo} alt={title} title={title} />
          </Stack.Item>
          <Stack.Item align="center">
            <Spinner size={SpinnerSize.large} label={message} />
          </Stack.Item>
        </Stack>
      </Wrapper>
    );
  }
}
