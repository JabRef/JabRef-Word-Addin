/* eslint-disable no-unused-vars */
import {
  ITheme,
  getTheme,
  List,
  mergeStyleSets,
  getFocusStyle,
  FocusZone,
  FocusZoneDirection,
  Checkbox,
  IDropdownOption,
} from "@fluentui/react";
import { MetaData } from "citeproc";
import React, { ReactElement } from "react";
import EditCitation, { citationMetaData } from "./EditCitation";

const theme: ITheme = getTheme();
const { palette, semanticColors, fonts } = theme;
export interface bib extends MetaData {
  isSelected: boolean;
  label: string;
  locator: string;
  suffix: string;
  prefix: string;
  "suppress-author": boolean;
}

interface ReferenceListProps {
  list: Array<bib>;
  metaDataHandler: (metadata: citationMetaData) => void;
  onCheckBoxChange: (
    ev?: React.FormEvent<HTMLInputElement | HTMLElement>,
    checked?: boolean
  ) => void;
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

function ReferenceList(props: ReferenceListProps): ReactElement {
  const { list } = props;
  const onRenderCell = (item: bib): JSX.Element => {
    return (
      <div className={classNames.itemCell} data-is-focusable>
        <Checkbox
          className={classNames.checkbox}
          title={item.title}
          checked={item.isSelected}
          onChange={props.onCheckBoxChange}
        />
        <EditCitation
          metaDataHandler={props.metaDataHandler}
          id={item.id}
          labelProp={item.label}
          locatorProp={item.locator}
          prefixProp={item.prefix}
          suffixProp={item.prefix}
          isAuthorSuppressProp={item["suppress-author"]}
        />
        <div className={classNames.itemContent}>
          <div className={classNames.itemType}>{item.type}</div>
          <div className={classNames.itemTitle}>{item.title}</div>
          {/* <div className={classNames.itemAuthor}>{item.author}</div>
          <div className={classNames.itemYear}>
            {item.journal} {item.year}
          </div> */}
        </div>
      </div>
    );
  };

  return (
    <FocusZone
      direction={FocusZoneDirection.vertical}
      className={classNames.container}
    >
      <List items={list} onRenderCell={onRenderCell} />
    </FocusZone>
  );
}

export default ReferenceList;
