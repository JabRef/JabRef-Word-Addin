import { Button } from "@fluentui/react";
import React, { useState } from "react";
import data from "../../utils/data";
import ReferenceList from "../components/ReferenceList";
import SearchField from "../components/SearchField";
// /* global Word */

function containsSearchTerm(keyword: string) {
  return function (item) {
    return [item.title, item.author, item.year].some((str) =>
      str ? str.toLowerCase().includes(keyword.toLowerCase().trim()) : false
    );
  };
}
function onCheckboxChange(ev: React.FormEvent<HTMLElement | HTMLInputElement>) {
  return function (item) {
    if (item.title === ev.currentTarget.title) {
      return { ...item, isChecked: !item.isChecked };
    }
    return item;
  };
}
function unCheckAllCheckbox(item) {
  if (item.isChecked) {
    return { ...item, isChecked: !item.isChecked };
  }
  return item;
}
function Dashboard() {
  const originalItems = data.map((item) => ({ ...item, isChecked: false }));
  const [items, setItems] = useState(originalItems);
  const checked = items.filter(({ isChecked }) => isChecked).map(({ id }) => id);
  console.log(checked);

  const onFilterChange = (_: any, keyword: string): void => {
    setItems(originalItems.filter(containsSearchTerm(keyword)));
  };

  const handleToggleChange = (ev: React.FormEvent<HTMLElement | HTMLInputElement>) => {
    setItems((currentItems) => {
      return currentItems.map(onCheckboxChange(ev));
    });
  };

  const unCheckAllEntries = () => {
    setItems((currentItems) => {
      return currentItems.map(unCheckAllCheckbox);
    });
  };

  return (
    <>
      <Button onClick={unCheckAllEntries}></Button>
      <SearchField onFilterChange={onFilterChange} />
      <ReferenceList list={items} onCheckBoxChange={handleToggleChange} />
    </>
  );
}

export default Dashboard;
