/* eslint-disable no-unused-vars */
import { FocusZone, FocusZoneDirection, List } from '@fluentui/react';
import { CitationItem, MetaData } from 'citeproc';
import React, { ReactElement } from 'react';
import classNames from './ReferenceList.style';
import ReferenceView from './ReferenceView';

export interface BibItem extends MetaData, CitationItem {
  isSelected: boolean;
}

interface ReferenceListProps {
  referenceList: Array<MetaData>;
}

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
