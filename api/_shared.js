const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const INDEX_PATH = path.join(ROOT, "index.html");

function getSiteOrigin(request) {
  const explicitSiteUrl = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || "";
  if (explicitSiteUrl) {
    const normalized = explicitSiteUrl.startsWith("http") ? explicitSiteUrl : `https://${explicitSiteUrl}`;
    return normalized.replace(/\/+$/, "");
  }

  const forwardedProto = request.headers["x-forwarded-proto"];
  const forwardedHost = request.headers["x-forwarded-host"];
  const protocol = (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto || "").split(",")[0].trim()
    || (request.socket && request.socket.encrypted ? "https" : "http");
  const host = (Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost || "").split(",")[0].trim()
    || request.headers.host
    || "localhost:3000";

  return `${protocol}://${host}`.replace(/\/+$/, "");
}

function send(response, status, body, headers = {}) {
  response.statusCode = status;
  for (const [key, value] of Object.entries(headers)) {
    response.setHeader(key, value);
  }
  response.end(body);
}

function renderIndex(siteOrigin) {
  const html = fs.readFileSync(INDEX_PATH, "utf8");
  return html.replaceAll("__SITE_ORIGIN__", siteOrigin);
}

function getIndexLastModified() {
  return fs.existsSync(INDEX_PATH) ? fs.statSync(INDEX_PATH).mtime.toISOString() : new Date().toISOString();
}

module.exports = {
  getIndexLastModified,
  getSiteOrigin,
  renderIndex,
  send,
};
