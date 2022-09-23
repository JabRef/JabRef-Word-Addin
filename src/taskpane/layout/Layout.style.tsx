import { Depths, IPivotStyles, IStackStyles } from '@fluentui/react';

export const pivotStyle: Partial<IPivotStyles> = {
  root: {
    display: 'flex',
    overflow: 'hidden',
    justifyContent: 'center',
    boxShadow: Depths.depth4,
  },
  link: {
    selectors: {
      '&:hover': { background: 'transparent' },
      '&:active': { background: 'transparent' },
    },
  },
};

export const scrollableStack: IStackStyles = {
  root: {
    overflow: 'auto',
  },
};
