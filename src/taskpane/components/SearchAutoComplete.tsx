import React from "react";
import Autocomplete from "react-autocomplete";

interface SearchAutoCompleteProps {
  // eslint-disable-next-line no-unused-vars
  inputHandler: (value: React.ChangeEvent<HTMLInputElement>) => void;
  items: string[];
  style: React.CSSProperties;
}

const SearchAutoComplete: React.FC<SearchAutoCompleteProps> = ({
  items,
  inputHandler,
  style,
}) => {
  const [inputText, setInputText] = React.useState<string>("");
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };
  return (
    <Autocomplete
      value={inputText}
      items={items}
      getItemValue={(item: string) => item}
      shouldItemRender={(item: string, value: string) =>
        item?.toLowerCase().indexOf(value.toLowerCase()) > -1
      }
      renderItem={(item: string) => (
        <div style={{ backgroundColor: false ? "#eee" : "transparent" }}>
          {item}
        </div>
      )}
      onChange={(event) => onChange(event)}
      onSelect={(e) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        onChange(e.target.value);
      }}
    />
  );
};

export default SearchAutoComplete;
