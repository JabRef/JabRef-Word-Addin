import { getTheme, IDropdownStyles, IIconProps, IStackStyles, IStackTokens } from '@fluentui/react';

const theme = getTheme();
const { palette } = theme;
export const iconButtonStyle = {
  root: {
    padding: 0,
  },
  rootHovered: {
    backgroundColor: 'transparent',
    color: palette.neutralSecondary,
    transform: 'scale(1.05)',
  },
  rootPressed: {
    backgroundColor: 'transparent',
    color: palette.neutralLight,
    transform: 'scale(1.1)',
  },
};

export const editIcon: IIconProps = { iconName: 'edit' };

export const buttonContainerStack: IStackStyles = {
  root: {
    padding: 0,
  },
};

export const stackToken: IStackTokens = {
  childrenGap: 25,
};

export const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: {
    minWidth: 160,
  },
};
