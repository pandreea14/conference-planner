import React, { type ReactNode } from "react";
import { useApiSWR } from "../units/swr";
import { endpoints, toast } from "../utils";
import type { UserDto } from "../types/dto";
import { useTranslation } from "react-i18next";
import { UserDataContext, type UserDataContextPayload } from "./UserDataContextTypes";
import { Box, CircularProgress, Typography } from "@mui/material";

interface UserDataProviderProps {
  children: ReactNode;
}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  const { t } = useTranslation();

  const {
    data: userData,
    isLoading,
    error
  } = useApiSWR<UserDto, Error>(endpoints.users.default, {
    onError: (err) => toast.error(t("User.Error", { message: err.message }))
  });

  const contextValue: UserDataContextPayload = {
    userData,
    isLoading,
    error
  };

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" gap={2}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          {t("User.Loading")}
        </Typography>
      </Box>
    );
  }

  if (error || !userData) {
    return null;
  }

  return <UserDataContext.Provider value={contextValue}>{children}</UserDataContext.Provider>;
};
