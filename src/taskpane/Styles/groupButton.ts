import { IStackItemStyles, IStackStyles } from '@fluentui/react';
import globalStyles from '.';

const buttonContainerStack: IStackStyles = {
  root: {
    padding: globalStyles.margin,
  },
};

export const buttonItemStyle: IStackItemStyles = {
  root: {
    paddingLeft: '0.5rem',
  },
};

export default buttonContainerStack;
