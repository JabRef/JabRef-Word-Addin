/* eslint-disable no-unused-vars */
import { ISearchBoxStyles, SearchBox } from "@fluentui/react";
import React, { ReactElement } from "react";

interface SearchFieldProps {
  onFilterChange: (
    event?: React.ChangeEvent<HTMLInputElement>,
    newValue?: string
  ) => void;
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

function SearchField(props: SearchFieldProps): ReactElement {
  const { onFilterChange } = props;
  return (
    <SearchBox
      styles={searchBoxStyle}
      underlined
      placeholder="Search"
      autoComplete="off"
      onChange={onFilterChange}
    />
  );
}
export default SearchField;
