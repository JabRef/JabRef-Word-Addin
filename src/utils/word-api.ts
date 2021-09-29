import { CitationItem, StatefulCitation } from "citeproc";
import { err, ok, Result } from "neverthrow";

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
  ): Promise<void | Error> {
    await Word.run((context) => {
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
      if (error instanceof OfficeExtension.Error) {
        return err(new Error(JSON.stringify(error.debugInfo.message)));
      }
      return err(new Error("Something went wrong"));
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

  async getPositionOfNewCitation(): Promise<Result<number, Error>> {
    return Word.run(async (context): Promise<Result<number, Error>> => {
      const currentPosition = context.document.getSelection();
      const jabRefCitations = await this.getJabRefCitations(context);
      if (jabRefCitations.length === 0) return ok(0);
      const locationArray = jabRefCitations.map((citation) => {
        const citationToCompareWith = citation.getRange("Start");
        const currentSelectionRange = currentPosition.getRange("Whole");
        return citationToCompareWith.compareLocationWith(currentSelectionRange);
      });
      await context.sync();
      const position = locationArray.findIndex(
        (location) => location.value === "After"
      );
      const positionOfNewCitation =
        position !== -1 ? position : jabRefCitations.length;
      return ok(positionOfNewCitation);
    }).catch((error) => {
      if (error instanceof OfficeExtension.Error) {
        return err(new Error(JSON.stringify(error.debugInfo.message)));
      }
      return err(new Error("Something went wrong"));
    });
  }

  async getPositionOfSelectedCitation(): Promise<Result<number, Error>> {
    return Word.run(
      async (context: Word.RequestContext): Promise<Result<number, Error>> => {
        const currentCitation = context.document
          .getSelection()
          .contentControls.getFirstOrNullObject();
        const jabRefCitations = await this.getJabRefCitations(context);
        const locationArray = jabRefCitations.map((citation) => {
          const citationToCompareWith = citation.getRange("Whole");
          const currentSelectionRange = currentCitation.getRange("Whole");
          return citationToCompareWith.compareLocationWith(
            currentSelectionRange
          );
        });
        await context.sync();
        const positon = locationArray.findIndex(
          (location) => location.value === "Equal"
        );
        return ok(positon);
      }
    ).catch((error) => {
      if (error instanceof OfficeExtension.Error) {
        return err(new Error(JSON.stringify(error.debugInfo.message)));
      }
      return err(new Error("Something went wrong"));
    });
  }

  async isCitationSelected(): Promise<Result<boolean, Error>> {
    return Word.run(
      async (context: Word.RequestContext): Promise<Result<boolean, Error>> => {
        const currentSelection = context.document
          .getSelection()
          .contentControls.getFirstOrNullObject();
        currentSelection.load("tag");
        await context.sync();
        return ok(
          !currentSelection.isNullObject &&
            currentSelection.tag.includes(this.JABREF_CITATION_TAG_PREFIX)
        );
      }
    ).catch((error) => {
      if (error instanceof OfficeExtension.Error) {
        return err(new Error(JSON.stringify(error.debugInfo.message)));
      }
      return err(new Error("Something went wrong"));
    });
  }

  async updateCitations(
    citations: Array<CitationDataFormatForWordAPI>
  ): Promise<void | Error> {
    await Word.run(async (context) => {
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
      if (error instanceof OfficeExtension.Error) {
        return new Error(JSON.stringify(error.debugInfo.message));
      }
      return new Error("Something went wrong");
    });
  }

  async getItemsInSelectedCitation(): Promise<
    Result<Array<CitationItem>, Error>
  > {
    return Word.run(
      async (
        context: Word.RequestContext
      ): Promise<Result<Array<CitationItem>, Error>> => {
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
            return ok(tag.citationItems);
          }
        }
        return ok([]);
      }
    ).catch((error) => {
      if (error instanceof OfficeExtension.Error) {
        return err(new Error(JSON.stringify(error.debugInfo.message)));
      }
      return err(new Error("Something went wrong"));
    });
  }

  removeSelectedCitation = async (): Promise<void | Error> => {
    await Word.run(async (context) => {
      context.document
        .getSelection()
        .contentControls.getFirstOrNullObject()
        .delete(false);
      return context.sync();
    }).catch((error) => {
      if (error instanceof OfficeExtension.Error) {
        return new Error(JSON.stringify(error.debugInfo.message));
      }
      return new Error("Something went wrong");
    });
  };

  generateCitationTag = (citation: StatefulCitation): string => {
    return this.JABREF_CITATION_TAG_PREFIX + JSON.stringify(citation);
  };

  async getTotalNumberOfCitations(): Promise<Result<number, Error>> {
    return Word.run(async (context): Promise<Result<number, Error>> => {
      const jabRefCitations = await this.getJabRefCitations(context);
      return ok(jabRefCitations.length);
    }).catch((error) => {
      if (error instanceof OfficeExtension.Error) {
        return err(new Error(JSON.stringify(error.debugInfo.message)));
      }
      return err(new Error("Something went wrong"));
    });
  }

  async getCitationIdToPos(): Promise<Result<Record<string, number>, Error>> {
    return Word.run(
      async (context): Promise<Result<Record<string, number>, Error>> => {
        const jabRefCitations = await this.getJabRefCitations(context);
        const citationIdToPos: Record<string, number> = {};
        jabRefCitations.forEach((citation, index) => {
          const { tag } = citation;
          citationIdToPos[
            tag.substring(this.JABREF_CITATION_TAG_PREFIX_LENGTH)
          ] = index;
        });
        return ok(citationIdToPos);
      }
    ).catch((error) => {
      if (error instanceof OfficeExtension.Error) {
        return err(new Error(JSON.stringify(error.debugInfo.message)));
      }
      return err(new Error("Something went wrong"));
    });
  }

  async getCitationByIndex(): Promise<Result<Array<StatefulCitation>, Error>> {
    return Word.run(
      async (context): Promise<Result<Array<StatefulCitation>, Error>> => {
        const jabRefCitations = await this.getJabRefCitations(context);
        return ok(
          jabRefCitations.map(
            (citation) =>
              JSON.parse(
                citation.tag.substring(this.JABREF_CITATION_TAG_PREFIX_LENGTH)
              ) as StatefulCitation
          )
        );
      }
    ).catch((error) => {
      if (error instanceof OfficeExtension.Error) {
        return err(new Error(JSON.stringify(error.debugInfo.message)));
      }
      return err(new Error("Something went wrong"));
    });
  }

  async insertBibliography(html: string): Promise<void | Error> {
    await Word.run((context: Word.RequestContext) => {
      const getSelection = context.document.getSelection();
      const contentControl = getSelection.insertContentControl();
      contentControl.appearance = "BoundingBox";
      contentControl.insertHtml(html, "Replace");
      contentControl.tag = this.JABREF_BIBLIOGRAPHY_TAG;
      return context.sync();
    }).catch((error) => {
      if (error instanceof OfficeExtension.Error) {
        return new Error(JSON.stringify(error.debugInfo.message));
      }
      return new Error("Something went wrong");
    });
  }

  async updateBibliography(html: string): Promise<void | Error> {
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
      if (error instanceof OfficeExtension.Error) {
        return new Error(JSON.stringify(error.debugInfo.message));
      }
      return new Error("Something went wrong");
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
