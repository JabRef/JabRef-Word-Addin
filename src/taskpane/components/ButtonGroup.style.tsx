import { IStackItemStyles, IStackStyles, Depths } from '@fluentui/react';
import globalStyles from '../../theme/index';

const buttonContainerStack: IStackStyles = {
  root: {
    padding: globalStyles.margin,
    boxShadow: Depths.depth16,
  },
};

export const buttonItemStyle: IStackItemStyles = {
  root: {
    paddingLeft: '0.5rem',
  },
};

export default buttonContainerStack;
