/* eslint-disable no-unused-vars */
import React from "react";
import {
  Checkbox,
  getFocusStyle,
  getTheme,
  ITheme,
  mergeStyleSets,
} from "@fluentui/react";
import { CitationItem, MetaData } from "citeproc";
import EditCitation from "./EditCitation";

interface DocumentViewProps {
  document: MetaData;
  selectedDocuments: Array<CitationItem>;
  metaDataHandler: (metadata: CitationItem) => void;
  handleSelection: (id: string, checked: boolean) => void;
}

const theme: ITheme = getTheme();
const { palette, semanticColors, fonts } = theme;
const classNames = mergeStyleSets({
  itemCell: [
    getFocusStyle(theme, { inset: -1 }),
    {
      backgroundColor: theme.palette.neutralLighterAlt,
      minHeight: 54,
      padding: "0.25rem",
      margin: 2,
      boxSizing: "border-box",
      borderBottom: `1px solid ${semanticColors.bodyDivider}`,
      display: "flex",
      selectors: {
        "&:hover": { background: palette.themeLighterAlt },
      },
    },
  ],
  itemContent: {
    marginLeft: 10,
    boxSizing: "border-box",
    overflow: "auto",
    flexGrow: 1,
  },
  itemTitle: [
    fonts.mediumPlus,
    {
      whiteSpace: "nowrap",
      position: "relative",
      maxHeight: "5.4em",
      lineHeight: "1.8em",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  ],
  itemAuthor: {
    fontSize: fonts.small.fontSize,
    color: palette.neutralTertiary,
    marginBottom: 10,
  },
  itemYear: {
    fontSize: fonts.smallPlus,
    color: palette.neutralTertiary,
  },
  itemType: {
    fontSize: fonts.smallPlus,
    color: palette.neutralTertiary,
  },
  checkbox: {
    marginTop: 6,
    marginLeft: 4,
  },
});

const DocumentView: React.FC<DocumentViewProps> = ({
  document,
  selectedDocuments,
  handleSelection,
  metaDataHandler,
}) => {
  return (
    <li className={classNames.itemCell} data-is-focusable>
      <div style={{ display: "flex", flexDirection: "column" as const }}>
        <Checkbox
          className={classNames.checkbox}
          checked={
            !!selectedDocuments.find((citation) => citation.id === document.id)
          }
          onChange={(_e, checked) => {
            handleSelection(document.id, checked);
          }}
        />
        {!!selectedDocuments.find(
          (citation) => citation.id === document.id
        ) && (
          <EditCitation
            document={document}
            metaDataHandler={metaDataHandler}
            selectedDocuments={selectedDocuments}
          />
        )}
      </div>
      <div className={classNames.itemContent}>
        <div className={classNames.itemType}>{document.type}</div>
        <div className={classNames.itemTitle}>{document.title}</div>
        {/* <div className={classNames.itemAuthor}>{item.author}</div>
          <div className={classNames.itemYear}>
            {item.journal} {item.year}
          </div> */}
      </div>
    </li>
  );
};

export default DocumentView;