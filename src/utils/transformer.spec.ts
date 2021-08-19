import { Article } from "../generated/graphql";
import { transform } from "./transformer";

describe("transformsArticles", () => {
  it("simple article", () => {
    const article: Article = {
      id: "testId",
      title: "Test article",
      authors: [
        {
          id: "authorId",
          name: "Jangra",
        },
      ],
      keywords: [],
    };
    const result = transform(article);
    expect(result).toStrictEqual({
      id: "testId",
      title: "Test article",
      type: "article",
      author: [{ fullName: "Jangra" }],
    });
  });

  it("id is taken from input", () => {
    const article: Article = {
      id: "someId",
      authors: [],
      keywords: [],
    };
    const result = transform(article);
    expect(result).toStrictEqual({
      id: "someId",
      type: "article",
      title: undefined,
    });
  });

  it("article with multiple authors", () => {
    const article: Article = {
      id: "someId",
      authors: [
        { id: "abc", name: "First Author" },
        { id: "def", name: "Second Author" },
      ],
      keywords: [],
    };
    const result = transform(article);
    expect(result).toStrictEqual({
      id: "someId",
      type: "article",
      title: undefined,
      author: [{ fullName: "First Author" }, { fullName: "Second Author" }],
    });
  });

  it("simple article with subtitle", () => {
    const article: Article = {
      id: "testId",
      title: "Test article",
      subtitle: "with subtitle!",
      authors: [],
      keywords: [],
    };
    const result = transform(article);
    expect(result).toStrictEqual({
      id: "testId",
      title: "Test article with subtitle!",
      type: "article",
    });
  });
});
