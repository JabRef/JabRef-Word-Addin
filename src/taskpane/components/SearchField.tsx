import { ISearchBoxStyles, SearchBox } from "@fluentui/react";
import React from "react";

interface SearchFieldProps {
  onFilterChange: any;
}

const searchBoxStyle: ISearchBoxStyles = {
  root: {
    margin: 8,
  },
};

function SearchField(props: SearchFieldProps) {
  return <SearchBox styles={searchBoxStyle} placeholder="Search" underlined={true} onChange={props.onFilterChange} />;
}
export default SearchField;
