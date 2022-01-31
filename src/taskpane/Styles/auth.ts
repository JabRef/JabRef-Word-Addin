import { getTheme, IStackItemStyles, IStackStyles } from '@fluentui/react';
import globalStyles from '.';

const { palette, fonts } = getTheme();
export const logoStyle: IStackStyles = {
  root: {
    margin: `0rem ${globalStyles.margin}`,
  },
};

export const heading: IStackItemStyles = {
  root: {
    fontSize: fonts.xxLarge.fontSize,
    fontWeight: 700,
    margin: `1rem ${globalStyles.margin}`,
    color: palette.neutralPrimary,
  },
};

export const bodyText: IStackItemStyles = {
  root: {
    fontSize: fonts.small.fontSize,
    fontWeight: fonts.small.fontWeight,
    margin: `1rem ${globalStyles.margin}`,
    color: palette.neutralDark,
  },
};

export const containerStyle: IStackStyles = {
  root: {
    backgroundColor: palette.white,
    margin: `0rem ${globalStyles.margin}`,
  },
};

export const logoText: IStackStyles = {
  root: {
    fontSize: fonts.superLarge.fontSize,
    fontFamily: fonts.superLarge.fontFamily,
    fontWeight: fonts.superLarge.fontWeight,
  },
};

export const logo = {
  width: '12rem',
  height: '5rem',
};

export const svg = {
  width: '20rem',
  height: '15rem',
};
