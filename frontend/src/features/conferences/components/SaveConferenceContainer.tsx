import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Grid, Paper, Typography, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useApiSWR } from "units/swr";
import { endpoints, toast } from "utils";
import { useTranslation } from "react-i18next";
import type { ConferenceDto } from "types";
import SaveConference from "../components/SaveConference";

const SaveConferenceContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);

  const isEditMode = !!id && id !== "new";

  const {
    data: conference,
    error,
    isLoading
  } = useApiSWR<ConferenceDto>(isEditMode ? `${endpoints.conferences.conferenceById}/${id}` : null);
  console.log("Conference data for editing:", conference);

  const handleSaveSuccess = () => {
    toast.success(t(isEditMode ? "Conference updated successfully" : "Conference created successfully"));
    navigate("/conferences"); // Navigate back to conference list
  };

  const handleSaveError = () => {
    setIsSaving(false);
  };

  const handleBack = () => {
    if (isSaving) {
      toast.warning("Please wait for save to complete");
      return;
    }
    navigate("/conferences");
  };

  // Handle loading and error states
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
    <Grid container sx={{ minHeight: "100%" }}>
      <Grid>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: "white",
            borderRadius: 1,
            borderBottom: "1px solid #e0e0e0"
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid>
              <IconButton onClick={handleBack} disabled={isSaving} sx={{ mr: 1, backgroundColor: "darkblue" }}>
                <ArrowBack sx={{ color: "white" }} />
              </IconButton>
            </Grid>
            <Grid alignItems={"center"}>
              <Typography variant="h4" component="h1">
                {isEditMode ? "Edit Conference" : "Create New Conference"}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid>
        <SaveConference
          onSaveSuccess={handleSaveSuccess}
          onSaveError={handleSaveError}
          conference={conference}
          onSavingStateChange={setIsSaving}
        />
      </Grid>
    </Grid>
  );
};

export default SaveConferenceContainer;
