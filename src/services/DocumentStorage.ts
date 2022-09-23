export default class DocumentStorage {
  static getItem(key: string): string | null {
    return Office.context.document.settings.get(key) as string | null;
  }

  static setItem(key: string, value: string): void {
    Office.context.document.settings.set(key, value);
  }

  static save(): void {
    Office.context.document.settings.saveAsync();
  }
}
