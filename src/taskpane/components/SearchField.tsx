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
    width: "90%",
    flex: "0 0 auto",
    margin: "1rem auto",
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
