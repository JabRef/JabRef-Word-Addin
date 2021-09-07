import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { PrimaryButton, DefaultButton } from "@fluentui/react";
import { CitationItem } from "citeproc";
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

function resetReferenceState(item: bib): bib {
  return {
    ...item,
    isSelected: false,
    label: null,
    locator: null,
    prefix: null,
    suffix: null,
  };
}

function Dashboard({ citeSupport }: DashboardProps): ReactElement {
  const originalItems = data.map((item) => ({
    ...item,
    label: null,
    locator: null,
    suffix: null,
    prefix: null,
    isSelected: false,
  }));
  const [referenceList, setReferenceList] = useState<Array<bib>>(originalItems);
  const [citationItems, _setCitationItems] = useState([]);
  const [citationSelected, setCitationSelected] = useState<boolean>(false);
  const itemsInSelectedCitation = useRef(citationItems);
  const setItemsInSelectedCitation = (itemsMetadata: Array<CitationItem>) => {
    itemsInSelectedCitation.current = itemsMetadata;
    _setCitationItems(itemsMetadata);
  };

  const checkedItems = referenceList.filter(({ isSelected }) => isSelected);

  const resetAllReferences = () => {
    setReferenceList((currentItems) => {
      return currentItems.map(resetReferenceState);
    });
  };

  const onFilterChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    keyword: string
  ): void => {
    setReferenceList(originalItems.filter(containsSearchTerm(keyword)));
  };

  const handleToggleChange = (
    ev: React.FormEvent<HTMLElement | HTMLInputElement>
  ) => {
    setReferenceList((currentItems) => {
      return currentItems.map(onCheckboxChange(ev));
    });
  };

  const insertCitation = async () => {
    if (citationSelected && !checkedItems.length) {
      await citeSupport.wordApi.removeSelectedCitation();
    } else {
      await citeSupport.insertCitation(checkedItems, citationSelected);
      resetAllReferences();
    }
  };

  const setReferenceState = (itemsMetadata: Array<CitationItem>) => {
    setReferenceList((currentItems) => {
      return currentItems.map((item) => {
        const metadata = itemsMetadata.find(
          (metaData) => metaData.id === item.id
        );
        if (metadata) {
          return {
            ...item,
            ...metadata,
            isSelected: true,
          };
        }
        return item;
      });
    });
  };

  const discardEdit = () => {
    resetAllReferences();
    setReferenceState(itemsInSelectedCitation.current);
  };

  const isCitationEdited = (): boolean => {
    return (
      JSON.stringify(checkedItems.map((citation) => ({ ...citation }))) ===
      JSON.stringify(itemsInSelectedCitation.current)
    );
  };

  const updateCitationMetaData = (citation: CitationItem) => {
    setReferenceList((currentItems) => {
      return currentItems.map((item) => {
        if (item.id === citation.id) {
          return {
            ...item,
            ...citation,
          };
        }
        return item;
      });
    });
  };

  const getSelectedCitation = useCallback(async (): Promise<void> => {
    const itemsInCitation =
      await citeSupport.wordApi.getItemsInSelectedCitation();
    const isCitationValue = await citeSupport.wordApi.isCitationSelected();
    if (itemsInSelectedCitation) {
      resetAllReferences();
      setReferenceState(itemsInCitation);
      setItemsInSelectedCitation(itemsInCitation);
      setCitationSelected(() => isCitationValue);
    } else if (itemsInSelectedCitation.current.length) {
      resetAllReferences();
      setItemsInSelectedCitation([]);
    }
  }, [citeSupport.wordApi]);

  useEffect(() => {
    citeSupport.wordApi.addEventListener(getSelectedCitation);
    return () => citeSupport.wordApi.removeEventListener();
  }, [citeSupport.wordApi, getSelectedCitation]);

  return (
    <div style={dashboadStyle}>
      <SearchField onFilterChange={onFilterChange} />
      <ReferenceList
        list={referenceList}
        metaDataHandler={updateCitationMetaData}
        onCheckBoxChange={handleToggleChange}
      />
      {checkedItems.length && !itemsInSelectedCitation.current.length ? (
        <div style={buttonContainer}>
          <PrimaryButton onClick={insertCitation}>
            Insert {checkedItems.length}{" "}
            {checkedItems.length > 1 ? "citations" : "citation"}
          </PrimaryButton>
          <DefaultButton onClick={resetAllReferences} style={{ marginLeft: 8 }}>
            Cancel
          </DefaultButton>
        </div>
      ) : null}
      {citationSelected ? (
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
