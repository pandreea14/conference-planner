import { Grid, Typography } from "@mui/material";
import ConferenceCard from "./ConferenceCard";
import type { ConferenceDto } from "types";
import type { ConferenceFilterState } from "types";

const ConferenceList: React.FC<{ conferences: ConferenceDto[]; state: ConferenceFilterState; isOrganizer: boolean }> = ({
  conferences,
  state,
  isOrganizer
}) => {
  const filteredConferences = conferences.filter((conference) => {
    const matchesName = state?.name === "" || conference.name.toLowerCase().includes(state?.name.toLowerCase());
    const matchesEmail = state?.email === "" || conference.organizerEmail.toLowerCase().includes(state?.email.toLowerCase());
    const matchesLocation = state?.location === "" || conference.locationName.toLowerCase().includes(state?.location.toLowerCase());
    const matchesStartDate = state?.dateStart === "" || new Date(conference.startDate) >= new Date(state?.dateStart);
    const matchesType = state?.conferenceType[0] === "" || state?.conferenceType.includes(conference.conferenceTypeName);
    let matchesSpeaker = true;
    if (state.speakerName && state.speakerName.length > 0 && state.speakerName[0] !== "") {
      const selectedSpeakers = state.speakerName.filter((speaker) => speaker && speaker.trim() !== "");

      if (selectedSpeakers.length > 0) {
        if (conference.speakersList && conference.speakersList.length > 0) {
          matchesSpeaker = selectedSpeakers.some((selectedSpeaker) =>
            conference.speakersList.some((conferenceSpeaker) =>
              conferenceSpeaker.speakerName.toLowerCase().includes(selectedSpeaker.toLowerCase())
            )
          );

          console.log(
            `Conference "${conference.name}" speakers:`,
            conference.speakersList.map((s) => s.speakerName)
          );
          console.log(`Selected speakers:`, selectedSpeakers);
          console.log(`Matches speaker filter: ${matchesSpeaker}`);
        } else {
          matchesSpeaker = false;
          console.log(`Conference "${conference.name}" has no speakers, filtered out`);
        }
      }
    }

    return matchesName && matchesLocation && matchesStartDate && matchesEmail && matchesType && matchesSpeaker;
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
          <ConferenceCard conference={conference} isOrganizer={isOrganizer} />
        </Grid>
      ))}
    </Grid>
  );
};
export default ConferenceList;
