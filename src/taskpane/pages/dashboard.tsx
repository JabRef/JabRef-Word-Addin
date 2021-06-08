import {
  IStackStyles,
  DefaultPalette,
  ISearchBoxStyles,
  Stack,
  SearchBox,
  PrimaryButton,
  ButtonType,
} from "@fluentui/react";
import * as React from "react";
import Header from "../components/Header";
/* global Word */

interface dashboardProps {}
const stackStyles: IStackStyles = {
  root: {
    background: DefaultPalette.white,
  },
};
const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { margin: 20, marginTop:0 } };

const Dashboard: React.FC<dashboardProps> = () => {
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
    <div>
      <Stack styles={stackStyles}>
        <SearchBox
          styles={searchBoxStyles}
          placeholder="Search"
          onSearch={(newValue) => console.log("value is " + newValue)}
        />
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
    </div>
  );
};
export default Dashboard;
