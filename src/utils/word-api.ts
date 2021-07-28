/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */

import { citationByIndexInterface } from "./cite-interface";

class WordApiSupport {
  insertEmptyContentControl(): void {
    Word.run(function (context) {
      const getSelection = context.document.getSelection();
      const contentControl = getSelection.insertContentControl();
      contentControl.tag = "JABREF-CITATION-NEW";
      contentControl.appearance = "Hidden";
      return context.sync();
    }).catch(function (error) {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  insertTextInContentControl(tag: string, text: string): void {
    Word.run(async (context) => {
      const contentControl = context.document.contentControls
        .getByTag(`JABREF-CITATION-${tag}`)
        .getFirst();
      contentControl.load("tag, appearance");
      return context.sync().then(() => {
        contentControl.insertHtml(text, "Replace");
        contentControl.appearance = "BoundingBox";
        return context.sync();
      });
    }).catch(function (error) {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  async getTotalNumberOfCitation(): Promise<number | void> {
    return Word.run(async (context) => {
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
    }).catch(function (error) {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  async getPositionOfNewCitation(): Promise<number | void> {
    return Word.run(async function (context) {
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
    }).catch(function (error) {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  setCitationTagAtPosition(position: number, tag: string): void {
    Word.run(async function (context) {
      const { contentControls } = context.document;
      context.load(contentControls, "tag");
      await context.sync();
      let pos = 0;
      for (let i = 0, ilen = contentControls.items.length; i < ilen; i += 1) {
        if (contentControls.items[i].tag.includes("JABREF-CITATION")) {
          if (pos === position) {
            contentControls.items[i].tag = `JABREF-CITATION-${tag}`;
            break;
          } else {
            pos += 1;
          }
        }
      }
      return context.sync();
    }).catch(function (error) {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  async getCitationTagByIndex(position: number): Promise<string | void> {
    return Word.run(async function (context) {
      const { contentControls } = context.document;
      context.load(contentControls, "tag, length");
      await context.sync();
      let indexTag: string = null;
      let pos = 0;
      for (let i = 0, ilen = contentControls.items.length; i < ilen; i += 1) {
        const { tag } = contentControls.items[i];
        if (tag.includes("JABREF-CITATION")) {
          if (pos === position) {
            indexTag = tag.substring(16);
            break;
          } else {
            pos += 1;
          }
        }
      }
      return indexTag;
    }).catch(function (error) {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  async getCitationIdToPos(): Promise<Record<string, number> | void> {
    return Word.run(async (context) => {
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
    }).catch(function (error) {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  async getCitationByIndex(): Promise<Array<citationByIndexInterface> | void> {
    return Word.run(async function (context) {
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
      return context.sync().then(function () {
        if (citationByIndex.length) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return citationByIndex;
        }
        return [];
      });
    }).catch(function (error) {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  createContentControl(tag: string, html: string): void {
    Word.run((context) => {
      const getSelection = context.document.getSelection();
      const contentControl = getSelection.insertContentControl();
      contentControl.tag = tag;
      contentControl.appearance = "BoundingBox";
      contentControl.color = "white";
      contentControl.insertHtml(html, "Replace");
      return context.sync();
    }).catch(function (error) {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }
}

export default WordApiSupport;
