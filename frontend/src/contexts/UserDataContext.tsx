import React, { type ReactNode, useState, useEffect } from "react";
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

  const [userEmail, setUserEmailState] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUserEmailState(storedUser);
    }
  }, []);

  const setUserEmail = (email: string) => {
    setUserEmailState(email);
    localStorage.setItem("currentUser", email);
    console.log("User email set:", email);
  };

  const clearUserEmail = () => {
    setUserEmailState("");
    localStorage.removeItem("currentUser");
    console.log("User email cleared");
  };

  const isLoggedIn = !!userEmail;

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
    error,
    userEmail,
    setUserEmail,
    clearUserEmail,
    isLoggedIn
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
