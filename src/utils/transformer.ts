import { MetaData } from "citeproc";
import { Article } from "../generated/graphql";

// eslint-disable-next-line import/prefer-default-export
export function transform(document: Article): MetaData {
  const result: MetaData = {
    id: document.id,
    type: "article",
    title: document.title,
  };
  if (document.subtitle) {
    result.title += ` ${document.subtitle}`;
  }

  if (document.authors.length > 0) {
    result.author = document.authors.map((author) => ({
      fullName: author.name,
    }));
  }

  return result;
}
