"use strict";
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const envFileRegEx = /env.([a-z0-9]*.)?js/g;
const injectedObjectRegEx = /(const oidc = {[^}]*})/;
const buildDir = "./dist";

function generateScriptContent() {
  const prefixRegexp = /^VITE_APP_/;
  const env = process.env;
  const config = Object.keys(env)
    .filter((key) => prefixRegexp.test(key))
    .reduce((c, key) => Object.assign({}, c, { [key]: env[key] }), {});

  console.log(config);
  return `window.env=${JSON.stringify(config)};`;
}

function saveEnvScript(scriptContent, scriptName) {
  const scriptPath = path.join(buildDir, scriptName);
  console.log("Saving file to: " + scriptPath);
  fs.writeFile(scriptPath, scriptContent, "utf8", function (err) {
    if (err) throw err;
    console.log(`${scriptName} was saved!`);
  });
}

function setOidcDomains() {
  const trustedDomainsFile = "OidcTrustedDomains.js";
  const scriptPath = path.join(buildDir, trustedDomainsFile);
  fs.readFile(scriptPath, "utf8", function (err, data) {
    if (err) {
      console.error(err);
      return;
    }
    const { VITE_APP_IDENTITY_AUTHORITY, VITE_APP_API_URL } = process.env;

    const injectedValue =
      "const oidc = " +
      JSON.stringify({
        VITE_APP_IDENTITY_AUTHORITY,
        VITE_APP_API_URL
      });

    data = data.replace(injectedObjectRegEx, injectedValue);

    console.log("Saving file to: " + scriptPath);
    fs.writeFile(scriptPath, data, "utf8", function (err) {
      if (err) throw err;

      console.log("The file was saved!");
    });
  });
}

function updateIndexHtml(envFileName) {
  const indexPath = path.join(buildDir, "index.html");
  if (!fs.existsSync(indexPath)) {
    throw new Error(`Error: ${indexPath} not found`);
  }

  fs.readFile(indexPath, "utf8", function (err, data) {
    if (err) throw err;

    const result = data.replace(envFileRegEx, envFileName);

    fs.writeFile(indexPath, result, "utf8", function (err) {
      if (err) throw err;
    });
  });
}

function cleanupOldEnvFiles(currentScriptName) {
  const files = fs.readdirSync(buildDir).filter((fn) => fn != currentScriptName && fn.match(envFileRegEx));
  files.forEach((fn) => {
    let filePath = path.join(buildDir, fn);
    fs.unlink(filePath, (err) => {
      if (err) throw err;
    });
  });
}

function getSha256Hash(input) {
  const hash = crypto.createHash("sha256");
  hash.update(input);
  return hash.digest("hex");
}

function main() {
  console.log("Setting runtime environment...");
  const scriptContent = generateScriptContent();

  const hash = getSha256Hash(scriptContent);
  const fragment = hash.substring(0, 8);
  const envFileName = `env.${fragment}.js`;

  saveEnvScript(scriptContent, envFileName);
  setOidcDomains();
  updateIndexHtml(envFileName);
  cleanupOldEnvFiles(envFileName);
}

main();
