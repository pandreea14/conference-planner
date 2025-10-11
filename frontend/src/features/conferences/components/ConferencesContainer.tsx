import { Box, Grid, IconButton } from "@mui/material";
import ConferenceList from "./ConferenceList";
import ConferenceListFilters from "./ConferenceListFilters";
import { useState } from "react";
import { endpoints } from "utils/api";
import { useApiSWR } from "units/swr";
import type { ConferenceDto, DictionaryItem, SpeakerDto } from "types/dto";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ConferencesContainer: React.FC = () => {
  const { data: types = [] } = useApiSWR<DictionaryItem[], Error>(endpoints.dictionaries.conferenceType);
  const { data: speakers = [] } = useApiSWR<SpeakerDto[], Error>(endpoints.conferences.getSpeakers);
  const { data: conferences = [] } = useApiSWR<ConferenceDto[]>(endpoints.conferences.conferencesForAttendees);
  console.log("conferences from API:", conferences);
  const navigate = useNavigate();
  // console.log("conferences attendees for first conference from API:", conferences[0]?.attendeesList?.length || 0);

  const [state, setState] = useState({
    name: "",
    location: "",
    dateStart: "",
    email: "",
    conferenceType: [""],
    speakerName: [""]
  });
  // const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);

  const handleCreateConference = () => {
    navigate("/conferences/new");
  };
  return (
    <Grid padding={3} sx={{ width: "100%", height: "100%" }}>
      <Box
        sx={{
          position: "fixed",
          left: "90%",
          zIndex: 1300
        }}
      >
        <IconButton size="medium" sx={{ background: "darkblue" }} onClick={handleCreateConference}>
          {" "}
          <Add sx={{ color: "white" }} />
        </IconButton>
      </Box>
      <ConferenceListFilters state={state} onStateChange={setState} conferenceTypes={types} speakers={speakers} />
      <ConferenceList conferences={conferences} state={state} />
    </Grid>
  );
};
export default ConferencesContainer;
