import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { Stack } from '@fluentui/react';
import { CitationItem, MetaData } from 'citeproc';
import data from '../../utils/data';
import SearchField from '../components/SearchField';
import { useCitationStore } from '../contexts/CitationStoreContext';
import { useCiteSupport } from '../contexts/CiteSupportContext';
import ReferenceList from '../components/ReferenceList';
import { scrollableStack } from '../styles/layout';
import ButtonGroup from '../components/ButtonGroup';
import { CitationMode } from '../../../types';

function containsSearchTerm(keyword: string) {
  return (item?: MetaData) => {
    return [item.title, item.author, item.year].some((str: string | number) =>
      str ? str.toString().toLowerCase().includes(keyword?.toLowerCase().trim()) : false
    );
  };
}

const buttonLabel = (length: number) =>
  length > 0
    ? length > 1
      ? `Insert ${length} citations `
      : `Insert ${length} citation `
    : 'Remove citation';

function Dashboard(): ReactElement {
  const originalItems = data; // TODO: Replace with getData hooK
  const citeSupport = useCiteSupport();
  const [mode, setMode] = useState<CitationMode>(CitationMode.REST);
  const { selectedCitations, dispatch } = useCitationStore();
  const [referenceList, setReferenceList] = useState<Array<MetaData>>(originalItems);
  const [citationItems, _setCitationItems] = useState<Array<CitationItem | null>>([]);
  const itemsInSelectedCitation = useRef(citationItems);
  const setItemsInSelectedCitation = (itemsMetadata: Array<CitationItem>) => {
    itemsInSelectedCitation.current = itemsMetadata;
    _setCitationItems(itemsMetadata);
  };

  const onFilterChange = (_: React.ChangeEvent<HTMLInputElement>, keyword: string): void => {
    setReferenceList(originalItems.filter(containsSearchTerm(keyword)));
  };

  const insertCitation = async () => {
    const citationSelected = itemsInSelectedCitation.current.length > 0;
    if (citationSelected && !selectedCitations.length) {
      await citeSupport.wordApi.removeSelectedCitation();
    } else {
      await citeSupport.insertCitation(selectedCitations, citationSelected);
      dispatch({ type: 'empty' });
      setItemsInSelectedCitation([]);
    }
  };

  useEffect(() => {
    if (selectedCitations.length && !itemsInSelectedCitation.current.length) {
      setMode(CitationMode.CITE);
    } else if (itemsInSelectedCitation.current.length) {
      setMode(CitationMode.EDIT);
    } else {
      setMode(CitationMode.REST);
    }
  }, [selectedCitations, itemsInSelectedCitation.current.length, setMode]);

  const undoEdit = () => {
    dispatch({ type: 'replace', citations: itemsInSelectedCitation.current });
  };

  const editCheck = () =>
    JSON.stringify(selectedCitations) === JSON.stringify(itemsInSelectedCitation.current);

  const getSelectedCitation = useCallback(async (): Promise<void> => {
    const itemsInCitation = await citeSupport.wordApi.getItemsInSelectedCitation();
    if (itemsInCitation.length) {
      dispatch({ type: 'replace', citations: itemsInCitation });
      setItemsInSelectedCitation(itemsInCitation);
    } else if (itemsInSelectedCitation.current.length) {
      dispatch({ type: 'empty' });
      setItemsInSelectedCitation([]);
    }
  }, [citeSupport.wordApi, dispatch]);

  useEffect(() => {
    citeSupport.wordApi.addEventListener(getSelectedCitation);
    return () => citeSupport.wordApi.removeEventListener();
  }, [citeSupport.wordApi, getSelectedCitation]);

  return (
    <Stack verticalFill>
      <Stack.Item>
        <SearchField onFilterChange={onFilterChange} />
      </Stack.Item>
      <Stack.Item grow styles={scrollableStack}>
        <ReferenceList referenceList={referenceList} />
      </Stack.Item>
      <Stack.Item>
        {mode === CitationMode.CITE && (
          <ButtonGroup
            label1={buttonLabel(selectedCitations.length)}
            label2="Cancel"
            onClick1={insertCitation}
            onClick2={() => dispatch({ type: 'empty' })}
            disabled1={false}
            disabled2={false}
          />
        )}
        {mode === CitationMode.EDIT && (
          <ButtonGroup
            label1={buttonLabel(selectedCitations.length)}
            label2="Cancel"
            onClick1={insertCitation}
            onClick2={undoEdit}
            disabled1={editCheck()}
            disabled2={editCheck()}
          />
        )}
      </Stack.Item>
    </Stack>
  );
}

export default Dashboard;
