import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import { NotificationButton, NotificationBadge } from "./mainContainer.styled";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Sidebar from "./Sidebar/Sidebar";
import LanguageSelector from "../../units/internationalization/LanguageSelector";
import LogoutButton from "./LogoutButton";
import {
  AppContainer,
  MainContentArea,
  MainContent,
  HeaderSection,
  HeaderRightSection,
  ContentSection,
  PageTitle
} from "./mainContainer.styled";
import { FooterContainer } from "./mainContainer.styled";
import { useServerError, useApplicationLayout } from "hooks";
import { getLabelKeyByRoute } from "./Sidebar/menuItems";

const MainContainer: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const { header: applicationHeader, notifications, footer: applicationFooter } = useApplicationLayout();
  useServerError();

  const pageTitle = useMemo(() => {
    const path = location.pathname;
    const labelKey = getLabelKeyByRoute(path);
    if (labelKey) return t(labelKey);
    return t("Common.PageNotFound");
  }, [location.pathname, t]);

  return (
    <AppContainer>
      <Sidebar />
      <MainContentArea>
        <MainContent>
          <HeaderSection>
            {applicationHeader || <PageTitle>{pageTitle}</PageTitle>}
            <HeaderRightSection>
              {notifications.visible && (
                <NotificationButton onClick={notifications.onClick} startIcon={<NotificationsIcon />}>
                  {t("Common.Notifications")}
                  {notifications.count > 0 && <NotificationBadge>{notifications.count}</NotificationBadge>}
                </NotificationButton>
              )}
              <LanguageSelector />
              <LogoutButton />
            </HeaderRightSection>
          </HeaderSection>

          <ContentSection>
            <Outlet />
          </ContentSection>
          {applicationFooter && <FooterContainer>{applicationFooter}</FooterContainer>}
        </MainContent>
      </MainContentArea>
    </AppContainer>
  );
};

export default MainContainer;
