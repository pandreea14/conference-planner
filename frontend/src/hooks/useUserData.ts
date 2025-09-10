import { useContext } from "react";
import { UserDataContext, type UserDataContextPayload } from "../contexts/UserDataContextTypes";

export const useUserData = (): UserDataContextPayload => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
};
