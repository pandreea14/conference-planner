import React from "react";
import { useOidc } from "@axa-fr/react-oidc";
import { useTranslation } from "react-i18next";
import { Tooltip } from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { oidcConfigName } from "../../units/authentication/configuration";
import { StyledLogoutButton } from "./logoutButton.styled";

const LogoutButton: React.FC = () => {
  const { logout } = useOidc(oidcConfigName);
  const { t } = useTranslation();

  const handleLogout = () => {
    logout(`${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ""}/`);
  };

  return (
    <Tooltip title={t("Logout")} arrow>
      <StyledLogoutButton onClick={handleLogout} aria-label={t("Logout")} size="medium">
        <LogoutIcon />
      </StyledLogoutButton>
    </Tooltip>
  );
};

export default LogoutButton;
