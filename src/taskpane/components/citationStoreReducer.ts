import { CitationItem } from "citeproc";

export type citationStoreAction =
  | { type: "empty" }
  | { type: "add"; citation: CitationItem }
  | { type: "remove"; citation: CitationItem }
  | { type: "update"; citation: CitationItem }
  | { type: "replace"; citations: Array<CitationItem> };

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function citationStoreReducer(
  selectedCitations: Array<CitationItem>,
  action: citationStoreAction
) {
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
