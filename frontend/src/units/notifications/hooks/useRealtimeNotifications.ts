import { useContext } from "react";
import { RealtimeNotificationsContext, type RealtimeNotificationsContextType } from "../RealtimeNotificationsContext";

export const useRealtimeNotifications = (): RealtimeNotificationsContextType => {
  const context = useContext(RealtimeNotificationsContext);
  
  if (!context) {
    throw new Error("useRealtimeNotifications must be used within a RealtimeNotificationsProvider");
  }
  
  return context;
};