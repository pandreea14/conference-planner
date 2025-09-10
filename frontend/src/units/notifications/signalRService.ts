import { HubConnection, HubConnectionBuilder, HubConnectionState, HttpTransportType } from "@microsoft/signalr";
import env from "../../utils/env";

import type { ServerNotification } from "./types";

export type ConnectionStateChangeHandler = (newState: HubConnectionState) => void;
export type NotificationHandler<T = never> = (notification: ServerNotification<T>) => void;

class SignalRService {
  private connection: HubConnection | null = null;
  private connectionStateHandler: ConnectionStateChangeHandler | null = null;
  private eventHandlers: Map<string, NotificationHandler[]> = new Map();
  private currentToken: string | null = null;

  private createConnection(accessToken?: string | null) {
    const hubUrl = `${env.VITE_APP_API_URL}/hubs/notifications`;

    this.connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        skipNegotiation: false,
        transport: HttpTransportType.WebSockets,
        accessTokenFactory: () => {
          if (!accessToken) {
            console.warn("No authentication token available for SignalR connection");
            return "";
          }
          return accessToken;
        }
      })
      .withAutomaticReconnect()
      .build();

    this.setupConnectionEventHandlers();
  }

  private setupConnectionEventHandlers() {
    if (!this.connection) return;

    this.connection.onreconnecting((error) => {
      console.log("SignalR connection reconnecting...", error);
      this.notifyStateChange(HubConnectionState.Reconnecting);
    });

    this.connection.onreconnected((connectionId) => {
      console.log("SignalR connection reconnected", { connectionId });
      this.notifyStateChange(HubConnectionState.Connected);
    });

    this.connection.onclose((error) => {
      console.log("SignalR connection closed", { error: error?.message || error });
      if (error) {
        console.error("SignalR close error details:", error);
      }
      this.notifyStateChange(HubConnectionState.Disconnected);
    });
  }

  private notifyStateChange(newState: HubConnectionState) {
    if (this.connectionStateHandler) {
      this.connectionStateHandler(newState);
    }
  }

  public async startConnection(accessToken?: string | null): Promise<void> {
    const token = accessToken ?? null;

    // If token changed, recreate the connection
    if (this.currentToken !== token) {
      console.log("Token changed, recreating SignalR connection");
      await this.stopConnection();
      this.currentToken = token;
      this.createConnection(token);
    }

    // Create connection if it doesn't exist
    if (!this.connection) {
      this.currentToken = token;
      this.createConnection(token);
    }

    // Check current state and handle accordingly
    if (!this.connection) {
      throw new Error("Failed to create SignalR connection");
    }

    const currentState = this.connection.state;
    console.log("SignalR connection current state:", currentState);

    if (currentState === HubConnectionState.Connected) {
      console.log("SignalR already connected");
      return;
    }

    if (currentState === HubConnectionState.Connecting || currentState === HubConnectionState.Reconnecting) {
      console.log("SignalR already connecting");
      return;
    }

    // Only proceed if disconnected
    if (currentState !== HubConnectionState.Disconnected) {
      console.log("SignalR in unexpected state, stopping first");
      await this.stopConnection();
      this.createConnection(token);
    }

    try {
      console.log("Starting SignalR connection...", { hasToken: !!token });
      this.notifyStateChange(HubConnectionState.Connecting);

      await this.connection.start();

      console.log("SignalR connection started successfully");
      this.notifyStateChange(HubConnectionState.Connected);

      this.setupEventListeners();
    } catch (error) {
      console.error("Failed to start SignalR connection:", error);
      this.notifyStateChange(HubConnectionState.Disconnected);
      throw error;
    }
  }

  public async stopConnection(): Promise<void> {
    if (!this.connection) return;

    try {
      console.log("Stopping SignalR connection...");
      this.clearEventListeners();
      await this.connection.stop();
      console.log("SignalR connection stopped");
    } catch (error) {
      console.error("Error stopping SignalR connection:", error);
    }
  }

  private setupEventListeners() {
    if (!this.connection) return;

    console.log("Setting up SignalR event listeners");
    this.clearEventListeners();

    // Listen to server notification events
    this.connection.on("SendNotification", (serverNotification: ServerNotification) => {
      if (serverNotification.notificationType) {
        this.triggerHandlers(serverNotification.notificationType, serverNotification);
      }
    });
  }

  private clearEventListeners() {
    if (!this.connection) return;

    this.connection.off("SendNotification");
  }

  private triggerHandlers(eventType: string, serverNotification: ServerNotification) {
    const handlers = this.eventHandlers.get(eventType) || [];
    handlers.forEach((handler) => {
      handler(serverNotification);
    });
  }

  public subscribe<T>(eventType: string, handler: NotificationHandler<T>): () => void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }

    this.eventHandlers.get(eventType)!.push(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.eventHandlers.get(eventType);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  public onConnectionStateChange(handler: ConnectionStateChangeHandler): () => void {
    this.connectionStateHandler = handler;

    // Return unsubscribe function
    return () => {
      if (this.connectionStateHandler === handler) {
        this.connectionStateHandler = null;
      }
    };
  }

  public getConnectionState(): HubConnectionState {
    return this.connection?.state || HubConnectionState.Disconnected;
  }

  public getConnectionId(): string | null {
    return this.connection?.connectionId || null;
  }

  public isConnected(): boolean {
    return this.connection?.state === HubConnectionState.Connected;
  }

  public isConnecting(): boolean {
    return this.connection?.state === HubConnectionState.Connecting || this.connection?.state === HubConnectionState.Reconnecting;
  }
}

// Singleton instance
export const signalRService = new SignalRService();
