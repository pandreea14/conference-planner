import React, { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { LayoutContext } from "./context";
import type { LayoutContextData, LayoutContextPayload, NotificationsData } from "./types";
import { initialData } from "./constants";

type Props = {
  children: ReactNode;
};

const LayoutProvider: React.FC<Props> = ({ children }) => {
  const [layout, setLayout] = useState<LayoutContextData>(initialData);

  const setHeader = useCallback((header: ReactNode | null) => {
    setLayout((prev) => ({ ...prev, header }));
  }, []);

  const setFooter = useCallback((footer: ReactNode | null) => {
    setLayout((prev) => ({ ...prev, footer }));
  }, []);

  const setNotifications = useCallback((notifications: NotificationsData) => {
    setLayout((prev) => ({ ...prev, notifications }));
  }, []);

  const resetNotifications = useCallback(() => {
    setLayout((prev) => ({ ...prev, notifications: initialData.notifications }));
  }, []);

  const payload: LayoutContextPayload = useMemo(
    () => ({
      ...layout,
      setHeader,
      setFooter,
      setNotifications,
      resetNotifications
    }),
    [layout, setHeader, setFooter, setNotifications, resetNotifications]
  );

  return <LayoutContext.Provider value={payload}>{children}</LayoutContext.Provider>;
};

export default LayoutProvider;
