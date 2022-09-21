/* eslint-disable no-unused-vars */
import { mergeStyleSets, FocusZone, FocusZoneDirection, List } from '@fluentui/react';
import { CitationItem, MetaData } from 'citeproc';
import React, { ReactElement } from 'react';
import ReferenceView from './ReferenceView';

export interface bib extends MetaData, CitationItem {
  isSelected: boolean;
}

interface ReferenceListProps {
  referenceList: Array<MetaData>;
}
const classNames = mergeStyleSets({
  container: {
    flexDirection: 'row',
    overflow: 'auto',
    flex: '1 1 auto',
  },
});

function ReferenceList({ referenceList }: ReferenceListProps): ReactElement {
  return (
    <FocusZone
      data-is-scrollable
      className={classNames.container}
      direction={FocusZoneDirection.vertical}
    >
      <List items={referenceList} onRenderCell={(item) => <ReferenceView document={item} />} />
    </FocusZone>
  );
}

export default ReferenceList;
