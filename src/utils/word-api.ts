/* eslint-disable no-console */
import { CitationItem, StatefulCitation } from "citeproc";

export type CitationDataFormatForWordAPI = {
  position: number;
  citationText: string;
  citationTag: StatefulCitation;
};
class WordApi {
  JABREF_CITATION_TAG_PREFIX = "JABREF-CITATION-";

  JABREF_BIBLIOGRAPHY_TAG = "JABREF-BIBLIOGRAPHY";

  JABREF_CITATION_TAG_PREFIX_LENGTH = this.JABREF_CITATION_TAG_PREFIX.length;

  async insertNewCitation(
    citation: CitationDataFormatForWordAPI
  ): Promise<unknown> {
    return Word.run((context) => {
      const citationContentControl = context.document
        .getSelection()
        .insertContentControl();
      const { citationText } = citation;
      const tag = this.generateCitationTag(citation.citationTag);
      citationContentControl.tag = tag;
      citationContentControl.appearance = "BoundingBox";
      citationContentControl.insertText(citationText, "Replace");
      return context.sync();
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  async getJabRefCitations(
    context: Word.RequestContext
  ): Promise<Array<Word.ContentControl>> {
    const { contentControls } = context.document;
    context.load(contentControls, "tag, length");
    await context.sync();
    return contentControls.items.filter((citation) =>
      citation.tag.includes(this.JABREF_CITATION_TAG_PREFIX)
    );
  }

  async getPositionOfNewCitation(): Promise<number> {
    return Word.run(async (context) => {
      const currentPosition = context.document.getSelection();
      const jabRefCitations = await this.getJabRefCitations(context);
      if (jabRefCitations.length === 0) return 0;
      const locationArray = jabRefCitations.map((citation) => {
        const citationToCompareWith = citation.getRange("Start");
        const currentSelectionRange = currentPosition.getRange("Whole");
        return citationToCompareWith.compareLocationWith(currentSelectionRange);
      });
      await context.sync();
      const position = locationArray.findIndex(
        (location) => location.value === "After"
      );
      return position !== -1 ? position : jabRefCitations.length;
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
      return 0;
    });
  }

  async getPositionOfSelectedCitation(): Promise<number> {
    return Word.run(async (context: Word.RequestContext) => {
      const currentCitation = context.document
        .getSelection()
        .contentControls.getFirstOrNullObject();
      const jabRefCitations = await this.getJabRefCitations(context);
      const locationArray = jabRefCitations.map((citation) => {
        const citationToCompareWith = citation.getRange("Whole");
        const currentSelectionRange = currentCitation.getRange("Whole");
        return citationToCompareWith.compareLocationWith(currentSelectionRange);
      });
      await context.sync();
      return locationArray.findIndex((location) => location.value === "Equal");
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
      return 0;
    });
  }

  async isCitationSelected(): Promise<boolean> {
    return Word.run(async (context: Word.RequestContext) => {
      const currentSelection = context.document
        .getSelection()
        .contentControls.getFirstOrNullObject();
      currentSelection.load("tag");
      await context.sync();
      return (
        !currentSelection.isNullObject &&
        currentSelection.tag.includes(this.JABREF_CITATION_TAG_PREFIX)
      );
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
      return false;
    });
  }

  async updateCitations(
    citations: Array<CitationDataFormatForWordAPI>
  ): Promise<unknown> {
    return Word.run(async (context) => {
      const jabRefCitations = await this.getJabRefCitations(context);
      citations.forEach((citation) => {
        const { position, citationText } = citation;
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

  async getItemsInSelectedCitation(): Promise<Array<CitationItem>> {
    return Word.run(async (context: Word.RequestContext) => {
      const getSelection = context.document.getSelection();
      context.load(getSelection, "contentControls");
      await context.sync();
      if (getSelection.contentControls.items.length !== 0) {
        const citation = getSelection.contentControls.getFirstOrNullObject();
        citation.load("tag");
        await context.sync();
        if (citation.tag.includes(this.JABREF_CITATION_TAG_PREFIX)) {
          const tag = JSON.parse(
            citation.tag.substring(16)
          ) as StatefulCitation;
          return tag.citationItems;
        }
      }
      return [];
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
      return [];
    });
  }

  removeSelectedCitation = async (): Promise<unknown> => {
    return Word.run(async (context) => {
      context.document
        .getSelection()
        .contentControls.getFirstOrNullObject()
        .delete(false);
      return context.sync();
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  };

  generateCitationTag = (citation: StatefulCitation): string => {
    return this.JABREF_CITATION_TAG_PREFIX + JSON.stringify(citation);
  };

  async getTotalNumberOfCitations(): Promise<number | void> {
    return Word.run(async (context) => {
      const jabRefCitations = await this.getJabRefCitations(context);
      return jabRefCitations.length;
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  async getCitationIdToPos(): Promise<Record<string, number>> {
    return Word.run(async (context) => {
      const jabRefCitations = await this.getJabRefCitations(context);
      const citationIdToPos: Record<string, number> = {};
      jabRefCitations.forEach((citation, index) => {
        const { tag } = citation;
        citationIdToPos[tag.substring(this.JABREF_CITATION_TAG_PREFIX_LENGTH)] =
          index;
      });
      return citationIdToPos;
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
      return {};
    });
  }

  async getCitationByIndex(): Promise<Array<StatefulCitation>> {
    return Word.run(async (context): Promise<Array<StatefulCitation>> => {
      const jabRefCitations = await this.getJabRefCitations(context);
      return jabRefCitations.map(
        (citation) =>
          JSON.parse(
            citation.tag.substring(this.JABREF_CITATION_TAG_PREFIX_LENGTH)
          ) as StatefulCitation
      );
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
      return [];
    });
  }

  async insertBibliography(html: string): Promise<void> {
    await Word.run((context: Word.RequestContext) => {
      const getSelection = context.document.getSelection();
      const contentControl = getSelection.insertContentControl();
      contentControl.appearance = "BoundingBox";
      contentControl.insertHtml(html, "Replace");
      contentControl.tag = this.JABREF_BIBLIOGRAPHY_TAG;
      return context.sync();
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  async updateBibliography(html: string): Promise<void> {
    await Word.run(async (context) => {
      const jabRefBibliography = context.document.body.contentControls.getByTag(
        this.JABREF_BIBLIOGRAPHY_TAG
      );
      context.load(jabRefBibliography, "length, items, tag");
      await context.sync();
      if (jabRefBibliography) {
        jabRefBibliography.items.forEach((item) => {
          item.insertHtml(html, "Replace");
        });
      }
      return context.sync();
    }).catch((error) => {
      console.log(`Error: ${JSON.stringify(error)}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
  }

  addEventListener = (eventHandler: () => Promise<void>): void => {
    return Office.context.document.addHandlerAsync(
      Office.EventType.DocumentSelectionChanged,
      eventHandler,
      (result) => {
        console.log(`result: ${JSON.stringify(result)}`);
      }
    );
  };

  removeEventListener = (): void => {
    return Office.context.document.removeHandlerAsync(
      Office.EventType.DocumentSelectionChanged,
      (result) => {
        console.log(`result: ${JSON.stringify(result)}`);
      }
    );
  };
}

export default WordApi;
