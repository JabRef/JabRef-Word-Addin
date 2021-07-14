import axios from "axios";
import CSL from "citeproc";
var parseString = require("xml2js").parseString;

const ctx: Worker = self as any;
var itemsObj = {};
var style = null;
var localesObj = null;
var preferredLocale = null;
var citeproc = null;
var citationByIndex = null;
var citationData = [];

const sys = {
  retrieveItem: function (itemID: string | number) {
    return itemsObj[itemID];
  },
  retrieveLocale: function (locale: string | number) {
    return localesObj[locale];
  },
};

async function getFileContent(type: string, filename: string) {
  if (type === "styles") {
    filename = filename + ".csl";
  } else if (type === "locales") {
    filename = "locales-" + filename + ".xml";
  }
  const url = "../data/" + type + "/" + filename;
  console.log("axios call", url);
  const resp = await fetch(url);
  console.log(resp.text());
  return resp.text();
}

async function getLocales(localeName: string) {
  console.log("inside loxales");
  localesObj[localeName] = await getFileContent("locales", localeName);
  console.log("localesObj");
}

async function buildProcessor(styleName: string) {
  style = await getFileContent("styles", styleName);
  citeproc = new CSL.Engine(sys, style, preferredLocale);
  var itemIDs = [];
  if (citationByIndex) {
    citationByIndex.forEach((citation) => {
      citation.citationItems.forEach((item) => {
        itemIDs.push(item.id);
      });
      citation.properties.noteIndex = 0;
    });
  }

  buildItemsObj(itemIDs);
  var rebuildData = null;
  if (citationByIndex) {
    rebuildData = citeproc.rebuildProcessorState(citationByIndex);
  }
  citationByIndex = null;
  var bibRes = null;
  if (citeproc.bibliography.tokens.length) {
    bibRes = citeproc.makeBibliography();
  }
  console.log("sending back");
  ctx.postMessage({
    command: "initProcessor",
    xclass: citeproc.opt.xclass,
    citationByIndex: citeproc.registry.citationreg.citationByIndex,
    rebuildData: rebuildData,
    bibliographyData: bibRes,
    result: "OK",
  });
}

function buildItemsObj(itemIDs) {
  itemIDs.forEach((itemID) => {
    itemsObj[itemID] = citationData.find((x) => x.id === itemID);
  });
}

ctx.addEventListener("message", async (e) => {
  console.log("i have received msg");
  const d = e.data;
  switch (d.command) {
    case "initProcessor":
      console.log(d.styleName);
      preferredLocale = d.localeName;
      citationByIndex = d.citationByIndex;
      citationData = d.citationData;
      await getLocales(d.localeName);
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
      if (citeproc.bibliography.tokens.length) {
        bibRes = citeproc.makeBibliography();
      }
      ctx.postMessage({
        command: "registerCitation",
        result: "OK",
        citationData: citeRes[1],
        bibliographyData: bibRes,
        citationByIndex: citeproc.registry.citationreg.citationByIndex,
      });
      break;
    case "getBibliography":
      if (citeproc.bibliography.tokens.length) {
        bibRes = citeproc.makeBibliography();
      }
      ctx.postMessage({
        command: "registerCitation",
        result: "OK",
        bibliographyData: bibRes,
      });
      break;
  }
});
