const supportedLanguages = ["en", "fr", "ar"];

export const resolveMenuLanguage = (requestedLanguage, savedLanguage) => {
  if (supportedLanguages.includes(requestedLanguage)) {
    return requestedLanguage;
  }

  if (supportedLanguages.includes(savedLanguage)) {
    return savedLanguage;
  }

  return "en";
};

export const applyMenuLanguageToDocument = (language, documentElement) => {
  documentElement.lang = language;
  documentElement.dir = language === "ar" ? "rtl" : "ltr";
};
