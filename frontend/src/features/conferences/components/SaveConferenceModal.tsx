import { Dialog } from "@mui/material";
import { useApiSWR } from "units/swr";
import type { ConferenceDto } from "types";
import { endpoints, toast } from "utils";
import { notificationTypes } from "constants";
import { useSubscription } from "units/notifications";
import { useTranslation } from "react-i18next";
import SaveConference from "./SaveConference";

const SaveConferenceModal: React.FC<{ openCreateModal: boolean; onClose: () => void }> = ({ openCreateModal, onClose }) => {
  const { t } = useTranslation();
  const { mutate: refetchConferenceList } = useApiSWR<ConferenceDto[]>(endpoints.conferences.conferencesForAttendees);

  const handleSaveSuccess = () => {
    refetchConferenceList();
    onClose();
  };

  useSubscription(notificationTypes.CONFERENCE_CREATED, {
    onNotification: () => {
      refetchConferenceList();
      toast.info(t("Conferences.ConferenceCreatedNotification"));
    }
  });

  return (
    <Dialog open={openCreateModal} onClose={onClose} maxWidth="md" fullWidth>
      <SaveConference onSaveSuccess={handleSaveSuccess} />
    </Dialog>
  );
};
export default SaveConferenceModal;
