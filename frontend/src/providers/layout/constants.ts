import type { LayoutContextData, LayoutContextPayload, NotificationsData } from "./types";

const initialNotificationsData: NotificationsData = {
  visible: false,
  onClick: () => undefined,
  count: 0
};

const initialData: LayoutContextData = {
  header: null,
  footer: null,
  notifications: initialNotificationsData
};

const initialContext: LayoutContextPayload = {
  ...initialData,
  setHeader: () => undefined,
  setFooter: () => undefined,
  setNotifications: () => undefined,
  resetNotifications: () => undefined
};

export { initialData, initialContext };
