import { Box, Grid, IconButton } from "@mui/material";
import ConferenceList from "./ConferenceList";
import ConferenceListFilters from "./ConferenceListFilters";
import { useState } from "react";
import { endpoints } from "utils/api";
import { useApiSWR } from "units/swr";
import type { ConferenceDto, DictionaryItem, SpeakerDto } from "types/dto";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Add } from "@mui/icons-material";
import SaveConferenceModal from "./SaveConferenceModal";

const ConferencesContainer: React.FC = () => {
  const { t } = useTranslation();

  const { data: types = [] } = useApiSWR<DictionaryItem[], Error>(endpoints.dictionaries.conferenceType, {
    onError: (err) => toast.error(t("User.Error", { message: err.message }))
  });

  const { data: speakers = [] } = useApiSWR<SpeakerDto[], Error>(endpoints.conferences.getSpeakers, {
    onError: (err) => toast.error(t("User.Error", { message: err.message }))
  });

  const { data: conferences = [] } = useApiSWR<ConferenceDto[]>(endpoints.conferences.conferencesForAttendees, {
    onError: (err) => toast.error(t("User.Error", { message: err.message }))
  });
  console.log("conferences from API:", conferences);
  console.log("conferences attendees for first conference from API:", conferences[0]?.attendeesList?.length || 0);

  const [state, setState] = useState({
    name: "",
    location: "",
    dateStart: "",
    email: "",
    conferenceType: [""],
    speakerName: [""]
  });
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);

  return (
    <Grid padding={3} sx={{ width: "100%", height: "100%" }}>
      <Box
        sx={{
          position: "fixed",
          left: "90%",
          zIndex: 1300
        }}
      >
        <IconButton size="medium" sx={{ background: "darkblue" }} onClick={() => setOpenCreateModal(true)}>
          {" "}
          <Add sx={{ color: "white" }} />
        </IconButton>
      </Box>
      <SaveConferenceModal openCreateModal={openCreateModal} onClose={() => setOpenCreateModal(false)} />
      <ConferenceListFilters state={state} onStateChange={setState} conferenceTypes={types} speakers={speakers} />
      <ConferenceList conferences={conferences} state={state} />
    </Grid>
  );
};
export default ConferencesContainer;
