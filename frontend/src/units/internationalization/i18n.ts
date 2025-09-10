import i18n from "i18next";
import type { Resource } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import moment from "moment/min/moment-with-locales";
import Cookies from "js-cookie";
import { cloneDeep, set } from "lodash";
import en from "./locales/en/translations.json";
import ro from "./locales/ro/translations.json";
import fr from "./locales/fr/translations.json";
import { getCurrentLanguageShortFormat } from "./functions";

type StringMap = { [key: string]: string | StringMap };
type CustomResource = { languageCode: string; key: string; value: string };

const staticResources: Resource = {
  en: { translation: en },
  ro: { translation: ro },
  fr: { translation: fr }
};

i18n.on("initialized", () => {
  moment.locale(i18n.language);
});

const getDomain = () => {
  const hostname = window.location.hostname.split(".");
  hostname.reverse();
  return !hostname[1] ? hostname[0] : `${hostname[1]}.${hostname[0]}`;
};

i18n.on("languageChanged", function (lng) {
  const cookiesOptions: Record<string, string | boolean> = {
    path: "/"
  };
  // If not localhost, set secure cookie
  if (window.location.hostname !== "localhost") {
    cookiesOptions.sameSite = "None";
    cookiesOptions.secure = true;
    cookiesOptions.domain = getDomain();
  }
  Cookies.set("language", lng, cookiesOptions);
  moment.locale(lng);
});

function transformCustomResources(backendResources: CustomResource[]): Resource {
  const transformed: Resource = {};
  backendResources.forEach(({ languageCode, key, value }) => {
    const lang = languageCode.toLowerCase();
    if (!transformed[lang]) {
      transformed[lang] = { translation: {} };
    }
    set(transformed[lang].translation as StringMap, key, value);
  });
  return transformed;
}

function mergeDeep<T extends object>(target: T, source: T): T {
  if (typeof target !== "object" || typeof source !== "object") {
    return source;
  }
  const result = { ...target };
  Object.entries(source).forEach(([key, value]) => {
    if (key in target) {
      result[key as keyof T] = mergeDeep((target as T)[key as keyof T], value);
    } else {
      result[key as keyof T] = value;
    }
  });
  return result as T;
}

function mergeResources(staticResources: Resource, customResources: CustomResource[], enabledLanguages: string[]): Resource {
  const transformedCustomResources = transformCustomResources(customResources);
  const mergedResources: Resource = cloneDeep(staticResources);
  Object.entries(transformedCustomResources).forEach(([lang, data]) => {
    if (!mergedResources[lang]) {
      mergedResources[lang] = {
        translation: cloneDeep(mergedResources.en.translation)
      };
    }
    mergedResources[lang].translation = mergeDeep(mergedResources[lang].translation as StringMap, data.translation as StringMap);
  });
  enabledLanguages.forEach((code) => {
    const langCode = code.toLowerCase();
    if (!mergedResources[langCode]) {
      mergedResources[langCode] = {
        translation: cloneDeep(mergedResources.en.translation)
      };
    }
  });
  return mergedResources;
}

function ensureLanguageTranslationsFallback(staticResources: Resource, enabledLanguages: string[]): Resource {
  const completedResources: Resource = cloneDeep(staticResources);
  enabledLanguages.forEach((code) => {
    const langCode = code.toLowerCase();
    if (!completedResources[langCode]) {
      completedResources[langCode] = {
        translation: cloneDeep(completedResources.en.translation)
      };
    }
  });
  return completedResources;
}

const initializeI18n = async (resources: CustomResource[], enabledLanguages: string[]) => {
  const mergedResources = resources
    ? mergeResources(staticResources, resources, enabledLanguages)
    : ensureLanguageTranslationsFallback(staticResources, enabledLanguages);

  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init(
      {
        fallbackLng: "en",
        resources: mergedResources,
        ns: ["translation"],
        defaultNS: "translation",
        debug: import.meta.env.DEV,
        detection: {
          order: ["cookie", "localStorage"],
          lookupCookie: "language"
        },
        interpolation: {
          escapeValue: false,
          format: function (value, format, lng) {
            if (format === "uppercase") return value.toUpperCase();
            if (format === "intlDate") {
              if (value && moment(value).isValid()) {
                return moment(value).format("L");
              }
              return "";
            }
            if (format === "intlLongDate") {
              if (value && moment(value).isValid()) {
                return moment(value).format("LLLL");
              }
              return "";
            }
            if (format === "intlDateTime") {
              if (value && moment(value).isValid()) {
                return moment(value).format("L") + ", " + moment(value).format("LT");
              }
              return "";
            }
            if (format === "intlTimeFromX") {
              if (value && moment(value.start).isValid()) {
                const startDate = moment(value.start);
                const endDate = moment(value.end);
                return moment(endDate).from(startDate, true);
              }
              return "";
            }
            if (format === "intlHoursFromX") {
              if (value && moment(value.start).isValid()) {
                const startDate = moment(value.start);
                const endDate = moment(value.end);
                const span = moment.duration(endDate.diff(startDate));
                return `${parseInt(String(span.asHours()), 10)}h ${parseInt(String(span.asMinutes() % 60), 10)}m`;
              }
              return "";
            }
            if (format === "intlNumber") return new Intl.NumberFormat(lng).format(value);
            if (format === "intlDecimal") return new Intl.NumberFormat(lng, { minimumFractionDigits: 2 }).format(value);
            if (format === "intlDecimal2")
              return new Intl.NumberFormat(lng, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
            if (format === "intlDecimal4") {
              return new Intl.NumberFormat(lng, { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(value);
            }
            if (format === "cvsChPercentNumber") {
              return new Intl.NumberFormat(lng, { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(value);
            }
            if (value && value.format) {
              if (value.value && moment(value).isValid()) {
                return moment(value.value).format(value.format);
              }
              return "";
            }
            return value;
          }
        },
        react: {
          useSuspense: false
        }
      },
      () => {
        const availableLanguages = Object.keys(mergedResources);
        const currentLang = i18n.language;
        const currentLangShortFormat = getCurrentLanguageShortFormat();
        let finalLang = "en-GB";
        if (currentLang && availableLanguages.includes(currentLangShortFormat)) {
          finalLang = currentLang;
        } else if (!currentLang || currentLang.startsWith("ro")) {
          finalLang = "ro-RO";
        } else if (!currentLang || currentLang.startsWith("en")) {
          finalLang = "en-GB";
        } else if (!currentLang || currentLang.startsWith("fr")) {
          finalLang = "fr-FR";
        }
        i18n.changeLanguage(finalLang);
      }
    );
};

export { initializeI18n };
