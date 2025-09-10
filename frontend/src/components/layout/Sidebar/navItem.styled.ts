import { ListItemButton, Badge, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { withTransientProps } from "utils/styled";

export const NavItemButton = styled(
  ListItemButton,
  withTransientProps
)<{ $isActive?: boolean; $isCollapsed?: boolean }>(({ theme, $isActive, $isCollapsed }) => ({
  borderRadius: theme.spacing(0.75),
  padding: $isCollapsed ? theme.spacing(0.5, 1.5) : theme.spacing(0.5, 1.5),
  backgroundColor: $isActive ? theme.palette.primary.main : "transparent",
  justifyContent: $isCollapsed ? "center" : "flex-start",
  minHeight: theme.spacing(5),
  transition: theme.transitions.create(["background-color", "color"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  "&:hover": {
    backgroundColor: $isActive ? theme.palette.primary.main : theme.palette.action.hover,
    "& .MuiListItemIcon-root": {
      color: $isActive ? theme.palette.common.white : theme.palette.grey[800]
    },
    "& .MuiListItemText-primary": {
      color: $isActive ? theme.palette.common.white : theme.palette.grey[800]
    }
  },
  "& .MuiListItemIcon-root": {
    color: $isActive ? theme.palette.common.white : theme.palette.grey[300],
    minWidth: $isCollapsed ? "auto" : theme.spacing(4),
    marginRight: $isCollapsed ? 0 : theme.spacing(1),
    transition: theme.transitions.create("color", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter
    })
  },
  "& .MuiListItemText-primary": {
    color: $isActive ? theme.palette.common.white : theme.palette.grey[300],
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.body1.fontWeight,
    lineHeight: theme.typography.body1.lineHeight,
    display: $isCollapsed ? "none" : "block",
    transition: theme.transitions.create("color", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter
    })
  }
}));

export const NotificationBadge = styled(
  Badge,
  withTransientProps
)<{ $isCollapsed?: boolean }>(({ theme, $isCollapsed }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: theme.typography.caption.fontSize,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.caption.fontWeight,
    minWidth: theme.spacing(2.5),
    height: theme.spacing(2.5),
    borderRadius: theme.spacing(0.75),
    border: `1px solid ${theme.palette.primary.main}`,
    padding: theme.spacing(0.25, 0.75),
    right: $isCollapsed ? theme.spacing(-0.5) : theme.spacing(1.5),
    top: "50%",
    transform: "translate(50%, -50%)"
  }
}));

export const NavItemIcon = styled("svg")(({ theme }) => ({
  width: theme.spacing(2.5),
  height: theme.spacing(2.5),
  display: "block",
  color: theme.palette.grey[300]
}));

export const TooltipWrapper = styled(Tooltip)(({ theme }) => ({
  "& .MuiTooltip-tooltip": {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.fontWeightMedium || 500
  }
}));
