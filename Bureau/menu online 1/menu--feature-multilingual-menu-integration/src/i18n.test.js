import { describe, expect, it } from "vitest";
import {
  applyMenuLanguageToDocument,
  resolveMenuLanguage,
} from "./utils/menuLanguage";
import { translations } from "./i18n";

describe("menu language selection", () => {
  it.each(["en", "fr", "ar"])("prioritizes URL language %s", (language) => {
    expect(resolveMenuLanguage(language, "en")).toBe(language);
  });

  it("uses a supported saved language when URL language is missing or invalid", () => {
    expect(resolveMenuLanguage(null, "fr")).toBe("fr");
    expect(resolveMenuLanguage("de", "ar")).toBe("ar");
  });

  it("defaults to English when neither language is supported", () => {
    expect(resolveMenuLanguage("de", "es")).toBe("en");
  });

  it("sets document direction and language for Arabic and LTR languages", () => {
    const documentElement = {};

    applyMenuLanguageToDocument("ar", documentElement);
    expect(documentElement).toEqual({ lang: "ar", dir: "rtl" });

    applyMenuLanguageToDocument("fr", documentElement);
    expect(documentElement).toEqual({ lang: "fr", dir: "ltr" });
  });

  it("provides translated menu-load errors in every supported language", () => {
    for (const language of ["en", "fr", "ar"]) {
      expect(translations[language].menuLoadError).toBeTruthy();
      expect(translations[language].menuLoadHint).toBeTruthy();
    }
  });

  it("explains that ordering needs a table-specific QR in every language", () => {
    for (const language of ["en", "fr", "ar"]) {
      expect(translations[language].tableRequired).toBeTruthy();
    }
  });
});
