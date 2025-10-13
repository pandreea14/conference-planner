import { createContext, useContext } from "react";
import type { UserDto } from "../types/dto";

export interface UserDataContextPayload {
  userData?: UserDto;
  isLoading: boolean;
  error?: Error;
  userEmail: string;
  setUserEmail: (email: string) => void;
  clearUserEmail: () => void;
  isLoggedIn: boolean;
}

export const UserDataContext = createContext<UserDataContextPayload | undefined>(undefined); //it was null before

export const useUserData = (): UserDataContextPayload => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
};
