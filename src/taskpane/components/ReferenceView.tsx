/* eslint-disable no-unused-vars */
import React from "react";
import {
  Checkbox,
  getFocusStyle,
  getTheme,
  ITheme,
  mergeStyleSets,
} from "@fluentui/react";
import { MetaData } from "citeproc";
import EditCitation from "../pages/editCitation";
import { useCitationStore } from "../contexts/CitationStoreContext";

interface ReferenceViewProps {
  document: MetaData;
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

const ReferenceView: React.FC<ReferenceViewProps> = ({ document }) => {
  const { selectedCitations, dispatch } = useCitationStore();
  return (
    <li key={document.id} className={classNames.itemCell} data-is-focusable>
      <div style={{ display: "flex", flexDirection: "column" as const }}>
        <Checkbox
          className={classNames.checkbox}
          checked={
            !!selectedCitations.find((citation) => citation.id === document.id)
          }
          onChange={(_e, checked) => {
            dispatch({
              type: checked ? "add" : "remove",
              citation: document,
            });
          }}
        />
        {!!selectedCitations.find(
          (citation) => citation.id === document.id
        ) && <EditCitation document={document} />}
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

export default ReferenceView;
