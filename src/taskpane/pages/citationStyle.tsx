import React from "react";
import { FocusZone, FocusZoneDirection } from "@fluentui/react/lib/FocusZone";
import { List } from "@fluentui/react/lib/List";
import {
  ITheme,
  mergeStyleSets,
  getTheme,
  getFocusStyle,
} from "@fluentui/react/lib/Styling";
import { Stack } from "@fluentui/react";
import Preference from "../../utils/user-preference";
import CiteSupport from "../../utils/citesupport";

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

interface CitationStyleProps {
  citeSupport: CiteSupport;
}

function CitationStyle({ citeSupport }: CitationStyleProps): JSX.Element {
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
  const preferenceStyle = Preference.getCitationStyle();
  const [currentStyle, setCurrentStyle] = React.useState(preferenceStyle);
  const onClick = async (
    ev: React.FormEvent<HTMLElement | HTMLInputElement>
  ) => {
    setCurrentStyle(ev.currentTarget.id);
    Preference.setCitationStyle(ev.currentTarget.id);
    await citeSupport.initDocument();
  };

  // Sync with doc settings
  React.useEffect(() => {
    return Preference.syncPreference();
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
      <div className={classNames.selectedStyle}>
        {currentStyle
          ? items.find((item) => item.value === currentStyle).text
          : "American Political Science Association"}
      </div>
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
