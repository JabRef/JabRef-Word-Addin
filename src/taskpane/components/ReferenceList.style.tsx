import { mergeStyleSets } from '@fluentui/react';

const classNames = mergeStyleSets({
  container: {
    flexDirection: 'row',
    overflow: 'auto',
    flex: '1 1 auto',
  },
});

export default classNames;
