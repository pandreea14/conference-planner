import { Box, TextField, List, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { withTransientProps } from "utils/styled";
import { SIDEBAR_BACKGROUND } from "units/theme/variants/default";

// Styled components
export const SidebarContainer = styled(
  Box,
  withTransientProps
)<{ $isCollapsed?: boolean }>(({ theme, $isCollapsed }) => ({
  width: $isCollapsed ? theme.spacing(10) : theme.spacing(40),
  height: "100vh",
  padding: theme.spacing(1),
  display: "flex",
  flexDirection: "column",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard
  })
}));

export const SidebarContent = styled(Box)(() => ({
  // Transparent sidebar content to show background image/gradient
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: "100vh"
}));

export const LogoSection = styled(
  Box,
  withTransientProps
)<{ $isCollapsed?: boolean }>(({ theme, $isCollapsed }) => ({
  padding: $isCollapsed ? theme.spacing(2.5, 1, 4) : theme.spacing(2.5, 2, 4),
  display: "flex",
  flexDirection: "column",
  gap: $isCollapsed ? theme.spacing(2) : theme.spacing(4),
  alignItems: $isCollapsed ? "center" : "stretch"
}));

export const LogoContainer = styled(
  Box,
  withTransientProps
)<{ $isCollapsed?: boolean }>(({ theme, $isCollapsed }) => ({
  display: "flex",
  flexDirection: $isCollapsed ? "column" : "row",
  justifyContent: $isCollapsed ? "center" : "space-between",
  alignItems: "center",
  gap: $isCollapsed ? 0 : theme.spacing(4)
}));

export const Logo = styled(
  "img",
  withTransientProps
)<{ $isCollapsed?: boolean }>(({ theme, $isCollapsed }) => ({
  width: $isCollapsed ? theme.spacing(5) : "auto",
  flex: $isCollapsed ? "0 0 auto" : "1 1 auto",
  maxHeight: $isCollapsed ? theme.spacing(5) : theme.spacing(7),
  height: "auto",
  objectFit: "contain",
  transition: theme.transitions.create("all", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard
  })
}));

export const CollapseToggleButton = styled(
  IconButton,
  withTransientProps
)<{ $isCollapsed?: boolean }>(({ theme }) => ({
  backgroundColor: "transparent",
  color: theme.palette.common.white,
  padding: theme.spacing(1),
  transition: theme.transitions.create("all", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard
  }),
  "&:hover": {
    backgroundColor: theme.palette.action.hover
  }
}));

export const SearchField = styled(
  TextField,
  withTransientProps
)<{ $isCollapsed?: boolean }>(({ theme, $isCollapsed }) => ({
  display: $isCollapsed ? "none" : "block",
  "& .MuiOutlinedInput-root": {
    backgroundColor: SIDEBAR_BACKGROUND,
    borderRadius: theme.spacing(1),
    "& fieldset": {
      borderColor: theme.palette.primary.main
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main
    }
  },
  "& .MuiInputBase-input": {
    color: theme.palette.grey[300],
    fontSize: theme.typography.body1.fontSize,
    fontFamily: theme.typography.fontFamily,
    "&::placeholder": {
      color: theme.palette.grey[300],
      opacity: 1
    }
  },
  "& .MuiInputAdornment-root": {
    marginLeft: 0,
    "& .MuiSvgIcon-root": {
      color: theme.palette.grey[400],
      width: 20,
      height: 20
    }
  }
}));

export const NavigationSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: theme.spacing(0, 0, 0)
}));

export const NavList = styled(
  List,
  withTransientProps
)<{ $isCollapsed?: boolean }>(({ theme, $isCollapsed }) => ({
  padding: $isCollapsed ? theme.spacing(0, 1, 1) : theme.spacing(0, 2, 1),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5)
}));

export const FooterSection = styled(
  Box,
  withTransientProps
)<{ $isCollapsed?: boolean }>(({ theme, $isCollapsed }) => ({
  padding: $isCollapsed ? theme.spacing(1, 1, 2) : theme.spacing(2, 2, 4)
}));
