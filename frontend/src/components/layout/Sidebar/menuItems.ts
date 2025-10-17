import {
  HomeOutlined as HomeIcon,
  DescriptionOutlined as FolderIcon,
  NotificationsNoneOutlined as BellIcon,
  HelpOutlineOutlined as LifebuoyIcon,
  SettingsOutlined as CogIcon,
  Reviews,
  School
} from "@mui/icons-material";

export interface MenuItem {
  id: string;
  labelKey: string;
  icon?: React.ElementType;
  route: string;
  badgeCount?: number;
}

export const staticPrimaryNavItems: MenuItem[] = [
  { id: "homepage", labelKey: "Navigation.Homepage", icon: HomeIcon, route: "/" },
  { id: "organizerConferences", labelKey: "Navigation.ConferencesO", icon: School, route: "/myConferences" },
  { id: "attendeeConferences", labelKey: "Navigation.ConferencesA", icon: FolderIcon, route: "/allConferences" },
  { id: "myReviews", labelKey: "Navigation.Reviews", icon: Reviews, route: "/myReviews" }
];

export const staticSecondaryNavItems: MenuItem[] = [
  { id: "notifications", labelKey: "Navigation.Notifications", icon: BellIcon, badgeCount: 8, route: "/notifications" },
  { id: "support", labelKey: "Navigation.Support", icon: LifebuoyIcon, route: "/support" },
  { id: "settings", labelKey: "Navigation.Settings", icon: CogIcon, route: "/settings" }
];

export const dynamicNavItems: MenuItem[] = [
  { id: "details", labelKey: "Navigation.Conference", route: "/conferences/details" },
  { id: "edit", labelKey: "Navigation.ConferencesO", route: "/conferences/edit" },
  { id: "create", labelKey: "Navigation.ConferencesO", route: "/conferences/new" }
];

export const getLabelKeyByRoute = (route: string): string | undefined => {
  // const item = [...staticPrimaryNavItems, ...staticSecondaryNavItems, ...dynamicNavItems].find((item) => item.route === route);
  // return item?.labelKey;

  const allItems = [...staticPrimaryNavItems, ...staticSecondaryNavItems, ...dynamicNavItems];
  let item = allItems.find((item) => item.route === route);

  if (!item) {
    item = allItems.find((item) => route.startsWith(item.route + "/"));
  }
  return item?.labelKey;
};

export const getIdByRoute = (route: string): string | undefined => {
  // const item = [...staticPrimaryNavItems, ...staticSecondaryNavItems, ...dynamicNavItems].find((item) => item.route === route);
  // return item?.id;

  const allItems = [...staticPrimaryNavItems, ...staticSecondaryNavItems, ...dynamicNavItems];
  let item = allItems.find((item) => item.route === route);
  if (!item) {
    item = allItems.find((item) => route.startsWith(item.route + "/"));
  }
  return item?.id;
};
