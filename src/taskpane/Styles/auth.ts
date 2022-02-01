import {
  getTheme,
  IButtonStyles,
  IIconStyles,
  IStackItemStyles,
  IStackStyles,
} from '@fluentui/react';
import globalStyles from '.';

const { palette, fonts } = getTheme();
export const logoStyle: IStackStyles = {
  root: {
    margin: `1rem ${globalStyles.margin}`,
  },
};

export const container: IStackStyles = {
  root: {
    backgroundImage: `linear-gradient(to bottom,rgba(9, 32, 63, 0.8), rgba(83, 120, 149, 0.4)), url('../../../assets/images/login-page.jpg')`,
    backgroundSize: 'cover',
  },
};

export const iconStyle: IIconStyles = {
  root: {
    marginLeft: '0.2rem',
  },
};

export const heading: IStackItemStyles = {
  root: {
    fontSize: 50,
    fontWeight: 600,
    margin: `1rem ${globalStyles.margin}`,
    color: palette.themeLighter,
  },
};

export const textOnlyButton: IButtonStyles = {
  root: {
    marginTop: 'auto',
    marginBottom: '5rem',
    backgroundColor: 'transparent',
    padding: '1rem',
    fontSize: fonts.mediumPlus.fontSize,
    color: palette.white,
  },
  rootHovered: {
    backgroundColor: 'transparent',
    color: palette.white,
    borderColor: palette.themeLighter,
  },
  rootPressed: {
    backgroundColor: 'transparent',
    color: palette.white,
    borderColor: palette.themeLighter,
  },
};

export const logo = {
  width: '12rem',
  height: '5rem',
};
