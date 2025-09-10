import React from "react";
import { useTranslation } from "react-i18next";
import { Typography, Card, CardContent } from "@mui/material";

const HomeContainer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Card sx={{ maxWidth: 500, width: "100%" }}>
      <CardContent>
        <Typography variant="h6" textAlign="center" gutterBottom>
          {t("Homepage.Title")}
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {t("Common.ComingSoon")}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default HomeContainer;
