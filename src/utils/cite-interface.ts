import { MetaData, StatefulCitation } from "citeproc";

export interface referenceDataInterface
  extends Omit<MetaData, "year" | "issued" | "type"> {
  year?: number;
  issued?: unknown;
  type?: string;
}

export interface citationByIndexInterface
  extends Omit<StatefulCitation, "citationItems"> {
  citationItems: Array<referenceDataInterface>;
}
