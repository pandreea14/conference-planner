import React from "react";
import { Box, Typography, Button, Paper, Alert, Stack } from "@mui/material";
import { Refresh as RefreshIcon, Warning as WarningIcon } from "@mui/icons-material";

type Props = {
  error: string;
  onRetry: () => void;
  onContinue: () => void;
};

export const ErrorBox: React.FC<Props> = ({ error, onRetry, onContinue }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="grey.100">
      <Paper elevation={3} sx={{ p: 4, textAlign: "center", maxWidth: 500 }}>
        <WarningIcon color="warning" sx={{ fontSize: 48, mb: 2 }} />

        <Typography variant="h6" gutterBottom>
          Connection Issue
        </Typography>

        <Alert severity="warning" sx={{ mb: 3, textAlign: "left" }}>
          Unable to establish real-time connection: {error}
        </Alert>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Real-time notifications won't be available, but you can still use the application. You can try reconnecting or continue without
          real-time features.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" startIcon={<RefreshIcon />} onClick={onRetry}>
            Try Again
          </Button>
          <Button variant="outlined" onClick={onContinue}>
            Continue Without Real-time
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};
