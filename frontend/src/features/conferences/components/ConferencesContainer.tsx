import { Grid } from "@mui/material";
import ConferenceList from "./ConferenceList";
import ConferenceListFilters from "./ConferenceListFilters";
import { useState } from "react";
import { endpoints } from "utils/api";
import { useApiSWR } from "units/swr";
import type { ConferenceDto, DictionaryItem } from "types/dto";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ConferencesContainer: React.FC = () => {
  const { t } = useTranslation();

  const [filterName, setFilterName] = useState<string>("");
  const [filterLocation, setFilterLocation] = useState<string>("");
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  // const [filterEndDate, setFilterEndDate] = useState<Date>(new Date());

  // const { data: categories = [] } = useApiSWR<DictionaryItem[], Error>(endpoints.dictionaries.categories, {
  //   onError: (err) => toast.error(t("User.Error", { message: err.message }))
  // });
  // console.log("categories:", categories);
  // console.log("first item:", categories[0]);

  const { data: cities = [] } = useApiSWR<DictionaryItem[]>(endpoints.dictionaries.cities, {
    onError: (err) => toast.error(t("User.Error", { message: err.message }))
  });
  console.log("cities from API:", cities);
  // // console.log("first:", cities[0]?.name);

  const { data: conferences = [] } = useApiSWR<ConferenceDto[]>(endpoints.conferences.conferencesForAttendees, {
    onError: (err) => toast.error(t("User.Error", { message: err.message }))
  });
  console.log("conferences from API:", conferences);
  console.log("conferences attendees for first conference from API:", conferences[0]?.attendeesList?.length || 0);

  return (
    <Grid padding={3} sx={{ width: "100%", height: "100%" }}>
      <ConferenceListFilters
        filterName={filterName}
        onFilterNameChange={setFilterName}
        filterLocation={filterLocation}
        onFilterLocationChange={setFilterLocation}
        filterStartDate={filterStartDate}
        onFilterStartDateChange={setFilterStartDate}
        // filterEndDate={filterEndDate}
        // onFilterEndDateChange={setFilterEndDate}
      />
      <ConferenceList conferences={conferences} filterName={filterName} filterLocation={filterLocation} filterStartDate={filterStartDate} />
    </Grid>
  );
};
export default ConferencesContainer;
