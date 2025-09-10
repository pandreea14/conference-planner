import { createContext, useContext } from "react";

export interface Language {
  id: number;
  code: string;
  name: string;
  countryCode: string;
  enabled?: boolean;
}

interface I18nContextValue {
  enabledLanguages: Language[];
}

export const I18nContext = createContext<I18nContextValue>({ enabledLanguages: [] });
export const useI18nContext = () => useContext(I18nContext);
