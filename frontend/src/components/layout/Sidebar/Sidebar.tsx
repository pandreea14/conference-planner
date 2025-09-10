import React, { useMemo, useState } from "react";
import { Box, InputAdornment } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import logoCollapsed from "../../../assets/logo-small.png";
import NavItem from "./NavItem";
import UserArea from "./UserArea";
import {
  SearchOutlined as MagnifyingGlassIcon,
  ArrowBackOutlined as ArrowBackIcon,
  ArrowForwardOutlined as ArrowForwardIcon
} from "@mui/icons-material";
import {
  SidebarContainer,
  SidebarContent,
  LogoSection,
  LogoContainer,
  Logo,
  CollapseToggleButton,
  SearchField,
  NavigationSection,
  NavList,
  FooterSection
} from "./sidebar.styled";
import { CollapseArrowIcon } from "./shared.styled";
import { getIdByRoute, staticPrimaryNavItems as primaryNavItems, staticSecondaryNavItems } from "./menuItems";

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeNavItemId = useMemo(() => {
    return getIdByRoute(location.pathname);
  }, [location.pathname]);

  const handleNavClick = (route: string) => {
    navigate(route);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    console.log("Search query:", event.target.value);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const filteredPrimaryItems = useMemo(
    () => primaryNavItems.filter((item) => t(item.labelKey).toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery, t]
  );

  const filteredSecondaryItems = useMemo(
    () => staticSecondaryNavItems.filter((item) => t(item.labelKey).toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery, t]
  );

  const renderNavItem = (item: { id: string; labelKey: string; icon: React.ElementType; badgeCount?: number; route: string }) => {
    const isActive = activeNavItemId === item.id;
    return <NavItem key={item.id} item={item} $isActive={isActive} $isCollapsed={isCollapsed} onClick={() => handleNavClick(item.route)} />;
  };

  return (
    <SidebarContainer $isCollapsed={isCollapsed}>
      <SidebarContent>
        <LogoSection $isCollapsed={isCollapsed}>
          <LogoContainer $isCollapsed={isCollapsed}>
            {isCollapsed ? (
              <>
                <Logo src={logoCollapsed} alt="Charisma Logo Collapsed" $isCollapsed />
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 1 }}>
                  <CollapseToggleButton $isCollapsed size="small" onClick={toggleCollapse}>
                    <CollapseArrowIcon as={ArrowForwardIcon} />
                  </CollapseToggleButton>
                </Box>
              </>
            ) : (
              <>
                <Logo src={logo} alt="Charisma Logo" $isCollapsed={false} />
                <CollapseToggleButton $isCollapsed={false} size="small" onClick={toggleCollapse}>
                  <CollapseArrowIcon as={ArrowBackIcon} />
                </CollapseToggleButton>
              </>
            )}
          </LogoContainer>

          <SearchField
            $isCollapsed={isCollapsed}
            size="small"
            placeholder={t("Navigation.Search")}
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlassIcon />
                  </InputAdornment>
                )
              }
            }}
          />
        </LogoSection>

        {/* Primary navigation items */}
        <NavigationSection>
          <NavList $isCollapsed={isCollapsed}>{filteredPrimaryItems.map(renderNavItem)}</NavList>
        </NavigationSection>

        {/* Secondary navigation items and user card grouped at the bottom */}
        <Box>
          <NavigationSection>
            <NavList $isCollapsed={isCollapsed}>{filteredSecondaryItems.map(renderNavItem)}</NavList>
          </NavigationSection>
          <FooterSection $isCollapsed={isCollapsed} sx={{ mt: 1 }}>
            <UserArea $isCollapsed={isCollapsed} />
          </FooterSection>
        </Box>
      </SidebarContent>
    </SidebarContainer>
  );
};

export default Sidebar;
