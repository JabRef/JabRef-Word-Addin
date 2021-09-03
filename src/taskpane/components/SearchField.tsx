import { ISearchBoxProps, ISearchBoxStyles, SearchBox } from "@fluentui/react";
import React from "react";

const searchBoxStyle: ISearchBoxStyles = {
  root: {
    margin: 8,
    marginTop: 10,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
  },
};

function SearchField({ onChange }: ISearchBoxProps): JSX.Element {
  return (
    <SearchBox
      styles={searchBoxStyle}
      underlined
      placeholder="Search"
      autoComplete="off"
      onChange={onChange}
    />
  );
}

export default SearchField;
