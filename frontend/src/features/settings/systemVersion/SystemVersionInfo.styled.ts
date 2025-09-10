import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.subtitle1.fontSize,
  fontWeight: theme.typography.subtitle1.fontWeight,
  display: "flex",
  alignItems: "center"
}));

export const InfoLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  display: "flex",
  alignItems: "center"
}));

export const IconWrapper = styled("span")(({ theme }) => ({
  marginRight: theme.spacing(1),
  display: "inline-flex",
  verticalAlign: "middle"
}));

export const SmallIconWrapper = styled("span")(({ theme }) => ({
  marginRight: theme.spacing(0.5),
  fontSize: theme.typography.body2.fontSize,
  display: "inline-flex",
  verticalAlign: "middle"
}));