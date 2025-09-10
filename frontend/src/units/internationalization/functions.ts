import i18n from "i18next";

export const getCurrentLanguageShortFormat = () => {
  return i18n.language?.split("-")[0];
};

export const getNativeLanguageName = (languageCode: string) => {
  const displayNames = new Intl.DisplayNames([languageCode], { type: "language" });
  const nativeName = displayNames.of(languageCode);

  if (!nativeName) return null;
  return nativeName.charAt(0).toUpperCase() + nativeName.slice(1);
};
