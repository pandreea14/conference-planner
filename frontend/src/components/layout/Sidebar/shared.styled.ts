import { Box, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { withTransientProps } from "utils/styled";

// Shared styled components used across multiple sidebar components
export const CollapseArrowIcon = styled(
  Box,
  withTransientProps
)<{ $small?: boolean }>(({ theme, $small }) => ({
  width: $small ? theme.spacing(2) : theme.spacing(2.5),
  height: $small ? theme.spacing(2) : theme.spacing(2.5),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& .MuiSvgIcon-root": {
    width: "100%",
    height: "100%",
    color: theme.palette.grey[300]
  }
}));

export const CollapseButton = styled(
  IconButton,
  withTransientProps
)<{ $isCollapsed?: boolean }>(({ theme, $isCollapsed }) => ({
  padding: theme.spacing(0.75),
  color: theme.palette.common.white,
  display: $isCollapsed ? "none" : "flex",
  "&:hover": {
    backgroundColor: theme.palette.action.hover
  }
}));
