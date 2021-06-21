import { IStackStyles, DefaultPalette, Stack } from "@fluentui/react";
import React from "react";
import data from "../../utils/data";
import { ReferenceList } from "../components/ReferenceList";
import SearchField from "../components/SearchField";
// /* global Word */

const stackStyles: IStackStyles = {
  root: {
    background: DefaultPalette.white,
    overflow: "auto",
  },
};

function Dashboard() {
  const originalItems = data;
  const [items, setItems] = React.useState(originalItems);
  const onFilterChange = (_: any, text: string): void => {
    setItems(originalItems.filter((item) => item.title.toLowerCase().indexOf(text.toLowerCase()) >= 0));
  };
  return (
    <Stack verticalFill={true} grow disableShrink={false} styles={stackStyles}>
      <SearchField onFlterChange={onFilterChange} />
      <ReferenceList list={items} />
    </Stack>
  );
}
export default Dashboard;
