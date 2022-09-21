import { DefaultPalette, ISpinnerStyles, IStackTokens } from '@fluentui/react';

export const stackToken: IStackTokens = {
  childrenGap: 45,
};

export const spinnerStyle: ISpinnerStyles = {
  root: {
    color: DefaultPalette.blueMid,
  },
  label: {
    color: DefaultPalette.blueMid,
    fontSize: '1em',
  },
};
