import CSL, {
  Citation,
  CitationKind,
  CitationResult,
  Engine,
  GeneratedBibliography,
  Locator,
  MetaData,
  RebuildProcessorStateData,
  StatefulCitation,
} from "citeproc";

// eslint-disable-next-line no-restricted-globals
const worker: Worker = self as never;

/** A javaScript object maping citationitem id to metadata */
const itemsObj: Record<string, MetaData> = {};

/** A javaScript object maping RFC 5646 lang tag to serialized XML string */
const localesObj: Record<string, string> = {};

/** CSL style as serialized XML (if xmldom.js is used) or as JavaScript object (if xmljson.js is used). */
let style: string;

/** Language tag compliant with RFC 5646. Defaults to en. */
let preferredLocale: string;

/** citeproc instance */
let citeproc: Engine | null = null;

let citationByIndex: Array<StatefulCitation>;

/** referenceData is a single bundle of metadata
 *  for a source to be referenced. Every item must
 *  have an id and a type.
 */
let referenceData: Array<MetaData>;

export type CiteWorkerInitProcessorCommand = {
  command: "initProcessor";

  styleName: string;
  localeName: string;
  citationByIndex: Array<StatefulCitation>;
  referenceData: Array<MetaData>;
};

export type CiteWorkerInitProcessorMessage = {
  command: "initProcessor";

  xclass: CitationKind;
  citationByIndex: StatefulCitation[];
  rebuildData: RebuildProcessorStateData[];
  bibliographyData: GeneratedBibliography;
  result: string;
};

export type CiteWorkerRegisterCitationCommand = {
  command: "registerCitation";

  citation: Citation;
  preCitations: Locator;
  postCitations: Locator;
};

export type CiteWorkerRegisterCitationMessage = {
  command: "registerCitation";

  citationData: CitationResult[];
  citationByIndex: StatefulCitation[];
  bibliographyData: GeneratedBibliography;
  result: string;
};

export type CiteWorkerGetBibliographyCommand = {
  command: "getBibliography";
};

export type CiteWorkerSetBibliographyMessage = {
  command: "setBibliography";

  bibliographyData: GeneratedBibliography;
  result: string;
};

export type CiteWorkerError = {
  command: "error";

  error: string;
};

export type CiteWorkerCommand =
  | CiteWorkerInitProcessorCommand
  | CiteWorkerRegisterCitationCommand
  | CiteWorkerGetBibliographyCommand;

export type CiteWorkerMessage =
  | CiteWorkerInitProcessorMessage
  | CiteWorkerRegisterCitationMessage
  | CiteWorkerSetBibliographyMessage
  | CiteWorkerError;

/**
 * Two locally defined synchronous functions on the sys object must be supplied to acquire runtime inputs.
 *
 * retrieveLocale: The retrieveLocale() function fetches CSL locales needed at runtime. The function takes a single
 *                 RFC 5646 language tag as its sole argument, and returns a locale object. The return may
 *                 be a serialized XML string, an E4X object, a DOM document, or a JSON or JavaScript
 *                 representation of the locale XML. If the requested locale is not available, the function
 *                 must return a value that tests false. The function must return a value for the us locale.
 *
 * retrieveItem:   The retrieveItem() function fetches citation data for an item. The function takes an item ID
 *                 as its sole argument, and returns a JavaScript object in CSL JSON format.
 */
const sys = {
  retrieveItem(itemID: string | number): MetaData {
    return itemsObj[itemID];
  },
  retrieveLocale(lang: string): string {
    return localesObj[lang];
  },
};

function getLocale(localeId: string): string {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://raw.githubusercontent.com/Juris-M/citeproc-js-docs/master/locales-${localeId}.xml`,
    false
  );
  xhr.send(null);
  return xhr.responseText;
}

function getStyle(styleID: string): string {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://raw.githubusercontent.com/citation-style-language/styles/master/${styleID}.csl`,
    false
  );
  xhr.send(null);
  return xhr.responseText;
}

function reportBack(message: CiteWorkerMessage): void {
  worker.postMessage(message);
}

function buildLocalesObj(locales: string): void {
  const locale = locales != null ? locales : "en-US";
  localesObj[locale] = getLocale(locale);
}

function buildItemsObj(itemIDs: Array<string | number>): void {
  itemIDs.forEach((itemID) => {
    itemsObj[itemID] = referenceData.find((x) => x.id === itemID);
  });
}

function setPreferenceAndReferenceData(
  localeName: string,
  citationbyIndex: Array<StatefulCitation>,
  data: Array<MetaData>
): void {
  preferredLocale = localeName;
  citationByIndex = citationbyIndex;
  referenceData = data;
}

function makeBibliography(): GeneratedBibliography | null {
  if (citeproc.bibliography.tokens.length) {
    const result = citeproc.makeBibliography();
    if (!result) {
      return null;
    }
    return result;
  }
  return null;
}

function buildProcessor(styleID: string): void {
  try {
    style = getStyle(styleID);
    buildLocalesObj(preferredLocale);
    citeproc = new CSL.Engine(sys, style, preferredLocale);
    const itemIDs = [];
    if (citationByIndex) {
      citationByIndex.forEach((citation: StatefulCitation) => {
        citation.citationItems.forEach((item) => {
          itemIDs.push(item.id);
        });
      });
    }

    buildItemsObj(itemIDs);
    let rebuildData: CSL.RebuildProcessorStateData[] = [];
    if (citationByIndex) {
      rebuildData = citeproc.rebuildProcessorState(citationByIndex);
    }
    citationByIndex = null;
    reportBack({
      command: "initProcessor",
      xclass: citeproc.opt.xclass,
      citationByIndex: citeproc.registry.citationreg.citationByIndex,
      rebuildData,
      bibliographyData: makeBibliography(),
      result: "OK",
    });
  } catch (error) {
    reportBack({
      command: "error",
      error: JSON.stringify(error, ["name", "message", "stack"], 2),
    });
  }
}

function registerCitation(
  citation: Citation,
  preCitations: Locator,
  postCitations: Locator
): void {
  try {
    const itemFetchLst = citation.citationItems
      .filter((citationItem) => !itemsObj[citationItem.id])
      .map((citationItem) => citationItem.id);
    buildItemsObj(itemFetchLst);
    const citeRes = citeproc.processCitationCluster(
      citation,
      preCitations,
      postCitations
    );
    reportBack({
      command: "registerCitation",
      citationData: citeRes[1],
      citationByIndex: citeproc.registry.citationreg.citationByIndex,
      bibliographyData: makeBibliography(),
      result: "OK",
    });
  } catch (error) {
    reportBack({
      command: "error",
      error: JSON.stringify(error, ["name", "message", "stack"], 2),
    });
  }
}

function getBibliography(): void {
  try {
    reportBack({
      command: "setBibliography",
      bibliographyData: makeBibliography(),
      result: "OK",
    });
  } catch (error) {
    reportBack({
      command: "error",
      error: JSON.stringify(error, ["name", "message", "stack"], 2),
    });
  }
}

worker.addEventListener("message", (ev: MessageEvent<CiteWorkerCommand>) => {
  switch (ev.data.command) {
    case "initProcessor":
      setPreferenceAndReferenceData(
        ev.data.localeName,
        ev.data.citationByIndex,
        ev.data.referenceData
      );
      buildProcessor(ev.data.styleName);
      break;
    case "registerCitation":
      registerCitation(
        ev.data.citation,
        ev.data.preCitations,
        ev.data.postCitations
      );
      break;
    case "getBibliography":
      getBibliography();
      break;
    default:
  }
});

export default null as any;
