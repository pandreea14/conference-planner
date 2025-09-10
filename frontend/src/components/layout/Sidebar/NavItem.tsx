import React from "react";
import { Box, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";
import { NavItemButton, NotificationBadge, TooltipWrapper, NavItemIcon } from "./navItem.styled";

interface NavItemProps {
  item: {
    id: string;
    labelKey: string;
    icon: React.ElementType;
    badgeCount?: number;
    route: string;
  };
  $isActive: boolean;
  $isCollapsed: boolean;
  onClick: () => void;
}

interface NavItemContentProps {
  item: NavItemProps["item"];
  $isActive: boolean;
  $isCollapsed: boolean;
  onClick: () => void;
}

const NavItemContent: React.FC<NavItemContentProps> = ({ item, $isActive, $isCollapsed, onClick }) => {
  const { t } = useTranslation();

  return (
    <NavItemButton $isActive={$isActive} $isCollapsed={$isCollapsed} onClick={onClick}>
      <ListItemIcon>
        <NavItemIcon as={item.icon} />
      </ListItemIcon>
      {!$isCollapsed && <ListItemText primary={t(item.labelKey)} />}
      {item.badgeCount && (
        <NotificationBadge badgeContent={item.badgeCount} $isCollapsed={$isCollapsed}>
          <Box />
        </NotificationBadge>
      )}
    </NavItemButton>
  );
};

const NavItem: React.FC<NavItemProps> = ({ item, $isActive, $isCollapsed, onClick }) => {
  const { t } = useTranslation();

  const content = <NavItemContent item={item} $isActive={$isActive} $isCollapsed={$isCollapsed} onClick={onClick} />;

  if ($isCollapsed) {
    return (
      <TooltipWrapper title={t(item.labelKey)} placement="right" arrow>
        <ListItem disablePadding>{content}</ListItem>
      </TooltipWrapper>
    );
  }

  return <ListItem disablePadding>{content}</ListItem>;
};

export default NavItem;
