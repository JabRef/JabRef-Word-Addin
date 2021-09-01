import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  PrimaryButton,
  DefaultButton,
  arraysEqual,
  IContextualMenuProps,
  CompoundButton,
} from "@fluentui/react";
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
  padding: 16,
  width: "100%",
  display: "flex",
  flex: "0 0 auto",
  marginTop: "auto",
  alignContent: "flex-start",
  flexDirection: "row" as const,
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
  const [citationMode, setCitationMode] = useState("none");
  const [citationItemsIDs, _setCitationItemsIDs] = useState([]);
  const [isCitationSelected, setIsCitationSelection] = useState(false);
  const itemsIDsInSelectedCitation = useRef(citationItemsIDs);
  const setCitationItemsIDs = (ids: Array<string>) => {
    itemsIDsInSelectedCitation.current = ids;
    _setCitationItemsIDs(ids);
  };

  const checkedItems = items
    .filter((item) => item.isSelected)
    .map((item) => {
      return { id: item.id };
    });

  const unCheckAllCheckboxes = () => {
    setItems((currentItems) => {
      return currentItems.map(unCheckCheckbox);
    });
  };

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

  async function insertCitation() {
    if (isCitationSelected && !checkedItems.length) {
      await citeSupport.wordApi.removeSelectedCitation();
    } else {
      await citeSupport.insertCitation(checkedItems, isCitationSelected);
      unCheckAllCheckboxes();
    }
  }

  const checkItems = (itemIds: Array<string>) => {
    setItems((currentItems) => {
      return currentItems.map((item) => {
        if (itemIds.some((id) => item.id === id)) {
          return { ...item, isSelected: true };
        }
        return item;
      });
    });
  };

  const discardEdit = () => {
    unCheckAllCheckboxes();
    checkItems(itemsIDsInSelectedCitation.current);
  };

  const isCitationEdited = (): boolean => {
    return arraysEqual(
      checkedItems.map((i) => i.id),
      itemsIDsInSelectedCitation.current
    );
  };

  const getSelectedCitation = useCallback(async (): Promise<void> => {
    const getItemsIDInCitation =
      await citeSupport.wordApi.getItemsInSelectedCitation();
    const isCitationValue = await citeSupport.wordApi.isCitationSelected();
    if (getItemsIDInCitation) {
      unCheckAllCheckboxes();
      setCitationItemsIDs(getItemsIDInCitation);
      setIsCitationSelection(() => isCitationValue);
      checkItems(getItemsIDInCitation);
    } else if (itemsIDsInSelectedCitation.current.length && !isCitationValue) {
      unCheckAllCheckboxes();
      setCitationItemsIDs([]);
    }
  }, [citeSupport.wordApi]);

  useEffect(() => {
    citeSupport.wordApi.addEventListener(getSelectedCitation);
    return () => citeSupport.wordApi.removeEventListener();
  }, [citeSupport.wordApi, getSelectedCitation]);

  const onModeChange = (ev?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setCitationMode(() => ev.currentTarget.id);
  };
  const menuProps: IContextualMenuProps = {
    items: [
      {
        id: "author-only",
        key: "author-only",
        text: "Author only",
        iconProps: { iconName: "Contact" },
        onClick: onModeChange,
      },
      {
        id: "suppress-author",
        key: "suppress-author",
        text: "Suppress Author",
        iconProps: { iconName: "Calendar" },
        onClick: onModeChange,
      },
      {
        id: "none",
        key: "none",
        text: "none",
        iconProps: { iconName: "Calendar" },
        onClick: onModeChange,
      },
    ],
  };

  return (
    <div style={dashboadStyle}>
      <SearchField onFilterChange={onFilterChange} />
      <ReferenceList list={items} onCheckBoxChange={handleToggleChange} />
      {checkedItems.length && !itemsIDsInSelectedCitation.current.length ? (
        <div style={buttonContainer}>
          <CompoundButton
            primary
            text={`Insert ${checkedItems.length} 
            ${checkedItems.length > 1 ? "citations" : "citation"}`}
            menuProps={menuProps}
            secondaryText={citationMode}
            split
            splitButtonAriaLabel="See 2 options"
            aria-roledescription="split button"
            onClick={insertCitation}
          />
          <CompoundButton
            text="Cancel"
            onClick={unCheckAllCheckboxes}
            style={{ marginLeft: 8 }}
          />
        </div>
      ) : null}
      {isCitationSelected ? (
        <div style={buttonContainer}>
          <PrimaryButton
            text="Save changes"
            split
            splitButtonAriaLabel="See 2 options"
            aria-roledescription="split button"
            menuProps={menuProps}
            onClick={insertCitation}
            disabled={isCitationEdited()}
          />
          <DefaultButton
            text="Cancel"
            onClick={discardEdit}
            style={{ marginLeft: 8 }}
            disabled={isCitationEdited()}
          />
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;
