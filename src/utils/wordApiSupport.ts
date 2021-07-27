export class WordApiSupport {
  constructor() {}

  async insertEmptyContentControl(): Promise<void> {
    Word.run(function (context) {
      const getSelection = context.document.getSelection();
      const contentControl = getSelection.insertContentControl();
      contentControl.tag = "JABREF-CITATION-NEW";
      contentControl.appearance = "Hidden";
      return context.sync();
    }).catch(function (error) {
      console.log("Error: " + error);
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }

  async insertTextInContentControl(tag: string, text: string): Promise<void> {
    Word.run(async function (context) {
      let contentControl = context.document.contentControls.getByTag("JABREF-CITATION-" + tag).getFirst();
      contentControl.load("tag, appearance");
      return context.sync().then(() => {
        contentControl.insertHtml(text, "Replace");
        contentControl.appearance = "BoundingBox";
        return context.sync();
      });
    }).catch(function (error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }

  async getTotalNumberOfCitation(): Promise<number | void> {
    return Word.run(async function (context) {
      const contentControls = context.document.contentControls;
      context.load(contentControls, "tag, length");
      await context.sync();
      let length = 0;
      contentControls.items.forEach((citation) => {
        const tag = citation.tag;
        if (tag.includes("JABREF-CITATION")) {
          length++;
        }
      });
      return length;
    }).catch(function (error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }

  async getPositionOfNewCitation(): Promise<number> {
    return Word.run(async function (context) {
      const contentControls = context.document.contentControls;
      context.load(contentControls, "tag, length");
      await context.sync();
      let length = 0;
      let pos = null;
      for (let i = 0, ilen = contentControls.items.length; i < ilen; i++) {
        const tag = contentControls.items[i].tag;
        if (tag.includes("JABREF-CITATION")) {
          if (tag.substring(16) === "NEW") {
            pos = length;
            break;
          }
          length++;
        }
      }
      return pos;
    }).catch(function (error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }

  async setCitationTagAtPosition(position: number, tag: string): Promise<void> {
    Word.run(async function (context) {
      const contentControls = context.document.contentControls;
      context.load(contentControls, "tag");
      await context.sync();
      let pos = 0;
      for (let i = 0, ilen = contentControls.items.length; i < ilen; i++) {
        if (contentControls.items[i].tag.includes("JABREF-CITATION")) {
          if (pos === position) {
            contentControls.items[i].tag = "JABREF-CITATION-" + tag;
            break;
          } else {
            pos++;
          }
        }
      }
      return context.sync();
    }).catch(function (error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }

  async getCitationTagByIndex(position: number): Promise<string> {
    return Word.run(async function (context) {
      const contentControls = context.document.contentControls;
      context.load(contentControls, "tag, length");
      await context.sync();
      let indexTag = null;
      let pos = 0;
      for (let i = 0, ilen = contentControls.items.length; i < ilen; i++) {
        const tag = contentControls.items[i].tag;
        if (tag.includes("JABREF-CITATION")) {
          if (pos == position) {
            indexTag = tag.substring(16);
            break;
          } else {
            pos++;
          }
        }
      }
      return indexTag;
    }).catch(function (error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }

  async getCitationIdToPos(): Promise<object | void> {
    return Word.run(async function (context) {
      const contentControls = context.document.contentControls;
      context.load(contentControls, "tag, length");
      await context.sync();
      let citationIdToPos = {};
      let pos = 0;
      contentControls.items.forEach((citation) => {
        const tag = citation.tag;
        if (tag.includes("JABREF-CITATION")) {
          citationIdToPos[tag.substring(16)] = pos;
          pos++;
        }
      });
      return context.sync().then(function () {
        if (citationIdToPos) {
          return citationIdToPos;
        }
        return {};
      });
    }).catch(function (error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }

  async getCitationByIndex(): Promise<Array<object> | void> {
    return Word.run(async function (context) {
      const contentControls = context.document.contentControls;
      context.load(contentControls, "tag, length");
      await context.sync();
      let citationByIndex = [];
      contentControls.items.forEach((citation) => {
        const tag = citation.tag;
        if (tag.includes("JABREF-CITATION")) {
          citationByIndex.push(JSON.parse(tag.substring(16)));
        }
      });
      return context.sync().then(function () {
        if (citationByIndex.length) {
          return citationByIndex;
        }
        return [];
      });
    }).catch(function (error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }

  createContentControl(tag: string, html: string) {
    Word.run(function (context) {
      const getSelection = context.document.getSelection();
      const contentControl = getSelection.insertContentControl();
      contentControl.tag = tag;
      contentControl.appearance = "BoundingBox";
      contentControl.color = "white";
      contentControl.insertHtml(html, "Replace");
      return context.sync();
    }).catch(function (error) {
      console.log("Error: " + error);
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }
}
