/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-await-in-loop */
import {
  Bibliography,
  Citation,
  citationByIndexInterface,
  CitationResult,
  RebuildProcessorStateData,
  referenceDataInterface,
} from "citeproc";
import WordApi from "./word-api";
import CiteWorker from "./cite.worker";

interface WorkerEventInterface {
  data?: DataInterface;
}
interface DataInterface {
  errors: string;
  command: string;
  localeName: string;
  citationByIndex: Array<citationByIndexInterface>;
  referenceData: Array<referenceDataInterface>;
  styleName: string;
  citation: Citation;
  preCitations: Array<[string, number]>;
  postCitations: Array<[string, number]>;
  xclass: string;
  rebuildData: Array<RebuildProcessorStateData>;
  bibliographyData: Bibliography;
  citationData: Array<CitationResult>;
}

class CiteSupport {
  config: {
    debug: boolean;
    mode: string;
    defaultLocale: string;
    defaultStyle: string;
    citationIdToPos: Record<string, number>;
    citationByIndex: Array<citationByIndexInterface>;
    processorReady: boolean;
    referenceData: Array<referenceDataInterface>;
  };

  worker: Worker;

  constructor(referenceData: Array<referenceDataInterface>) {
    this.config = {
      debug: true,
      mode: "in-text",
      defaultLocale: "en-US",
      defaultStyle: "american-sociological-association",
      citationIdToPos: {},
      citationByIndex: [],
      processorReady: false,
      referenceData,
    };
    this.worker = new CiteWorker();
    this.worker.onmessage = (event: WorkerEventInterface) => {
      if (event.data.errors) {
        this.debug(event.data.errors);
      }
      switch (event.data.command) {
        case "initProcessor":
          this.onInitProcessor(
            event.data.xclass,
            event.data.rebuildData,
            event.data.bibliographyData,
            event.data.citationByIndex
          );
          break;
        case "registerCitation":
          this.onRegisterCitation(
            event.data.citationByIndex,
            event.data.citationData
          );
          break;

        case "setBibliography":
          this.onSetBibliography(event.data.bibliographyData);
          break;
        default:
      }
    };
  }

  /**
   *  In response to `callInitProcessor` request, refresh
   *  `config.mode`, and document citations (if any)
   *  and document bibliography (if any).
   */
  onInitProcessor(
    xclass: string,
    rebuildData: Array<RebuildProcessorStateData>,
    _bibliographyData: Bibliography,
    citationByIndex: Array<citationByIndexInterface>
  ): void {
    this.debug("initProcessor()");
    this.config.mode = xclass;
    this.config.citationByIndex = citationByIndex;
    const citationData = this.convertRebuildDataToCitationData(rebuildData);
    this.setCitations(citationData);
    // this.setBibliography(bibliographyData);
    this.config.processorReady = true;
  }

  /**
   *   In response to `callRegisterCitation`, refresh `config.citationByIndex`,
   *   set citations that require update in the document, replace
   *   the bibliography in the document, and save the `citationByIndex` array
   *   for persistence.
   */
  onRegisterCitation(
    citationByIndex: Array<citationByIndexInterface>,
    citationData: Array<CitationResult>
  ): void {
    this.debug("registerCitation()");
    this.config.citationByIndex = citationByIndex;
    this.setCitations(citationData);
    this.config.processorReady = true;
  }

  onSetBibliography(bibliographyData: Bibliography): void {
    this.debug("setBibliograghy()");
    this.setBibliography(bibliographyData);
    this.config.processorReady = true;
  }

  /**
   * Logs messages to the console if `config.debug` is true
   */
  debug(txt: string): void {
    if (this.config.debug) {
      console.log(`*** ${txt}`);
    }
  }

  /**
   *   Initializes the processor, optionally populating it with a
   *   preexisting list of citations.
   */
  callInitProcessor(
    styleName: string,
    localeName: string,
    citationByIndex: Array<citationByIndexInterface>,
    referenceData: Array<referenceDataInterface>
  ): void {
    this.debug("callInitProcessor()");
    this.config.processorReady = false;
    this.worker.postMessage({
      command: "initProcessor",
      styleName,
      localeName,
      citationByIndex,
      referenceData,
    });
  }

