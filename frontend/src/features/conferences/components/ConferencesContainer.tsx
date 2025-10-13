import { Box, Button, Grid } from "@mui/material";
import ConferenceList from "./ConferenceList";
import ConferenceListFilters from "./ConferenceListFilters";
import { useState } from "react";
import { endpoints } from "utils/api";
import { useApiSWR } from "units/swr";
import type { ConferenceDto, DictionaryItem, SpeakerResponseDto } from "types/dto";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ConferencesContainer: React.FC = () => {
  const { data: types = [] } = useApiSWR<DictionaryItem[], Error>(endpoints.dictionaries.conferenceType);
  const { data: speakers = [] } = useApiSWR<SpeakerResponseDto[], Error>(endpoints.conferences.getSpeakers);
  const { data: conferences = [] } = useApiSWR<ConferenceDto[]>(endpoints.conferences.conferencesForAttendees);
  console.log("conferences from API:", conferences);
  const navigate = useNavigate();
  const [state, setState] = useState({
    name: "",
    location: "",
    dateStart: "",
    email: "",
    conferenceType: [""],
    speakerName: [""]
  });

  const handleCreateConference = () => {
    navigate("/conferences/new");
  };
  return (
    <Grid padding={3} sx={{ width: "100%", height: "100%" }}>
      <Box
        sx={{
          position: "fixed",
          left: "80%",
          zIndex: 1300
        }}
      >
        <Button size="medium" sx={{ background: "darkblue", color: "white" }} onClick={handleCreateConference}>
          <Add sx={{ color: "white" }} />
          Add conference
        </Button>
      </Box>
      <ConferenceListFilters state={state} onStateChange={setState} conferenceTypes={types} speakers={speakers} />
      <ConferenceList conferences={conferences} state={state} />
    </Grid>
  );
};
export default ConferencesContainer;
