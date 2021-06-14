import * as React from "react";
import { FocusZone, FocusZoneDirection } from "@fluentui/react/lib/FocusZone";

import { List } from "@fluentui/react/lib/List";
import { ITheme, mergeStyleSets, getTheme, getFocusStyle } from "@fluentui/react/lib/Styling";
import { createListItems, IExampleItem } from "@fluentui/example-data";
import { useConst } from "@fluentui/react-hooks";
import { ISearchBoxStyles, SearchBox } from "@fluentui/react";

const theme: ITheme = getTheme();
const { palette, semanticColors, fonts } = theme;
const searchBoxStyle: ISearchBoxStyles = {
  root: {
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
  },
};

interface ReferenceListProps {}
const classNames = mergeStyleSets({
  container: {
    overflow: "auto",
    maxHeight: 500,
    marginLeft: 8,
    marginRight: 8,
  },
  itemCell: [
    getFocusStyle(theme, { inset: -1 }),
    {
      minHeight: 54,
      padding: 10,
      boxSizing: "border-box",
      borderBottom: `1px solid ${semanticColors.bodyDivider}`,
      display: "flex",
      selectors: {
        "&:hover": { background: palette.neutralLight },
      },
    },
  ],
  itemContent: {
    marginLeft: 10,
    overflow: "hidden",
    flexGrow: 1,
  },
  itemName: [
    fonts.xLarge,
    {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  ],
  itemIndex: {
    fontSize: fonts.small.fontSize,
    color: palette.neutralTertiary,
    marginBottom: 10,
  },
  chevron: {
    alignSelf: "center",
    marginLeft: 10,
    color: palette.neutralTertiary,
    fontSize: fonts.large.fontSize,
    flexShrink: 0,
  },
});

const onRenderCell = (item: IExampleItem, index: number): JSX.Element => {
  return (
    <div className={classNames.itemCell} data-is-focusable={true}>
      <div className={classNames.itemContent}>
        <div className={classNames.itemName}>{item.name}</div>
        <div className={classNames.itemIndex}>{`Item ${index}`}</div>
      </div>
    </div>
  );
};

export const ReferenceList: React.FC<ReferenceListProps> = () => {
  const originalItems = useConst(() => createListItems(5000));
  const [items, setItems] = React.useState(originalItems);
  const onFilterChanged = (_: any, text: string): void => {
    setItems(originalItems.filter((item) => item.name.toLowerCase().indexOf(text.toLowerCase()) >= 0));
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
