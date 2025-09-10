import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { SearchOffOutlined as SearchOffIcon } from "@mui/icons-material";

const NotFound: React.FC = () => {
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
      <SearchOffIcon sx={{ fontSize: 64, color: "text.secondary" }} />
      <Typography variant="h4" component="h1" textAlign="center">
        {t("Common.PageNotFound")}
      </Typography>
      <Button variant="contained" onClick={handleGoToHome}>
        {t("Navigation.GoToHome")}
      </Button>
    </Box>
  );
};

export default NotFound;
