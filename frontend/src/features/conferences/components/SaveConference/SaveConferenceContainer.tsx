import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Grid, Paper, Typography, IconButton, Stack, Container } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useApiSWR } from "units/swr";
import { endpoints, toast } from "utils";
import { useTranslation } from "react-i18next";
import type { ConferenceDto } from "types";
import { notificationTypes } from "constants";
import { useSubscription } from "units/notifications";
import SaveConference from "./SaveConference";

const SaveConferenceContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);

  const isEditMode = !!id && id !== "new";

  const {
    data: conference,
    error,
    isLoading,
    mutate: refetchCurrentConference
  } = useApiSWR<ConferenceDto>(isEditMode ? `${endpoints.conferences.conferenceById}/${id}` : null);

  const { mutate: refetchConferenceList } = useApiSWR<ConferenceDto[]>(endpoints.conferences.conferencesForAttendees);

  useSubscription(notificationTypes.CONFERENCE_CREATED, {
    onNotification: () => {
      refetchConferenceList();
      toast.info(t("Conferences.ConferenceCreatedNotification") || "Conference created successfully");
    }
  });

  useSubscription(notificationTypes.CONFERENCE_UPDATED, {
    onNotification: () => {
      if (isEditMode) {
        refetchCurrentConference();
      }
      refetchConferenceList();
      toast.info(t("Conferences.ConferenceUpdatedNotification") || "Conference updated successfully");
    }
  });

  const handleSaveSuccess = () => {
    // refetchConferenceList();
    console.log("Save success handler called, isEditMode: ", isEditMode);
    navigate("/myConferences");
    setIsSaving(false);
  };

  const handleBack = () => {
    if (isSaving) {
      toast.warning("Please wait for save to complete");
      return;
    }
    navigate("/myConferences");
  };

  if (isEditMode && isLoading) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <Typography>Loading conference...</Typography>
      </Grid>
    );
  }

  if (isEditMode && error) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <Typography color="error">Error loading conference: {error.message}</Typography>
      </Grid>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ minHeight: "100%" }}>
      <Paper
        sx={{
          position: "sticky",
          zIndex: 1000,
          top: 0,
          padding: 2,
          borderRadius: 3,
          background: "white",
          color: "black"
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton
            onClick={handleBack}
            sx={{
              backgroundColor: "darkblue",
              color: "white",
              "&:hover": {
                backgroundColor: "lightblue",
                transform: "translateX(-2px)"
              },
              transition: "all 0.2s ease"
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              pr: 5
            }}
          >
            {isEditMode ? "Edit Conference" : "Create New Conference"}
          </Typography>
        </Stack>
      </Paper>

      <Grid>
        <SaveConference onSaveSuccess={handleSaveSuccess} conference={conference} onSavingStateChange={setIsSaving} />
      </Grid>
    </Container>
  );
};

export default SaveConferenceContainer;
