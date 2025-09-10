import React from "react";
import { Button } from "@mui/material";
import { useApiSWRMutation, mutationFetcher } from "../../units/swr";
import type { Key } from "../../units/swr";
import { endpoints, toast } from "../../utils";
import type { AsyncCommandResult } from "../../types/dto";
import { useTranslation } from "react-i18next";
import { useSubscription } from "units/notifications";
import { notificationTypes } from "constants";

type EmptyCommand = {
  noProp?: string;
};

type CacheResetPayload = {
  noProp?: string;
};

const ResetCacheButton: React.FC = () => {
  const { t } = useTranslation();
  const { trigger: resetCache, isMutating } = useApiSWRMutation<AsyncCommandResult, Error, Key, EmptyCommand>(
    endpoints.system.resetCache,
    mutationFetcher<EmptyCommand>,
    {
      onError: (err) => {
        toast.error(t("Settings.Error", { message: err.message }));
      }
    }
  );

  useSubscription<CacheResetPayload>(notificationTypes.CACHE_RESET, {
    onNotification: () => {
      toast.info(t("Settings.Success"));
    }
  });

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() =>
        resetCache({
          noProp: undefined
        })
      }
      disabled={isMutating}
    >
      {t("Settings.Label")}
    </Button>
  );
};

export default ResetCacheButton;
