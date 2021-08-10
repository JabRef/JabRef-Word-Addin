import React, { ReactElement, useState } from "react";
import { PrimaryButton, DefaultButton } from "@fluentui/react";
import data from "../../utils/data";
import ReferenceList, { bib } from "../components/ReferenceList";
import SearchField from "../components/SearchField";
import CiteSupport from "../../utils/citesupport";

interface DashboardProps {
  citeSupport: CiteSupport;
}

const dashboadStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  overflow: "hidden",
  flexDirection: "column" as const,
};

const buttonContainer = {
  display: "flex",
  flexDirection: "row" as const,
  marginTop: "auto",
  flex: "0 0 auto",
  width: "100%",
  alignContent: "flex-start",
  padding: 16,
};

function containsSearchTerm(keyword: string) {
  return (item?: bib) => {
    return [item.title, item.author, item.year].some((str: string | number) =>
      str
        ? str.toString().toLowerCase().includes(keyword.toLowerCase().trim())
        : false
    );
  };
}

function onCheckboxChange(ev: React.FormEvent<HTMLElement | HTMLInputElement>) {
  return (item: bib) => {
    if (ev.currentTarget && item.title === ev.currentTarget.title) {
      return { ...item, isSelected: !item.isSelected };
    }
    return item;
  };
}

function unCheckCheckbox(item: bib): bib {
  return { ...item, isSelected: false };
}

function Dashboard({ citeSupport }: DashboardProps): ReactElement {
  const originalItems = data.map((item) => ({ ...item, isSelected: false }));
  const [items, setItems] = useState(originalItems);
  const checkedItems = items
    .filter((item) => item.isSelected)
    .map((item) => {
      return { id: item.id };
    });

  const onFilterChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    keyword: string
  ): void => {
    setItems(originalItems.filter(containsSearchTerm(keyword)));
  };

  const handleToggleChange = (
    ev: React.FormEvent<HTMLElement | HTMLInputElement>
  ) => {
    setItems((currentItems) => {
      return currentItems.map(onCheckboxChange(ev));
    });
  };

  const unCheckAllCheckboxes = () => {
    setItems((currentItems) => {
      return currentItems.map(unCheckCheckbox);
    });
  };

  async function insertCitation() {
    await citeSupport.insertCitation(checkedItems);
    unCheckAllCheckboxes();
  }

  return (
    <div style={dashboadStyle}>
      <SearchField onFilterChange={onFilterChange} />
      <ReferenceList list={items} onCheckBoxChange={handleToggleChange} />
      {checkedItems.length ? (
        <div style={buttonContainer}>
          <PrimaryButton onClick={insertCitation}>
            Insert {checkedItems.length}{" "}
            {checkedItems.length > 1 ? "citations" : "citation"}
          </PrimaryButton>
          <DefaultButton
            onClick={unCheckAllCheckboxes}
            style={{ marginLeft: 8 }}
          >
            Cancel
          </DefaultButton>
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;
