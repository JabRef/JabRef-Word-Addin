import React from 'react';
import { List } from '@fluentui/react/lib/List';
import { Icon, Stack } from '@fluentui/react';
import Preference from '../../utils/user-preference';
import { useCiteSupport } from '../contexts/CiteSupportContext';
import {
  classNames,
  container,
  heading,
  listContainer,
  selectedStyle,
  selectedStyleIcon,
} from '../styles/citationStyles';

function CitationStyle(): JSX.Element {
  const citeSupport = useCiteSupport();
  const items = [
    {
      text: 'American Political Science Association',
      value: 'american-political-science-association',
    },
    { text: 'IEEE', value: 'ieee' },
    {
      text: 'American Sociological Association 6th edition',
      value: 'american-sociological-association',
    },
    {
      text: 'American Psychological Association 7th edition',
      value: 'advances-in-complex-systems',
    },
    {
      text: 'Chicago Manual of Style 16th edition (author-date)',
      value: 'chicago-author-date-16th-edition',
    },
  ];

  const preferenceStyle = Preference.getItem('style');
  const [currentStyle, setCurrentStyle] = React.useState(preferenceStyle);
  const onClick = async (ev: React.FormEvent<HTMLElement | HTMLInputElement>) => {
    setCurrentStyle(ev.currentTarget.id);
    Preference.setItem('style', ev.currentTarget.id);
    await citeSupport.initDocument();
  };

  // Sync with doc settings
  React.useEffect(() => {
    return Preference.syncPreference();
  });

  const onRenderCell = (item: { text: string; value: string }): JSX.Element => {
    return (
      <Stack className={classNames.itemCell} data-is-focusable>
        <Stack key={item.value} id={item.value} className={classNames.itemName} onClick={onClick}>
          {item.text}
        </Stack>
      </Stack>
    );
  };

  return (
    <Stack verticalFill styles={container}>
      <Stack.Item styles={heading}>Current Style</Stack.Item>
      <Stack.Item styles={selectedStyle}>
        <Icon iconName="Pinned" styles={selectedStyleIcon} />
        {currentStyle
          ? items.find((item) => item.value === currentStyle).text
          : 'American Political Science Association'}
      </Stack.Item>
      <Stack.Item styles={heading}>Change Style</Stack.Item>
      <Stack.Item grow styles={listContainer}>
        <List items={items} onRenderCell={onRenderCell} />
      </Stack.Item>
    </Stack>
  );
}

export default CitationStyle;
