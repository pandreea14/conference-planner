const oidc = {
  VITE_APP_IDENTITY_AUTHORITY: "https://sso-qa.charisma.online",
  VITE_APP_API_URL: "http://localhost:5200"
};

const trustedDomains = {
  charisma_oidc_config: {
    domains: [oidc.VITE_APP_IDENTITY_AUTHORITY, oidc.VITE_APP_API_URL],
    showAccessToken: true,
  },
};
