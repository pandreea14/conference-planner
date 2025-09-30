import { Card, CardContent, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export const UserDetailCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Card sx={{ maxWidth: 500, width: "100%" }}>
      <CardContent>
        <Typography variant="h6" textAlign="center" gutterBottom>
          {t("UserNew.Details")}

        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="left">
          {t("UserNew.Address", { address: "Strada cea mai tare, nr 1" })}
        </Typography>
      </CardContent>
    </Card>
  );
};