/* eslint-disable no-console */
import { StatefulCitation } from "citeproc";

class WordApi {
  async insertNewCitation(
    citations: Array<{
      position: number;
      citationText: string;
      citationTag: StatefulCitation;
    }>
  ): Promise<unknown> {
    return Word.run((context: Word.RequestContext) => {
      const citationContentControl = context.document
        .getSelection()
        .insertContentControl();
      citations.forEach((citation) => {
        const { citationText } = citation;
        const tag = this.generateCitationTag(citation.citationTag);
        citationContentControl.tag = tag;
        citationContentControl.appearance = "BoundingBox";
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

  static async getJabRefCitations(
    context: Word.RequestContext
  ): Promise<Array<Word.ContentControl>> {
    const { contentControls } = context.document;
    context.load(contentControls, "tag, length");
    await context.sync();
    return contentControls.items.filter((citation) =>
      citation.tag.includes("JABREF-CITATION")
    );
  }

  static async getPositionOfNewCitation(): Promise<number | void> {
    return Word.run(async (context: Word.RequestContext) => {
      const currentPosition = context.document.getSelection();
      const jabRefCitations = await WordApi.getJabRefCitations(context);
      const locationArray = jabRefCitations.map((citation) => {
        const citationToCompareWith = citation.getRange("Start");
        const currentSelectionRange = currentPosition.getRange("Whole");
        return citationToCompareWith.compareLocationWith(currentSelectionRange);
      });
      await context.sync();
      const position = locationArray.findIndex(
        (location) => location.value === "After"
      );
      return position !== undefined ? position : jabRefCitations.length;
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  async updateCitations(
    citations: Array<{
      position: number;
      citationText: string;
      citationTag: StatefulCitation;
    }>
  ): Promise<unknown> {
    return Word.run(async (context: Word.RequestContext) => {
      const jabRefCitations = await WordApi.getJabRefCitations(context);
      citations.forEach((citation) => {
        const { position } = citation;
        const { citationText } = citation;
        const tag = this.generateCitationTag(citation.citationTag);
        const citationContentControl = jabRefCitations[position];
        if (!citationContentControl) {
          return;
        }
        const currentCitationTag = citationContentControl.tag;
        if (currentCitationTag !== tag) {
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
      const jabRefCitations = await WordApi.getJabRefCitations(context);
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
      const jabRefCitations = await WordApi.getJabRefCitations(context);
      const citationIdToPos: Record<string, number> = {};
      jabRefCitations.forEach((citation, index) => {
        const { tag } = citation;
        citationIdToPos[tag.substring(16)] = index;
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
        const jabRefCitations = await WordApi.getJabRefCitations(context);
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
