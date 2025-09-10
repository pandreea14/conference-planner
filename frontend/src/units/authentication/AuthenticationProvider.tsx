import React, { useCallback } from "react";
import { OidcProvider } from "@axa-fr/react-oidc";
import { oidcConfig, oidcConfigName } from "./configuration";

type Props = {
  children: React.ReactNode;
};

const AuthenticationProvider: React.FC<Props> = ({ children }) => {
  const onLogoutFromAnotherTab = useCallback(() => (window.location.href = "/"), []);

  return (
    <OidcProvider configuration={oidcConfig} configurationName={oidcConfigName} onLogoutFromAnotherTab={onLogoutFromAnotherTab}>
      {children}
    </OidcProvider>
  );
};

export default AuthenticationProvider;
