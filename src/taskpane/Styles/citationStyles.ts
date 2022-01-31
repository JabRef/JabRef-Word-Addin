import {
  getFocusStyle,
  getTheme,
  IIconStyles,
  IStackItemStyles,
  IStackStyles,
  mergeStyleSets,
} from '@fluentui/react';
import globalStyles from '.';

const theme = getTheme();
const { fonts, semanticColors } = theme;

export const heading: IStackItemStyles = {
  root: {
    fontSize: fonts.medium.fontSize,
    fontWeight: 700,
    margin: `1rem ${globalStyles.margin}`,
  },
};

export const container: IStackStyles = {
  root: {
    position: 'relative',
  },
};

export const selectedStyle: IStackItemStyles = {
  root: {
    display: 'flex',
    fontWeight: 700,
    flexDirection: 'row',
    minHeight: '2.5rem',
    alignItems: 'center',
    fontSize: fonts.medium.fontSize,
    margin: `1rem ${globalStyles.margin}`,
  },
};

export const listContainer: IStackItemStyles = {
  root: {
    overflow: 'auto',
  },
};

export const selectedStyleIcon: IIconStyles = {
  root: {
    paddingRight: '0.5rem',
    fontSize: fonts.large.fontSize,
    fontWeight: fonts.large.fontFamily,
  },
};

export const classNames = mergeStyleSets({
  itemCell: [
    getFocusStyle(theme, { inset: -1 }),
    {
      minHeight: 34,
      boxSizing: 'border-box',
      padding: '0 25px',
      cursor: 'pointer',
      display: 'flex',
    },
  ],
  itemName: [
    fonts.medium,
    {
      padding: '8px 0',
      borderBottom: `1px solid ${semanticColors.bodyDivider}`,
      minWidth: '100%',
    },
  ],
});
