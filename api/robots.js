const { getSiteOrigin, send } = require("./_shared");

module.exports = function handler(request, response) {
  const siteOrigin = getSiteOrigin(request);
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /server.js",
    "Disallow: /package.json",
    "Disallow: /README.md",
    "Disallow: /.git/",
    "Disallow: /node_modules/",
    "Disallow: /src/",
    "Disallow: *.json",
    "Disallow: *.map",
    "",
    `Sitemap: ${siteOrigin}/sitemap.xml`,
  ].join("\n");

  send(response, 200, body, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
  });
};
