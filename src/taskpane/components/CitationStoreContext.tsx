import { CitationItem } from "citeproc";
import React, { useReducer, useContext, ReactElement, ReactNode } from "react";
import citationStoreReducer, {
  citationStoreAction,
} from "./citationStoreReducer";

interface CitationStoreContextInterface {
  selectedCitations: Array<CitationItem | null>;
  dispatch: React.Dispatch<citationStoreAction>;
}

const CitationStoreContext =
  React.createContext<CitationStoreContextInterface>(null);

interface CitationStoreProviderProps {
  children: ReactNode;
}

const initialState: Array<CitationItem> = [];

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
