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

function unCheckCheckbox(item: bib): bib {
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
    label: "",
    locator: "",
    suffix: "",
    prefix: "",
    isSelected: false,
  }));
  const [items, setItems] = useState<Array<bib>>(originalItems);
  const [citationItemsIDs, _setCitationItemsIDs] = useState([]);
  const [isCitationSelected, setIsCitationSelection] = useState(false);
  const itemsIDsInSelectedCitation = useRef(citationItemsIDs);
  const setCitationItemsIDs = (itemsMetadata: Array<CitationItem>) => {
    itemsIDsInSelectedCitation.current = itemsMetadata;
    _setCitationItemsIDs(itemsMetadata);
  };

  const checkedItems = items
    .filter((item) => item.isSelected)
    .map((item: bib) => {
      return {
        id: item.id,
        label: item.label,
        locator: item.locator,
        prefix: item.prefix,
        suffix: item.suffix,
      };
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

  const checkItems = (itemsMetadata: Array<CitationItem>) => {
    setItems((currentItems) => {
      return currentItems.map((item) => {
        const metadata = itemsMetadata.find(
          (metaData) => metaData.id === item.id
        );
        if (metadata) {
          return {
            ...item,
            label: metadata.label,
            suffix: metadata.suffix,
            prefix: metadata.prefix,
            locator: metadata.locator,
            isSelected: true,
          };
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
    return (
      JSON.stringify(checkedItems.map((citation) => ({ ...citation }))) ===
      JSON.stringify(itemsIDsInSelectedCitation.current)
    );
  };

  const updateCitationMetaData = (citation: CitationItem) => {
    setItems((currentItems) => {
      return currentItems.map((item) => {
        if (item.id === citation.id) {
          return {
            ...item,
            label: citation.label,
            locator: citation.locator,
            prefix: citation.prefix,
            suffix: citation.suffix,
          };
        }
        return item;
      });
    });
  };

  const getSelectedCitation = useCallback(async (): Promise<void> => {
    const getItemsMetaDataInCitation =
      await citeSupport.wordApi.getItemsInSelectedCitation();
    const isCitationValue = await citeSupport.wordApi.isCitationSelected();
    if (getItemsMetaDataInCitation) {
      unCheckAllCheckboxes();
      checkItems(getItemsMetaDataInCitation);
      setCitationItemsIDs(getItemsMetaDataInCitation);
      setIsCitationSelection(() => isCitationValue);
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
      <SearchField onFilterChange={onFilterChange} />
      <ReferenceList
        list={items}
        metaDataHandler={updateCitationMetaData}
        onCheckBoxChange={handleToggleChange}
      />
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
