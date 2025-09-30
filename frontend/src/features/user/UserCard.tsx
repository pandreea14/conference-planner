import { Card, CardContent, Typography } from "@mui/material";
import { useUserData } from "hooks";
import { useTranslation } from "react-i18next";

export const UserCard: React.FC = () => {
  const { t } = useTranslation();
  const { userData: u } = useUserData();

  return (
    <Card sx={{ maxWidth: 500, width: "100%" }}>
      <CardContent>
        <Typography variant="h6" textAlign="center" gutterBottom>
          {t("UserNew.Title")}
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="left">
          {t("UserNew.Name", { name: u?.firstName })}
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="left">
          {t("UserNew.Surname", { surname: u?.lastName })}
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="left">
          {t("UserNew.Email", { email: u?.email })}
        </Typography>
      </CardContent>
    </Card>
  );
};