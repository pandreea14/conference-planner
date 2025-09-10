import type React from "react";
import { useApiSWR } from "units/swr";
import { endpoints, toast } from "utils";
import type { SystemVersionDto } from "types/dto";
import { Divider, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import BffVersion from "./BffVersion";

type Props = {
  hideBffVersion?: boolean;
};

const SystemVersion: React.FC<Props> = ({ hideBffVersion }) => {
  const { t } = useTranslation();
  const { data: systemVersion, isLoading: isLoadingSystemVersion } = useApiSWR<SystemVersionDto, Error>(endpoints.system.version, {
    onError: (err) => toast.error(t("SystemVersion.Error", { message: err.message }))
  });

  const { data: databaseVersion, isLoading: isLoadingDatabaseVersion } = useApiSWR<string, Error>(endpoints.system.databaseVersion, {
    onError: (err) => toast.error(t("SystemVersion.Error", { message: err.message }))
  });

  if (isLoadingSystemVersion || isLoadingDatabaseVersion) {
    return (
      <Typography variant="body1" align="center">
        {t("SystemVersion.Loading")}
      </Typography>
    );
  }

  if (!systemVersion || !databaseVersion) {
    return (
      <Typography variant="body1" align="center" color="error">
        {t("SystemVersion.Unavailable")}
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="body1" align="center">
        {t("SystemVersion.AppVersion", { version: systemVersion.version })}
        {" | "}
        {t("SystemVersion.LastUpdated", { date: t("DATE", { date: systemVersion.buildDate }) })}
        {" | "}
        {t("SystemVersion.DatabaseVersion", { version: databaseVersion })}
      </Typography>
      <Divider />
      {!hideBffVersion && <BffVersion />}
    </>
  );
};
export default SystemVersion;
