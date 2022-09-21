/* eslint-disable no-unused-vars */
import { ISearchBoxStyles, SearchBox } from '@fluentui/react';
import React, { ReactElement } from 'react';
import globalStyles from '../../theme';

interface SearchFieldProps {
  onFilterChange: (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => void;
}

const searchBoxStyle: ISearchBoxStyles = {
  root: {
    margin: `1rem ${globalStyles.margin}`,
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
