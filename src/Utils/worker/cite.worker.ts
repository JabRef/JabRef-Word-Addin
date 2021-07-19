import CSL, { MetaData as reference, Citation, CitationRegistry } from "citeproc";

const ctx: Worker = self as any;
let itemsObj = {};
let style = null;
let localesObj = {};
let preferredLocale = null;
let citeproc = null;
let citationByIndex = null;
let referenceData = [];

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
  retrieveItem: function (itemID: string | number) {
    return itemsObj[itemID];
  },
  retrieveLocale: function (lang: string) {
    return localesObj[lang];
  },
};

function getLocale(localeId: string) {
  let xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://raw.githubusercontent.com/Juris-M/citeproc-js-docs/master/locales-" + localeId + ".xml",
    false
  );
  xhr.send(null);
  return xhr.responseText;
}

function getStyle(styleID: string) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "https://raw.githubusercontent.com/citation-style-language/styles/master/" + styleID + ".csl", false);
  xhr.send(null);
  return xhr.responseText;
}

function buildLocalesObj(locales: Array<string>) {
  if (locales) {
    locales.push("en-US");
  }
  locales.forEach((locale) => {
    localesObj[locale] = getLocale(locale);
  });
}

function buildItemsObj(itemIDs: Array<string | number>) {
  itemIDs.forEach((itemID) => {
    itemsObj[itemID] = referenceData.find((x) => x.id === itemID);
  });
}

function setPreferenceAndReferenceData(localeName: string, citationbyIndex: CitationRegistry, data: Array<reference>) {
  preferredLocale = localeName;
  citationByIndex = citationbyIndex;
  referenceData = data;
}

async function buildProcessor(styleID: string) {
  style = getStyle(styleID);
  citeproc = new CSL.Engine(sys, style, preferredLocale);
  let itemIDs = [];
  if (citationByIndex) {
    citationByIndex.forEach(function (citation) {
      citation.citationItems.forEach((item) => {
        itemIDs.push(item.id);
      });
      this.citation.properties.noteIndex = 0;
    }, citationByIndex);
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
    rebuildData: rebuildData,
    bibliographyData: bibRes,
    result: "OK",
  });
}

function registerCitation(
  citation: Citation,
  preCitations: Array<[string, number]>,
  postCitations: Array<[string, number]>
) {
  const itemFetchLst = citation.citationItems.map((citation: CitationItem): string => {
    if (!itemsObj[citation.id]) {
      return citation.id;
    }
  });
  buildItemsObj(itemFetchLst);
  const citeRes = citeproc.processCitationCluster(citation, preCitations, postCitations);
  ctx.postMessage({
    command: "registerCitation",
    citationData: citeRes[1],
    citationByIndex: citeproc.registry.citationreg.citationByIndex,
    result: "OK",
  });
}

function getBibliography() {
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

ctx.addEventListener("message", async (ev) => {
  switch (ev.data.command) {
    case "initProcessor":
      setPreferenceAndReferenceData(ev.data.localeName, ev.data.citationByIndex, ev.data.referenceData);
      await buildProcessor(ev.data.styleName);
      break;
    case "registerCitation":
      registerCitation(ev.data.citation, ev.data.preCitations, ev.data.postCitations);
      break;
    case "getBibliography":
      getBibliography();
      break;
  }
});
