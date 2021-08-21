import React, { useCallback, useState } from "react";
import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
import { Panel, PanelType } from "@fluentui/react/lib/Panel";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useBoolean } from "@fluentui/react-hooks";
import {
  Checkbox,
  Dropdown,
  IDropdownOption,
  IDropdownStyles,
  IStackStyles,
  IStackTokens,
  Stack,
  TextField,
} from "@fluentui/react";

export interface citationMetaData {
  id: string;
  label: string;
  locator: string;
  isAuthorSuppress: boolean;
  prefix: string;
  suffix: string;
}

interface EditCitationProps {
  id: string;
  labelProp: string;
  locatorProp: string;
  isAuthorSuppressProp: boolean;
  prefixProp: string;
  suffixProp: string;
  // eslint-disable-next-line no-unused-vars
  metaDataHandler: (metadata: citationMetaData) => void;
}

const buttonStyles = { root: { marginRight: 8 } };

const stackToken: IStackTokens = {
  childrenGap: 20,
};

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 150 },
};
const stackStyles: IStackStyles = {
  root: {
    marginTop: 30,
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
    isAuthorSuppressProp,
    prefixProp,
    suffixProp,
    metaDataHandler,
  } = props;
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);
  const [prefix, setPrefix] = useState<string>(prefixProp);
  const [suffix, setSuffix] = useState<string>(suffixProp);
  const [locator, setLocator] = useState<string>(locatorProp);
  const [isAuthorSuppress, setIsAuthorSuppress] =
    React.useState(isAuthorSuppressProp);
  const [label, setlabel] = React.useState<string>(labelProp);

  const onLabelChange = (
    _event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    setlabel(item.key as string);
  };
  const onAuthorSuppressChange = React.useCallback(
    (
      _ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
      checked?: boolean
    ): void => {
      setIsAuthorSuppress(!!checked);
    },
    []
  );
  const onPrefixChange = useCallback(
    (
      _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setPrefix(newValue || "");
    },
    []
  );
  const onSuffixChange = useCallback(
    (
      _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setSuffix(newValue || "");
    },
    []
  );
  const onLocatorChange = useCallback(
    (
      _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setLocator(newValue || "");
    },
    []
  );
  const onClickHandler = useCallback(() => {
    metaDataHandler({ id, label, prefix, suffix, locator, isAuthorSuppress });
  }, [id, isAuthorSuppress, label, locator, metaDataHandler, prefix, suffix]);

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
      <DefaultButton text="Open panel" onClick={openPanel} />
      <Panel
        isOpen={isOpen}
        onDismiss={dismissPanel}
        headerText="Edit Reference"
        closeButtonAriaLabel="Close"
        type={PanelType.smallFluid}
        onRenderFooterContent={onRenderFooterContent}
        isFooterAtBottom
      >
        <Stack
          horizontal
          styles={stackStyles}
          tokens={stackToken}
          horizontalAlign="stretch"
        >
          <Dropdown
            label="label"
            placeholder="Select an option"
            selectedKey={label || undefined}
            options={LabelOptions}
            styles={dropdownStyles}
            onChange={onLabelChange}
          />
          <TextField
            styles={stackStyles}
            title="locator"
            label="locator"
            value={locator}
            onChange={onLocatorChange}
          />
        </Stack>
        <Stack tokens={stackToken}>
          <Stack.Item align="auto">
            <TextField
              title="Prefix"
              label="Prefix"
              value={prefix}
              onChange={onPrefixChange}
            />
            <TextField
              title="Suffix"
              label="Suffix"
              value={suffix}
              onChange={onSuffixChange}
            />
          </Stack.Item>
          <Stack.Item align="auto">
            <Checkbox
              label="Suppress Author"
              checked={isAuthorSuppress}
              onChange={onAuthorSuppressChange}
            />
          </Stack.Item>
        </Stack>
      </Panel>
    </div>
  );
};

export default EditCitation;
