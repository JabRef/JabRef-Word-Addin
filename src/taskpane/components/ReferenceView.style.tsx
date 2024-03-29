import { getTheme, IStackItemStyles, IStackStyles, ITheme } from '@fluentui/react';
import globalStyles from '../../theme/index';

const theme: ITheme = getTheme();
const { fonts } = theme;

export const referenceViewContainer: IStackStyles = {
  root: {
    padding: `0.5rem ${globalStyles.margin}`,
    cursor: 'pointer',
    minHeight: '6rem',
  },
};

export const buttonContainer: IStackStyles = {
  root: {
    width: '1.5rem',
    paddingTop: '0.20rem',
  },
};

export const referenceDetailsContainer: IStackItemStyles = {
  root: {
    marginRight: '0.5rem',
    paddingLeft: '0.5rem',
    overflow: 'hidden',
  },
};

export const heading: IStackItemStyles = {
  root: {
    fontSize: fonts.medium.fontSize,
    fontWeight: 700,
    lineHeight: '1.2rem',
    height: '2.4rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

export const authorStyle: IStackItemStyles = {
  root: {
    fontWeight: 500,
    fontSize: fonts.medium.fontSize,
    paddingTop: '0.5rem',
    fontStyle: 'italic',
  },
};
