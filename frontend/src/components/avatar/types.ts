export type UserStatus = "online" | "busy" | "away" | "offline";

export interface AvatarProps {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  status?: UserStatus;
}
