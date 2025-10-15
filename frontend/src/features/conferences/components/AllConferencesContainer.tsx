import { Alert, Box, Button, Grid, Typography } from "@mui/material";
import ConferenceList from "./ConferenceList";
import ConferenceListFilters from "./ConferenceListFilters";
import { useEffect, useState } from "react";
import { endpoints } from "utils/api";
import { useApiSWR } from "units/swr";
import type { ConferenceDto, DictionaryItem, SpeakerResponseDto } from "types/dto";
import { useNavigate } from "react-router-dom";
import { useUserData } from "hooks";

const AllConferencesContainer: React.FC = () => {
  const { userEmail, isLoggedIn } = useUserData();
  const { data: types = [] } = useApiSWR<DictionaryItem[], Error>(endpoints.dictionaries.conferenceType);
  const { data: speakers = [] } = useApiSWR<SpeakerResponseDto[], Error>(endpoints.conferences.getSpeakers);
  const { data: allConferences = [] } = useApiSWR<ConferenceDto[]>(endpoints.conferences.conferencesForAttendees);
  const navigate = useNavigate();

  const [conferences, setConferences] = useState<ConferenceDto[]>([]);
  const [state, setState] = useState({
    name: "",
    location: "",
    dateStart: "",
    email: "",
    conferenceType: [""],
    speakerName: [""]
  });

  useEffect(() => {
    if (!isLoggedIn || !userEmail) {
      console.log("User not logged in, clearing conferences");
      setConferences([]);
      return;
    }

    if (allConferences.length === 0) {
      console.log("No conferences loaded yet");
      setConferences([]);
      return;
    }

    const filteredConferences = allConferences.filter((conference) => conference.organizerEmail !== userEmail);

    console.log(`Filtering conferences for user: ${userEmail}`);
    console.log(`Filtered conferences: ${filteredConferences.length}`);

    setConferences(filteredConferences);
  }, [allConferences, userEmail, isLoggedIn]);

  useEffect(() => {
    console.log("User data changed:", { userEmail, isLoggedIn });
  }, [userEmail, isLoggedIn]);

  const handleGoToHome = () => {
    navigate("/");
  };
  if (!isLoggedIn) {
    return (
      <Grid padding={3} sx={{ width: "50%", height: "40%" }} flexDirection={"column"} display={"flex"} justifyContent={"center"}>
        <Alert severity="info" sx={{ borderRadius: 2, alignItems: "center", borderColor: "black", borderWidth: 100 }}>
          <Typography variant="h6" gutterBottom>
            You need to login!
          </Typography>
        </Alert>
        <Button sx={{ backgroundColor: "darkblue", color: "white" }} onClick={handleGoToHome}>
          Go To HomePage
        </Button>
      </Grid>
    );
  }

  return (
    <Grid padding={3} sx={{ width: "100%", height: "100%" }}>
      <Box sx={{ marginBottom: 3, padding: 2, backgroundColor: "#e3f2fd", borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={"bold"} gutterBottom>
          Conferences
        </Typography>
        <ConferenceListFilters state={state} onStateChange={setState} conferenceTypes={types} speakers={speakers} />
      </Box>

      {conferences.length === 0 && allConferences.length > 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2, marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>
            No conferences found
          </Typography>
          <Typography>You haven't organized any conferences yet. Click the "Add conference" button to create your first one!</Typography>
        </Alert>
      ) : (
        <>
          <ConferenceList conferences={conferences} state={state} isOrganizer={false} />
        </>
      )}
    </Grid>
  );
};
export default AllConferencesContainer;
