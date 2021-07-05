import { ISearchBoxStyles, SearchBox } from "@fluentui/react";
import React from "react";

interface SearchFieldProps {
  // eslint-disable-next-line no-unused-vars
  onFilterChange: (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => void;
}

const searchBoxStyle: ISearchBoxStyles = {
  root: {
    margin: 8,
    marginTop: 10,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
  },
};

function SearchField(props: SearchFieldProps) {
  return (
    <SearchBox
      styles={searchBoxStyle}
      underlined={true}
      placeholder="Search"
      autoComplete="off"
      onChange={props.onFilterChange}
    />
  );
}
export default SearchField;
