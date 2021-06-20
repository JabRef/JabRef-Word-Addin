<<<<<<< HEAD
import { IStackStyles, DefaultPalette, Stack, PrimaryButton, ButtonType } from "@fluentui/react";
import * as React from "react";
import { ReferenceList } from "../components/ReferenceList";
/* global Word */

interface dashboardProps {}
=======
import {
  IStackStyles,
  DefaultPalette,
  ISearchBoxStyles,
  Stack,
  SearchBox,
  PrimaryButton,
  ButtonType,
} from "@fluentui/react";
import React from "react";
import Header from "../components/Header";
/* global Word */

>>>>>>> ce2bb92a61aa940273f1c9049ab3c31cd5eb1010
const stackStyles: IStackStyles = {
  root: {
    background: DefaultPalette.white,
  },
};
<<<<<<< HEAD

const Dashboard: React.FC<dashboardProps> = () => {
=======
const searchBoxStyles: Partial<ISearchBoxStyles> = { root: {} };

function Dashboard() {
>>>>>>> ce2bb92a61aa940273f1c9049ab3c31cd5eb1010
  const click = async () => {
    return Word.run(async (context) => {
      // insert a paragraph at the end of the document.
      const paragraph = context.document.body.insertParagraph("Hello World!", Word.InsertLocation.end);
      paragraph.font.color = "black";
      paragraph.font.size = 30;
      await context.sync();
    });
  };
  return (
    <Stack styles={stackStyles}>
<<<<<<< HEAD
      <Stack verticalAlign="center">
        <ReferenceList />
      </Stack>
      <Stack verticalAlign="end">
        <PrimaryButton
          className="ms-welcome__action"
          buttonType={ButtonType.hero}
          iconProps={{ iconName: "ChevronRight" }}
          onClick={click}
        >
          Cite
        </PrimaryButton>
      </Stack>
    </Stack>
  );
};
=======
      <SearchBox styles={searchBoxStyles} placeholder="Search" />
      <Header logo="assets/jabref.svg" message="JabRef" title="JabRef" />
      <PrimaryButton
        className="ms-welcome__action"
        buttonType={ButtonType.hero}
        iconProps={{ iconName: "ChevronRight" }}
        onClick={click}
      >
        Cite
      </PrimaryButton>
    </Stack>
  );
}
>>>>>>> ce2bb92a61aa940273f1c9049ab3c31cd5eb1010
export default Dashboard;
