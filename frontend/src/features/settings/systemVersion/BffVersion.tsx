import type React from "react";
import { ApiError, useApiSWR } from "units/swr";
import { endpoints, toast } from "utils";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

// BffVersion component is used temporarily for testing purposes
// It will be removed in the next release

type BffVersionDto = {
  service: string;
  version: string;
  buildDate: string;
  environment: string;
};

const BffVersion: React.FC = () => {
  const { t } = useTranslation();
  const { data: bffVersion, isLoading } = useApiSWR<BffVersionDto, ApiError>(endpoints.system.bff.version, {
    onError: (err) => toast.error(t("SystemVersion.Error", { message: err.message }))
  });

  if (isLoading) {
    return (
      <Typography variant="body1" align="center">
        {t("SystemVersion.Loading")}
      </Typography>
    );
  }

  if (!bffVersion) {
    return (
      <Typography variant="body1" align="center" color="error">
        {t("SystemVersion.Unavailable")}
      </Typography>
    );
  }

  return (
    <Typography variant="body1" align="center">
      {`BFF version: ${bffVersion.version}`}
      {" | "}
      {t("SystemVersion.LastUpdated", { date: t("DATE", { date: bffVersion.buildDate }) })}
      {" | "}
      {`Environment: ${bffVersion.environment}`}
      {" | "}
      {`Service: ${bffVersion.service}`}
    </Typography>
  );
};

export default BffVersion;
