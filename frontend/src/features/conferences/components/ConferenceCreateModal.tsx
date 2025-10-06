import { Dialog } from "@mui/material";
import ConferenceCreate from "./ConferenceCreate";

const ConferenceCreateModal: React.FC<{ openCreateModal: boolean; onClose: () => void }> = ({ openCreateModal, onClose }) => {
  return (
    <Dialog open={openCreateModal} onClose={onClose} maxWidth="md" fullWidth>
      <ConferenceCreate />
    </Dialog>
  );
};
export default ConferenceCreateModal;