  /**
   *    Registers a single citation in the processor to follow
   *    citations described by `preCitations` and precede those
   *    described in `postCitations`.
   */
  callRegisterCitation(
    citation: Citation,
    preCitations: Array<[string, number]>,
    postCitations: Array<[string, number]>
  ): void {
    this.debug("callRegisterCitation()");
    if (!this.config.processorReady) return;
    this.config.processorReady = false;
    this.worker.postMessage({
      command: "registerCitation",
      citation,
      preCitations,
      postCitations,
    });
  }

  getBibliography(): void {
    if (!this.config.processorReady) return;
    this.debug("getBibliography()");
    this.config.processorReady = false;
    this.worker.postMessage({
      command: "getBibliography",
    });
  }

  /**
   *   Function to be run immediately after document has been loaded, and
   *   before any editing operations.
   */
  initDocument = async (): Promise<void> => {
    this.debug("initDocument()");
    await this.spoofDocument();
    this.callInitProcessor(
      this.config.defaultStyle,
      this.config.defaultLocale,
      this.config.citationByIndex,
      this.config.referenceData
    );
  };

  /**
   *    Converts the array returned by the processor `rebuildProcessor()` method
   *    to the form digested by our own `setCitations()` method.
   *
   *    rebuildData has this structure:
   *    [<citation_id>, <note_number>, <citation_string>]
   *
   *    setCitations() wants this structure:
   *    [<citation_index>, <citation_string>, <citation_id>]
   */
  convertRebuildDataToCitationData(
    rebuildData: Array<RebuildProcessorStateData>
  ): Array<CitationResult> {
    if (!rebuildData) return null;
    this.debug("convertRebuildDataToCitationData()");
    const citationData = rebuildData.map(
      (obj: RebuildProcessorStateData): CitationResult => [0, obj[2], obj[0]]
    );
    for (let i = 0, ilen = citationData.length; i < ilen; i += 1) {
      citationData[i][0] = i;
    }
    return citationData;
  }

  /**
   * Update all citations based on data returned by the processor.
   * The update has two effects: (1) the id of all in-text citation
   * nodes is set to the citationByIndex object; and (2)
   * citation texts are updated.
   */
  async setCitations(data: Array<CitationResult>): Promise<void> {
    this.debug("setCitations()");
    for (let i = 0; i < data.length; i += 1) {
      const position = data[i][0];
      const tag = JSON.stringify(this.config.citationByIndex[position]);
      const citationTag = (await WordApi.getCitationTagByIndex(
        position
      )) as string;
      if (citationTag === "NEW" || citationTag !== tag) {
        await WordApi.setCitationTagAtPosition(position, tag);
      }
      await WordApi.insertTextInContentControl(tag, data[i][1]);
    }
    // Update citationIdToPos for all nodes
    const getTotalNumberOfCitation = await WordApi.getTotalNumberOfCitation();
    for (let i = 0; i < getTotalNumberOfCitation; i += 1) {
      const citationID = await WordApi.getCitationTagByIndex(i);
      if (citationID) {
        this.config.citationIdToPos[citationID] = i;
      }
    }
  }

  /**
   * Insert bibliography with xHTML returned by the processor.
   */
  setBibliography(data: Bibliography): void {
    this.debug("setBibliography()");
    const bib = data[1].join("\n");
    WordApi.createContentControl("bibliography", bib);
  }

  /**
   *   Puts document into the state it would have been
   *   in at first opening had it been properly saved.
   */
  async spoofDocument(): Promise<void> {
    this.debug("spoofDocument()");
    const citationStyle = Office.context.document.settings.get("Style") as
      | string
      | null;
    if (citationStyle) {
      this.config.defaultStyle = citationStyle;
    }
    const getCitationByIndex = await WordApi.getCitationByIndex();
    if (getCitationByIndex) {
      this.config.citationByIndex = getCitationByIndex;
    }
    const getCitationIdToPos = await WordApi.getCitationIdToPos();
    if (getCitationIdToPos) {
      this.config.citationIdToPos = getCitationIdToPos;
    }
  }

  /** Updates the citationByIndex array after every edit or delete operation */
  async updateCitationByIndex(): Promise<void> {
    const citationByIndex = await WordApi.getCitationByIndex();
    if (citationByIndex) {
      this.config.citationByIndex = citationByIndex;
    }
  }

  static isCitation(): boolean {
    return false;
  }
}

export default CiteSupport;
