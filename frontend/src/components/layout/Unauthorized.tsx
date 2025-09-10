import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LockOutlined as LockIcon } from "@mui/icons-material";

const Unauthorized: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoToHome = () => {
    navigate("/");
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      gap={3} 
      px={2}
      height="100%"
    >
      <LockIcon sx={{ fontSize: 64, color: "text.secondary" }} />
      <Typography variant="h4" component="h1" textAlign="center">
        {t("User.AccessDenied")}
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth={400}>
        {t("User.InsufficientPermissions")}
      </Typography>
      <Button variant="contained" onClick={handleGoToHome}>
        {t("Navigation.GoToHome")}
      </Button>
    </Box>
  );
};

export default Unauthorized;