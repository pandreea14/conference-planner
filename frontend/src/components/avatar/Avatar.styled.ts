import { styled } from "@mui/material/styles";
import { Badge } from "@mui/material";

export const OnlineStatusBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    "&.MuiBadge-dot": {
      backgroundColor: theme.palette.success.main
    }
  }
}));

export const BusyStatusBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    "&.MuiBadge-dot": {
      backgroundColor: theme.palette.error.main
    }
  }
}));

export const AwayStatusBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    "&.MuiBadge-dot": {
      backgroundColor: theme.palette.warning.main
    }
  }
}));
