import React, { ReactElement, useEffect, useRef, useState } from "react";
import { PrimaryButton, DefaultButton } from "@fluentui/react";
import { StatefulCitation } from "citeproc";
import data from "../../utils/data";
import ReferenceList, { bib } from "../components/ReferenceList";
import SearchField from "../components/SearchField";
import CiteSupport from "../../utils/citesupport";
import WordApi from "../../utils/word-api";

interface DashboardProps {
  citeSupport: CiteSupport;
}

const dashboadStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  overflow: "hidden",
  flexDirection: "column" as const,
};

const buttonContainer = {
  display: "flex",
  flexDirection: "row" as const,
  marginTop: "auto",
  flex: "0 0 auto",
  width: "100%",
  alignContent: "flex-start",
  padding: 16,
};

function containsSearchTerm(keyword: string) {
  return (item?: bib) => {
    return [item.title, item.author, item.year].some((str: string | number) =>
      str
        ? str.toString().toLowerCase().includes(keyword.toLowerCase().trim())
        : false
    );
  };
}

function onCheckboxChange(ev: React.FormEvent<HTMLElement | HTMLInputElement>) {
  return (item: bib) => {
    if (ev.currentTarget && item.title === ev.currentTarget.title) {
      return { ...item, isSelected: !item.isSelected };
    }
    return item;
  };
}

function unCheckCheckbox(item: bib): bib {
  return { ...item, isSelected: false };
}

function Dashboard({ citeSupport }: DashboardProps): ReactElement {
  const originalItems = data.map((item) => ({ ...item, isSelected: false }));
  const [items, setItems] = useState(originalItems);
  const [citationID, _setCitationID] = useState([]);
  const citationIDinCitation = useRef(citationID);
  const setCitationID = (ID: Array<string>) => {
    citationIDinCitation.current = ID;
    _setCitationID(ID);
  };

  const checkedItems = items
    .filter((item) => item.isSelected)
    .map((item) => {
      return { id: item.id };
    });

  const unCheckAllCheckboxes = () => {
    setItems((currentItems) => {
      return currentItems.map(unCheckCheckbox);
    });
  };

  const checkCitationItems = (itemId: Array<string>) => {
    setItems((currentItems) => {
      return currentItems.map((item) => {
        if (itemId.filter((id) => item.id === id).length) {
          return { ...item, isSelected: true };
        }
        return item;
      });
    });
  };

  const unCheckCitationItems = (itemId: Array<string>) => {
    setItems((currentItems) => {
      return currentItems.map((item) => {
        if (itemId.filter((id) => item.id === id).length) {
          return { ...item, isSelected: false };
        }
        return item;
      });
    });
  };

  const onFilterChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    keyword: string
  ): void => {
    setItems(originalItems.filter(containsSearchTerm(keyword)));
  };

  const handleToggleChange = (
    ev: React.FormEvent<HTMLElement | HTMLInputElement>
  ) => {
    setItems((currentItems) => {
      return currentItems.map(onCheckboxChange(ev));
    });
  };

  async function getSelectedCitation(): Promise<void> {
    return Word.run(async (context: Word.RequestContext) => {
      const getSelection = context.document.getSelection();
      context.load(getSelection, "contentControls");
      await context.sync();
      if (getSelection.contentControls.items.length !== 0) {
        unCheckCitationItems(citationIDinCitation.current);
        const citation = getSelection.contentControls.getFirstOrNullObject();
        citation.load("tag");
        await context.sync();
        const tag = JSON.parse(citation.tag.substring(16)) as StatefulCitation;
        const citationId = tag.citationItems.map((i) => i.id);
        setCitationID(citationId);
        checkCitationItems(citationId);
      } else if (citationIDinCitation.current.length) {
        unCheckAllCheckboxes();
        setCitationID([]);
      }
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  useEffect(() => {
    WordApi.addEventListener(getSelectedCitation);
    return WordApi.removeEventListener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function insertCitation() {
    await citeSupport.insertCitation(checkedItems);
    unCheckAllCheckboxes();
  }

  return (
    <div style={dashboadStyle}>
      <SearchField onFilterChange={onFilterChange} />
      <ReferenceList list={items} onCheckBoxChange={handleToggleChange} />
      {checkedItems.length && citationIDinCitation.current.length === 0 ? (
        <div style={buttonContainer}>
          <PrimaryButton onClick={insertCitation}>
            Insert {checkedItems.length}{" "}
            {checkedItems.length > 1 ? "citations" : "citation"}
          </PrimaryButton>
          <DefaultButton
            onClick={unCheckAllCheckboxes}
            style={{ marginLeft: 8 }}
          >
            Cancel
          </DefaultButton>
        </div>
      ) : null}
      {citationIDinCitation.current.length !== 0 &&
      checkedItems.length !== 0 ? (
        <div style={buttonContainer}>
          <PrimaryButton onClick={insertCitation}>Save</PrimaryButton>
          <DefaultButton
            onClick={unCheckAllCheckboxes}
            style={{ marginLeft: 8 }}
          >
            Cancel
          </DefaultButton>
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;
