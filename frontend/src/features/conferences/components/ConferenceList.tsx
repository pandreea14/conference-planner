import { Grid, Typography } from "@mui/material";
import ConferenceCard from "./ConferenceCard";
import type { Conference } from "../mockDate";

const ConferenceList: React.FC<{ conferences: Conference[]; filterName: string; filterLocation: string }> = ({
  conferences,
  filterName,
  filterLocation
  // filterStartDate
}) => {
  // const filteredConferences: JSX.Element[] = [];

  // conferences.forEach((conference) => {
  //   if (conference.name.toLocaleLowerCase().indexOf(filterName.toLocaleLowerCase()) === -1) return;
  //   if (conference.location.toLocaleLowerCase().indexOf(filterLocation.toLocaleLowerCase()) === -1) return;
  //   filteredConferences.push(<ConferenceCard conference={conference} />);
  // });

  const filteredConferences = conferences.filter((conference) => {
    const matchesName = filterName === "" || conference.name.toLowerCase().includes(filterName.toLowerCase());
    const matchesLocation = filterLocation === "" || conference.location.toLowerCase().includes(filterLocation.toLowerCase());
    // const matchesStartDate = filterStartDate

    return matchesName && matchesLocation;
  });

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
          {/* {filteredConferences} */}
          <ConferenceCard conference={conference} />
        </Grid>
      ))}
    </Grid>
  );
};
export default ConferenceList;
