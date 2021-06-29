import React, { useState } from "react";
import CSL from "citeproc";
import data from "../../utils/data";
import ReferenceList from "../components/ReferenceList";
import SearchField from "../components/SearchField";
import { DefaultButton, PrimaryButton } from "@fluentui/react";
/* global Word */

const dashboadStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

function containsSearchTerm(keyword: string) {
  return function (item) {
    return [item.title, item.author, item.year].some((str) =>
      str ? str.toLowerCase().includes(keyword.toLowerCase().trim()) : false
    );
  };
}
function onCheckboxChange(ev: React.FormEvent<HTMLElement | HTMLInputElement>) {
  return function (item) {
    if (item.title === ev.currentTarget.title) {
      return { ...item, isSelected: !item.isSelected };
    }
    return item;
  };
}
function unCheckAllCheckbox(item) {
  if (item.isChecked) {
    return { ...item, isSelected: !item.isSelected };
  }
  return item;
}

function Dashboard() {
  const originalItems = data.map((item) => ({ ...item, isSelected: false }));
  const [items, setItems] = useState(originalItems);
  const checked = items.filter(({ isSelected }) => isSelected).map(({ id }) => id);

  const onFilterChange = (_: any, keyword: string): void => {
    setItems(originalItems.filter(containsSearchTerm(keyword)));
  };

  const handleToggleChange = (ev: React.FormEvent<HTMLElement | HTMLInputElement>) => {
    setItems((currentItems) => {
      return currentItems.map(onCheckboxChange(ev));
    });
  };

  const unCheckAllEntries = () => {
    setItems((currentItems) => {
      return currentItems.map(unCheckAllCheckbox);
    });
  };

  const citeprocSys = {
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
    retrieveItem: function (id) {
      return data.find((x) => x.id === id);
    },
  };
  function getProcessor(styleID) {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://raw.githubusercontent.com/citation-style-language/styles/master/" + styleID + ".csl",
      false
    );
    xhr.send(null);
    var styleAsText = xhr.responseText;
    var citeproc = new CSL.Engine(citeprocSys, styleAsText);
    return citeproc;
  }
  function processorOutput() {
    var citeproc = getProcessor("chicago-fullnote-bibliography");
    citeproc.updateItems(checked);
    var result = citeproc.makeBibliography();
    return result[1].join("\n");
  }
  const result = processorOutput();
  console.log("result", result);

  function createContentControl() {
    Word.run(function (context) {
      var serviceNameRange = context.document.getSelection();
      var serviceNameContentControl = serviceNameRange.insertContentControl();
      serviceNameContentControl.tag = "jabref";
      serviceNameContentControl.appearance = "BoundingBox";
      serviceNameContentControl.color = "blue";
      serviceNameContentControl.insertText("hello", "After");
      return context.sync();
    }).catch(function (error) {
      console.log("Error: " + error);
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }

  return (
    <div style={dashboadStyle}>
      <SearchField onFilterChange={onFilterChange} />
      <ReferenceList list={items} onCheckBoxChange={handleToggleChange} />
      {checked.length ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: "auto",
            flex: "0 0 auto",
            width: "100%",
            alignContent: "flex-start",
            padding: 16,
          }}
        >
          <PrimaryButton>Insert {checked.length} citation</PrimaryButton>
          <DefaultButton style={{ marginLeft: 8 }}>cancel</DefaultButton>
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;
