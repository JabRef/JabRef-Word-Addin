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
      return { ...item, isSelected: !item.isSelected };
    }
    return item;
  };
}

function Dashboard() {
  const originalItems = data.map((item) => ({ ...item, isSelected: false }));
  const [items, setItems] = useState(originalItems);
  const checked = items.filter((item) => item.isSelected);

  const onFilterChange = (_: any, keyword: string): void => {
    setItems(originalItems.filter(containsSearchTerm(keyword)));
  };

  const handleToggleChange = (ev: React.FormEvent<HTMLElement | HTMLInputElement>) => {
    setItems((currentItems) => {
      return currentItems.map(onCheckboxChange(ev));
    });
  };

  return (
    <>
      <SearchField onFilterChange={onFilterChange} />
      <ReferenceList list={items} onCheckBoxChange={handleToggleChange} />
    </>
  );
}

export default Dashboard;
