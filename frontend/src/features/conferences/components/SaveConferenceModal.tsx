import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useApiSWR } from "units/swr";
import type { ConferenceDto } from "types";
import { endpoints, toast } from "utils";
import { notificationTypes } from "constants";
import { useSubscription } from "units/notifications";
import { useTranslation } from "react-i18next";
import SaveConference from "./SaveConference";
import { useState } from "react";
import { Close } from "@mui/icons-material";

const SaveConferenceModal: React.FC<{
  openCreateModal: boolean;
  onClose: () => void;
  conference?: ConferenceDto | null;
}> = ({ openCreateModal, onClose, conference }) => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const isEditMode = !!conference;

  const { mutate: refetchConferenceList } = useApiSWR<ConferenceDto[]>(endpoints.conferences.conferencesForAttendees);

  console.log("conference at modal display ", conference);

  const handleSaveSuccess = () => {
    refetchConferenceList();
    onClose();
    setIsSaving(false);
  };

  const handleSaveError = () => {
    setIsSaving(false);
  };

  const handleClose = () => {
    if (isSaving) return;
    onClose();
  };

  useSubscription(notificationTypes.CONFERENCE_CREATED, {
    onNotification: () => {
      refetchConferenceList();
      toast.info(t("Conferences.ConferenceCreatedNotification"));
    }
  });

  useSubscription(notificationTypes.CONFERENCE_UPDATED, {
    onNotification: () => {
      refetchConferenceList();
      toast.info(t("Conferences.ConferenceUpdatedNotification"));
    }
  });

  return (
    <Dialog
      open={openCreateModal}
      onClose={handleClose}
      // maxWidth="lg"
      fullWidth
      aria-labelledby="save-conference-dialog-title"
      aria-describedby="save-conference-dialog-content"
      disableEscapeKeyDown={isSaving}
      disableAutoFocus={false}
      disableRestoreFocus={false}
    >
      <DialogTitle
        id="save-conference-dialog-title"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h1>{isEditMode ? "Edit Conference" : "Create New Conference"}</h1>

        <IconButton aria-label="close" onClick={handleClose} disabled={isSaving} sx={{ ml: 1 }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent
        id="save-conference-dialog-content"
        sx={{
          padding: 2
        }}
      >
        <SaveConference
          onSaveSuccess={handleSaveSuccess}
          onSaveError={handleSaveError}
          conference={conference}
          onSavingStateChange={setIsSaving}
        />
      </DialogContent>

      {/* ✅ Optional: You can add action buttons here if needed */}
      {/* 
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleClose} 
          disabled={isSaving}
          variant="outlined"
        >
          Cancel
        </Button>
      </DialogActions>
      */}
    </Dialog>
  );
};
export default SaveConferenceModal;
