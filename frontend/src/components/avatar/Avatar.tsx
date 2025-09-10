import React, { useState, useMemo } from "react";
import { Avatar as MuiAvatar } from "@mui/material";
import { OnlineStatusBadge, BusyStatusBadge, AwayStatusBadge } from "./Avatar.styled";
import type { AvatarProps } from "./types";

const AvatarImage = ({ src, alt, onError }: { src: string; alt: string; onError: () => void }) => (
  <img
    src={src}
    alt={alt}
    onError={onError}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }}
  />
);

const Avatar: React.FC<AvatarProps> = ({ fullName, firstName, lastName, image, status }) => {
  const [imageError, setImageError] = useState(false);

  const initials = useMemo((): string => {
    if (firstName && lastName) {
      const firstInitial = firstName.length > 0 ? firstName[0].toUpperCase() : "";
      const lastInitial = lastName.length > 0 ? lastName[0].toUpperCase() : "";
      return firstInitial + lastInitial || "?";
    } else if (fullName) {
      const names = fullName.split(" ").filter((n) => n.length > 0);
      if (names.length === 0) return "?";
      if (names.length === 1) return names[0][0].toUpperCase();

      const firstInitial = names[0][0].toUpperCase();
      const lastInitial = names[names.length - 1][0].toUpperCase();
      return firstInitial + lastInitial;
    }
    return "?";
  }, [firstName, lastName, fullName]);

  const displayName = fullName || `${firstName || ""} ${lastName || ""}`.trim() || "Unknown";

  const avatarElement = (
    <MuiAvatar alt={displayName}>
      {image && !imageError ? <AvatarImage src={image} alt={displayName} onError={() => setImageError(true)} /> : initials}
    </MuiAvatar>
  );

  if (status === "online") {
    return (
      <OnlineStatusBadge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant="dot">
        {avatarElement}
      </OnlineStatusBadge>
    );
  }

  if (status === "busy") {
    return (
      <BusyStatusBadge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant="dot">
        {avatarElement}
      </BusyStatusBadge>
    );
  }

  if (status === "away") {
    return (
      <AwayStatusBadge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant="dot">
        {avatarElement}
      </AwayStatusBadge>
    );
  }

  return avatarElement;
};

export default Avatar;
