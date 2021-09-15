import React, { useCallback, useState } from "react";
import {
  DefaultButton,
  IconButton,
  PrimaryButton,
} from "@fluentui/react/lib/Button";
import { Panel, PanelType } from "@fluentui/react/lib/Panel";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useBoolean } from "@fluentui/react-hooks";
import {
  Dropdown,
  IDropdownOption,
  IDropdownStyles,
  IIconProps,
  IStackStyles,
  IStackTokens,
  MessageBar,
  Stack,
  TextField,
} from "@fluentui/react";
import { CitationItem } from "citeproc";

interface EditCitationProps {
  id: string;
  labelProp: string;
  locatorProp: string;
  prefixProp: string;
  suffixProp: string;
  // eslint-disable-next-line no-unused-vars
  metaDataHandler: (metadata: CitationItem) => void;
}

const editIcon: IIconProps = { iconName: "edit" };
const buttonStyles = { root: { marginRight: 8 } };
const stackToken: IStackTokens = {
  childrenGap: 25,
};
const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: {
    minWidth: 160,
  },
};
const wrapperStackStyles: IStackStyles = {
  root: {
    marginTop: 40,
    marginLeft: 10,
    marginRight: 10,
  },
};

interface LabelOptionInterface {
  key: string;
  text: string;
}

const LabelOptions: Array<LabelOptionInterface> = [
  { key: "column", text: "Column" },
  { key: "figure", text: "Figure" },
  { key: "book", text: "Book" },
  { key: "chapter", text: "Chapter" },
  { key: "volume", text: "Volume" },
  { key: "page", text: "Page" },
  { key: "folio", text: "Folio" },
  { key: "issue", text: "Issue" },
  { key: "opus", text: "Opus" },
  { key: "part", text: "Part" },
  { key: "line", text: "Line" },
  { key: "note", text: "Note" },
  { key: "section", text: "Section" },
  { key: "paragraph", text: "Paragraph" },
];

const EditCitation: React.FunctionComponent<EditCitationProps> = (
  props: EditCitationProps
) => {
  const {
    id,
    labelProp,
    locatorProp,
    prefixProp,
    suffixProp,
    metaDataHandler,
  } = props;
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);
  const [label, setlabel] = useState<string>(labelProp);
  const [prefix, setPrefix] = useState<string>(prefixProp);
  const [suffix, setSuffix] = useState<string>(suffixProp);
  const [locator, setLocator] = useState<string>(locatorProp);
  const onLabelChange = (
    _event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    setlabel(item.key as string);
  };
  const onPrefixChange = useCallback(
    (
      _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => setPrefix(newValue || ""),
    []
  );
  const onSuffixChange = useCallback(
    (
      _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => setSuffix(newValue || ""),
    []
  );
  const onLocatorChange = useCallback(
    (
      _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => setLocator(newValue || ""),
    []
  );
  const onClickHandler = useCallback(() => {
    metaDataHandler({
      id,
      label,
      prefix,
      suffix,
      locator,
    });
    dismissPanel();
  }, [metaDataHandler, id, label, prefix, suffix, locator, dismissPanel]);

  const onRenderFooterContent = React.useCallback(
    () => (
      <div>
        <PrimaryButton onClick={onClickHandler} styles={buttonStyles}>
          Save
        </PrimaryButton>
        <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
      </div>
    ),
    [dismissPanel, onClickHandler]
  );

  return (
    <div>
      <IconButton
        iconProps={editIcon}
        ariaLabel="Add extra info"
        onClick={openPanel}
      />
      <Panel
        isOpen={isOpen}
        onDismiss={dismissPanel}
        headerText="Edit Reference"
        type={PanelType.smallFluid}
        onRenderFooterContent={onRenderFooterContent}
        isFooterAtBottom
      >
        <Stack styles={wrapperStackStyles} tokens={stackToken}>
          <MessageBar>Add more information.</MessageBar>
          <Stack horizontal horizontalAlign="stretch" tokens={stackToken}>
            <Stack.Item>
              <Dropdown
                label="Label"
                placeholder="Select an option"
                selectedKey={label || undefined}
                options={LabelOptions}
                defaultSelectedKey="page"
                styles={dropdownStyles}
                onChange={onLabelChange}
              />
            </Stack.Item>
            <Stack.Item>
              <TextField
                label="Locator"
                autoComplete="off"
                value={locator}
                onChange={onLocatorChange}
              />
            </Stack.Item>
          </Stack>
          <Stack tokens={stackToken}>
            <Stack.Item align="auto">
              <TextField
                label="Prefix"
                value={prefix}
                autoComplete="off"
                onChange={onPrefixChange}
              />
              <TextField
                label="Suffix"
                value={suffix}
                autoComplete="off"
                onChange={onSuffixChange}
              />
            </Stack.Item>
          </Stack>
        </Stack>
      </Panel>
    </div>
  );
};

export default EditCitation;
