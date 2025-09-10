import React from "react";
import { useSWR, fetcher } from "units/swr";
import { endpoints, toast } from "utils";
import type { SystemVersionDto } from "types/dto";
import { Typography, Stack, Grid, Chip, Skeleton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Info as InfoIcon, Storage as DatabaseIcon, Cloud as ServiceIcon, Schedule as DateIcon } from "@mui/icons-material";
import { SectionTitle, InfoLabel, IconWrapper, SmallIconWrapper } from "./SystemVersionInfo.styled";

type BffVersionDto = {
  service: string;
  version: string;
  buildDate: string;
  environment: string;
};

type Props = {
  showBffVersion?: boolean;
};

const SystemVersionInfo: React.FC<Props> = ({ showBffVersion = false }) => {
  const { t } = useTranslation();

  const { data: systemVersion, isLoading: isLoadingSystemVersion } = useSWR<SystemVersionDto, Error>(endpoints.system.version, fetcher, {
    onError: (err) => toast.error(t("SystemVersion.Error", { message: err.message }))
  });

  const { data: databaseVersion, isLoading: isLoadingDatabaseVersion } = useSWR<string, Error>(endpoints.system.databaseVersion, fetcher, {
    onError: (err) => toast.error(t("SystemVersion.Error", { message: err.message }))
  });

  const { data: bffVersion, isLoading: isLoadingBffVersion } = useSWR<BffVersionDto, Error>(
    showBffVersion ? endpoints.system.bff.version : null,
    fetcher,
    {
      onError: (err) => toast.error(t("SystemVersion.Error", { message: err.message }))
    }
  );

  const isLoading = isLoadingSystemVersion || isLoadingDatabaseVersion || (showBffVersion && isLoadingBffVersion);

  if (isLoading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="text" height={24} />
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} />
      </Stack>
    );
  }

  if (!systemVersion || !databaseVersion) {
    return (
      <Typography variant="body2" color="error" textAlign="center">
        {t("SystemVersion.Unavailable")}
      </Typography>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={2}>
        <SectionTitle>
          <IconWrapper>
            <InfoIcon />
          </IconWrapper>
          {t("SystemVersion.ApplicationInfo")}
        </SectionTitle>

        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoLabel variant="body2">{t("SystemVersion.Version")}:</InfoLabel>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Chip label={systemVersion.version} color="primary" size="small" variant="outlined" />
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoLabel variant="body2">
              <SmallIconWrapper>
                <DatabaseIcon />
              </SmallIconWrapper>
              {t("SystemVersion.DatabaseVersion")}:
            </InfoLabel>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Chip label={databaseVersion} color="secondary" size="small" variant="outlined" />
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12 }}>
            <InfoLabel variant="body2">
              <SmallIconWrapper>
                <DateIcon />
              </SmallIconWrapper>
              {t("SystemVersion.LastUpdated", { date: t("DATE", { date: systemVersion.buildDate }) })}
            </InfoLabel>
          </Grid>
        </Grid>
      </Stack>

      {showBffVersion && bffVersion && (
        <Stack spacing={2}>
          <SectionTitle>
            <IconWrapper>
              <ServiceIcon />
            </IconWrapper>
            {t("SystemVersion.BffInfo")}
          </SectionTitle>

          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6 }}>
              <InfoLabel variant="body2">{t("SystemVersion.Service")}:</InfoLabel>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2">{bffVersion.service}</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6 }}>
              <InfoLabel variant="body2">{t("SystemVersion.Version")}:</InfoLabel>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Chip label={bffVersion.version} color="primary" size="small" variant="outlined" />
            </Grid>
          </Grid>

          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6 }}>
              <InfoLabel variant="body2">{t("SystemVersion.Environment")}:</InfoLabel>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Chip
                label={bffVersion.environment}
                color={bffVersion.environment.toLowerCase() === "production" ? "error" : "warning"}
                size="small"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12 }}>
              <InfoLabel variant="body2">
                <SmallIconWrapper>
                  <DateIcon />
                </SmallIconWrapper>
                {t("SystemVersion.LastUpdated", { date: t("DATE", { date: bffVersion.buildDate }) })}
              </InfoLabel>
            </Grid>
          </Grid>
        </Stack>
      )}
    </Stack>
  );
};

export default SystemVersionInfo;
