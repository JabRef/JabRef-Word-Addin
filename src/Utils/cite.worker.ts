import CSL from "citeproc";

const ctx: Worker = self as any;
var itemsObj = {};
var style = null;
var localesObj = {};
var preferredLocale = null;
var citeproc = null;
var citationByIndex = null;
var citationData = [];

var sys = {
  retrieveItem: function (itemID: string | number) {
    return itemsObj[itemID];
  },
  retrieveLocale: function (lang) {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://raw.githubusercontent.com/Juris-M/citeproc-js-docs/master/locales-" + lang + ".xml",
      false
    );
    xhr.send(null);
    return xhr.responseText;
  },
};

// async function getFileContent(type: string, filename: string) {
//   if (type === "styles") {
//     filename = filename + ".csl";
//   } else if (type === "locales") {
//     filename = "locales-" + filename + ".xml";
//   }
//   const url = "../data/" + type + "/" + filename;
//   console.log("axios call", url);
//   const resp = await fetch(url).then((resp) => {
//     return resp.text();
//   });
//   return resp;
// }

// async function getLocales(localeName: string) {
//   localesObj[localeName] = await getFileContent("locales", localeName);
//   console.log(localesObj);
// }

// async function getStyles(styleName: any) {
//   style = await getFileContent("styles", styleName);
// }

async function buildProcessor(styleID) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://raw.githubusercontent.com/citation-style-language/styles/master/" + styleID + ".csl", false);
  xhr.send(null);
  var styleAsText = xhr.responseText;
  console.log("new citeproc instance");
  citeproc = new CSL.Engine(sys, styleAsText, preferredLocale);
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
  console.log("citeproc citationby index", citeproc.registry.citationreg.citationByIndex);
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
      console.log(itemsObj);
      buildItemsObj(itemFetchLst);
      var citeRes = citeproc.processCitationCluster(d.citation, d.preCitations, d.postCitations);
      console.log("citeproc citationby index", citeproc.registry.citationreg.citationByIndex);
      var bibRes = null;
      console.log(citeproc.bibliography.tokens.length);
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
        command: "registerCitation",
        result: "OK",
        bibliographyData: bibRes,
      });
      break;
  }
});
