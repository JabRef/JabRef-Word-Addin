/* eslint-disable no-console */
import { CitationResult, StatefulCitation } from "citeproc";

class WordApi {
  static async insertEmptyContentControl(): Promise<unknown> {
    return Word.run((context: Word.RequestContext) => {
      const getSelection = context.document.getSelection();
      const contentControl = getSelection.insertContentControl();
      contentControl.tag = "JABREF-CITATION-NEW";
      contentControl.appearance = "Hidden";
      return context.sync();
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  async setCitations(
    data: Array<CitationResult>,
    citationByIndex: Array<StatefulCitation>
  ): Promise<unknown> {
    return Word.run(async (context: Word.RequestContext) => {
      const citationContentControls = context.document.contentControls;
      context.load(citationContentControls, "tag, length, appearance");
      return context.sync().then(() => {
        data.forEach((res: CitationResult) => {
          const position = res[0];
          const tag = this.getCitationTagForPosition(citationByIndex, position);
          const citationContentControl =
            this.getCitationContentControlAtPosition(
              citationContentControls,
              position
            );
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
          citationContentControl.insertText(res[1], "Replace");
          citationContentControl.appearance = "BoundingBox";
        });
        return context.sync();
      });
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  getCitationTagForPosition = (
    citationByIndex: Array<StatefulCitation>,
    position: number
  ): string => {
    return `JABREF-CITATION-${JSON.stringify(citationByIndex[position])}`;
  };

  getCitationContentControlAtPosition = (
    contentControls: Word.ContentControlCollection,
    position: number
  ): Word.ContentControl => {
    let pos = 0;
    let contentControl: Word.ContentControl = null;
    for (let i = 0, ilen = contentControls.items.length; i < ilen; i += 1) {
      const { tag } = contentControls.items[i];
      if (tag.includes("JABREF-CITATION")) {
        if (pos === position) {
          contentControl = contentControls.items[i];
          break;
        } else {
          pos += 1;
        }
      }
    }
    return contentControl;
  };

  static async getTotalNumberOfCitation(): Promise<number | void> {
    return Word.run(async (context: Word.RequestContext) => {
      const { contentControls } = context.document;
      context.load(contentControls, "tag, length");
      await context.sync();
      let length = 0;
      contentControls.items.forEach((citation) => {
        const { tag } = citation;
        if (tag.includes("JABREF-CITATION")) {
          length += 1;
        }
      });
      return length;
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  static async getPositionOfNewCitation(): Promise<number | void> {
    return Word.run(async (context: Word.RequestContext) => {
      const { contentControls } = context.document;
      context.load(contentControls, "tag, length");
      await context.sync();
      let length = 0;
      let pos = 0;
      for (let i = 0, ilen = contentControls.items.length; i < ilen; i += 1) {
        const { tag } = contentControls.items[i];
        if (tag.includes("JABREF-CITATION")) {
          if (tag.substring(16) === "NEW") {
            pos = length;
            break;
          }
          length += 1;
        }
      }
      return pos;
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  static async getCitationIdToPos(): Promise<Record<string, number> | void> {
    return Word.run(async (context: Word.RequestContext) => {
      const { contentControls } = context.document;
      context.load(contentControls, "tag, length");
      await context.sync();
      const citationIdToPos = {};
      let pos = 0;
      contentControls.items.forEach((citation) => {
        const { tag } = citation;
        if (tag.includes("JABREF-CITATION")) {
          citationIdToPos[tag.substring(16)] = pos;
          pos += 1;
        }
      });
      return context.sync().then(() => {
        if (citationIdToPos) {
          return citationIdToPos;
        }
        return {};
      });
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  static async getCitationByIndex(): Promise<Array<StatefulCitation> | void> {
    return Word.run(async (context: Word.RequestContext) => {
      const { contentControls } = context.document;
      context.load(contentControls, "tag, length");
      await context.sync();
      const citationByIndex = [];
      contentControls.items.forEach((citation) => {
        const { tag } = citation;
        if (tag.includes("JABREF-CITATION")) {
          citationByIndex.push(JSON.parse(tag.substring(16)));
        }
      });
      return context.sync().then(() => {
        if (citationByIndex.length) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return citationByIndex;
        }
        return [];
      });
    }).catch((error) => {
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
