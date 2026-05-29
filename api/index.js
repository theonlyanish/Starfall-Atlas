const { getSiteOrigin, renderIndex, send } = require("./_shared");

module.exports = function handler(request, response) {
  try {
    const siteOrigin = getSiteOrigin(request);
    const html = renderIndex(siteOrigin);
    send(response, 200, html, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    });
  } catch (error) {
    send(response, 500, "Unable to load homepage", {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    });
  }
};
