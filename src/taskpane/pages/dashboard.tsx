import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { PrimaryButton, DefaultButton } from "@fluentui/react";
import { CitationItem, MetaData } from "citeproc";
import data from "../../utils/data";
import SearchField from "../components/SearchField";
import CiteSupport from "../../utils/citesupport";
import DocumentList from "../components/ReferenceList";

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
  return (item?: MetaData) => {
    return [item.title, item.author, item.year].some((str: string | number) =>
      str
        ? str.toString().toLowerCase().includes(keyword.toLowerCase().trim())
        : false
    );
  };
}

function Dashboard({ citeSupport }: DashboardProps): ReactElement {
  const originalItems = data; // Replace with getData hook

  // ===========================================================================
  // States
  // ===========================================================================

  const [selectedDocuments, setSelectedDocuments] = useState<
    Array<CitationItem>
  >([]);
  const [referenceList, setReferenceList] =
    useState<Array<MetaData>>(originalItems);
  const [citationItems, _setCitationItems] = useState([]);
  const itemsInSelectedCitation = useRef(citationItems);
  const setItemsInSelectedCitation = (itemsMetadata: Array<CitationItem>) => {
    itemsInSelectedCitation.current = itemsMetadata;
    _setCitationItems(itemsMetadata);
  };

  const checkedItems = data.filter(
    (document) => !!selectedDocuments.find((item) => item.id === document.id)
  );

  const handleSelection = (id: string, checked: boolean) => {
    setSelectedDocuments((currentItems) => {
      return checked
        ? [...currentItems, { id }]
        : [...currentItems.filter((item) => item.id !== id)];
    });
  };

  const clearSelection = () => setSelectedDocuments([]);

  const updateSelectedDocuments = (documents: Array<CitationItem>) => {
    setSelectedDocuments(() => documents);
  };

  const onFilterChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    keyword: string
  ): void => {
    setReferenceList(originalItems.filter(containsSearchTerm(keyword)));
  };

  const insertCitation = async () => {
    const citationSelected = itemsInSelectedCitation.current.length > 0;
    if (citationSelected && !checkedItems.length) {
      await citeSupport.wordApi.removeSelectedCitation();
    } else {
      await citeSupport.insertCitation(checkedItems, citationSelected);
      clearSelection();
      setItemsInSelectedCitation([]);
    }
  };

  const getSelectedCitation = useCallback(async (): Promise<void> => {
    const itemsInCitation =
      await citeSupport.wordApi.getItemsInSelectedCitation();
    if (itemsInCitation.length) {
      clearSelection();
      updateSelectedDocuments(itemsInCitation);
      setItemsInSelectedCitation(itemsInCitation);
    } else if (itemsInSelectedCitation.current.length) {
      clearSelection();
      setItemsInSelectedCitation([]);
    }
  }, [citeSupport.wordApi]);

  // ===========================================================================
  // Event Listener
  // ===========================================================================

  useEffect(() => {
    citeSupport.wordApi.addEventListener(getSelectedCitation);
    return () => citeSupport.wordApi.removeEventListener();
  }, [citeSupport.wordApi, getSelectedCitation]);

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <div style={dashboadStyle}>
      <SearchField onFilterChange={onFilterChange} />
      <DocumentList
        referenceList={referenceList}
        selectedItems={selectedDocuments}
        // metaDataHandler={updateCitationMetaData}
        handleSelection={handleSelection}
      />
      {checkedItems.length && !itemsInSelectedCitation.current.length ? (
        <div style={buttonContainer}>
          <PrimaryButton onClick={insertCitation}>
            Insert {checkedItems.length}{" "}
            {checkedItems.length > 1 ? "citations" : "citation"}
          </PrimaryButton>
          <DefaultButton onClick={clearSelection} style={{ marginLeft: 8 }}>
            Cancel
          </DefaultButton>
        </div>
      ) : null}
      {itemsInSelectedCitation.current.length ? (
        <div style={buttonContainer}>
          <PrimaryButton onClick={insertCitation} disabled={}>
            Save changes
          </PrimaryButton>
          <DefaultButton onClick={} style={{ marginLeft: 8 }} disabled={}>
            Cancel
          </DefaultButton>
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;
