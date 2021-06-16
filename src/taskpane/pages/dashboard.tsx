import { IStackStyles, DefaultPalette, Stack, PrimaryButton, ButtonType } from "@fluentui/react";
import * as React from "react";
import { ReferenceList } from "../components/ReferenceList";
/* global Word */

interface dashboardProps {}
const stackStyles: IStackStyles = {
  root: {
    background: DefaultPalette.white,
  },
};

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
    <Stack styles={stackStyles}>
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
export default Dashboard;
