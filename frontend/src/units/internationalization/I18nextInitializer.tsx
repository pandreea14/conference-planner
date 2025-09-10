import React, { useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { initializeI18n } from "./i18n";
import { I18nContext } from "./i18nContext";
import type { Language } from "./i18nContext";

/// Mocked language data - Can be replaced with real API data
const languages: Language[] = [
  { id: 1, code: "en", name: "English", countryCode: "US", enabled: true },
  { id: 2, code: "fr", name: "Français", countryCode: "FR", enabled: true },
  { id: 3, code: "ro", name: "Română", countryCode: "RO", enabled: true }
];

/// Mocked resource data - Can be replaced with real API data
const resources: Array<{ languageCode: string; key: string; value: string }> = [];

interface Props {
  children: ReactNode;
}

export const I18nextInitializer: React.FC<Props> = ({ children }) => {
  const [i18nReady, setI18nReady] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);

  const enabledLanguages = useMemo(() => {
    if (!Array.isArray(languages)) return [];
    return languages.filter((l) => l && l.enabled === true);
  }, []);

  useEffect(() => {
    if (!resources) return;

    setInitError(null);

    const initialize = async () => {
      try {
        await initializeI18n(
          resources,
          enabledLanguages.map((l) => l.code)
        );
        setI18nReady(true);
      } catch (error) {
        setInitError(error as Error);
        console.error("Failed to initialize i18n:", error);
      }
    };

    initialize();
  }, [enabledLanguages]);

  if (initError) {
    return <div style={{ color: "red" }}>{initError && <p>I18n initialization error: {initError.message}</p>}</div>;
  }

  if (!resources || !i18nReady) {
    return null;
  }

  return <I18nContext.Provider value={{ enabledLanguages }}>{children}</I18nContext.Provider>;
};
