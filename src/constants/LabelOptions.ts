interface LabelOptionInterface {
  key: string;
  text: string;
}

const LabelOptions: Array<LabelOptionInterface> = [
  { key: 'column', text: 'Column' },
  { key: 'figure', text: 'Figure' },
  { key: 'book', text: 'Book' },
  { key: 'chapter', text: 'Chapter' },
  { key: 'volume', text: 'Volume' },
  { key: 'page', text: 'Page' },
  { key: 'folio', text: 'Folio' },
  { key: 'issue', text: 'Issue' },
  { key: 'opus', text: 'Opus' },
  { key: 'part', text: 'Part' },
  { key: 'line', text: 'Line' },
  { key: 'note', text: 'Note' },
  { key: 'section', text: 'Section' },
  { key: 'paragraph', text: 'Paragraph' },
];

export default LabelOptions;
