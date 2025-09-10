import { Box, Typography, Button } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import backgroundImage from "../../assets/background.jpg";

// Styled components
export const AppContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
  backgroundColor: theme.palette.background.default,
  backgroundImage: `url(${backgroundImage})`,
  backgroundPosition: "0 0, -204.96px 358px",
  backgroundSize: "100% 100%, 43.533% 73.683%",
  backgroundRepeat: "no-repeat, no-repeat",
  margin: 0,
  padding: 0,
  position: "relative"
}));

export const MainContentArea = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(1),
  paddingLeft: 0,
  minHeight: "100vh",
  position: "relative"
}));

export const MainContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(3),
  boxShadow: `0px 1px 2px 0px ${alpha(theme.palette.common.black, 0.05)}`,
  border: `1px solid ${theme.palette.divider}`,
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(4, 0),
  paddingBottom: 0,
  position: "relative",
  overflow: "auto"
}));

export const HeaderSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 4),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: `1px solid ${theme.palette.divider}`,
  paddingBottom: theme.spacing(3),
  marginBottom: theme.spacing(1)
}));

export const HeaderRightSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2)
}));

export const ContentSection = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(0, 2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(3),
  overflow: "auto"
}));

export const FooterContainer = styled(Box)(({ theme }) => ({
  position: "sticky",
  bottom: 0,
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  zIndex: 20
}));

export const PageTitle = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.h4.fontSize,
  fontWeight: theme.typography.h4.fontWeight,
  lineHeight: theme.typography.h4.lineHeight
}));

export const NotificationButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  color: theme.palette.text.primary,
  fontSize: theme.typography.body1.fontSize,
  fontWeight: theme.typography.body1.fontWeight,
  textTransform: "none",
  "&:hover": {
    backgroundColor: theme.palette.action.hover
  }
}));

export const NotificationBadge = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.main,
  fontSize: theme.typography.caption.fontSize,
  fontWeight: theme.typography.caption.fontWeight,
  minWidth: theme.spacing(2.5),
  height: theme.spacing(2.5),
  borderRadius: theme.spacing(1.25),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: theme.spacing(0.5)
}));
