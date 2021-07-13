"use strict";
import CiteWorker from "./cite.worker.ts";
/* global Word Office OfficeExtension*/
/**
 *   citesupport - Citation support for xHTML documents
 *
 * - The class should be instantiated as `citesupport`. The event
 *   handlers expect the class object to be available in global
 *   context under that name.
 *
 * - The `spoofDocument()` function brings citation data into memory.
 *
 * - The `setCitations()` function is where citation data for individual
 *   citations would be saved, at the location marked by NOTE.
 */
class CiteSupport {
  config: {
    debug: boolean;
    mode: string;
    defaultLocale: string;
    defaultStyle: string;
    citationIdToPos: {};
    citationByIndex: any[];
    processorReady: boolean;
    citationData: any[];
  };
  worker: Worker;
  constructor(citationData) {
    this.config = {
      debug: true,
      mode: "in-text",
      defaultLocale: "en-US",
      defaultStyle: "american-medical-association",
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
          console.log("msg from the processor");
          me.config.mode = e.data.xclass;
          me.config.citationByIndex = e.data.citationByIndex;
          var citationData = me.convertRebuildDataToCitationData(e.data.rebuildData);
          me.setCitations(citationData);
          me.setBibliography(e.data.bibliographyData);
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
    console.log(this.config.processorReady);
    this.config.processorReady = false;
    console.log(this.config.processorReady);
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
    this.debug("heinjkdn");
    console.log(this.config.processorReady);
    if (!this.config.processorReady) return;
    this.debug("Ok, now i'm inside callregisterCitation");
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
  initDocument = function (): void {
    this.debug("initDocument()");
    this.spoofDocument();
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
   * nodes is set to the processor-assigned citationID; and (2)
   * citation texts are updated. For footnote styles, the footnote
   * block is regenerated from scratch, using hidden text stored
   * in the citation elements.
   *
   * mode: The mode of the current style, either `in-text` or `note`
   * data: An array of elements with the form `[citationIndex, citationText, citationID]`
   */
  async setCitations(data: object[]): Promise<void> {
    this.debug("setCitations()");

    for (var i = 0; i < data.length; i++) {
      const position = data[i][0];
      const tag = this.config.citationByIndex[position];
      const encodedTag = this.encodeString(tag);
      const getCitationTag = await this.getCitationTagByIndex(position);
      console.log("inside", data[i][0]);
      if (getCitationTag == "NewCitationTag" || getCitationTag != encodedTag) {
        this.setCitationTagAtPosition(position, encodedTag);
      }
      this.insertTextAtCitation(encodedTag, data[i][1]);
    }

    // Update citationIdToPos for all nodes
    const getTotalNumberOfCitation = await this.getTotalNumberOfCitation();
    for (let i = 0; i < getTotalNumberOfCitation; i++) {
      var citationID = await this.getCitationTagByIndex(i);
      this.config.citationIdToPos[citationID] = i;
    }
  }

  // Word API
  async insertTextAtCitation(tag: string, text: string): Promise<void> {
    Word.run(async function (context) {
      var contentControls = context.document.contentControls.getByTag(tag).getFirst();
      context.load(contentControls, "text");
      await context.sync();
      contentControls.insertText(text, "Replace");
      return context.sync();
    }).catch(function (error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }
  async getTotalNumberOfCitation(): Promise<number> {
    try {
      return Word.run(async function (context) {
        var contentControls = context.document.contentControls;
        context.load(contentControls, "tag");
        await context.sync();
        return contentControls.items.length;
      });
    } catch (error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    }
  }
  async setCitationTagAtPosition(position: number, encodedTag: string): Promise<void> {
    try {
      return Word.run(async function (context) {
        const contentControls = context.document.contentControls;
        context.load(contentControls, "tag");
        await context.sync();
        const contentControl = contentControls.items[position];
        contentControl.load("tag");
        contentControl.tag = encodedTag;
        return context.sync();
      });
    } catch (error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    }
  }
  async getCitationTagByIndex(position: number): Promise<string> {
    try {
      return Word.run(async function (context) {
        const contentControls = context.document.contentControls;
        context.load(contentControls, "tag");
        await context.sync();
        const contentControl = contentControls.items[position];
        contentControl.load("tag");
        await context.sync();
        return contentControl.tag;
      });
    } catch (error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    }
  }
  async buildCitationByIndexAndCitationIdToPos(): Promise<void> {
    Word.run(async function (context) {
      var contentControls = context.document.contentControls;
      context.load(contentControls, "tag");
      await context.sync();
      for (var i = 0; i < contentControls.items.length; i++) {
        var contentControl = contentControls.items[i];
        contentControl.load("tag");
        await context.sync();
        this.citationByIndex.push(this.decodeString(contentControl.tag));
        this.citationIdToPos[contentControl.tag] = i;
      }
      return context.sync();
    }).catch(function (error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }
  async getCitationByIndex() {
    return Word.run(async function (context) {
      var citationByIndex = [];
      var contentControls = context.document.contentControls;
      context.load(contentControls, "tag");
      await context.sync();
      for (var i = 0; i < contentControls.items.length; i++) {
        var contentControl = contentControls.items[i];
        contentControl.load("tag");
        await context.sync();
        citationByIndex.push(this.decodeString(contentControl.tag));
      }
      return context.sync().then(function () {
        return citationByIndex;
      });
    }).catch(function (error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }

  // encoding decode String
  encodeString(text: string): string {
    return atob(JSON.stringify(text));
  }
  decodeString(text: string): string {
    return JSON.parse(btoa(text));
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

  createContentControl(tag: string, html: string) {
    Word.run(function (context) {
      const serviceNameRange = context.document.getSelection();
      const serviceNameContentControl = serviceNameRange.insertContentControl();
      serviceNameContentControl.tag = tag;
      serviceNameContentControl.appearance = "BoundingBox";
      serviceNameContentControl.color = "white";
      serviceNameContentControl.insertHtml(html, "Replace");
      return context.sync();
    }).catch(function (error) {
      console.log("Error: " + error);
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }
  /**
   *   Puts document into the state it would have been
   *   in at first opening had it been properly saved.
   *
   * @return {void}
   */
  async spoofDocument(): Promise<void> {
    this.debug("spoofDocument()");
    this.getCitationByIndex();

    // Use stored style if available
    const citationStyle = Office.context.document.settings.get("Style");
    if (citationStyle) {
      this.config.defaultStyle = citationStyle;
    }

    // Initialize array and object
    this.config.citationByIndex = [];
    this.config.citationIdToPos = {};

    // Build citationByIndex
    await this.buildCitationByIndexAndCitationIdToPos();

    // This gives us assurance of one-to-one correspondence between
    // citation nodes and citationByIndex data. The processor
    // and the code for handling its return must cope with possible
    // duplicate citationIDs in data and node citationIDs.
  }

  async spoofCitations() {
    this.debug("spoofCitations()");
    const citationByIndex = await this.getCitationByIndex();
    return citationByIndex;
  }
}

export default CiteSupport;
