import {
  HomeOutlined as HomeIcon,
  DescriptionOutlined as FolderIcon,
  NotificationsNoneOutlined as BellIcon,
  HelpOutlineOutlined as LifebuoyIcon,
  SettingsOutlined as CogIcon
} from "@mui/icons-material";

export interface MenuItem {
  id: string;
  labelKey: string;
  icon: React.ElementType;
  route: string;
  badgeCount?: number;
}

export const staticPrimaryNavItems: MenuItem[] = [
  { id: "homepage", labelKey: "Navigation.Homepage", icon: HomeIcon, route: "/" },
  { id: "conferences", labelKey: "Navigation.Conferences", icon: FolderIcon, route: "/conferences" }
];

export const staticSecondaryNavItems: MenuItem[] = [
  { id: "notifications", labelKey: "Navigation.Notifications", icon: BellIcon, badgeCount: 8, route: "/notifications" },
  { id: "support", labelKey: "Navigation.Support", icon: LifebuoyIcon, route: "/support" },
  { id: "settings", labelKey: "Navigation.Settings", icon: CogIcon, route: "/settings" }
];

export const getLabelKeyByRoute = (route: string): string | undefined => {
  const item = [...staticPrimaryNavItems, ...staticSecondaryNavItems].find((item) => item.route === route);
  return item?.labelKey;
};

export const getIdByRoute = (route: string): string | undefined => {
  const item = [...staticPrimaryNavItems, ...staticSecondaryNavItems].find((item) => item.route === route);
  return item?.id;
};
