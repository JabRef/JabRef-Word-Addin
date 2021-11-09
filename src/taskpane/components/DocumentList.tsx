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
  selectedItems: Array<CitationItem>;
  metaDataHandler: (metadata: CitationItem) => void;
  handleSelection: (id: string, checked?: boolean) => void;
}
const classNames = mergeStyleSets({
  container: {
    overflow: "auto",
    padding: "0.25rem 0.25rem 0px",
    webkitBoxFlex: "1 1 auto",
  },
});

function DocumentList({
  referenceList,
  selectedItems,
  handleSelection,
  metaDataHandler,
}: ReferenceListProps): ReactElement {
  return (
    <FocusZone
      direction={FocusZoneDirection.vertical}
      className={classNames.container}
    >
      <ul>
        {referenceList.map((document) => (
          <DocumentView
            document={document}
            metaDataHandler={metaDataHandler}
            selectedDocuments={selectedItems}
            handleSelection={handleSelection}
          />
        ))}
      </ul>
    </FocusZone>
  );
}

export default DocumentList;
