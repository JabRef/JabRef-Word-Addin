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

function resetCitation(item: bib): bib {
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
  const [items, setItems] = useState<Array<bib>>(originalItems);
  const [citationItems, _setCitationItems] = useState([]);
  const [isCitationSelected, setIsCitationSelection] = useState<boolean>(false);
  const itemsInSelectedCitation = useRef(citationItems);
  const setItemsInSelectedCitation = (itemsMetadata: Array<CitationItem>) => {
    itemsInSelectedCitation.current = itemsMetadata;
    _setCitationItems(itemsMetadata);
  };

  const checkedItems = items
    .filter(({ isSelected }) => isSelected)
    .map(({ id, label, locator, prefix, suffix }) => {
      return {
        id,
        label,
        locator,
        prefix,
        suffix,
      };
    });

  const resetAllCitations = () => {
    setItems((currentItems) => {
      return currentItems.map(resetCitation);
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
      resetAllCitations();
    }
  }

  const setCitationItems = (itemsMetadata: Array<CitationItem>) => {
    setItems((currentItems) => {
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
    resetAllCitations();
    setCitationItems(itemsInSelectedCitation.current);
  };

  const isCitationEdited = (): boolean => {
    return (
      JSON.stringify(checkedItems.map((citation) => ({ ...citation }))) ===
      JSON.stringify(itemsInSelectedCitation.current)
    );
  };

  const updateCitationMetaData = (citation: CitationItem) => {
    setItems((currentItems) => {
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
      resetAllCitations();
      setCitationItems(itemsInCitation);
      setItemsInSelectedCitation(itemsInCitation);
      setIsCitationSelection(() => isCitationValue);
    } else if (itemsInSelectedCitation.current.length) {
      resetAllCitations();
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
        list={items}
        metaDataHandler={updateCitationMetaData}
        onCheckBoxChange={handleToggleChange}
      />
      {checkedItems.length && !itemsInSelectedCitation.current.length ? (
        <div style={buttonContainer}>
          <PrimaryButton onClick={insertCitation}>
            Insert {checkedItems.length}{" "}
            {checkedItems.length > 1 ? "citations" : "citation"}
          </PrimaryButton>
          <DefaultButton onClick={resetAllCitations} style={{ marginLeft: 8 }}>
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
