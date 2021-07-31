import CSL, {
  Citation,
  CitationKind,
  CitationResult,
  Engine,
  GeneratedBibliography,
  MetaData,
  RebuildProcessorStateData,
  StatefulCitation,
} from "citeproc";

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as never;
const itemsObj: Record<string, MetaData> = {};
const localesObj: Record<string, string> = {};
let style: string;
let preferredLocale: string;
let citeproc: Engine | null = null;
let citationByIndex: Array<StatefulCitation>;
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
  preCitations: Array<[string, number]>;
  postCitations: Array<[string, number]>;
};

export type CiteWorkerRegisterCitationMessage = {
  command: "registerCitation";

  citationData: CitationResult[];
  citationByIndex: StatefulCitation[];
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
  ctx.postMessage(message);
}

function buildLocalesObj(locales: string): void {
  const locale = locales != null ? locales : "en-US";
  localesObj[locale] = getLocale(locale);
}

function buildItemsObj(itemIDs: Array<string | number>): void {
  itemIDs.forEach((itemID: string) => {
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
  preCitations: Array<[string, number]>,
  postCitations: Array<[string, number]>
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

ctx.addEventListener("message", (ev: MessageEvent<CiteWorkerCommand>) => {
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
