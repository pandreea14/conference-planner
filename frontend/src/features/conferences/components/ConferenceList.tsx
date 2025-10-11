import { Grid, Typography } from "@mui/material";
import ConferenceCard from "./ConferenceCard";
import type { ConferenceDto } from "types";
import type { ConferenceFilterState } from "types";

const ConferenceList: React.FC<{ conferences: ConferenceDto[]; state: ConferenceFilterState }> = ({ conferences, state }) => {
  const filteredConferences = conferences.filter((conference) => {
    const matchesName = state?.name === "" || conference.name.toLowerCase().includes(state?.name.toLowerCase());
    const matchesEmail = state?.email === "" || conference.organizerEmail.toLowerCase().includes(state?.email.toLowerCase());
    const matchesLocation = state?.location === "" || conference.locationName.toLowerCase().includes(state?.location.toLowerCase());
    const matchesStartDate = state?.dateStart === "" || new Date(conference.startDate) >= new Date(state?.dateStart);
    const matchesType = state?.conferenceType[0] === "" || state?.conferenceType.includes(conference.conferenceTypeName);
    // if(state.speakerName?.[0] && state.speakerName[0] !== "") {
    //   const speakerName = state.speakerName[0]
    //   const hasSpeaker = conference.speakers?
    // trb sa pun lista de speakeri. sau parcurg dupa id-uri conferenceXSpeaker
    // }

    return matchesName && matchesLocation && matchesStartDate && matchesEmail && matchesType;
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
          <ConferenceCard conference={conference} />
        </Grid>
      ))}
    </Grid>
  );
};
export default ConferenceList;
