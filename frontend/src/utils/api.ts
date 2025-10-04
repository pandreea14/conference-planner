import env from "./env";
import urlJoin from "url-join";

const apiHost = urlJoin(env.VITE_APP_API_URL, "api");

const systemRoute = `${apiHost}/system`;
const usersRoute = `${apiHost}/users`;

const endpoints = {
  system: {
    version: `${systemRoute}/version`,
    databaseVersion: `${systemRoute}/database-version`,
    resetCache: `${systemRoute}/reset-cache`,
    bff: {
      version: urlJoin(env.VITE_APP_API_URL, "/bff-api/system/version")
    }
  },
  users: {
    default: `${usersRoute}`
  },
  dictionaries: {
    categories: `${apiHost}/dictionaries/categories`,
    cities: `${apiHost}/dictionaries/cities`,
    conferenceType: `${apiHost}/dictionaries/conferenceType`
  },
  conferences: {
    conferencesForAttendees: `${apiHost}/conferences/list-for-attendees`
  }
};

/**
 * Replaces placeholders in the template string with corresponding values.
 * A placeholder is a word enclosed in curly braces, like {placeholder}.
 * If a placeholder's value is not provided, it's replaced with an empty string.
 *
 * @param template - The template string with placeholders.
 * @param values - An object that maps placeholder names to their values.
 * @returns The template string with all placeholders replaced by their values.
 */
const fit = (template: string, values: Record<string, string | number | undefined>): string => {
  return template.replace(/{(\w+)}/g, (_match, key) => (values[key] !== undefined ? String(values[key]) : ""));
};

export { endpoints, fit };
