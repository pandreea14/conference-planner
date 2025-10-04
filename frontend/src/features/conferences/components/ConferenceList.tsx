import { Grid, Typography } from "@mui/material";
import ConferenceCard from "./ConferenceCard";
import type { ConferenceDto } from "types";

const ConferenceList: React.FC<{ conferences: ConferenceDto[]; filterName: string; filterLocation: string; filterStartDate: string }> = ({
  conferences,
  filterName,
  filterLocation,
  filterStartDate
  // filterEndDate
}) => {
  const filteredConferences = conferences.filter((conference) => {
    const matchesName = filterName === "" || conference.name.toLowerCase().includes(filterName.toLowerCase());
    const matchesLocation = filterLocation === "" || conference.locationName.toLowerCase().includes(filterLocation.toLowerCase());
    const matchesStartDate = filterStartDate === "" || new Date(conference.startDate) >= new Date(filterStartDate);
    // const matchesEndDate = !filterEndDate || conference.endDate <= filterEndDate;

    return matchesName && matchesLocation && matchesStartDate;
  });

  // console.log("filtrarea datelor ", filteredConferences);

  if (filteredConferences.length === 0) {
    return (
      <Grid container justifyContent="center" sx={{ padding: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No conferences found to match the filters.
        </Typography>
      </Grid>
    );
  }

  return (
    <Grid container spacing={1} padding={1}>
      {filteredConferences.map((conference) => (
        <Grid key={conference.id} size={{ xs: 6, md: 6 }} sx={{ display: "flex", padding: 1 }}>
          <ConferenceCard conference={conference} />
        </Grid>
      ))}
    </Grid>
  );
};
export default ConferenceList;
