/* eslint-disable no-console */
import { StatefulCitation } from "citeproc";

class WordApi {
  async insertNewCitation(
    citations: Array<[number, string, StatefulCitation]>
  ): Promise<unknown> {
    return Word.run((context: Word.RequestContext) => {
      const citationContentControl = context.document
        .getSelection()
        .insertContentControl();
      citations.forEach((citation) => {
        const citationText = citation[1];
        citationContentControl.appearance = "BoundingBox";
        citationContentControl.insertText(citationText, "Replace");
        citationContentControl.tag = this.generateCitationTag(citation[2]);
      });
      return context.sync();
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  static async getJabRefCitations(
    context: Word.RequestContext
  ): Promise<Array<Word.ContentControl> | void> {
    const { contentControls } = context.document;
    context.load(contentControls, "tag, length");
    await context.sync();
    return contentControls.items.filter((citation) =>
      citation.tag.includes("JABREF-CITATION")
    );
  }

  static async getPositionOfNewCitation(): Promise<number | void> {
    return Word.run(async (context: Word.RequestContext) => {
      const { contentControls } = context.document.body;
      context.load(contentControls, "length, items");
      const currentposition = context.document.getSelection();
      await context.sync();
      const jabRefCitation = contentControls.items.filter((citation) =>
        citation.tag.includes("JABREF-CITATION")
      );
      const jabRefCitations = (await WordApi.getJabRefCitations(
        context
      )) as Array<Word.ContentControl>;
      const locationArray = jabRefCitations.map((citation) => {
        const citationToCompareWith = citation.getRange("Start");
        const currentSelectionRange = currentposition.getRange("Whole");
        return citationToCompareWith.compareLocationWith(currentSelectionRange);
      });
      await context.sync();
      for (let i = 0; i < locationArray.length; i += 1) {
        const index = locationArray[i].value;
        if (index === "After") {
          console.log("location", i);
          return i;
        }
      }
      console.log("location", jabRefCitation.length);
      return jabRefCitation.length;
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  async updateCitations(
    citations: Array<[number, string, StatefulCitation]>
  ): Promise<unknown> {
    return Word.run(async (context: Word.RequestContext) => {
      const jabRefCitations = (await WordApi.getJabRefCitations(
        context
      )) as Array<Word.ContentControl>;
      citations.forEach((citation) => {
        const position = citation[0];
        const citationText = citation[1];
        const tag = this.generateCitationTag(citation[2]);
        const citationContentControl = jabRefCitations[position];
        if (!citationContentControl) {
          return;
        }
        const currentCitationTag = citationContentControl.tag;
        if (
          currentCitationTag === "JABREF-CITATION-NEW" ||
          currentCitationTag !== tag
        ) {
          citationContentControl.tag = tag;
        }
        citationContentControl.insertText(citationText, "Replace");
      });
      return context.sync();
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  generateCitationTag = (citation: StatefulCitation): string => {
    return `JABREF-CITATION-${JSON.stringify(citation)}`;
  };

  static async getTotalNumberOfCitations(): Promise<number | void> {
    return Word.run(async (context: Word.RequestContext) => {
      const jabRefCitations = (await WordApi.getJabRefCitations(
        context
      )) as Array<Word.ContentControl>;
      return jabRefCitations.length;
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  static async getCitationIdToPos(): Promise<Record<string, number> | void> {
    return Word.run(async (context: Word.RequestContext) => {
      const jabRefCitations = (await WordApi.getJabRefCitations(
        context
      )) as Array<Word.ContentControl>;
      const citationIdToPos: Record<string, number> = {};
      let pos = 0;
      jabRefCitations.forEach((citation) => {
        const { tag } = citation;
        citationIdToPos[tag.substring(16)] = pos;
        pos += 1;
      });
      return citationIdToPos;
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  static async getCitationByIndex(): Promise<Array<StatefulCitation> | void> {
    return Word.run(
      async (
        context: Word.RequestContext
      ): Promise<Array<StatefulCitation>> => {
        const jabRefCitations = (await WordApi.getJabRefCitations(
          context
        )) as Array<Word.ContentControl>;
        return jabRefCitations.map(
          (citation) =>
            JSON.parse(citation.tag.substring(16)) as StatefulCitation
        );
      }
    ).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  static createContentControl(tag: string, html: string): void {
    Word.run((context: Word.RequestContext) => {
      const getSelection = context.document.getSelection();
      const contentControl = getSelection.insertContentControl();
      contentControl.tag = tag;
      contentControl.appearance = "BoundingBox";
      contentControl.color = "white";
      contentControl.insertHtml(html, "Replace");
      return context.sync();
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }
}

export default WordApi;
