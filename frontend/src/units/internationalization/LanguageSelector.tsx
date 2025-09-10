import React, { useCallback, useMemo } from "react";
import { StyledFlag, StyledLanguageName, StyledValueWrapper, StyledSelect, StyledMenuItem } from "./LanguageSelector.styled";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useI18nContext } from "./i18nContext";
import type { Language } from "./i18nContext";
import { useTranslation } from "react-i18next";
import { getNativeLanguageName } from "./functions";

const getLangValue = (lang: Language) => `${lang.code.toLowerCase()}-${lang.countryCode}`;

const LanguageSelector: React.FC = () => {
  const { enabledLanguages } = useI18nContext();
  const { i18n, t } = useTranslation();

  const languagesWithCountry = useMemo(() => {
    return enabledLanguages.map((lang) => ({
      ...lang,
      countryCode: lang.countryCode ?? lang.code.toUpperCase().slice(0, 2)
    }));
  }, [enabledLanguages]);

  const currentLanguageObj = useMemo(() => {
    const i18nLangCode = i18n.language.split("-")[0].toLowerCase();
    return languagesWithCountry.find((l) => l.code.toLowerCase() === i18nLangCode);
  }, [languagesWithCountry, i18n.language]);

  const currentLanguage = useMemo(() => (currentLanguageObj ? getLangValue(currentLanguageObj) : ""), [currentLanguageObj]);

  const handleChangeLanguage = useCallback(
    (event: SelectChangeEvent) => {
      const value = event.target.value as string;
      const langCode = value.split("-")[0];
      i18n.changeLanguage(langCode);
    },
    [i18n]
  );

  const renderValue = useCallback(
    (selected: unknown) => {
      const selectedStr = String(selected);
      const lang = languagesWithCountry.find((l) => getLangValue(l) === selectedStr);
      if (!lang)
        return (
          <StyledValueWrapper>
            <StyledLanguageName>{t("LanguageSelector.SelectLanguage")}</StyledLanguageName>
          </StyledValueWrapper>
        );
      return (
        <StyledValueWrapper>
          <StyledFlag countryCode={lang.countryCode} svg />
          <StyledLanguageName>{getNativeLanguageName(lang.code) || lang.name}</StyledLanguageName>
        </StyledValueWrapper>
      );
    },
    [languagesWithCountry, t]
  );

  return (
    <StyledSelect
      value={currentLanguage}
      onChange={(event) => handleChangeLanguage(event as SelectChangeEvent)}
      variant="standard"
      renderValue={renderValue}
      aria-label={t("LanguageSelector.SelectLanguage")}
      displayEmpty
    >
      {languagesWithCountry.map((lang) => (
        <StyledMenuItem key={lang.id || lang.code} value={getLangValue(lang)}>
          <StyledFlag countryCode={lang.countryCode} svg />
          <StyledLanguageName>{getNativeLanguageName(lang.code) || lang.name}</StyledLanguageName>
        </StyledMenuItem>
      ))}
    </StyledSelect>
  );
};

export default LanguageSelector;
