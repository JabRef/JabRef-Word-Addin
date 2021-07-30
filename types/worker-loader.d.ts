import {
  citationByIndexInterface,
  referenceDataInterface,
  Citation,
} from "citeproc";

/* eslint-disable no-unused-vars */
declare module "*.worker.ts" {
  class WebpackWorker extends Worker {
    constructor();

    onmessage: ((this: Worker, ev: WorkerEventInterface) => any) | null;
  }
  interface WorkerEventInterface {
    data: DataInterface;
  }
  interface DataInterface {
    command: string;
    localeName: string;
    citationByIndex: Array<citationByIndexInterface>;
    referenceData: Array<referenceDataInterface>;
    styleName: string;
    citation: Citation;
    preCitations: Array<[string, number]>;
    postCitations: Array<[string, number]>;
  }

  export default WebpackWorker;
}
