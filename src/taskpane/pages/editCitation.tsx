import React from 'react';
import { IconButton } from '@fluentui/react/lib/Button';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useBoolean } from '@fluentui/react-hooks';
import { MetaData } from 'citeproc';
import { useFormik } from 'formik';
import { Dropdown, IDropdownOption, MessageBar, Stack, TextField } from '@fluentui/react';
import { useCitationStore } from '../contexts/CitationStoreContext';
import LabelOptions from '../../constants/LabelOptions';
import ButtonGroup from '../components/ButtonGroup';
import {
  buttonContainerStack,
  dropdownStyles,
  editIcon,
  iconButtonStyle,
  stackToken,
} from './EditCitation.style';

interface EditCitationProps {
  document: MetaData;
}

function EditCitation({ document }: EditCitationProps): React.ReactElement {
  const { selectedCitations, dispatch } = useCitationStore();

  const {
    id,
    label: labelProp,
    prefix: prefixProp,
    suffix: suffixProp,
    locator: locatorProp,
  } = selectedCitations.find((doc) => doc.id === document.id);

  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);

  const {
    values: formValues,
    handleSubmit,
    handleChange,
  } = useFormik({
    initialValues: {
      label: labelProp || '',
      prefix: prefixProp || '',
      suffix: suffixProp || '',
      locator: locatorProp || '',
    },
    onSubmit: (values) => {
      const citation = {
        id,
        ...values,
      };
      dispatch({ type: 'update', citation });
      dismissPanel();
    },
  });

  const onLabelChange = (_event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void =>
    handleChange('label')(item.key as string);

  const onDismiss = () => {
    dismissPanel();
  };

  const onRenderFooterContent = () => (
    <ButtonGroup
      label1="Save"
      label2="Cancel"
      onClick1={handleSubmit}
      onClick2={onDismiss}
      disabled1={false}
      disabled2={false}
      styles={buttonContainerStack}
    />
  );

  return (
    <Stack>
      <IconButton
        iconProps={editIcon}
        ariaLabel="Add extra info"
        onClick={openPanel}
        styles={iconButtonStyle}
      />
      <Panel
        isOpen={isOpen}
        hasCloseButton={false}
        onDismiss={dismissPanel}
        headerText="Edit Reference"
        type={PanelType.smallFluid}
        onRenderFooterContent={onRenderFooterContent}
        isFooterAtBottom
      >
        <Stack tokens={stackToken}>
          <Stack.Item styles={{ root: { marginTop: '1.14rem' } }}>
            <MessageBar>Add more information.</MessageBar>
          </Stack.Item>
          <Stack horizontal horizontalAlign="stretch" tokens={stackToken}>
            <Stack.Item grow>
              <Dropdown
                label="Label"
                id="label"
                placeholder="Select an option"
                selectedKey={formValues.label || undefined}
                options={LabelOptions}
                styles={dropdownStyles}
                onChange={onLabelChange}
              />
            </Stack.Item>
            <Stack.Item grow>
              <TextField
                label="Locator"
                id="locator"
                autoComplete="off"
                value={formValues.locator}
                onChange={handleChange}
              />
            </Stack.Item>
          </Stack>
          <Stack tokens={stackToken}>
            <Stack.Item align="auto">
              <TextField
                label="Prefix"
                id="prefix"
                value={formValues.prefix}
                autoComplete="off"
                onChange={handleChange}
              />
              <TextField
                label="Suffix"
                id="suffix"
                value={formValues.suffix}
                autoComplete="off"
                onChange={handleChange}
              />
            </Stack.Item>
          </Stack>
        </Stack>
      </Panel>
    </Stack>
  );
}

export default EditCitation;
