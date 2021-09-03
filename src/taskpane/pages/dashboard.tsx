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
  ISearchBoxProps,
} from "@fluentui/react";
import { Author } from "citeproc";
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
  return (item: bib) => {
    return [item.title, item.author, item.year].some(
      (str?: string | number | Array<Author>) =>
        str?.toString().toLowerCase().includes(keyword.toLowerCase().trim())
    );
  };
}

function onCheckboxChange(
  event?: React.FormEvent<HTMLElement | HTMLInputElement>
) {
  return (item: bib) => {
    if (event?.currentTarget && item.title === event.currentTarget.title) {
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
  const [citationItemsIDs, _setCitationItemsIDs] = useState<Array<string>>([]);
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

  const onFilterChange: ISearchBoxProps["onChange"] = (_, newValue?): void => {
    if (newValue) {
      setItems(originalItems.filter(containsSearchTerm(newValue)));
    }
  };

  const handleToggleChange = (
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>
  ) => setItems((currentItems) => currentItems.map(onCheckboxChange(ev)));

  const insertCitation = useCallback(
    async function insertCitation() {
      if (isCitationSelected && !checkedItems.length) {
        await citeSupport.wordApi.removeSelectedCitation();
      } else {
        await citeSupport.insertCitation(checkedItems, isCitationSelected);
        unCheckAllCheckboxes();
      }
    },
    [checkedItems, citeSupport, isCitationSelected]
  );

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
    } else if (itemsIDsInSelectedCitation.current.length) {
      unCheckAllCheckboxes();
      setCitationItemsIDs([]);
    }
  }, [citeSupport.wordApi]);

  useEffect(() => {
    citeSupport.wordApi.addEventListener(getSelectedCitation);
    return () => citeSupport.wordApi.removeEventListener();
  }, [citeSupport.wordApi, getSelectedCitation]);

  return (
    <div style={dashboadStyle}>
      <SearchField onChange={onFilterChange} />
      <ReferenceList list={items} onCheckBoxChange={handleToggleChange} />
      {checkedItems.length && !itemsIDsInSelectedCitation.current.length ? (
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
      {isCitationSelected ? (
        <div style={buttonContainer}>
          <PrimaryButton onClick={insertCitation} disabled={isCitationEdited()}>
            Save changes
          </PrimaryButton>
          <DefaultButton
            onClick={discardEdit}
            style={{ marginLeft: 8 }}
            disabled={isCitationEdited()}
          >
            Cancel
          </DefaultButton>
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;
