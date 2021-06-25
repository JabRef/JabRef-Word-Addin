import React, { useState } from "react";
import data from "../../utils/data";
import ReferenceList from "../components/ReferenceList";
import SearchField from "../components/SearchField";
// /* global Word */

function Dashboard() {
  const originalItems = data.map((item) => ({ ...item, isChecked: false }));
  const [items, setItems] = useState(originalItems);
  const selectedItems = items.filter((items) => items.isChecked);

  const onFilterChange = (_: any, keyword: string): void => {
    setItems(
      originalItems.filter((item) =>
        [item.title, item.author, item.year].some((str) =>
          str ? str.toLowerCase().includes(keyword.toLowerCase().trim()) : false
        )
      )
    );
  };

  const handleToggleChange = (ev: React.FormEvent<HTMLElement | HTMLInputElement>) => {
    setItems((currentItems) => {
      return currentItems.map((item) => {
        if (item.title === ev.currentTarget.title) {
          return { ...item, isChecked: !item.isChecked };
        }
        return item;
      });
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
