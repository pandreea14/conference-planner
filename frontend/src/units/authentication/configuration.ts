import { TokenRenewMode } from "@axa-fr/react-oidc";
import env from "../../utils/env";

const oidcConfig = {
  client_id: env.VITE_APP_IDENTITY_CLIENT_ID,
  authority: env.VITE_APP_IDENTITY_AUTHORITY,
  redirect_uri: `${window.location.origin}/authentication/callback`,
  silent_redirect_uri: `${window.location.origin}/authentication/silent-callback`,
  scope: "openid profile " + env.VITE_APP_IDENTITY_SCOPE,
  refresh_time_before_tokens_expiration_in_second: 40,
  token_renew_mode: TokenRenewMode.access_token_invalid,
  service_worker_relative_url: "/OidcServiceWorker.js",
  service_worker_only: true
};

const oidcConfigName = "charisma_oidc_config";

export { oidcConfig, oidcConfigName };
