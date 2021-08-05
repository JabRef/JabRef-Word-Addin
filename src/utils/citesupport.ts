import {
  Citation,
  CitationResult,
  GeneratedBibliography,
  MetaData,
  RebuildProcessorStateData,
  StatefulCitation,
} from "citeproc";
import WordApi from "./word-api";
import CiteWorker, {
  CiteWorkerCommand,
  CiteWorkerMessage,
} from "./cite.worker";

class CiteSupport {
  config: {
    debug: boolean;
    mode: string;
    defaultLocale: string;
    defaultStyle: string;
    citationIdToPos: Record<string, number>;
    citationByIndex: Array<StatefulCitation>;
    processorReady: boolean;
    referenceData: Array<MetaData>;
  };

  worker: Worker;

  wordApi: WordApi;

  constructor(referenceData: Array<MetaData>) {
    this.config = {
      debug: true,
      mode: "in-text",
      defaultLocale: "en-US",
      defaultStyle: "american-political-science-association",
      citationIdToPos: {},
      citationByIndex: [],
      processorReady: false,
      referenceData,
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.worker = new CiteWorker() as Worker;
    this.wordApi = new WordApi();
    this.worker.onmessage = async (event: MessageEvent<CiteWorkerMessage>) => {
      switch (event.data.command) {
        case "error":
          this.debug(event.data.error);
          break;
        case "initProcessor":
          await this.onInitProcessor(
            event.data.xclass,
            event.data.rebuildData,
            event.data.bibliographyData,
            event.data.citationByIndex
          );
          break;
        case "registerCitation":
          await this.onRegisterCitation(
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
   *  In response to `initProcessor` request, refresh
   *  config.mode, document citations, config.citationByIndex
   *  and bibliography(if any).
   */
  async onInitProcessor(
    xclass: string,
    rebuildData: Array<RebuildProcessorStateData>,
    _bibliographyData: GeneratedBibliography,
    citationByIndex: Array<StatefulCitation>
  ): Promise<void> {
    this.debug("initProcessor()");
    this.config.mode = xclass;
    this.config.citationByIndex = citationByIndex;
    const citationData = this.convertRebuildDataToCitationData(rebuildData);
    await this.setCitations(citationData);
    // this.setBibliography(bibliographyData);
    this.config.processorReady = true;
  }

  /**
   *   In response to `registerCitation`, refresh `config.citationByIndex`,
   *   set citations that require update in the document, replace
   *   the bibliography in the document, and save the `citationByIndex` array
   *   for persistence.
   */
  async onRegisterCitation(
    citationByIndex: Array<StatefulCitation>,
    citationData: Array<CitationResult>
  ): Promise<void> {
    this.debug("registerCitation()");
    this.config.citationByIndex = citationByIndex;
    await this.setCitations(citationData);
    this.config.processorReady = true;
  }

  onSetBibliography(bibliographyData: GeneratedBibliography): void {
    this.debug("setBibliograghy()");
    this.setBibliography(bibliographyData);
    this.config.processorReady = true;
  }

  /**
   *   Logs messages to the console if `config.debug` is true
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
  initProcessor(
    styleName: string,
    localeName: string,
    citationByIndex: Array<StatefulCitation>,
    referenceData: Array<MetaData>
  ): void {
    this.debug("callInitProcessor()");
    this.config.processorReady = false;
    this.work({
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
  registerCitation(
    citation: Citation,
    preCitations: Array<[string, number]>,
    postCitations: Array<[string, number]>
  ): void {
    this.debug("callRegisterCitation()");
    if (!this.config.processorReady) return;
    this.config.processorReady = false;
    this.work({
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
    this.work({
      command: "getBibliography",
    });
  }

  /**
   *   Function to be run immediately after document has been loaded, In case of change in citation style
   *   and before any editing operations.
   */
  async initDocument(): Promise<void> {
    this.debug("initDocument()");
    await this.spoofDocument();
    this.initProcessor(
      this.config.defaultStyle,
      this.config.defaultLocale,
      this.config.citationByIndex,
      this.config.referenceData
    );
  }

  private work(message: CiteWorkerCommand): void {
    this.worker.postMessage(message);
  }

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
   *  Update all citations based on data returned by the processor.
   *  The update has two effects: (1) the id of all in-text citation
   *  nodes is set to the citationByIndex object; and (2)
   *  citation texts are updated.
   */
  async setCitations(data: Array<CitationResult>): Promise<void> {
    this.debug("setCitations()");
    const citationData = this.convertCitationDataToCustomFormat(data);
    await this.wordApi.setCitations(citationData);

    // Update citationIdToPos for all nodes
    const citationIsToPos = await WordApi.getCitationIdToPos();
    if (citationIsToPos) {
      this.config.citationIdToPos = citationIsToPos;
    }
  }

  /**
   *  Converts the array returned by the processor `registerCitation()` method
   *  to the form digested by our own `setCitations()` method from WordApi.
   *
   *  word.api.setCitations() wants this structure:
   *  [<citation_index>, <citation_string>, <statefullCitation>]
   */

  convertCitationDataToCustomFormat(
    citationData: Array<CitationResult>
  ): Array<[number, string, StatefulCitation]> {
    if (!citationData) return null;
    this.debug("convertCitationDataToCustomFormat()");
    return citationData.map((citation) => [
      citation[0],
      citation[1],
      this.config.citationByIndex[citation[0]],
    ]);
  }

  /**
   *   Insert bibliography with xHTML returned by the processor.
   */
  setBibliography(data: GeneratedBibliography): void {
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

  /**
   *  Update the citationByIndex array after every edit or delete operation
   */
  async updateCitationByIndex(): Promise<void> {
    const citationByIndex = await WordApi.getCitationByIndex();
    if (citationByIndex) {
      this.config.citationByIndex = citationByIndex;
    }
  }

  async insertCitation(
    checkedItems: Array<Record<string, string>>
  ): Promise<void> {
    const isCitation = false;
    await this.updateCitationByIndex();
    let citation = null;
    if (!isCitation) {
      if (checkedItems.length) {
        await WordApi.insertEmptyContentControl();
        citation = {
          citationItems: checkedItems,
          properties: {
            noteIndex: 0,
          },
        };
      }
    }
    let citationsPre = [];
    let citationsPost = [];
    const i = (await WordApi.getPositionOfNewCitation()) as number;
    if (this.config.citationByIndex.slice(0, i).length) {
      citationsPre = this.config.citationByIndex
        .slice(0, i)
        .map((obj: StatefulCitation): [string, number] => {
          return [obj.citationID, 0];
        });
    }
    if (this.config.citationByIndex.slice(i).length) {
      citationsPost = this.config.citationByIndex
        .slice(i)
        .map((obj: StatefulCitation): [string, number] => {
          return [obj.citationID, 0];
        });
    }
    this.registerCitation(citation, citationsPre, citationsPost);
  }

  static isCitation(): boolean {
    return false;
  }
}

export default CiteSupport;
