import React from "react";
import { useTranslation } from "react-i18next";
import { Typography, Card, CardContent, Stack, Divider } from "@mui/material";
import ResetCacheButton from "./ResetCacheButton";
import SystemVersionInfo from "./systemVersion/SystemVersionInfo";

const SettingsContainer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Card sx={{ maxWidth: 600, width: "100%" }}>
      <CardContent>
        <Stack spacing={3} divider={<Divider />}>
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600}>
              {t("Settings.CacheManagement")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("Settings.CacheDescription")}
            </Typography>
            <ResetCacheButton />
          </Stack>

          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600}>
              {t("Settings.SystemInfo")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("Settings.SystemInfoDescription")}
            </Typography>
            <SystemVersionInfo showBffVersion />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SettingsContainer;
