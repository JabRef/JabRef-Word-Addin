import { ISearchBoxStyles, SearchBox } from "@fluentui/react";
import React from "react";

interface SearchFieldProps {
  onFlterChange: any;
}

const searchBoxStyle: ISearchBoxStyles = {
  root: {
    margin: 8,
  },
};

function SearchField(props: SearchFieldProps) {
  return <SearchBox styles={searchBoxStyle} placeholder="Search" underlined={true} onChange={props.onFlterChange} />;
}
export default SearchField;
