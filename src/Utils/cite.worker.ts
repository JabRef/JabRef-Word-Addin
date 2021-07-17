import CSL from "citeproc";

const ctx: Worker = self as any;
let itemsObj = {};
// var style = null;
// var localesObj = {};
let preferredLocale = null;
let citeproc = null;
let citationByIndex = null;
let citationData = [];

const sys = {
  retrieveItem: function (itemID: string | number) {
    return itemsObj[itemID];
  },
  retrieveLocale: function (lang: string) {
    let xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://raw.githubusercontent.com/Juris-M/citeproc-js-docs/master/locales-" + lang + ".xml",
      false
    );
    xhr.send(null);
    return xhr.responseText;
  },
};

async function buildProcessor(styleID: string) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "https://raw.githubusercontent.com/citation-style-language/styles/master/" + styleID + ".csl", false);
  xhr.send(null);
  let styleAsText = xhr.responseText;
  citeproc = new CSL.Engine(sys, styleAsText, preferredLocale);
  let itemIDs = [];
  if (citationByIndex) {
    citationByIndex.forEach((citation) => {
      citation.citationItems.forEach((item) => {
        itemIDs.push(item.id);
      });
      citation.properties.noteIndex = 0;
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
    rebuildData: rebuildData,
    bibliographyData: bibRes,
    result: "OK",
  });
}

function buildItemsObj(itemIDs: Array<string | number>) {
  itemIDs.forEach((itemID) => {
    itemsObj[itemID] = citationData.find((x) => x.id === itemID);
  });
}

ctx.addEventListener("message", async (e) => {
  const d = e.data;
  switch (d.command) {
    case "initProcessor":
      preferredLocale = d.localeName;
      citationByIndex = d.citationByIndex;
      citationData = d.citationData;
      await buildProcessor(d.styleName);
      break;
    case "registerCitation":
      var itemFetchLst = [];
      d.citation.citationItems.forEach((item) => {
        if (!itemsObj[item.id]) {
          itemFetchLst.push(item.id);
        }
      });
      buildItemsObj(itemFetchLst);
      var citeRes = citeproc.processCitationCluster(d.citation, d.preCitations, d.postCitations);
      var bibRes = null;
      ctx.postMessage({
        command: "registerCitation",
        result: "OK",
        citationData: citeRes[1],
        citationByIndex: citeproc.registry.citationreg.citationByIndex,
      });
      break;
    case "getBibliography":
      if (citeproc.bibliography.tokens.length) {
        bibRes = citeproc.makeBibliography();
      }
      ctx.postMessage({
        command: "getBibliography",
        result: "OK",
        bibliographyData: bibRes,
      });
      break;
  }
});
