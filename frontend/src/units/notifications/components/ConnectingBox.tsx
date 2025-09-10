import React from "react";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";

type Props = {
  attempts: number;
};

export const ConnectingBox: React.FC<Props> = ({ attempts }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="grey.100">
      <Paper elevation={3} sx={{ p: 4, textAlign: "center", minWidth: 300 }}>
        <CircularProgress size={48} sx={{ mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Connecting to Real-time Services
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Establishing connection... (Attempt {attempts}/3)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Please wait while we set up real-time notifications.
        </Typography>
      </Paper>
    </Box>
  );
};
