import { createTheme } from "@mui/material";
import type { Theme } from "@mui/material";

export const theme: Theme = createTheme({
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    button: {
      textTransform: "none"
    },
    h4: {
      fontSize: "24px",
      fontWeight: 600,
      lineHeight: "32px"
    },
    body1: {
      fontSize: "16px",
      fontWeight: 600,
      lineHeight: "24px"
    },
    body2: {
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "20px"
    },
    caption: {
      fontSize: "12px",
      fontWeight: 500,
      lineHeight: "18px"
    }
  },
  palette: {
    mode: "light",
    primary: {
      main: "#150B6C",
      light: "#1E05F9",
      contrastText: "#FFFFFF"
    },
    secondary: {
      main: "#FF6B35"
    },
    background: {
      default: "#280606",
      paper: "#FFFFFF"
    },
    action: {
      hover: "#F5F5F6",
      focus: "rgba(238, 0, 0, 0.12)"
    },
    text: {
      primary: "#181D27",
      secondary: "#A4A7AE"
    },
    success: {
      main: "#17B26A"
    },
    error: {
      main: "#F04438"
    },
    warning: {
      main: "#F79009"
    },
    grey: {
      50: "#FAFAFA", // Lightest - backgrounds
      100: "#F5F5F6", // Light hover backgrounds
      200: "#EAECF0", // Light borders
      300: "#D5D7DA", // Secondary text (sidebar inactive text)
      400: "#A4A7AE", // Icons inactive
      500: "#535862", // Mid-tone
      600: "#344054", // Darker text
      700: "#1D2939", // Dark text
      800: "#101828", // Very dark - hover text on light backgrounds
      900: "#181D27" // Darkest - primary text
    },
    divider: "#E9EAEB"
  }
});

export const SIDEBAR_BACKGROUND = "#150B6C";

export default theme;
