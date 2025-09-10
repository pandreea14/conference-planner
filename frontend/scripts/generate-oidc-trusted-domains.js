import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv(envFile) {
  const envPath = path.resolve(__dirname, "..", envFile);
  if (!fs.existsSync(envPath)) {
    return {};
  }

  const content = fs.readFileSync(envPath, "utf8");
  const env = {};

  content.split("\n").forEach((line) => {
    line = line.trim();
    if (line && !line.startsWith("#")) {
      const [key, ...valueParts] = line.split("=");
      if (key && valueParts.length > 0) {
        let value = valueParts.join("=");
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        env[key] = value;
      }
    }
  });

  return env;
}

// Load environment variables from .env files
const baseEnv = loadEnv(".env");
const devEnv = loadEnv(".env.development");
const prodEnv = loadEnv(".env.production");

// Merge env vars (dev/prod override base)
const isDev = process.env.NODE_ENV !== "production";
const env = { ...baseEnv, ...(isDev ? devEnv : prodEnv) };

// Resolve placeholder values
Object.keys(env).forEach((key) => {
  let value = env[key];
  // Replace [PLACEHOLDER] with actual values
  const placeholderMatch = value.match(/^\[(.+)\]$/);
  if (placeholderMatch) {
    const placeholderKey = placeholderMatch[1];
    if (env[placeholderKey]) {
      env[key] = env[placeholderKey];
    }
  }
});

// Generate OidcTrustedDomains.js content
const content = `const oidc = {
  VITE_APP_IDENTITY_AUTHORITY: "${env.VITE_APP_IDENTITY_AUTHORITY || "N/A"}",
  VITE_APP_API_URL: "${env.VITE_APP_API_URL || "N/A"}"
};

const trustedDomains = {
  charisma_oidc_config: {
    domains: [oidc.VITE_APP_IDENTITY_AUTHORITY, oidc.VITE_APP_API_URL],
    showAccessToken: true,
  },
};
`;

// Write the file
const outputPath = path.resolve(__dirname, "..", "public", "OidcTrustedDomains.js");
fs.writeFileSync(outputPath, content);

console.log("✅ Generated OidcTrustedDomains.js with environment variables");
console.log(`VITE_APP_IDENTITY_AUTHORITY: ${env.VITE_APP_IDENTITY_AUTHORITY}`);
console.log(`VITE_APP_API_URL: ${env.VITE_APP_API_URL}`);
