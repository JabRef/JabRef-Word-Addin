declare module "citeproc" {
  export interface referenceDataInterface
    extends Omit<MetaData, "year" | "issued" | "type" | "genre"> {
    year?: number;
    issued?: unknown;
    type?: string;
    genre?: string;
  }

  export interface citationByIndexInterface
    extends Omit<StatefulCitation, "citationItems"> {
    citationItems: Array<referenceDataInterface>;
  }
}
