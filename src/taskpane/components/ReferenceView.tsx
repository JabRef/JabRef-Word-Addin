import React from "react";
import {
  Checkbox,
  getFocusStyle,
  getTheme,
  ITheme,
  mergeStyleSets,
  Separator,
} from "@fluentui/react";
import { MetaData } from "citeproc";
import EditCitation from "../pages/editCitation";
import { useCitationStore } from "../contexts/CitationStoreContext";

interface ReferenceViewProps {
  document: MetaData;
}

const theme: ITheme = getTheme();
const { palette, fonts } = theme;
const classNames = mergeStyleSets({
  itemCell: [
    getFocusStyle(theme, { inset: -1 }),
    {
      backgroundColor: theme.palette.white,
      cursor: "default",
      width: "90%",
      margin: "0 auto",
      flex: "0 0 auto",
      display: "flex",
      flexDirection: "row",
      boxSizing: "border-box",
    },
  ],
  itemContent: {
    flexGrow: 1,
    display: "flex",
    overflow: "auto",
    paddingLeft: "0.25rem",
    boxSizing: "border-box",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  itemTitle: [
    fonts.medium,
    {
      display: "block",
      overflow: "hidden",
      maxHeight: "3.6em",
      lineHeight: "1.8em",
      wordWrap: "break-word",
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
    fontSize: fonts.mediumPlus,
    color: palette.neutralTertiary,
  },
});

const buttonContainerStyle = {
  display: "flex",
  paddingTop: "0.1rem",
  flexDirection: "column" as const,
  justifyContent: "space-between",
  alignItems: "center",
  boxSizing: "border-box" as const,
  width: "30px",
  flexGrow: 0,
  flexShrink: 0,
};
const ReferenceView: React.FC<ReferenceViewProps> = ({ document }) => {
  const { selectedCitations, dispatch } = useCitationStore();
  return (
    <>
      <li key={document.id} className={classNames.itemCell} data-is-focusable>
        <div style={buttonContainerStyle}>
          <Checkbox
            checked={
              !!selectedCitations.find(
                (citation) => citation.id === document.id
              )
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
      <Separator />
    </>
  );
};

export default ReferenceView;
