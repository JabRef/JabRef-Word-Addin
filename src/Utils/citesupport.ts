import { Bibliography, Citation, CitationResult, MetaData, RebuildProcessorStateData } from "citeproc";
import CiteWorker from "./worker/cite.worker.ts";
/* global Office Word OfficeExtension*/

interface referenceData extends Omit<MetaData, "year" | "issued"> {
  year?: number;
  issued?: unknown;
}


class CiteSupport {
  config: {
    debug: boolean;
    mode: string;
    defaultLocale: string;
    defaultStyle: string;
    citationIdToPos: {};
    citationByIndex: object[];
    processorReady: boolean;
    referenceData: Array<referenceData>;
  };
  worker: Worker;
  constructor(referenceData: Array<referenceData>) {
    this.config = {
      debug: true,
      mode: "in-text",
      defaultLocale: "en-US",
      defaultStyle: "american-sociological-association",
      citationIdToPos: {},
      citationByIndex: [],
      processorReady: false,
      referenceData: referenceData,
    };
    this.worker = new CiteWorker();
    this.worker.onmessage = (event) => {
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
          this.onRegisterCitation(event.data.citationByIndex, event.data.citationData);
          break;

        case "setBibliography":
          this.onSetBibliography(event.data.bibliographyData);
          break;
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
    bibliographyData: Bibliography,
    citationByIndex: Object[]
  ) {
    this.debug("initProcessor()");
    this.config.mode = xclass;
    this.config.citationByIndex = citationByIndex;
    var citationData = this.convertRebuildDataToCitationData(rebuildData);
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
  onRegisterCitation(citationByIndex: Object[], citationData: Array<CitationResult>) {
    this.debug("registerCitation()");
    this.config.citationByIndex = citationByIndex;
    this.setCitations(citationData);
    this.config.processorReady = true;
  }

  onSetBibliography(bibliographyData: Bibliography) {
    this.debug("setBibliograghy()");
    this.setBibliography(bibliographyData);
    this.config.processorReady = true;
  }

  /**
   * Logs messages to the console if `config.debug` is true
   */
  debug(txt: string): void {
    if (this.config.debug) {
      console.log("*** " + txt);
    }
  }

  /**
   *   Initializes the processor, optionally populating it with a
   *   preexisting list of citations.
   */
  callInitProcessor(
    styleName: string,
    localeName: string,
    citationByIndex: object[],
    referenceData: Array<referenceData>
  ): void {
    this.debug("callInitProcessor()");
    this.config.processorReady = false;
    if (!citationByIndex) {
      citationByIndex = [];
    }
    this.worker.postMessage({
      command: "initProcessor",
      styleName: styleName,
      localeName: localeName,
      citationByIndex: citationByIndex,
      referenceData: referenceData,
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
      citation: citation,
      preCitations: preCitations,
      postCitations: postCitations,
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
  convertRebuildDataToCitationData(rebuildData: Array<RebuildProcessorStateData>): Array<CitationResult> {
    if (!rebuildData) return null;
    this.debug("convertRebuildDataToCitationData()");
    const citationData = rebuildData.map((obj: RebuildProcessorStateData): CitationResult => [0, obj[2], obj[0]]);
    for (let i = 0, ilen = citationData.length; i < ilen; i++) {
      citationData[i][0] = i;
    }
    return citationData;
  }

  /**
   * Update all citations based on data returned by the processor.
   * The update has two effects: (1) the id of all in-text citation
   * nodes is set to the citationByIndex object; and (2)
   * citation texts are updated.
   *
   * data: An array of elements with the form `[citationIndex, citationText, citationID]`
   */
  async setCitations(data: Array<CitationResult>): Promise<void> {
    this.debug("setCitations()");

    for (var i = 0; i < data.length; i++) {
      const position = data[i][0];
      const tag = this.config.citationByIndex[position];
      const encodedTag = btoa(JSON.stringify(tag));
      const citationTag = await this.getCitationTagByIndex(position);
      if (citationTag === "NEW" || citationTag != encodedTag) {
        await this.setCitationTagAtPosition(position, encodedTag);
      }
      await this.insertTextInContentControl(citationTag as string, data[i][1]);
    }

    // Update citationIdToPos for all nodes
    const getTotalNumberOfCitation = await this.getTotalNumberOfCitation();
    for (let i = 0; i < getTotalNumberOfCitation; i++) {
      let citationID = await this.getCitationTagByIndex(i);
      if (citationID) {
        this.config.citationIdToPos[citationID] = i;
      }
    }
  }

  /**
   * Replace bibliography with xHTML returned by the processor.
   */
  setBibliography(data: Bibliography): void {
    this.debug("setBibliography()");
    const bib = data[1].join("\n");
    this.createContentControl("bibliography", bib);
  }

  /**
   *   Puts document into the state it would have been
   *   in at first opening had it been properly saved.
   */
  async spoofDocument(): Promise<void> {
    this.debug("spoofDocument()");
    const citationStyle = Office.context.document.settings.get("Style");
    if (citationStyle) {
      this.config.defaultStyle = citationStyle;
    }
    const getCitationByIndex = await this.getCitationByIndex();
    if (getCitationByIndex) {
      this.config.citationByIndex = getCitationByIndex;
    }
    const getCitationIdToPos = await this.getCitationIdToPos();
    if (getCitationIdToPos) {
      this.config.citationIdToPos = getCitationIdToPos;
    }
  }
  // TODO: ADD isCitation function to check whether current selection is citation or not
  isCitation() {
    return false;
  }

  // Word APIs
  async insertEmptyContentControl(): Promise<void> {
    Word.run(function (context) {
      const getSelection = context.document.getSelection();
      const contentControl = getSelection.insertContentControl();
      contentControl.tag = "JABREF-CITATION-NEW";
      contentControl.appearance = "Hidden";
      return context.sync();
    }).catch(function (error) {
      console.log("Error: " + error);
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }
  async insertTextInContentControl(encodedTag: string, text: string): Promise<void> {
    Word.run(async function (context) {
      let contentControl = context.document.contentControls.getByTag("JABREF-CITATION-" + encodedTag).getFirst();
      contentControl.load("tag, appearance");
      return context.sync().then(() => {
        contentControl.insertHtml(text, "Replace");
        contentControl.appearance = "BoundingBox";
        return context.sync();
      });
    }).catch(function (error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }
  async getTotalNumberOfCitation(): Promise<number | void> {
    return Word.run(async function (context) {
      const contentControls = context.document.contentControls;
      context.load(contentControls, "tag, length");
      await context.sync();
      let length = 0;
      contentControls.items.forEach((citation) => {
        const tag = citation.tag.split("-");
        if (tag[0] === "JABREF" && tag[1] === "CITATION") {
          length++;
        }
      });
      return length;
    }).catch(function (error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }
  async getPositionOfNewCitation(): Promise<number> {
    return Word.run(async function (context) {
      const contentControls = context.document.contentControls;
      context.load(contentControls, "tag, length");
      await context.sync();
      let length = 0;
      let pos = null;
      for (let i = 0, ilen = contentControls.items.length; i < ilen; i++) {
        const tag = contentControls.items[i].tag.split("-");
        if (tag[0] === "JABREF" && tag[1] === "CITATION") {
          if (tag[2] == "NEW") {
            pos = length;
            break;
          }
          length++;
        }
      }
      return pos;
    }).catch(function (error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }
  async setCitationTagAtPosition(position: number, tag: string): Promise<void> {
    Word.run(async function (context) {
      const contentControls = context.document.contentControls;
      context.load(contentControls, "tag");
      await context.sync();
      const contentControl = contentControls.items[position];
      contentControl.tag = "JABREF-CITATION-" + tag;
      return context.sync();
    }).catch(function (error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }
  async getCitationTagByIndex(position: number): Promise<string> {
    return Word.run(async function (context) {
      const contentControls = context.document.contentControls;
      context.load(contentControls, "tag, length");
      await context.sync();
      let indexTag = null;
      let pos = 0;
      for (let i = 0, ilen = contentControls.items.length; i < ilen; i++) {
        const tag = contentControls.items[i].tag.split("-");
        if (tag[0] === "JABREF" && tag[1] === "CITATION") {
          if (pos == position) {
            indexTag = tag[2];
            break;
          } else {
            pos++;
          }
        }
      }
      return indexTag;
    }).catch(function (error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }
  async getCitationIdToPos(): Promise<object | void> {
    return Word.run(async function (context) {
      const contentControls = context.document.contentControls;
      context.load(contentControls, "tag, length");
      await context.sync();
      let citationIdToPos = {};
      let pos = 0;
      contentControls.items.forEach((citation) => {
        const tag = citation.tag.split("-");
        if (tag[0] === "JABREF" && tag[1] === "CITATION") {
          citationIdToPos[tag[2]] = pos;
          pos++;
        }
      });
      return context.sync().then(function () {
        if (citationIdToPos) {
          return citationIdToPos;
        }
        return {};
      });
    }).catch(function (error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }
  async getCitationByIndex(): Promise<Array<object> | void> {
    return Word.run(async function (context) {
      const contentControls = context.document.contentControls;
      context.load(contentControls, "tag, length");
      await context.sync();
      let citationByIndex = [];
      contentControls.items.forEach((citation) => {
        const tag = citation.tag.split("-");
        if (tag[0] === "JABREF" && tag[1] === "CITATION") {
          citationByIndex.push(JSON.parse(atob(tag[2])));
        }
      });
      return context.sync().then(function () {
        if (citationByIndex.length) {
          return citationByIndex;
        }
        return [];
      });
    }).catch(function (error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }
  createContentControl(tag: string, html: string) {
    Word.run(function (context) {
      const getSelection = context.document.getSelection();
      const contentControl = getSelection.insertContentControl();
      contentControl.tag = tag;
      contentControl.appearance = "BoundingBox";
      contentControl.color = "white";
      contentControl.insertHtml(html, "Replace");
      return context.sync();
    }).catch(function (error) {
      console.log("Error: " + error);
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }
}

export default CiteSupport;
