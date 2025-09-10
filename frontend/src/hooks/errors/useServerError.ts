import { COMMAND_EXECUTION_ERROR } from "constants/notificationTypes";
import type { CommandExecutionError } from "types";
import { useSubscription } from "units/notifications";
import { toast } from "utils";
import { useTranslation } from "react-i18next";

const useServerError = () => {
  const { t, i18n } = useTranslation();

  useSubscription<CommandExecutionError>(COMMAND_EXECUTION_ERROR, {
    onNotification: (notification) => {
      let message = notification.notificationBody.code;
      if (message && i18n.exists(message)) {
        message = t(message, notification.notificationBody.data);
      }
      toast.error(t("Common.ExecutionError", { message }));
    }
  });
};

export default useServerError;
