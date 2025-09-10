import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/layout/App.tsx";
import { AuthenticationProvider } from "./units/authentication";
import { Toaster } from "./units/toaster";
import { ThemeProvider } from "./units/theme";
import "./styles/fonts.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthenticationProvider>
      <ThemeProvider>
        <App />
        <Toaster />
      </ThemeProvider>
    </AuthenticationProvider>
  </StrictMode>
);
