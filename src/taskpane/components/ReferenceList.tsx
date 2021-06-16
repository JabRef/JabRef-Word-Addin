import * as React from "react";
import { FocusZone, FocusZoneDirection } from "@fluentui/react/lib/FocusZone";

import { List } from "@fluentui/react/lib/List";
import { ITheme, mergeStyleSets, getTheme, getFocusStyle } from "@fluentui/react/lib/Styling";
import { Checkbox, ISearchBoxStyles, SearchBox } from "@fluentui/react";
import data from "../../Utils/data";

const theme: ITheme = getTheme();
const { palette, semanticColors, fonts } = theme;
const searchBoxStyle: ISearchBoxStyles = {
  root: {
    margin: 8,
  },
};

interface ReferenceListProps {}
const classNames = mergeStyleSets({
  container: {
    overflow: "auto",
    maxHeight: 450,
    marginLeft: 8,
    marginRight: 8,
  },
  itemCell: [
    getFocusStyle(theme, { inset: -1 }),
    {
      backgroundColor: theme.palette.neutralLighterAlt,
      minHeight: 54,
      padding: 8,
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
  chevron: {
    alignSelf: "center",
    marginLeft: 10,
    color: palette.neutralTertiary,
    fontSize: fonts.large.fontSize,
    flexShrink: 0,
  },
});

const onRenderCell = (item: typeof data): JSX.Element => {
  return (
    <div className={classNames.itemCell} data-is-focusable={true}>
      <Checkbox defaultChecked={false} onChange={() => console.log("hello")} />
      <div className={classNames.itemContent}>
        <div className={classNames.itemType}>{item.type}</div>
        <div className={classNames.itemTitle}>{item.title}</div>
        <div className={classNames.itemAuthor}>{item.author}</div>
        <div className={classNames.itemYear}>
          {item.journal} {item.year}
        </div>
      </div>
    </div>
  );
};

export const ReferenceList: React.FC<ReferenceListProps> = () => {
  const originalItems = data;
  const [items, setItems] = React.useState(originalItems);
  const onFilterChanged = (_: any, text: string): void => {
    setItems(originalItems.filter((item) => item.title.toLowerCase().indexOf(text.toLowerCase()) >= 0));
  };

  return (
    <FocusZone direction={FocusZoneDirection.vertical}>
      <SearchBox styles={searchBoxStyle} placeholder="Search" underlined={true} onChange={onFilterChanged} />
      <div className={classNames.container} data-is-scrollable>
        <List items={items} onRenderCell={onRenderCell} />
      </div>
    </FocusZone>
  );
};
