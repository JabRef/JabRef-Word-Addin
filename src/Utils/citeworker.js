import CSL from "citeproc";

var itemsObj = {};
var jurisdictionsObj = {};
var style = null;
var localesObj = null;
var preferredLocale = null;
var citeproc = null;
var citationByIndex = null;
var abbreviationObj = {
  default: {
    "container-title": {
      "English Reports": "!authority>>>E.R.",
      "Archives of Dermatological Research": "Arch. Dermatol.",
      "British Medical Journal": "Brit. Med. J.",
    },
    "collection-title": {},
    "institution-entire": {},
    "institution-part": {
      "court.appeals": "!here>>>",
      "House of Lords": "HL",
    },
    nickname: {},
    number: {},
    title: {},
    place: {
      us: "!here>>>",
      "us:c9": "9th Cir.",
    },
    hereinafter: {},
    classic: {},
  },
};
var emptyAbbreviationObj = {
  "container-title": {},
  "collection-title": {},
  "institution-entire": {},
  "institution-part": {},
  nickname: {},
  number: {},
  title: {},
  place: {},
  hereinafter: {},
  classic: {},
};
var sys = {
  retrieveItem: function (itemID) {
    return itemsObj[itemID];
  },
  retrieveLocale: function (locale) {
    return localesObj[locale];
  },
  retrieveStyleModule: function (jurisdiction, preference) {
    return jurisdictionsObj[jurisdiction];
  },
  getAbbreviation: function (listname, obj, jurisdiction, category, key) {
    if (!obj[jurisdiction]) {
      obj[jurisdiction] = JSON.parse(JSON.stringify(emptyAbbreviationObj));
    }
    obj[jurisdiction][category][key] = abbreviationObj["default"][category][key];
    return jurisdiction;
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
  } else if (type === "juris") {
    filename = "juris-" + filename + ".csl";
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
    var locales = extractRawLocales(style, localeName);
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
  getItems(
    null,
    itemIDs,
    function (callback) {
      getJurisdictions(null, itemIDs, callback);
    },
    function () {
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
    }
  );
}

function getItems(d, itemIDs, itemsCallback, jurisdictionsCallback) {
  // Fetch locales, call buildProcessor()
  fetchItem(0, itemIDs, itemsCallback, jurisdictionsCallback);
}

function fetchItem(pos, itemIDs, itemsCallback, jurisdictionsCallback) {
  if (pos === itemIDs.length) {
    itemsCallback(jurisdictionsCallback);
    return;
  }
  getFileContent("items", itemIDs[pos], function (txt) {
    var itemID = itemIDs[pos];
    itemsObj[itemID] = JSON.parse(txt);
    fetchItem(pos + 1, itemIDs, itemsCallback, jurisdictionsCallback);
  });
}

function getJurisdictions(d, itemIDs, jurisdictionsCallback) {
  // Installs jurisdiction style modules required by an
  // item in the processor context.
  var jurisdictionIDs = [];
  for (var i = 0, ilen = itemIDs.length; i < ilen; i++) {
    var itemID = itemIDs[i];
    var item = itemsObj[itemID];
    if (item.jurisdiction) {
      var lst = item.jurisdiction.split(":");
      for (var j = 0, jlen = lst.length; j < jlen; j++) {
        var jurisdiction = lst.slice(0, j + 1).join(":");
        if (!jurisdictionsObj[jurisdiction] && jurisdictionIDs.indexOf(jurisdiction) === -1) {
          jurisdictionIDs.push(jurisdiction);
        }
      }
    }
  }
  fetchJurisdiction(0, jurisdictionIDs, jurisdictionsCallback);
}

function fetchJurisdiction(pos, jurisdictionIDs, jurisdictionsCallback) {
  if (pos === jurisdictionIDs.length) {
    jurisdictionsCallback();
    return;
  }
  getFileContent("juris", jurisdictionIDs[pos], function (txt) {
    var jurisdictionID = jurisdictionIDs[pos];
    if (txt) {
      jurisdictionsObj[jurisdictionID] = txt;
    }
    fetchJurisdiction(pos + 1, jurisdictionIDs, jurisdictionsCallback);
  });
}

onmessage = function (e) {
  var d = e.data;
  switch (d.command) {
    case "initProcessor":
      preferredLocale = d.localeName;
      citationByIndex = d.citationByIndex;
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
      getItems(
        d,
        itemFetchLst,
        function (callback) {
          getJurisdictions(d, itemFetchLst, callback);
        },
        function () {
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
        }
      );
      break;
    case "getBibliography":
      getItems(function () {
        const bibRes = null;
        if (citeproc.bibliography.tokens.length) {
          bibRes = citeproc.makeBibliography();
        }
        postMessage({
          command: "registerCitation",
          result: "OK",
          bibliographyData: bibRes,
          citationByIndex: citeproc.registry.citationreg.citationByIndex,
        });
      });
  }
};
