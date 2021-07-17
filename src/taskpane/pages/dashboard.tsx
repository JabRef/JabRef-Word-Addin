import React, { useState } from "react";
import data, { citationByIndex } from "../../utils/data";
import ReferenceList from "../components/ReferenceList";
import SearchField from "../components/SearchField";
import CiteSupport from "../../utils/citesupport";
import { PrimaryButton, DefaultButton } from "@fluentui/react";
/* global */

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

const buttonContainer = {
  display: "flex",
  flexDirection: "row" as "row",
  marginTop: "auto",
  flex: "0 0 auto",
  width: "100%",
  alignContent: "flex-start",
  padding: 16,
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
    if (ev.currentTarget) {
      if (item.title === ev.currentTarget.title) {
        return { ...item, isSelected: !item.isSelected };
      }
      return item;
    }
  };
}

function unCheckCheckbox(item) {
  return { ...item, isSelected: false };
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

  const unCheckAllCheckbox = () => {
    setItems((currenItems) => {
      return currenItems.map(unCheckCheckbox);
    });
  };

  // function getIDs(citationID: string) {
  //   let itemIDs = [];
  //   const citation = citeSupport.config.citationByIndex.find((citation) => citation.citationID === citationID);
  //   if (citation) {
  //     itemIDs = citation.citationItems.map((obj) => {
  //       return obj.id;
  //     });
  //   }
  //   return itemIDs;
  // }
  async function insertCitation() {
    const isCitation = citeSupport.isCitation();
    // let citationID = "";
    if (isCitation) {
      // citationID = selectedNode.id || "";
    }
    // citeSupport.config.citationByIndex = await citeSupport.spoofCitations();
    // const itemIDs = getIDs(citationID);
    let citation = null;
    if (!isCitation) {
      if (checkedItems.length) {
        citeSupport.insertEmptyContentControl();
        citation = {
          citationItems: checkedItems,
          properties: {
            noteIndex: 0,
          },
        };
        console.log(citation);
      }
    }
    // else if (citationID) {
    //   let citationPosition = -1;
    //   for (let i = 0; i < citationNodes.length; i++) {
    //     if (citationNodes[i] === selectedNode) {
    //       citationPos = i;
    //       break;
    //     }
    //   }
    //   if (citationPosition === -1) {
    //     throw "node not found";
    //   } else {
    //     citation = citeSupport.config.citationByIndex[citationPosition];
    //   }
    //   if (checkedItems.length) {
    //     citation.citationItems = checkedItems;
    //   } else {
    //     // Remove this citation from data and from DOM
    //   }
    // }
    // Now travel through citations again and figure out where we are
    let citationsPre = [];
    let citationsPost = [];
    const i = await citeSupport.getPositionOfNewCitation();
    console.log("position", i);
    if (citeSupport.config.citationByIndex.slice(0, i).length) {
      citationsPre = citeSupport.config.citationByIndex.slice(0, i).map(function (obj) {
        return [obj.citationID, 0];
      });
    }
    if (citeSupport.config.citationByIndex.slice(i).length) {
      citationsPost = citeSupport.config.citationByIndex.slice(i).map(function (obj) {
        return [obj.citationID, 0];
      });
    }
    console.log("type", typeof citationByIndex);
    citeSupport.callRegisterCitation(citation, citationsPre, citationsPost);
    unCheckAllCheckbox();
  }

  return (
    <div style={dashboadStyle}>
      <SearchField onFilterChange={onFilterChange} />
      <ReferenceList list={items} onCheckBoxChange={handleToggleChange} />
      {checkedItems.length ? (
        <div style={buttonContainer}>
          <PrimaryButton onClick={insertCitation}>Insert {checkedItems.length} citation</PrimaryButton>
          <DefaultButton onClick={unCheckAllCheckbox} style={{ marginLeft: 8 }}>
            cancel
          </DefaultButton>
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;
