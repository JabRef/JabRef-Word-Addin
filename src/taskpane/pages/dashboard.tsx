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
import { useCitationStore } from "../contexts/CitationStoreContext";
import { useCiteSupport } from "../contexts/CiteSupportContext";
import ReferenceList from "../components/ReferenceList";

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

function Dashboard(): ReactElement {
  const originalItems = data; // TODO: Replace with getData hooK
  const citeSupport = useCiteSupport();
  const { selectedCitations, dispatch } = useCitationStore();
  const [referenceList, setReferenceList] =
    useState<Array<MetaData>>(originalItems);
  const [citationItems, _setCitationItems] = useState<
    Array<CitationItem | null>
  >([]);
  const itemsInSelectedCitation = useRef(citationItems);
  const setItemsInSelectedCitation = (itemsMetadata: Array<CitationItem>) => {
    itemsInSelectedCitation.current = itemsMetadata;
    _setCitationItems(itemsMetadata);
  };

  const onFilterChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    keyword: string
  ): void => {
    setReferenceList(originalItems.filter(containsSearchTerm(keyword)));
  };

  const insertCitation = async () => {
    const citationSelected = itemsInSelectedCitation.current.length > 0;
    if (citationSelected && !selectedCitations.length) {
      await citeSupport.wordApi.removeSelectedCitation();
    } else {
      await citeSupport.insertCitation(selectedCitations, citationSelected);
      dispatch({ type: "empty" });
      setItemsInSelectedCitation([]);
    }
  };

  const undoEdit = () => {
    dispatch({ type: "replace", citations: itemsInSelectedCitation.current });
  };

  const editCheck = () =>
    JSON.stringify(selectedCitations) ===
    JSON.stringify(itemsInSelectedCitation.current);

  const getSelectedCitation = useCallback(async (): Promise<void> => {
    const itemsInCitation =
      await citeSupport.wordApi.getItemsInSelectedCitation();
    if (itemsInCitation.length) {
      dispatch({ type: "replace", citations: itemsInCitation });
      setItemsInSelectedCitation(itemsInCitation);
    } else if (itemsInSelectedCitation.current.length) {
      dispatch({ type: "empty" });
      setItemsInSelectedCitation([]);
    }
  }, [citeSupport.wordApi, dispatch]);

  useEffect(() => {
    citeSupport.wordApi.addEventListener(getSelectedCitation);
    return () => citeSupport.wordApi.removeEventListener();
  }, [citeSupport.wordApi, getSelectedCitation]);

  return (
    <div style={dashboadStyle}>
      <SearchField onFilterChange={onFilterChange} />
      <ReferenceList referenceList={referenceList} />
      {selectedCitations.length && !itemsInSelectedCitation.current.length ? (
        <div style={buttonContainer}>
          <PrimaryButton onClick={insertCitation}>
            Insert {selectedCitations.length}{" "}
            {selectedCitations.length > 1 ? "citations" : "citation"}
          </PrimaryButton>
          <DefaultButton
            onClick={() => dispatch({ type: "empty" })}
            text="Cancel"
            style={{ marginLeft: 8 }}
          />
        </div>
      ) : null}
      {itemsInSelectedCitation.current.length ? (
        <div style={buttonContainer}>
          <PrimaryButton
            onClick={insertCitation}
            disabled={editCheck()}
            text="Save changes"
          />
          <DefaultButton
            onClick={undoEdit}
            style={{ marginLeft: 8 }}
            disabled={editCheck()}
            text="Cancel"
          />
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;
