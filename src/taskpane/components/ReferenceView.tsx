import React from 'react';
import { Checkbox, Stack } from '@fluentui/react';
import { Author, MetaData } from 'citeproc';
import EditCitation from '../pages/EditCitation';
import { useCitationStore } from '../contexts/CitationStoreContext';
import {
  authorStyle,
  buttonContainer,
  heading,
  referenceDetailsContainer,
  referenceViewContainer,
} from './ReferenceView.style';

interface ReferenceViewProps {
  document: MetaData;
}

function renderAuthor(author: Array<Author>): string {
  return author.map((_author) => `${_author.given} ${_author.family}`).join(', ');
}

function ReferenceView({ document }: ReferenceViewProps): React.ReactElement {
  const { selectedCitations, dispatch } = useCitationStore();

  const onCheckChange = (_e, checked: boolean) =>
    dispatch({
      type: checked ? 'add' : 'remove',
      citation: document,
    });

  const onClickHandler = () =>
    dispatch({
      type: !selectedCitations.find((citation) => citation.id === document.id) ? 'add' : 'remove',
      citation: document,
    });

  return (
    <Stack horizontal styles={referenceViewContainer}>
      <Stack.Item>
        <Stack styles={buttonContainer} verticalFill horizontalAlign="center">
          <Stack.Item grow>
            <Checkbox
              checked={!!selectedCitations.find((citation) => citation.id === document.id)}
              onChange={onCheckChange}
            />
          </Stack.Item>
          <Stack.Item>
            {!!selectedCitations.find((citation) => citation.id === document.id) && (
              <EditCitation document={document} />
            )}
          </Stack.Item>
        </Stack>
      </Stack.Item>
      <Stack.Item grow styles={referenceDetailsContainer} onClick={onClickHandler}>
        <Stack verticalFill>
          <Stack.Item styles={heading}>{document.title}</Stack.Item>
          <Stack.Item styles={authorStyle}>{renderAuthor(document.author)}</Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
}

export default ReferenceView;
