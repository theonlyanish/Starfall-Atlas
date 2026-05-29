const { getIndexLastModified, getSiteOrigin, send } = require("./_shared");

module.exports = function handler(request, response) {
  const siteOrigin = getSiteOrigin(request);
  const lastModified = getIndexLastModified();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteOrigin}/</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

  send(response, 200, body, {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
  });
};
