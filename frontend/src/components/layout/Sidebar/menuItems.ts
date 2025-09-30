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

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
const UserIcon = AccountCircleIcon;

export const staticPrimaryNavItems: MenuItem[] = [
  { id: "homepage", labelKey: "Navigation.Homepage", icon: HomeIcon, route: "/" },
  { id: "user", labelKey: "Navigation.User", icon: UserIcon, route: "/user" },
  { id: "conferences", labelKey: "Navigation.Conferences", icon: FolderIcon, route: "/conferences" },
  { id: "tutorial", labelKey: "Navigation.Tutorial", icon: FolderIcon, route: "/tutorial" }
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
