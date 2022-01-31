import React, { ReactElement } from 'react';
import { ISearchBoxStyles, SearchBox } from '@fluentui/react';
import globalStyles from '../styles';

interface SearchFieldProps {
  // eslint-disable-next-line no-unused-vars
  onFilterChange: (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => void;
}

const searchBoxStyle: ISearchBoxStyles = {
  root: {
    margin: `1rem ${globalStyles.margin}`,
  },
};

function SearchField({ onFilterChange }: SearchFieldProps): ReactElement {
  return (
    <SearchBox
      underlined
      autoComplete="off"
      placeholder="Search"
      styles={searchBoxStyle}
      onChange={onFilterChange}
    />
  );
}
export default SearchField;
