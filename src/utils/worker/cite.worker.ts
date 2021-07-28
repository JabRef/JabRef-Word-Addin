/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import CSL, { Citation } from "citeproc";
import {
  citationByIndexInterface,
  referenceDataInterface,
} from "../cite-interface";

const ctx: Worker = self as any;
const itemsObj: Record<string, referenceDataInterface> = {};
const localesObj: Record<string, string> = {};
let style: string;
let preferredLocale: string;
let citeproc = null;
let citationByIndex: Array<citationByIndexInterface>;
let referenceData: Array<referenceDataInterface>; // User citation data

interface CitationItem {
  locator?: string;
  label?: string;
  "suppress-author"?: boolean;
  "author-only"?: boolean;
  prefix?: string;
  suffix?: string;
  id: string;
}

const sys = {
  retrieveItem(itemID: string | number): referenceDataInterface {
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
  citationbyIndex: Array<citationByIndexInterface>,
  data: Array<referenceDataInterface>
): void {
  preferredLocale = localeName;
  citationByIndex = citationbyIndex;
  referenceData = data;
}

function buildProcessor(styleID: string): void {
  style = getStyle(styleID);
  buildLocalesObj(preferredLocale);
  citeproc = new CSL.Engine(sys, style, preferredLocale);
  const itemIDs = [];
  if (citationByIndex) {
    citationByIndex.forEach((citation: citationByIndexInterface) => {
      citation.citationItems.forEach((item) => {
        itemIDs.push(item.id);
      });
    });
  }

  buildItemsObj(itemIDs);
  let rebuildData = null;
  if (citationByIndex) {
    rebuildData = citeproc.rebuildProcessorState(citationByIndex);
  }
  citationByIndex = null;
  let bibRes = null;
  if (citeproc.bibliography.tokens.length) {
    bibRes = citeproc.makeBibliography();
  }
  ctx.postMessage({
    command: "initProcessor",
    xclass: citeproc.opt.xclass,
    citationByIndex: citeproc.registry.citationreg.citationByIndex,
    rebuildData,
    bibliographyData: bibRes,
    result: "OK",
  });
}

function registerCitation(
  citation: Citation,
  preCitations: Array<[string, number]>,
  postCitations: Array<[string, number]>
): void {
  const itemFetchLst = citation.citationItems
    .filter(
      (citationItem: CitationItem): boolean =>
        itemsObj[citationItem.id] === null
    )
    .map((citationItem: CitationItem): string => citationItem.id);
  buildItemsObj(itemFetchLst);
  const citeRes = citeproc.processCitationCluster(
    citation,
    preCitations,
    postCitations
  );
  ctx.postMessage({
    command: "registerCitation",
    citationData: citeRes[1],
    citationByIndex: citeproc.registry.citationreg.citationByIndex,
    result: "OK",
  });
}

function getBibliography(): void {
  let bibRes = null;
  if (citeproc.bibliography.tokens.length) {
    bibRes = citeproc.makeBibliography();
  }
  ctx.postMessage({
    command: "setBibliography",
    bibliographyData: bibRes,
    result: "OK",
  });
}

ctx.addEventListener("message", (ev) => {
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
