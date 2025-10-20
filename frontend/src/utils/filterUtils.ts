import type { ConferenceFilterState } from "types";

export interface ActiveFilter {
  type: string;
  value: string;
  key: string;
}

export const getActiveFilters = (state: ConferenceFilterState): ActiveFilter[] => {
  const filters: ActiveFilter[] = [];

  if (state.name && state.name.trim() !== "") {
    filters.push({ type: "Name", value: state.name, key: "name" });
  }

  if (state.location && state.location.trim() !== "") {
    filters.push({ type: "Location", value: state.location, key: "location" });
  }

  if (state.email && state.email.trim() !== "") {
    filters.push({ type: "Email", value: state.email, key: "email" });
  }

  if (state.dateStart && state.dateStart.trim() !== "") {
    filters.push({
      type: "Start Date",
      value: new Date(state.dateStart).toLocaleDateString(),
      key: "dateStart"
    });
  }

  if (state.conferenceType && state.conferenceType.length > 0 && state.conferenceType[0] !== "") {
    const activeTypes = state.conferenceType.filter((type) => type.trim() !== "");
    activeTypes.forEach((type) => {
      filters.push({ type: "Type", value: type, key: "conferenceType" });
    });
  }

  if (state.speakerName && state.speakerName.length > 0 && state.speakerName[0] !== "") {
    const activeSpeakers = state.speakerName.filter((speaker) => speaker.trim() !== "");
    activeSpeakers.forEach((speaker) => {
      filters.push({ type: "Speaker", value: speaker, key: "speakerName" });
    });
  }

  return filters;
};

export const removeFilter = (state: ConferenceFilterState, filterKey: string, filterValue?: string): ConferenceFilterState => {
  const newState: ConferenceFilterState = { ...state };

  switch (filterKey) {
    case "conferenceType":
      if (filterValue) {
        newState.conferenceType = newState.conferenceType.filter((type) => type !== filterValue);
        if (newState.conferenceType.length === 0) {
          newState.conferenceType = [""];
        }
      }
      break;

    case "speakerName":
      if (filterValue) {
        newState.speakerName = newState.speakerName.filter((speaker) => speaker !== filterValue);
        if (newState.speakerName.length === 0) {
          newState.speakerName = [""];
        }
      }
      break;

    case "name":
      newState.name = "";
      break;

    case "location":
      newState.location = "";
      break;

    case "dateStart":
      newState.dateStart = "";
      break;

    case "email":
      newState.email = "";
      break;

    default:
      break;
  }

  return newState;
};

export const clearAllFilters = (): ConferenceFilterState => {
  return {
    name: "",
    location: "",
    dateStart: "",
    email: "",
    conferenceType: [""],
    speakerName: [""]
  };
};

export const hasActiveFilters = (state: ConferenceFilterState): boolean => {
  return getActiveFilters(state).length > 0;
};

export const resetFilterType = (state: ConferenceFilterState, filterType: string): ConferenceFilterState => {
  return removeFilter(state, filterType);
};
