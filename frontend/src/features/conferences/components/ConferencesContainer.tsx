import { Grid } from "@mui/material";
import ConferenceList from "./ConferenceList";
import ConferenceListFilters from "./ConferenceListFilters";
import { useState } from "react";
import { mockData } from "../mockDate";
import { endpoints } from "utils/api";
import { useApiSWR } from "units/swr";
import type { DictionaryItem } from "types/dto";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ConferencesContainer: React.FC = () => {
  const { t } = useTranslation();

  const [filterName, setFilterName] = useState<string>("");
  const [filterLocation, setFilterLocation] = useState<string>("");
  // const [filterStartDate, setfilterStartDate] = useState<Date>(new Date());

  const { data: categories = [] } = useApiSWR<DictionaryItem[], Error>(endpoints.dictionaries.categories, {
    onError: (err) => toast.error(t("User.Error", { message: err.message }))
  });
  console.log("categories:", categories);
  console.log("first item:", categories[0]);

  const { data: cities = [] } = useApiSWR<DictionaryItem[]>(endpoints.dictionaries.cities, {
    onError: (err) => toast.error(t("User.Error", { message: err.message }))
  });
  console.log("cities from API:", cities);
  // console.log("first:", cities[0].name);
  // console.log("last:", cities[199].name);

  return (
    <Grid padding={3} sx={{ width: "100%", height: "100%" }}>
      <ConferenceListFilters
        filterName={filterName}
        onFilterNameChange={setFilterName}
        filterLocation={filterLocation}
        onFilterLocationChange={setFilterLocation}
        // filterStartDate={filterStartDate}
        // onFilterStartDateChange={setfilterStartDate}
      />
      <ConferenceList conferences={mockData} filterName={filterName} filterLocation={filterLocation} />
    </Grid>
  );
};
export default ConferencesContainer;
