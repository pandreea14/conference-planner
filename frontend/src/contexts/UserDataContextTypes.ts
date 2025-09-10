import { createContext } from "react";
import type { UserDto } from "../types/dto";

export interface UserDataContextPayload {
  userData?: UserDto;
  isLoading: boolean;
  error?: Error;
}

export const UserDataContext = createContext<UserDataContextPayload | null>(null);
