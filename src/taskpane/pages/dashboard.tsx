import React, { useState } from "react";
import data from "../../utils/data";
import ReferenceList from "../components/ReferenceList";
import SearchField from "../components/SearchField";
// /* global Word */

function containsSearchTerm(keyword: string) {
  return function (item) {
    try {
      return (
        item.title.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 ||
        item.author.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 ||
        item.year.indexOf(keyword) >= 0
      );
    } catch (e) {
      return false;
    }
  };
}

function Dashboard() {
  const originalItems = data;
  const [items, setItems] = useState(originalItems);
  const [checkedItems, setCheckedItems] = useState([]);

  const onFilterChange = (_: any, keyword: string): void => {
    setItems(originalItems.filter(containsSearchTerm(keyword)));
  };

  const onCheckBoxChange = async (ev: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked: boolean) => {
    const array = items.filter((item) => item.title === ev.currentTarget.title);
    if (isChecked) {
      setCheckedItems((prev) => [...prev, ...array]);
    } else {
      setCheckedItems((prev) => {
        const index = prev.indexOf(array[0]);
        if (index > -1) {
          prev.splice(index, 1);
        }
        return [...prev];
      });
    }
  };

  return (
    <>
      <SearchField onFlterChange={onFilterChange} />
      <ReferenceList list={items} onCheckBoxChange={onCheckBoxChange} />
    </>
  );
}

export default Dashboard;
