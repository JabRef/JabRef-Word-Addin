export default class Preference {
  static getCitationStyle(): string | null {
    return Office.context.document.settings.get("Style") as string | null;
  }

  static setCitationStyle(styleID: string): void {
    Office.context.document.settings.set("Style", styleID);
  }

  static syncPreference(): void {
    Office.context.document.settings.saveAsync();
  }
}
