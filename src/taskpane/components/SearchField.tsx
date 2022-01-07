import React, { ReactElement } from 'react';
import { ISearchBoxStyles, SearchBox } from '@fluentui/react';

interface SearchFieldProps {
  // eslint-disable-next-line no-unused-vars
  onFilterChange: (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => void;
}

const searchBoxStyle: ISearchBoxStyles = {
  root: {
    width: '90%',
    flex: '0 0 auto',
    margin: '1rem auto',
  },
};

function SearchField(props: SearchFieldProps): ReactElement {
  const { onFilterChange } = props;
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
