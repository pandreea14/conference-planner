import { useEffect } from "react";
import { useRealtimeNotifications } from "./useRealtimeNotifications";
import type { ServerNotification } from "../types";

interface UseSubscriptionOptions<T> {
  skip?: boolean;
  onNotification?: (notification: ServerNotification<T>) => void;
}

const emptyFn = () => {};

function useSubscription<T>(notificationType: string, options: UseSubscriptionOptions<T> = {}) {
  const { subscribe } = useRealtimeNotifications();
  const { skip = false, onNotification = emptyFn } = options;

  useEffect(() => {
    if (skip) return;

    // Subscribe and get the unsubscribe function
    const unsubscribe = subscribe<T>(notificationType, onNotification);

    // Return the unsubscribe function to be called on cleanup
    return unsubscribe;
  }, [notificationType, onNotification, skip, subscribe]);
}

export { useSubscription };
export default useSubscription;
