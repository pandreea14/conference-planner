import { Grid } from "@mui/material";
import ConferenceList from "./ConferenceList";
import ConferenceListFilters from "./ConferenceListFilters";
import { useState } from "react";
import { mockData } from "../mockDate";

const ConferencesContainer: React.FC = () => {
  const [filterName, setFilterName] = useState<string>("");
  const [filterLocation, setFilterLocation] = useState<string>("");
  const [filterStartDate, setfilterStartDate] = useState<Date>(new Date());

  return (
    <Grid padding={3} sx={{ width: "100%", height: "100%" }}>
      <ConferenceListFilters
        filterName={filterName}
        onFilterNameChange={setFilterName}
        filterLocation={filterLocation}
        onFilterLocationChange={setFilterLocation}
        filterStartDate={filterStartDate}
        onFilterStartDateChange={setfilterStartDate}
      />
      <ConferenceList conferences={mockData} filterName={filterName} filterLocation={filterLocation} />
    </Grid>
  );
};
export default ConferencesContainer;
