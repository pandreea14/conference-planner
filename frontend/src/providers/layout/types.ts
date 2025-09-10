import type { ReactNode } from "react";

export type LayoutContextData = {
  header: ReactNode | null;
  footer: ReactNode | null;
  notifications: NotificationsData;
};

export type LayoutContextPayload = LayoutContextData & {
  setHeader: (header: ReactNode | null) => void;
  setFooter: (footer: ReactNode | null) => void;
  setNotifications: (notifications: NotificationsData) => void;
  resetNotifications: () => void;
};

export type NotificationsData = {
  visible: boolean;
  onClick?: () => void;
  count: number;
};
