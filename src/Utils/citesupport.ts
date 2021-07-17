"use strict";
import CiteWorker from "./cite.worker.ts";
/* global Word OfficeExtension*/

class CiteSupport {
  config: {
    debug: boolean;
    mode: string;
    defaultLocale: string;
    defaultStyle: string;
    citationIdToPos: {};
    citationByIndex: object[];
    processorReady: boolean;
    citationData: object[];
  };
  worker: Worker;
  constructor(citationData: object[]) {
    this.config = {
      debug: true,
      mode: "in-text",
      defaultLocale: "en-US",
      defaultStyle: "american-sociological-association",
      citationIdToPos: {},
      citationByIndex: [],
      processorReady: false,
      citationData: citationData,
    };
    var me = this;
    this.worker = new CiteWorker();
    this.worker.onmessage = function (e) {
      switch (e.data.command) {
        /**
         *    In response to `callInitProcessor` request, refresh
         *   `config.mode`, and document citations (if any)
         *    and document bibliography (if any).
         *
         * @param {string} xclass Either `note` or `in-text` as a string
         * @param {Object[]} rebuildData Array of elements with the form `[citationID, noteNumber, citeString]`
         * @param {Object[]} bibliographyData Array of serialized xHTML bibliography entries
         */
        case "initProcessor":
          me.debug("initProcessor()");
          me.config.mode = e.data.xclass;
          me.config.citationByIndex = e.data.citationByIndex;
          var citationData = me.convertRebuildDataToCitationData(e.data.rebuildData);
          me.setCitations(citationData);
          // me.setBibliography(e.data.bibliographyData);
          me.config.processorReady = true;
          break;
        /**
         * In response to `callRegisterCitation`, refresh `config.citationByIndex`,
         *   set citations that require update in the document, replace
         *   the bibliography in the document, and save the `citationByIndex` array
         *   for persistence.
         *
         * @param {Object[]} citationByIndex Array of registered citation objects
         * @param {Object[]} citationData Array of elements with the form `[noteNumber, citeString]`
         * @param {Object[]} bibliographyData Array of serialized xHTML bibliography entries
         */
        case "registerCitation":
          me.debug("registerCitation()");
          if (e.data.errors) {
            me.debug(e.data.errors);
          }
          me.config.citationByIndex = e.data.citationByIndex;
          me.setCitations(e.data.citationData);
          me.config.processorReady = true;
          break;

        case "getBibliography":
          me.debug("getBibliography()");
          me.setBibliography(e.data.bibliographyData);
          me.config.processorReady = true;
          break;
      }
    };
  }
  /**
   * Logs messages to the console if `config.debug` is true
   * @param  {string} txt The message to log
   * @return {void}
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
  callInitProcessor(styleName: string, localeName: string, citationByIndex: object[], citationData: object[]): void {
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
      citationData: citationData,
    });
  }

  /**
   *    Registers a single citation in the processor to follow
   *    citations described by `preCitations` and precede those
   *    described in `postCitations`.
   *
   *    @param {Object{}} citation A citation object
   *    @param {Object[]} preCitations An array of `[citationID, noteNumber]` pairs in document order
   *    @param {Object[]} postCitations An array of `[citationID, noteNumber]` pairs in document order
   *    @return {void}
   */
  callRegisterCitation(citation: any, preCitations: object[], postCitations: object[]): void {
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
   *    Converts the array returned by the processor `rebuildProcessor()` method
   *    to the form digested by our own `setCitations()` method.
   *
   *    rebuildData has this structure:
   *    [<citation_id>, <note_number>, <citation_string>]
   *
   *    setCitations() wants this structure:
   *    [<citation_index>, <citation_string>, <citation_id>]
   *
   *    @param {Object[]} rebuildData An array of values for insertion of citations into a document
   *    @return {Object[]}
   */
  convertRebuildDataToCitationData(rebuildData: object[]): object[] {
    if (!rebuildData) return null;
    this.debug("convertRebuildDataToCitationData()");
    var citationData = rebuildData.map((obj) => [0, obj[2], obj[0]]);
    for (var i = 0; i < citationData.length; i++) {
      citationData[i][0] = i;
    }
    return citationData;
  }

  /**
   *   Function to be run immediately after document has been loaded, and
   *   before any editing operations.
   *   @return {void}
   */
  initDocument = async function (): Promise<void> {
    this.debug("initDocument()");
    await this.spoofDocument();
    this.callInitProcessor(
      this.config.defaultStyle,
      this.config.defaultLocale,
      this.config.citationByIndex,
      this.config.citationData
    );
  };

  /**
   * Update all citations based on data returned by the processor.
   * The update has two effects: (1) the id of all in-text citation
   * nodes is set to the citationByIndex object; and (2)
   * citation texts are updated.
   *
   * data: An array of elements with the form `[citationIndex, citationText, citationID]`
   */
  async setCitations(data: object[]): Promise<void> {
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
      var citationID = await this.getCitationTagByIndex(i);
      if (citationID) {
        this.config.citationIdToPos[citationID] = i;
      }
    }
  }

  // Word API
  async insertEmptyContentControl() {
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

  //TODO
  isCitation() {
    return false;
  }

  /**
   * Replace bibliography with xHTML returned by the processor.
   *
   * @param {Object[]} data An array consisting of [0] an object with style information and [1] an array of serialized xHMTL bibliography entries.
   */
  setBibliography(data: any[][]) {
    this.debug("setBibliography()");
    const bib = data[1].join("\n");
    this.createContentControl("bibliography", bib);
  }

  /**
   *   Puts document into the state it would have been
   *   in at first opening had it been properly saved.
   *
   * @return {void}
   */
  async spoofDocument(): Promise<void> {
    this.debug("spoofDocument()");
    // Use stored style if available
    // const citationStyle = Office.context.document.settings.get("Style");
    // if (citationStyle) {
    //   this.config.defaultStyle = citationStyle;
    // }

    // Initialize array and object
    const getCitationByIndex = await this.getCitationByIndex();
    if (getCitationByIndex) {
      this.config.citationByIndex = getCitationByIndex;
    }
    const getCitationIdToPos = await this.getCitationIdToPos();
    if (getCitationIdToPos) {
      this.config.citationIdToPos = getCitationIdToPos;
    }

    // Build citationByIndex
    // This gives us assurance of one-to-one correspondence between
    // citation nodes and citationByIndex data. The processor
    // and the code for handling its return must cope with possible
    // duplicate citationIDs in data and node citationIDs.
  }

  async spoofCitations(): Promise<object[]> {
    this.debug("spoofCitations()");
    const citationByIndex = await this.getCitationByIndex();
    if (!citationByIndex) {
      return [];
    }
    return citationByIndex;
  }
}

export default CiteSupport;
