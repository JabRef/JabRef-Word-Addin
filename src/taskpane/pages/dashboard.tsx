import React, { useState } from "react";
import data from "../../utils/data";
import ReferenceList from "../components/ReferenceList";
import SearchField from "../components/SearchField";
import CiteSupport from "../../utils/citesupport";
import { PrimaryButton, DefaultButton } from "@fluentui/react";
/* global Word OfficeExtension */

interface dashboardProps {
  citeSupport: CiteSupport;
}

const dashboadStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  overflow: "hidden",
  flexDirection: "column" as "column",
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

function Dashboard({ citeSupport }: dashboardProps) {
  const originalItems = data.map((item) => ({ ...item, isSelected: false }));
  const [items, setItems] = useState(originalItems);
  const checkedItems = items
    .filter((item) => item.isSelected)
    .map((item) => {
      return { id: item.id };
    });

  const onFilterChange = (_: any, keyword: string): void => {
    setItems(originalItems.filter(containsSearchTerm(keyword)));
  };

  const handleToggleChange = (ev: React.FormEvent<HTMLElement | HTMLInputElement>) => {
    setItems((currentItems) => {
      return currentItems.map(onCheckboxChange(ev));
    });
  };

  // Get citationIDs in current citation(In case on multiple citation
  function getIDs(citationID: string) {
    var itemIDs = [];
    var citation = citeSupport.config.citationByIndex.find((citation) => citation.citationID == citationID);
    if (citation) {
      itemIDs = citation.citationItems.map((obj: { id: string }) => {
        return obj.id;
      });
    }
    return itemIDs;
  }
  function insertEmptyContentControl(tag: string) {
    Word.run(function (context) {
      const serviceNameRange = context.document.getSelection();
      const serviceNameContentControl = serviceNameRange.insertContentControl();
      serviceNameContentControl.tag = tag;
      serviceNameContentControl.appearance = "BoundingBox";
      serviceNameContentControl.color = "white";
      return context.sync();
    }).catch(function (error) {
      console.log("Error: " + error);
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }

  function insertCitation() {
    // Reconcile citationByIndex and editor nodes
    // TODO citesupport.config.citationByIndex = citesupport.spoofCitations();
    const citation = {
      citationItems: checkedItems,
      properties: {
        noteIndex: 0,
      },
    };
    insertEmptyContentControl("NewCitationTag");
    citeSupport.callRegisterCitation(citation, [], []);
    return;
  }
  return (
    <div style={dashboadStyle}>
      <SearchField onFilterChange={onFilterChange} />
      <ReferenceList list={items} onCheckBoxChange={handleToggleChange} />
      {checkedItems.length ? (
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
          <PrimaryButton onClick={insertCitation}>Insert {checkedItems.length} citation</PrimaryButton>
          <DefaultButton style={{ marginLeft: 8 }}>cancel</DefaultButton>
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;
