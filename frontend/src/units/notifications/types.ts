export type ServerNotification<T = never> = {
  notificationType: string;
  notificationBody: T;
  correlationId?: string;
};

export type UnsubscribeFn = () => void;
export type SubscribeFn = <T>(notificationType: string, handler: (notification: ServerNotification<T>) => void) => UnsubscribeFn;
