import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledLogoutButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: theme.spacing(1),
  transition: theme.transitions.create(["color", "background-color"], {
    duration: theme.transitions.duration.short,
  }),
  "&:hover": {
    color: theme.palette.error.main,
    backgroundColor: theme.palette.action.hover,
  },
  "&:focus": {
    outline: `2px solid ${theme.palette.action.focus}`,
    outlineOffset: theme.spacing(0.25),
  },
}));