import { Theme } from '../../types';
import DocumentStorage from '../services/DocumentStorage';

export default class UserPreferences {
  static getCitationStyle(): string | null {
    return DocumentStorage.getItem('citation-style');
  }

  static setCitationStyle(styleID: string): void {
    DocumentStorage.setItem('citation-style', styleID);
  }

  static syncPreferences(): void {
    DocumentStorage.save();
  }

  static getTheme(): Theme {
    return DocumentStorage.getItem('theme') === '1' ? Theme.DARK : Theme.LIGHT;
  }

  static setTheme(theme: Theme): void {
    DocumentStorage.setItem('theme', theme.toString());
  }
}
