import CSL from "citeproc";

var itemsObj = {};
var style = null;
var localesObj = null;
var preferredLocale = null;
var citeproc = null;
var citationByIndex = null;
var citationData = [];

const sys = {
  retrieveItem: function (itemID) {
    return itemsObj[itemID];
  },
  retrieveLocale: function (locale) {
    return localesObj[locale];
  },
};

function getFileContent(type, filename, callback) {
  var xhr = new XMLHttpRequest();
  if (type === "styles") {
    filename = filename + ".csl";
  } else if (type === "locales") {
    filename = "locales-" + filename + ".xml";
  } else if (type === "items") {
    filename = filename + ".json";
  }
  var url = "../data/" + type + "/" + filename;

  xhr.open("GET", url);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(xhr.responseText);
      } else {
        callback();
      }
    }
  };
  xhr.send(null);
}

function getStyle(styleName, localeName) {
  // Fetch style, call getLocales()
  getFileContent("styles", styleName, function (txt) {
    style = txt;
    let locales = extractRawLocales(style, localeName);
    locales = normalizeLocales(locales);
    getLocales(locales);
  });
}

function extractRawLocales(style, localeName) {
  var locales = ["en-US"];
  if (localeName) {
    locales.push(localeName);
  }
  var m = style.match(/locale=\"[^\"]+\"/g);
  if (m) {
    for (var i = 0, ilen = m.length; i < ilen; i++) {
      var vals = m[i].slice(0, -1).slice(8).split(/\s+/);
      for (var j = 0, jlen = vals.length; j < jlen; j++) {
        var val = vals[j];
        locales.push(val);
      }
    }
  }
  return locales;
}

function normalizeLocales(locales) {
  var obj = {};
  for (var i = 0, ilen = locales.length; i < ilen; i++) {
    var locale = locales[i];
    locale = locale.split("-").slice(0, 2).join("-");
    if (CSL.LANGS[locale]) {
      obj[locale] = true;
    } else {
      locale = locale.split("-")[0];
      if (CSL.LANG_BASES[locale]) {
        locale = CSL.LANG_BASES[locale].split("_").join("-");
        obj[locale] = true;
      }
    }
  }
  return Object.keys(obj);
}

function getLocales(locales) {
  // Fetch locales, call buildProcessor()
  localesObj = {};
  fetchLocale(0, locales, function () {
    buildProcessor();
  });
}

function fetchLocale(pos, locales, callback) {
  if (pos === locales.length) {
    callback();
    return;
  }
  getFileContent("locales", locales[pos], function (txt) {
    var locale = locales[pos];
    localesObj[locale] = txt;
    fetchLocale(pos + 1, locales, callback);
  });
}

function buildProcessor() {
  citeproc = new CSL.Engine(sys, style, preferredLocale);
  var itemIDs = [];

  if (citationByIndex) {
    for (var i = 0, ilen = citationByIndex.length; i < ilen; i++) {
      var citation = citationByIndex[i];
      for (var j = 0, jlen = citation.citationItems.length; j < jlen; j++) {
        var itemID = citation.citationItems[j].id;
        itemIDs.push(itemID);
      }
      // Set note numbers for style, assuming that all notes are citesupport notes
      if (citeproc.opt.xclass === "note") {
        citation.properties.noteIndex = i + 1;
      } else {
        citation.properties.noteIndex = 0;
      }
    }
  }

  getItems(null, itemIDs, function () {
    var rebuildData = null;
    if (citationByIndex) {
      rebuildData = citeproc.rebuildProcessorState(citationByIndex);
    }
    citationByIndex = null;
    var bibRes = null;
    if (citeproc.bibliography.tokens.length) {
      bibRes = citeproc.makeBibliography();
    }
    postMessage({
      command: "initProcessor",
      xclass: citeproc.opt.xclass,
      citationByIndex: citeproc.registry.citationreg.citationByIndex,
      rebuildData: rebuildData,
      bibliographyData: bibRes,
      result: "OK",
    });
  });
}

function getItems(d, itemIDs, itemsCallback) {
  // Fetch locales, call buildProcessor()
  fetchItem(0, itemIDs, itemsCallback);
}

function fetchItem(pos, itemIDs, itemsCallback) {
  if (pos === itemIDs.length) {
    itemsCallback();
    return;
  }
  const citation = getCitationData(itemIDs[pos]);
  const itemID = itemIDs[pos];
  itemsObj[itemID] = citation;
  fetchItem(pos + 1, itemIDs, itemsCallback);
}
function getCitationData(itemID) {
  return citationData.find((x) => x.id === itemID);
}

onmessage = function (e) {
  console.log("i am web worker and i have received your message");
  var d = e.data;
  switch (d.command) {
    case "initProcessor":
      console.log("hi i am webworker");
      preferredLocale = d.localeName;
      citationByIndex = d.citationByIndex;
      citationData = d.citationData;
      getStyle(d.styleName, d.localeName);
      break;
    case "registerCitation":
      var itemFetchLst = [];
      for (var i = 0, ilen = d.citation.citationItems.length; i < ilen; i++) {
        var itemID = d.citation.citationItems[i].id;
        if (!itemsObj[itemID]) {
          itemFetchLst.push(itemID);
        }
      }
      // First callback is executed after items are fetched
      // Second callback is executed after jurisdictions are fetched
      getItems(d, itemFetchLst, function () {
        var citeRes = citeproc.processCitationCluster(d.citation, d.preCitations, d.postCitations);
        var bibRes = null;
        if (citeproc.bibliography.tokens.length) {
          bibRes = citeproc.makeBibliography();
        }
        postMessage({
          command: "registerCitation",
          result: "OK",
          citationData: citeRes[1],
          bibliographyData: bibRes,
          citationByIndex: citeproc.registry.citationreg.citationByIndex,
        });
      });
      break;
    case "getBibliography":
      getItems(null, null, function () {
        let bibRes = null;
        if (citeproc.bibliography.tokens.length) {
          bibRes = citeproc.makeBibliography();
        }
        postMessage({
          command: "registerCitation",
          result: "OK",
          bibliographyData: bibRes,
        });
      });
      break;
  }
};
