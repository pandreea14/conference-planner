import React, { useEffect, useState, useCallback } from "react";
import { HubConnectionState } from "@microsoft/signalr";
import { useOidcAccessToken } from "@axa-fr/react-oidc";
import { oidcConfigName } from "../authentication/configuration";
import { signalRService } from "./signalRService";
import { RealtimeNotificationsContext, type RealtimeNotificationsContextType } from "./RealtimeNotificationsContext";
import type { SubscribeFn } from "./types";
import { ConnectingBox } from "./components/ConnectingBox";
import { ErrorBox } from "./components/ErrorBox";
import { toast } from "utils";
import env from "utils/env";

const SHOW_SIGNALR_CONNECTION_FEEDBACK = env.VITE_APP_SHOW_SIGNALR_CONNECTION_FEEDBACK === "true";

type Props = {
  children: React.ReactNode;
};

export const RealtimeNotificationsProvider: React.FC<Props> = ({ children }) => {
  const { accessToken } = useOidcAccessToken(oidcConfigName);

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [showUserChoice, setShowUserChoice] = useState(false);

  const setAttempts = useCallback((updater: number | ((prev: number) => number)) => {
    if (SHOW_SIGNALR_CONNECTION_FEEDBACK) {
      setConnectionAttempts(updater);
    }
  }, []);

  const resetState = useCallback(() => {
    setConnectionAttempts(0);
    setConnectionError(null);
    setShowUserChoice(false);
  }, []);

  const handleContinueWithoutRealtime = useCallback(() => {
    setShowUserChoice(false);
    setConnectionError(null);
    setIsConnecting(false);
  }, []);

  const handleConnectionStateChange = useCallback(
    (newState: HubConnectionState) => {
      console.log("SignalR connection state changed:", newState);

      switch (newState) {
        case HubConnectionState.Connected:
          setIsConnected(true);
          setIsConnecting(false);
          setConnectionError(null);
          setAttempts(0);
          setConnectionId(signalRService.getConnectionId());
          setShowUserChoice(false);
          break;
        case HubConnectionState.Connecting:
        case HubConnectionState.Reconnecting:
          setIsConnected(false);
          setIsConnecting(true);
          setConnectionError(null);
          setAttempts((prev) => prev + 1);
          break;
        case HubConnectionState.Disconnected:
          setIsConnected(false);
          setIsConnecting(false);
          setConnectionId(null);
          if (!SHOW_SIGNALR_CONNECTION_FEEDBACK) {
            // Show toast when connection is lost and UI is disabled
            toast.error("Real-time connection lost. Attempting to reconnect...");
          }
          break;
      }
    },
    [setAttempts]
  );

  const handleRetry = useCallback(async () => {
    if (SHOW_SIGNALR_CONNECTION_FEEDBACK) {
      resetState();
    }

    try {
      await signalRService.startConnection(accessToken);
    } catch (error) {
      console.error("Failed to retry SignalR connection:", error);

      if (SHOW_SIGNALR_CONNECTION_FEEDBACK) {
        setConnectionError(error instanceof Error ? error.message : "Connection failed");
        setShowUserChoice(true);
      } else {
        toast.error("Retry failed. Will continue attempting to reconnect automatically.");
      }
    }
  }, [accessToken, resetState]);

  // Handle initial connection and token changes
  useEffect(() => {
    const connectWithToken = async () => {
      // Reset connection state
      if (SHOW_SIGNALR_CONNECTION_FEEDBACK) {
        resetState();
      }

      try {
        await signalRService.startConnection(accessToken);
      } catch (error) {
        console.error("Failed to connect to SignalR:", error);

        if (SHOW_SIGNALR_CONNECTION_FEEDBACK) {
          setConnectionError(error instanceof Error ? error.message : "Connection failed");
          setShowUserChoice(true);
        } else {
          // Show toast and continue without blocking UI
          toast.error("Failed to connect to real-time services. Some features may not work.");
        }
      }
    };

    const unsubscribeStateChange = signalRService.onConnectionStateChange(handleConnectionStateChange);
    connectWithToken();

    return () => {
      unsubscribeStateChange();
      signalRService.stopConnection();
    };
  }, [accessToken, handleConnectionStateChange, resetState]);

  const subscribe: SubscribeFn = useCallback((eventType, handler) => {
    // Subscribe to the service and return the unsubscribe function
    return signalRService.subscribe(eventType, handler);
  }, []);

  const contextValue: RealtimeNotificationsContextType = {
    isConnected,
    isConnecting,
    connectionError,
    connectionId,
    subscribe
  };

  if (SHOW_SIGNALR_CONNECTION_FEEDBACK && isConnecting && !showUserChoice) {
    return <ConnectingBox attempts={connectionAttempts} />;
  }

  if (SHOW_SIGNALR_CONNECTION_FEEDBACK && showUserChoice && connectionError) {
    return <ErrorBox error={connectionError} onRetry={handleRetry} onContinue={handleContinueWithoutRealtime} />;
  }

  return <RealtimeNotificationsContext.Provider value={contextValue}>{children}</RealtimeNotificationsContext.Provider>;
};
