/* eslint-disable no-unused-vars */
import { mergeStyleSets, FocusZone, FocusZoneDirection } from "@fluentui/react";
import { CitationItem, MetaData } from "citeproc";
import React, { ReactElement } from "react";
import DocumentView from "./DocumentView";

export interface bib extends MetaData, CitationItem {
  isSelected: boolean;
}

interface ReferenceListProps {
  referenceList: Array<MetaData>;
}
const classNames = mergeStyleSets({
  container: {
    overflow: "auto",
    webkitBoxFlex: "1 1 auto",
  },
});

function DocumentList({ referenceList }: ReferenceListProps): ReactElement {
  return (
    <FocusZone
      direction={FocusZoneDirection.vertical}
      className={classNames.container}
    >
      <ul>
        {referenceList.map((document) => (
          <DocumentView document={document} />
        ))}
      </ul>
    </FocusZone>
  );
}

export default DocumentList;
