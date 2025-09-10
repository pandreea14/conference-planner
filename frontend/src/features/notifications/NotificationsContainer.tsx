import React from "react";
import { Typography, Card, CardContent, Box, Stack, Chip, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import { useRealtimeNotifications } from "../../units/notifications";
import { useOidcAccessToken } from "@axa-fr/react-oidc";
import { oidcConfigName } from "../../units/authentication/configuration";

const Container = styled(Box)({
  maxWidth: 1200,
  width: "100%",
  margin: "0 auto",
  padding: 16
});

const FlexBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 16,
  marginBottom: 16
});

const NotificationsContainer: React.FC = () => {
  const { isConnected, isConnecting, connectionError, connectionId } = useRealtimeNotifications();
  const { accessToken } = useOidcAccessToken(oidcConfigName);

  const getConnectionStatusColor = () => {
    if (isConnected) return "success";
    if (isConnecting) return "warning";
    return "error";
  };

  const getConnectionStatusText = () => {
    if (isConnected) return "Connected";
    if (isConnecting) return "Connecting...";
    return "Disconnected";
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <NotificationsIcon />
        Real-time Notifications Test
      </Typography>

      <Stack spacing={3}>
        {/* Connection Status */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Connection Status
            </Typography>
            <FlexBox>
              <Chip label={getConnectionStatusText()} color={getConnectionStatusColor()} variant="filled" />
              {connectionId && (
                <Typography variant="body2" color="text.secondary">
                  ID: {connectionId}
                </Typography>
              )}
            </FlexBox>

            {connectionError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Connection Error: {connectionError}
              </Alert>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              SignalR connection status for real-time notifications.
              {isConnected && " Ready to receive notifications!"}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Authentication:</strong>
              </Typography>
              <Chip
                label={accessToken ? "Authenticated" : "No Token"}
                color={accessToken ? "success" : "warning"}
                size="small"
                variant="outlined"
              />
              {accessToken && (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                  Token: {accessToken.substring(0, 20)}...
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default NotificationsContainer;
