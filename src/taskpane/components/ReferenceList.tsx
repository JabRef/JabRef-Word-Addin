import {
  ITheme,
  getTheme,
  List,
  mergeStyleSets,
  getFocusStyle,
  FocusZone,
  FocusZoneDirection,
  Checkbox,
} from "@fluentui/react";
import React from "react";
import { BibliographyEntry } from "../../utils/data";

const theme: ITheme = getTheme();
const { palette, semanticColors, fonts } = theme;
interface bib extends BibliographyEntry {
  isSelected: boolean;
}

interface ReferenceListProps {
  list: Array<bib>;
  // eslint-disable-next-line no-unused-vars
  onCheckBoxChange: (ev?: React.FormEvent<HTMLInputElement | HTMLElement>, checked?: boolean) => void;
}
const classNames = mergeStyleSets({
  container: {
    overflow: "auto",
    padding: "0.25rem 0.25rem 0px",
    webkitBoxFlex: "1 1 auto",
  },
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
    color: palette.neutralDark,
    marginBottom: 10,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  itemYear: {
    fontSize: fonts.smallPlus,
    color: palette.neutralTertiary,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
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

const displayAuthor = (authorList) => {
  let authors = null;
  if (authorList) {
    authors = authorList
      .map((author: { family: string; given: string }) => `${author.given} ${author.family}`)
      .join(", ");
  }
  return <div className={classNames.itemAuthor}>{authors}</div>;
};

function ReferenceList(props: ReferenceListProps) {
  const onRenderCell = (item: bib): JSX.Element => {
    return (
      <div className={classNames.itemCell} data-is-focusable={true}>
        <Checkbox
          className={classNames.checkbox}
          title={item.title}
          checked={item.isSelected}
          onChange={props.onCheckBoxChange}
        />
        <div className={classNames.itemContent}>
          <div className={classNames.itemType}>{item.type}</div>
          <div className={classNames.itemTitle}>{item.title}</div>
          {displayAuthor(item.author)}
          <div className={classNames.itemYear}>
            {item["container-title"]} {item.issued["date-parts"][0][0]}
          </div>
        </div>
      </div>
    );
  };

  return (
    <FocusZone direction={FocusZoneDirection.vertical} className={classNames.container}>
      <List items={props.list} onRenderCell={onRenderCell} />
    </FocusZone>
  );
}

export default ReferenceList;
