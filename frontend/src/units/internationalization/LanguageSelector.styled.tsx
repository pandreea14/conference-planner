import { styled } from "@mui/material/styles";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ReactCountryFlag from "react-country-flag";

export const StyledSelect = styled(Select)(({ theme }) => ({
  width: 180,
  textAlign: "left",
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: "8px 12px",
    textAlign: "left"
  }
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  minHeight: 40,
  padding: "8px 12px",
  width: 180
}));

export const StyledFlag = styled(ReactCountryFlag)(({ theme }) => ({
  marginRight: theme.spacing(1)
}));

export const StyledValueWrapper = styled("span")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  width: "100%"
}));

export const StyledLanguageName = styled("span")(({ theme }) => ({
  flex: 1,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.body2.fontWeight,
  textAlign: "left"
}));
