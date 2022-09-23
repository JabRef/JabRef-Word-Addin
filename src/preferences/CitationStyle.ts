import DocumentStorage from '../services/DocumentStorage';

export default class CitationStyle {
  static getCitationStyle(): string | null {
    return DocumentStorage.getItem('citation-style');
  }

  static setCitationStyle(styleID: string): void {
    DocumentStorage.setItem('citation-style', styleID);
  }

  static sync(): void {
    DocumentStorage.save();
  }
}
