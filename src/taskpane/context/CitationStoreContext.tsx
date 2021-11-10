import { CitationItem } from "citeproc";
import React, {
  useReducer,
  useContext,
  ReactElement,
  ReactNode,
  createContext,
} from "react";

interface CitationStoreProviderProps {
  children: ReactNode;
}

interface CitationStoreContextInterface {
  selectedCitations: Array<CitationItem | null>;
  dispatch: React.Dispatch<citationStoreAction>;
}

export type citationStoreAction =
  | { type: "empty" }
  | { type: "add"; citation: CitationItem }
  | { type: "remove"; citation: CitationItem }
  | { type: "update"; citation: CitationItem }
  | { type: "replace"; citations: Array<CitationItem> };

const CitationStoreContext = createContext<CitationStoreContextInterface>(null);

const initialState: Array<CitationItem> = [];

export function citationStoreReducer(
  selectedCitations: Array<CitationItem>,
  action: citationStoreAction
): Array<CitationItem | null> {
  switch (action.type) {
    case "empty":
      return [];
    case "add":
      return [...selectedCitations, action.citation];
    case "replace":
      return action.citations;
    case "remove":
      return selectedCitations.filter(
        (citation) => citation.id !== action.citation.id
      );
    case "update": {
      const { id, label, prefix, suffix, locator } = action.citation;
      return selectedCitations.map((item) => {
        return item.id === id
          ? { ...item, label, prefix, suffix, locator }
          : item;
      });
    }
    default:
      throw new Error(`Unhandled action`);
  }
}

export function CitationStoreProvider({
  children,
}: CitationStoreProviderProps): ReactElement {
  const [selectedCitations, dispatch] = useReducer(
    citationStoreReducer,
    initialState
  );
  const contextValue = {
    selectedCitations,
    dispatch,
  };
  return (
    <CitationStoreContext.Provider value={contextValue}>
      {children}
    </CitationStoreContext.Provider>
  );
}

export function useCitationStore(): CitationStoreContextInterface {
  const context = useContext(CitationStoreContext);
  if (!context) {
    throw new Error(
      "useCitationStore must be used within a CitationStoreProvider. Wrap a parent component in <CitationStoreProvider> to fix this error."
    );
  }
  return context;
}
