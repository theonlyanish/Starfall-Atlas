const GITHUB_EVENTS_URL = "https://api.github.com/events?per_page=100";

function send(response, status, body, headers = {}) {
  response.statusCode = status;
  for (const [key, value] of Object.entries(headers)) {
    response.setHeader(key, value);
  }
  response.end(body);
}

module.exports = async function handler(request, response) {
  try {
    const headers = {
      Accept: "application/vnd.github+json",
      "User-Agent": "starfall-atlas-vercel",
    };

    if (request.headers["if-none-match"]) {
      headers["If-None-Match"] = request.headers["if-none-match"];
    }

    const upstream = await fetch(GITHUB_EVENTS_URL, { headers });
    const body = upstream.status === 304 ? "" : await upstream.text();
    const contentType = upstream.headers.get("content-type");
    const etag = upstream.headers.get("etag");
    const pollInterval = upstream.headers.get("x-poll-interval");

    const responseHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
      "X-Starfall-Source": "live",
    };

    if (contentType) responseHeaders["Content-Type"] = contentType;
    if (etag) responseHeaders.Etag = etag;
    if (pollInterval) responseHeaders["X-Poll-Interval"] = pollInterval;

    if (!upstream.ok && upstream.status !== 304) {
      send(response, 200, "[]", {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
        "Content-Type": "application/json; charset=utf-8",
        "X-Poll-Interval": "90",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
        "X-Starfall-Source": "demo",
      });
      return;
    }

    send(response, upstream.status, body, responseHeaders);
  } catch (error) {
    send(response, 200, "[]", {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      "X-Poll-Interval": "90",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
      "X-Starfall-Source": "demo",
    });
  }
};
