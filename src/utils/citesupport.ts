import {
  Citation,
  CitationItem,
  CitationResult,
  GeneratedBibliography,
  Locator,
  MetaData,
  RebuildProcessorStateData,
  StatefulCitation,
} from "citeproc";
import WordApi, { CitationDataFormatForWordAPI } from "./word-api";
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
            event.data.citationData,
            event.data.bibliographyData
          );
          break;
        case "setBibliography":
          await this.onSetBibliography(event.data.bibliographyData);
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
    bibliographyData: GeneratedBibliography,
    citationByIndex: Array<StatefulCitation>
  ): Promise<void> {
    this.debug("initProcessor()");
    this.config.mode = xclass;
    this.config.citationByIndex = citationByIndex;
    const citationData = this.convertRebuildDataToCitationData(rebuildData);
    await this.updateCitations(citationData);
    await this.updateBibliography(bibliographyData);
    this.config.processorReady = true;
  }

  /**
   *  In response to `registerCitation`, refresh `config.citationByIndex`,
   *  set citations that require update in the document, replace
   *  the bibliography in the document, and save the `citationByIndex` array
   *  for persistence.
   */
  async onRegisterCitation(
    citationByIndex: Array<StatefulCitation>,
    citationData: Array<CitationResult>,
    bibliographyData: GeneratedBibliography
  ): Promise<void> {
    this.debug("registerCitation()");
    this.config.citationByIndex = citationByIndex;
    await this.upsertCitation(citationData);
    await this.updateBibliography(bibliographyData);
    this.config.processorReady = true;
  }

  async onSetBibliography(
    bibliographyData: GeneratedBibliography
  ): Promise<void> {
    this.debug("setBibliograghy()");
    await this.insertBibliography(bibliographyData);
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
   *  This method is used on page load, on change of style,
   *  and when all citations have been removed from the document.
   *  The styleName argument is mandatory. If localeName is not provided,
   *  the processor will be configured with the en-US locale.
   *  The method implicitly accesses the config.citationByIndex
   *  array. If the array is empty, the processor will be initialized without
   *  citations.If the array contains citations, the processor will be initialized
   *  to that document state, and return an array of arrays as rebuildData,
   *  for use in reconstructing citations in the document text. Each sub-array
   *  contains a citation ID, a note number, and a citation string.
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
   *  This method is used to add or edit citations.
   *  All three arguments are mandatory. citation is an
   *  ordinary citation object with Id and properties.
   *  preCitations and postCitations are arrays of arrays,
   *  in which each sub-array is composed of a citationID
   *  and a note number.
   */
  registerCitation(
    citation: Citation,
    preCitations: Locator,
    postCitations: Locator
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

  async getBibliography(): Promise<void> {
    if (!this.config.processorReady) return;
    this.debug("getBibliography()");
    await this.updateCitationByIndex();
    if (this.config.citationByIndex.length) {
      this.config.processorReady = false;
      this.work({
        command: "getBibliography",
      });
    }
  }

  /**
   *  This method is used on page load, on change of style.
   *  First, this method calls the spoofDocument method, which
   *  reconstruct the citation by index array and the call
   *  initProcessor to rebuild the processor state.
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
   *  Converts the array returned by the processor `rebuildProcessor()` method
   *  to the form digested by our own `setCitations()` method.
   *
   *  rebuildData has this structure:
   *  [<citation_id>, <note_number>, <citation_string>]
   *
   *  setCitations() wants this structure:
   *  [<citation_index>, <citation_string>, <citation_id>]
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
  async updateCitations(data: Array<CitationResult>): Promise<void> {
    this.debug("updateCitations()");
    const citationData = this.convertCitationDataToCustomFormat(data);
    await this.wordApi.updateCitations(citationData);
  }

  /**
   *  This method is used to insert new citations or update existing
   *  ones.
   */
  async upsertCitation(data: Array<CitationResult>): Promise<void> {
    this.debug("upsertCitation()");
    const isCitationSelected = await this.wordApi.isCitationSelected();
    const citationData = this.convertCitationDataToCustomFormat(data);
    if (isCitationSelected) {
      await this.wordApi.updateCitations(citationData);
    } else {
      await this.wordApi.insertNewCitation(citationData[0]);
    }
  }

  /**
   *  Converts the array returned by the processor `registerCitation()` method
   *  to the form digested by our own `setCitations()` method from WordApi.
   *
   *  word.api.setCitations() wants this structure:
   *  [{position: number, citationText: string, citationTag: StatefulCitation}]
   */

  convertCitationDataToCustomFormat(
    citationData: Array<CitationResult>
  ): Array<CitationDataFormatForWordAPI> {
    if (!citationData) return null;
    this.debug("convertCitationDataToCustomFormat()");
    return citationData.map((citation) => {
      return {
        position: citation[0],
        citationText: citation[1],
        citationTag: this.config.citationByIndex[citation[0]],
      };
    });
  }

  /**
   *  Insert bibliography with xHTML returned by the processor.
   */
  async insertBibliography(data: GeneratedBibliography): Promise<void> {
    this.debug("insertBibliography()");
    const bib = data[1].join("\n");
    await this.wordApi.insertBibliography(bib);
  }

  /**
   *  Use this method to update the bibliography as citation in the document
   *  changes
   */
  async updateBibliography(data: GeneratedBibliography): Promise<void> {
    this.debug("updateBibliography()");
    const bib = data[1].join("\n");
    await this.wordApi.updateBibliography(bib);
  }

  /**
   *  This function puts document into the state it
   *  would have been in at first opening had it been properly
   *  saved.This function brings citation data into memory.
   */
  async spoofDocument(): Promise<void> {
    this.debug("spoofDocument()");
    const citationStyle = Office.context.document.settings.get("Style") as
      | string
      | null;
    if (citationStyle) {
      this.config.defaultStyle = citationStyle;
    }
    this.config.citationByIndex = await this.wordApi.getCitationByIndex();
  }

  /**
   *  Update the citationByIndex array after every edit or delete operation
   */
  async updateCitationByIndex(): Promise<void> {
    const citationByIndex = await this.wordApi.getCitationByIndex();
    if (citationByIndex) {
      this.config.citationByIndex = citationByIndex;
    }
  }

  async insertCitation(
    citationItems: Array<CitationItem>,
    isCitation: boolean
  ): Promise<void> {
    await this.updateCitationByIndex();
    let citation = null;
    if (!isCitation) {
      if (citationItems.length) {
        citation = {
          citationItems,
          properties: {
            noteIndex: 0,
          },
        };
      }
    } else {
      citation = {
        citationItems,
      };
    }
    let citationsPre = [];
    let citationsPost = [];
    let i = 0;
    let offset = 0;
    if (!isCitation) {
      i = await this.wordApi.getPositionOfNewCitation();
    } else {
      i = await this.wordApi.getPositionOfSelectedCitation();
      offset = 1;
    }
    if (this.config.citationByIndex.slice(0, i).length) {
      citationsPre = this.config.citationByIndex
        .slice(0, i)
        .map((obj: StatefulCitation): [string, number] => {
          return [obj.citationID, 0];
        });
    }
    if (this.config.citationByIndex.slice(i + offset).length) {
      citationsPost = this.config.citationByIndex
        .slice(i + offset)
        .map((obj: StatefulCitation): [string, number] => {
          return [obj.citationID, 0];
        });
    }
    this.registerCitation(citation, citationsPre, citationsPost);
  }
}

export default CiteSupport;
