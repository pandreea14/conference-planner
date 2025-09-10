import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { UserCard, UserInfo, UserName, UserRole } from "./userArea.styled";
import { CollapseArrowIcon, CollapseButton } from "./shared.styled";
import { ExpandMoreOutlined as ChevronDownIcon } from "@mui/icons-material";
import { useUserData } from "../../../hooks/useUserData";
import { Avatar } from "components/avatar";

interface UserAreaProps {
  $isCollapsed: boolean;
}

const UserArea: React.FC<UserAreaProps> = ({ $isCollapsed }) => {
  const { t } = useTranslation();
  const { userData, isLoading, error } = useUserData();

  const fullName = useMemo(() => {
    if (!userData) return t("User.Unknown");
    return `${userData.firstName} ${userData.lastName}`.trim() || t("User.Unknown");
  }, [userData, t]);

  const displayGroup = useMemo(() => {
    if (!userData) return t("User.Unknown");
    return userData.groups && userData.groups.length > 0 ? userData.groups[0].userGroupName : t("User.Unknown");
  }, [userData, t]);

  if (isLoading) {
    return (
      <UserCard $isCollapsed={$isCollapsed}>
        <Avatar status="online" />
        <UserInfo $isCollapsed={$isCollapsed}>
          <UserName>{t("User.Loading")}</UserName>
        </UserInfo>
        <CollapseButton $isCollapsed={$isCollapsed} size="small">
          <CollapseArrowIcon as={ChevronDownIcon} $small />
        </CollapseButton>
      </UserCard>
    );
  }

  if (error || !userData) {
    return (
      <UserCard $isCollapsed={$isCollapsed}>
        <Avatar status="online" />
        <UserInfo $isCollapsed={$isCollapsed}>
          <UserName>{t("User.Unknown")}</UserName>
        </UserInfo>
        <CollapseButton $isCollapsed={$isCollapsed} size="small">
          <CollapseArrowIcon as={ChevronDownIcon} $small />
        </CollapseButton>
      </UserCard>
    );
  }

  return (
    <UserCard $isCollapsed={$isCollapsed}>
      <Avatar firstName={userData.firstName} lastName={userData.lastName} fullName={fullName} status="online" />
      <UserInfo $isCollapsed={$isCollapsed}>
        <UserName>{fullName}</UserName>
        <UserRole>{displayGroup}</UserRole>
      </UserInfo>
      <CollapseButton $isCollapsed={$isCollapsed} size="small">
        <CollapseArrowIcon as={ChevronDownIcon} $small />
      </CollapseButton>
    </UserCard>
  );
};

export default UserArea;
