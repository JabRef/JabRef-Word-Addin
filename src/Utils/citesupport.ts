"use strict";
/* global Word */

/**
 * citesupport - Citation support for xHTML documents
 *
 * - The class should be instantiated as `citesupport`. The event
 *   handlers expect the class object to be available in global
 *   context under that name.
 *
 * - If `config.demo` is `true`, the stored object `citationIdToPos`
 *   maps citationIDs to the index position of fixed "pegs" in the
 *   document that have class `citeme`. In the demo, this map is
 *   stored in localStorage, and is used to reconstruct the document
 *   state (by reinserting `class:citation` span tags) on page reload.
 *
 * - The `spoofDocument()` function brings citation data into memory.
 *   In the demo, this data is held in localStorage, and
 *   `spoofDocument()` performs some sanity checks on data and
 *   document. For a production deployment, this is the place for code
 *   that initially extracts citation data the document (if, for example,
 *   it is stashed in data-attributes on citation nodes).
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
    demo: boolean;
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
      demo: true,
    };
    var me = this;
    this.worker = new Worker("./citeworker.js");
    this.worker.onmessage = function (e) {
      switch (e.data.command) {
        /**
         * In response to `callInitProcessor` request, refresh
         *   `config.mode`, and document citations (if any)
         *   and document bibliography (if any).
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
          // setCitations() implicitly updates this.config.citationIDs
          me.setCitations(me.config.mode, e.data.citationData);
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
   * Initializes the processor, optionally populating it with a
   *   preexisting list of citations.
   *
   * @param {string} styleName The ID of a style
   * @param {string} localeName The ID of a locale
   * @param {Object[]} citationByIndex An array of citation objects with citationIDs
   * @return {void}
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
   * Registers a single citation in the processor to follow
   *   citations described by `preCitations` and precede those
   *   described in `postCitations`.
   *
   * @param {Object{}} citation A citation object
   * @param {Object[]} preCitations An array of `[citationID, noteNumber]` pairs in document order
   * @param {Object[]} postCitations An array of `[citationID, noteNumber]` pairs in document order
   * @return {void}
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

  /**
   * Converts the array returned by the processor `rebuildProcessor()` method
   * to the form digested by our own `setCitations()` method.
   *
   * rebuildData has this structure:
   *    [<citation_id>, <note_number>, <citation_string>]
   *
   * setCitations() wants this structure:
   *    [<citation_index>, <citation_string>, <citation_id>]
   *
   * @param {Object[]} rebuildData An array of values for insertion of citations into a document
   * @return {Object[]}
   */
  convertRebuildDataToCitationData(rebuildData: object[]): object[] {
    if (!rebuildData) return;
    this.debug("convertRebuildDataToCitationData()");
    var citationData = rebuildData.map(function (obj) {
      return [0, obj[2], obj[0]];
    });
    for (var i = 0; i < citationData.length; i++) {
      citationData[i][0] = i;
    }
    return citationData;
  }

  getCitationsByTag = function (tag: string) {
    var citations = null;
    Word.run(async function (context) {
      citations = context.document.contentControls.getByTag(tag);
      await context.sync();
    }).catch(function (error) {
      console.log("Error: " + error);
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
    return citations;
  };
  getCitationById = function (id: string) {
    var citations = null;
    Word.run(async function (context) {
      citations = context.document.contentControls.getByTitle(id);
      await context.sync();
    }).catch(function (error) {
      console.log("Error: " + error);
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
    return citations;
  };

  /**
   * Function to be run immediately after document has been loaded, and
   *   before any editing operations.
   *
   * @return {void}
   */

  /**
   * Update all citations based on data returned by the processor.
   * The update has two effects: (1) the id of all in-text citation
   * nodes is set to the processor-assigned citationID; and (2)
   * citation texts are updated. For footnote styles, the footnote
   * block is regenerated from scratch, using hidden text stored
   * in the citation elements.
   *
   * @param {string} mode The mode of the current style, either `in-text` or `note`
   * @param {Object[]} data An array of elements with the form `[citationIndex, citationText, citationID]`
   * @return {void}
   */
  setCitations(mode: string, data: object[]): void {
    this.debug("setCitations()");

    // Assure that every citation node has citationID
    var citationNodes = this.getCitationsByTag("citation");
    for (var i = 0, ilen = data.length; i < ilen; i++) {
      var pos = data[i][0];
      var citationNode = citationNodes[pos];
      var citationID = this.config.citationByIndex[pos].citationID;
      if (!citationNode.hasAttribute("id") || citationNode.getAttribute("id") !== citationID) {
        citationNode.setAttribute("id", citationID);
      }
    }
    // Update citationIdToPos for all nodes
    for (var i = 0, ilen = citationNodes.length; i < ilen; i++) {
      const citationID = citationNodes[i].getAttribute("id");
      this.config.citationIdToPos[citationID] = i;
    }
    // Update data on all nodes in the return
    for (var i = 0, ilen = data.length; i < ilen; i++) {
      var dataNode = doc.getElementById("csdata-" + data[i][2]);
      if (!dataNode) {
        dataNode = doc.createElement("div");
        dataNode.setAttribute("id", "csdata-" + data[i][2]);
        dataNode.classList.add("citation-data");
        var inlineData = btoa(JSON.stringify(this.config.citationByIndex[this.config.citationIdToPos[data[i][2]]]));
        dataNode.innerHTML = inlineData;
        citesupportDataContainer.appendChild(dataNode);
      } else {
        var inlineData = btoa(JSON.stringify(this.config.citationByIndex[this.config.citationIdToPos[data[i][2]]]));
        dataNode.innerHTML = inlineData;
      }
    }

    var citationNodes = document.getElementsByClassName("citation");
    for (let i = 0; i < data.length; i++) {
      var citationNode = citationNodes[data[i][0]];
      var citationID = data[i][2];
      if (!citationNode.getAttribute("id")) {
        citationNode.setAttribute("id", citationID);
        // citationIdToPos isn't used for anything other than (optionally) validation
        var citations = document.getElementsByClassName("citation");
        for (var j = 0; j < citations.length; j++) {
          var citation = citations[j];
          if (citation && citation.getAttribute && citation.getAttribute("id") === citationID) {
            // NOTE: If stashing data on citation nodes, that should happen here.
            this.config.citationIdToPos[citationID] = j;
          }
        }
      }
    }

    /*
     * Pseudo-code
     *
     * (1) Open a menu at current document position.
     *   (a) Set a class:citation span placeholder if necessary.
     *   (b) Hang menu off of class:citation span.
     * (2) Perform click-handler from menu, which:
     *   * If no citationID on class:citation span ...
     *      ... and empty menu: just deletes the node.
     *      ... and menu content: file request w/empty citationID
     *   * If has citationID on class:citation span ...
     *      ... and empty menu, then ...
     *           ... if now no citations, file init request.
     *           ... if still citations, refile 1st citation.
     *      ... and menu content: file request w/citationID
     */

    if (mode === "note") {
      var footnoteContainer = document.getElementById("footnote-container");
      if (data.length) {
        footnoteContainer.hidden = false;
      } else {
        footnoteContainer.hidden = true;
      }
      for (var i = 0; i < data.length; i++) {
        // Get data for each cite for update (ain't pretty)
        var tuple = data[i];
        var citationID = tuple[2];
        var citationNode = document.getElementById(citationID);
        var citationText = tuple[1];
        var citationIndex = tuple[0];
        var footnoteNumber = citationIndex + 1;

        // The footnote update is tricky and hackish because
        // HTML has no native mechanism for binding
        // footnote markers to footnotes proper.
        //
        //   (1) We write the citationText in a hidden sibling to
        // the in-text note number. This gives us a persistent
        // record of the footnote text.
        //
        //   (2) We then (later) iterate over the citation
        // nodes to regenerate the footnote block from scratch.
        citationNode.innerHTML =
          '<span class="footnote-mark">' + footnoteNumber + '</span><span hidden="true">' + citationText + "</span>";
      }
      // Reset the number on all footnote markers
      // (the processor does not issue updates for note-number-only changes)
      var footnoteMarkNodes = document.getElementsByClassName("footnote-mark");
      for (var i = 0; i < footnoteMarkNodes.length; i++) {
        var footnoteMarkNode = footnoteMarkNodes[i];
        footnoteMarkNode.innerHTML = i + 1;
      }
      // Remove all footnotes
      var footnotes = document.getElementsByClassName("footnote");
      for (var i = footnotes.length - 1; i > -1; i--) {
        footnotes[i].parentNode.removeChild(footnotes[i]);
      }
      // Regenerate all footnotes from hidden texts
      var citationNodes = document.getElementsByClassName("citation");
      for (var i = 0; i < citationNodes.length; i++) {
        var footnoteText = citationNodes[i].childNodes[1].innerHTML;
        var footnoteNumber = i + 1;
        var footnote = document.createElement("div");
        footnote.classList.add("footnote");
        footnote.innerHTML =
          '<span class="footnote"><span class="footnote-number">' +
          footnoteNumber +
          '</span><span class="footnote-text">' +
          footnoteText +
          "</span></span>";
        footnoteContainer.appendChild(footnote);
      }
    } else {
      var footnoteContainer = document.getElementById("footnote-container");
      footnoteContainer.hidden = true;
      for (var i = 0; i < data.length; i++) {
        var tuple = data[i];
        var citationID = tuple[2];
        var citationNode = document.getElementById(citationID);
        var citationText = tuple[1];
        citationNode.innerHTML = citationText;
      }
    }
  }

  /**
   * Replace bibliography with xHTML returned by the processor.
   *
   * @param {Object[]} data An array consisting of [0] an object with style information and [1] an array of serialized xHMTL bibliography entries.
   */
  setBibliography(data: object[]) {
    this.debug("setBibliography()");
    var bibContainer = document.getElementById("bibliography-container");
    if (!data || !data[1] || data[1].length === 0) {
      bibContainer.hidden = true;
      return;
    }
    var bib = document.getElementById("bibliography");
    bib.setAttribute("style", "visibility: hidden;");
    bib.innerHTML = data[1].join("\n");
    var entries = document.getElementsByClassName("csl-entry");
    if (data[0].hangingindent) {
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        entry.setAttribute("style", "padding-left: 1.3em;text-indent: -1.3em;");
      }
      bibContainer.hidden = false;
      bib.setAttribute("style", "visibility: visible;");
    } else if (data[0]["second-field-align"]) {
      var offsetSpec = "padding-right:0.3em;";
      if (data[0].maxoffset) {
        offsetSpec = "width: " + (data[0].maxoffset / 2 + 0.5) + "em;";
      }
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        entry.setAttribute("style", "white-space: nowrap;");
      }
      var numbers = document.getElementsByClassName("csl-left-margin");
      for (var i = 0; i < numbers.length; i++) {
        var number = numbers[i];
        number.setAttribute("style", "display:inline-block;" + offsetSpec);
      }
      if (data[0].maxoffset) {
        // cheat
        var widthSpec = "";
        var texts = document.getElementsByClassName("csl-right-inline");
        var containerWidth = document.getElementById("dynamic-editing").offsetWidth;
        var numberWidth = data[0].maxoffset * (90 / 9);
        widthSpec = "width:" + (containerWidth - numberWidth - 20) + "px;";
        for (var i = 0; i < texts.length; i++) {
          var text = texts[i];
          text.setAttribute("style", "display: inline-block;white-space: normal;" + widthSpec);
        }
        bibContainer.hidden = false;
        bib.setAttribute("style", "visibility: visible;");
      } else {
        bibContainer.hidden = false;
        bib.setAttribute("style", "visibility: visible;");
      }
    } else {
      bibContainer.hidden = false;
      bib.setAttribute("style", "visibility: visible;");
    }
  }
  /**
   * Set or acquire a citation node for editing. If the node is
   * newly set, it will not have a processor-assigned citationID.
   * The presence or absence of citationID is used in later code to
   * determine how to handle a save operation.
   *
   * This is demo code: replace it with something more sophisticated
   * for production.
   *
   * @param {Event} e An event generated by the DOM
   */
  citationWidgetHandler(e) {
    citesupport.debug("citationWidgetHandler()");

    // In the demo, citations are set on a "citeme peg"
    // hard-coded into the document.
    //
    // If the peg has a citation node as its following sibling,
    // open it for editing.
    //
    // If the peg is not followed by a citation node, add
    // one and open it for editing.

    var peg = e.target;
    var sibling = peg.nextSibling;
    var hasCitation = sibling && sibling.classList && sibling.classList.contains("citation");
    var citation;
    if (hasCitation) {
      citation = sibling;
    } else {
      citation = document.createElement("span");
      citation.classList.add("citation");
      peg.parentNode.insertBefore(citation, peg.nextSibling);
    }
    citesupport.citationWidget(citation);
  }

  /**
   * Replace citation span nodes and get ready to roll. Puts
   *   document into the state it would have been in at first
   *   opening had it been properly saved.
   *
   * @return {void}
   */
  spoofDocument(): void {
    this.debug("spoofDocument()");

    // Stage 1: Check that all array items have citationID
    var citationIDs = {};
    for (var i = 0; i > this.config.citationByIndex.length; i++) {
      var citation = this.config.citationByIndex[i];
      if (!this.config.citationIDs[citation.citationID]) {
        this.debug("WARNING: encountered a stored citation that was invalid or had no citationID. Removing citations.");
        this.safeStorage.citationByIndex = [];
        this.safeStorage.citationIdToPos = {};
        break;
      }
      citationIDs[citation.citationID] = true;
    }
    this.config.citationIDs = citationIDs;

    // Stage 2: check that all citation locations are in posToCitationId with existing citationIDs and have span tags set
    var pegs;
    if (this.config.demo) {
      pegs = document.getElementsByClassName("citeme");
    } else {
      pegs = document.getElementsByClassName("citation");
    }
    for (var i = 0; i < this.config.citationByIndex.length; i++) {
      var citation = this.config.citationByIndex[i];
      var citationID = citation ? citation.citationID : null;
      if ("number" !== typeof this.config.citationIdToPos[citationID]) {
        this.debug("WARNING: invalid state data. Removing citations.");
        this.safeStorage.citationByIndex = [];
        this.safeStorage.citationIdToPos = {};
        break;
      } else if (this.config.demo) {
        var citationNode = document.createElement("span");
        citationNode.classList.add("citation");
        citationNode.setAttribute("id", citationID);
        var peg = pegs[this.config.citationIdToPos[citationID]];
        peg.parentNode.insertBefore(citationNode, peg.nextSibling);
      }
    }

    // Stage 3: check that number of citation nodes and number of stored citations matches
    var objectLength = citesupport.config.citationByIndex.length;
    var nodeLength = document.getElementsByClassName("citation").length;
    if (objectLength !== nodeLength) {
      this.debug("WARNING: document citation node and citation object counts do not match. Removing citations.");
      this.safeStorage.citationByIndex = [];
      this.safeStorage.citationIdToPos = {};
      var citations = document.getElementsByClassName("citation");
      for (var i = 0; i < citations.length; i++) {
        citations[0].parentNode.removeChild(citations[0]);
      }
    }
  }

  initDocument = function () {
    this.debug("initDocument()");
    this.spoofDocument();
    this.callInitProcessor(this.config.defaultStyle, this.config.defaultLocale, this.config.citationByIndex);
  };

  /**
   * Build a menu to set the style and trigger reinstantiation of
   *   the processor. This menu will be needed in all deployments,
   *   but is not part of the processor code itself.
   *
   * @return {void}
   */
  buildStyleMenu() {
    this.debug("buildStyleMenu()");
    var styleData = [
      {
        title: "ACM Proceedings",
        id: "acm-sig-proceedings",
      },
      {
        title: "AMA",
        id: "american-medical-association",
      },
      {
        title: "Chicago (author-date)",
        id: "chicago-author-date",
      },
      {
        title: "Chicago (full note)",
        id: "jm-chicago-fullnote-bibliography",
      },
      {
        title: "DIN-1505-2 (alpha)",
        id: "din-1505-2-alphanumeric",
      },
      {
        title: "JM Indigo",
        id: "jm-indigobook",
      },
      {
        title: "JM Indigo (L. Rev.)",
        id: "jm-indigobook-law-review",
      },
      {
        title: "JM OSCOLA",
        id: "jm-oscola",
      },
    ];
    var defaultStyle = this.safeStorage.defaultStyle;
    var stylesMenu = document.getElementById("citation-styles");
    for (var i = 0; i < styleData.length; i++) {
      var styleDatum = styleData[i];
      var option = document.createElement("option");
      option.setAttribute("value", styleDatum.id);
      if (styleDatum.id === defaultStyle) {
        option.selected = true;
      }
      option.innerHTML = styleDatum.title;
      stylesMenu.appendChild(option);
    }
  }

  /**
   * Listen for selections on the style menu, and initialize the processor
   *   for the selected style.
   *
   * @return {void}
   */
  setStyleListener() {
    this.debug("setStyleListener()");
    document.body.addEventListener("change", function (e) {
      if (e.target.getAttribute("id") === "citation-styles") {
        citesupport.debug("SET STYLE TO: " + e.target.value);
        citesupport.safeStorage.defaultStyle = e.target.value;
        citesupport.callInitProcessor(
          citesupport.config.defaultStyle,
          citesupport.config.defaultLocale,
          citesupport.config.citationByIndex
        );
      }
    });
  }
}

var citesupport = new CiteSupport();

window.addEventListener("load", function (e) {
  citesupport.spoofDocument();
  citesupport.initDocument();
  citesupport.setStyleListener();
});
