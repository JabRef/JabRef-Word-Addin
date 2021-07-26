import * as React from "react";
import { FocusZone, FocusZoneDirection } from "@fluentui/react/lib/FocusZone";
import { List } from "@fluentui/react/lib/List";
import {
  ITheme,
  mergeStyleSets,
  getTheme,
  getFocusStyle,
} from "@fluentui/react/lib/Styling";
import { Stack } from "@fluentui/react";

const theme: ITheme = getTheme();
const { palette, semanticColors, fonts } = theme;
const classNames = mergeStyleSets({
  container: {
    overflow: "auto",
    padding: "0.25rem 0.25rem 0px",
    webkitBoxFlex: "1 1 auto",
  },
  itemCell: [
    getFocusStyle(theme, { inset: -1 }),
    {
      minHeight: 34,
      boxSizing: "border-box",
      padding: "0 25px",
      display: "flex",
      selectors: {
        "&:hover": { background: palette.themeLighterAlt },
      },
    },
  ],
  itemName: [
    fonts.medium,
    {
      padding: "8px 0",
      borderBottom: `1px solid ${semanticColors.bodyDivider}`,
      minWidth: "100%",
    },
  ],
  StyleHeading: [
    fonts.medium,
    {
      color: palette.neutralSecondary,
      fontWeight: "bold",
      padding: 20,
      paddingBottom: 5,
      paddingTop: 15,
    },
  ],
  selectedStyle: [
    fonts.medium,
    {
      color: palette.themeDarkAlt,
      padding: 20,
      paddingBottom: 5,
      paddingTop: 5,
      fontWeight: "bold",
    },
  ],
});

function CitationStyle(): JSX.Element {
  const items = [
    {
      text: "American Political Science Association",
      value: "american-political-science-association",
    },
    { text: "IEEE", value: "ieee" },
    {
      text: "American Sociological Association 6th edition",
      value: "american-sociological-association",
    },
    {
      text: "American Psychological Association 7th edition",
      value: "advances-in-complex-systems",
    },
    {
      text: "Chicago Manual of Style 16th edition (author-date)",
      value: "chicago-author-date-16th-edition",
    },
  ];
  const preferenceStyle = Office.context.document.settings.get("Style") as
    | string
    | null;
  const selectedStyle = preferenceStyle
    ? items.find((item) => item.value === preferenceStyle).text
    : "American Psychological Association 7th edition";
  const [currentStyle, setCurrentStyle] = React.useState(selectedStyle);
  const onClick = (ev: React.FormEvent<HTMLElement | HTMLInputElement>) => {
    setCurrentStyle(
      items.find((item) => item.value === ev.currentTarget.id).text
    );
    Office.context.document.settings.set("Style", ev.currentTarget.id);
  };

  // Sync with doc settings
  React.useEffect(() => {
    return Office.context.document.settings.saveAsync();
  });

  const onRenderCell = (item: { text: string; value: string }): JSX.Element => {
    return (
      <Stack className={classNames.itemCell} data-is-focusable>
        <Stack
          key={item.value}
          id={item.value}
          className={classNames.itemName}
          onClick={onClick}
          onKeyDown={onClick}
        >
          {item.text}
        </Stack>
      </Stack>
    );
  };

  return (
    <>
      <div className={classNames.StyleHeading}>Current Style</div>
      <div className={classNames.selectedStyle}>{currentStyle}</div>
      <div className={classNames.StyleHeading}>Change Style</div>
      <div className={classNames.container}>
        <FocusZone direction={FocusZoneDirection.vertical} data-is-scrollable>
          <List items={items} onRenderCell={onRenderCell} />
        </FocusZone>
      </div>
    </>
  );
}

export default CitationStyle;
