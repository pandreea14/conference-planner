import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { withTransientProps } from "utils/styled";
import { SIDEBAR_BACKGROUND } from "units/theme/variants/default";

export const UserCard = styled(
  Box,
  withTransientProps
)<{ $isCollapsed?: boolean }>(({ theme, $isCollapsed }) => ({
  backgroundColor: SIDEBAR_BACKGROUND,
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  display: "flex",
  flexDirection: $isCollapsed ? "column" : "row",
  alignItems: "center",
  gap: $isCollapsed ? theme.spacing(1) : theme.spacing(2),
  width: "100%",
  maxWidth: "100%",
  transition: theme.transitions.create(["width", "max-width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard
  }),
  marginTop: 0
}));

export const UserInfo = styled(
  Box,
  withTransientProps
)<{ $isCollapsed?: boolean }>(({ $isCollapsed }) => ({
  flex: 1,
  display: $isCollapsed ? "none" : "flex",
  flexDirection: "column"
}));

export const UserName = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontSize: theme.typography.body2.fontSize,
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.body1.fontWeight,
  lineHeight: theme.typography.body2.lineHeight
}));

export const UserRole = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontSize: theme.typography.body2.fontSize,
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.body2.fontWeight,
  lineHeight: theme.typography.body2.lineHeight,
  opacity: 0.8
}));
