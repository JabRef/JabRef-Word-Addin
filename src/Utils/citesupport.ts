"use strict";
/* global Word Office*/
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
  };
  worker: Worker;
  constructor() {
    this.config = {
      debug: true,
      mode: "note",
      defaultLocale: "en-US",
      defaultStyle: "american-medical-association",
      citationIdToPos: {},
      citationByIndex: [],
      processorReady: false,
    };
    var me = this;
    this.worker = new Worker("./citeworker.js");
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
          me.setCitations(me.config.mode, citationData);
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
          me.setCitations(me.config.mode, e.data.citationData);
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
  callInitProcessor(styleName: string, localeName: string, citationByIndex: object[]): void {
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
    if (!this.config.processorReady) return;
    this.debug("callRegisterCitation()");
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
    this.callInitProcessor(this.config.defaultStyle, this.config.defaultLocale, this.config.citationByIndex);
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
  setCitations(mode: string, data: object[]): void {
    this.debug("setCitations()");
    if (data) {
      data.forEach((citation) => {
        this.createContentControl(citation[2], citation[1]);
      });
    }
    // TODO if (mode === "note")
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

  getCitationByIndex() {
    const citationByIndexXmlId = Office.context.document.settings.get("CitationByIndexID");
    Office.context.document.customXmlParts.getByIdAsync(citationByIndexXmlId, (asyncResult) => {
      asyncResult.value.getXmlAsync((asyncResult) => {
        this.config.citationByIndex = JSON.parse(atob(asyncResult.value));
      });
    });
  }

  /**
   * Replace citation span nodes and get ready to roll. Puts
   *   document into the state it would have been in at first
   *   opening had it been properly saved.
   *
   * @return {void}
   */
  spoofDocument = function () {
    this.debug("spoofDocument()");
    this.getCitationByIndex();

    // Use stored style if available
    const citationStyle = Office.context.document.settings.get("Style");
    if (citationStyle) {
      this.config.defaultStyle = citationStyle;
    }

    // Initialize array and object
    this.config.citationIdToPos = {};

    // Get citation nodes
    var citationNodes = this.pruneNodeList(doc.getElementsByClassName("citation"));

    // Build citationByIndex
    var offset = 0;
    var dataContainer = doc.getElementById("citesupport-data-container");
    if (dataContainer) {
      for (var i = citationNodes.length - 1; i > -1; i--) {
        var citationNode = citationNodes[i];
        var citationID = citationNode.id;
        var citationDataNode = doc.getElementById("csdata-" + citationID);
        if (citationDataNode) {
          var citation = JSON.parse(atob(citationDataNode.innerHTML));
          if (this.config.mode === "note") {
            citation.properties.noteIndex = i + offset + 1;
          } else {
            citation.properties.noteIndex = 0;
          }
          this.config.citationByIndex.push(citation);
        } else {
          citationNode.parentNode.removeChild(citationNode);
          offset--;
        }
      }
      this.config.citationByIndex.reverse();
    }

    // This gives us assurance of one-to-one correspondence between
    // citation nodes and citationByIndex data. The processor
    // and the code for handling its return must cope with possible
    // duplicate citationIDs in data and node citationIDs.
  };
}
export default CiteSupport;
