# Starfall Atlas

Starfall Atlas is a browser-based GitHub activity visualizer that turns public repository events into an interactive night sky.

In `Starfall` view, activity lands as a live meteor field. In `Galaxy` view, the same stream is mapped into a navigable code atlas, with repositories grouped into themed clusters such as Machine Learning, Frontend, Infra, DevTools, Data, Security, Mobile, and Systems.

It is built as a lightweight frontend project with no bundler, a small local Node server for development, and Vercel-ready serverless endpoints for deployment.

## Highlights

- Live GitHub activity powered by the public [GitHub Events API](https://docs.github.com/en/rest/activity/events?apiVersion=2022-11-28#list-public-events)
- Two visual modes:
  - `Starfall` for a simpler live meteor field
  - `Galaxy` for a navigable code atlas with region focus and camera motion
- Event filters for pushes, stars, forks, pull requests, issues, comments, releases, creates, deletes, and generic events
- Region focus controls with a slow telescope-style camera transition
- Hover details and direct links to repositories on GitHub
- Ambient audio with a mute toggle
- Graceful `demo` fallback when live GitHub requests are unavailable
- SEO, social preview, `robots.txt`, and `sitemap.xml` support for public deployment

## How It Works

Starfall Atlas polls GitHub's public events feed:

```text
https://api.github.com/events?per_page=100
```

Because the endpoint is polling-based rather than true realtime, the app respects GitHub's response cadence where possible:

- sends `If-None-Match` requests when an `ETag` is available
- uses `X-Poll-Interval` when it is exposed
- falls back to synthetic event-shaped data in `demo` mode if the upstream feed is unavailable or rate-limited

Repositories are classified locally from owner and repository-name heuristics, then placed into stable thematic regions. If a repository does not match a known category, it is assigned to open space in a consistent way so the atlas still feels alive without extra per-repository API calls.

## Views

### Starfall

The default view. Public GitHub events arrive as meteors, with repository nodes glowing as activity lands.

### Galaxy

A wider navigable atlas of topic clusters. Selecting a region smoothly slews the camera toward it, like moving a telescope across the sky.

## Event Language

- Most events appear as meteors
- `ReleaseEvent` blooms as a supernova
- `CreateEvent` lights up a small constellation burst
- Repository nodes pulse as activity accumulates

## Controls

- `Live` fetches public GitHub events
- `Quiet` pauses incoming activity while keeping the scene visible
- `Clear` resets the visible sky without changing the selected view
- `Starfall` and `Galaxy` switch between the two visualization modes
- `Calm`, `Pulse`, and `Storm` change activity density
- Region buttons focus the atlas on a single topic cluster
- Event filters toggle which GitHub event types are rendered
- In `Galaxy` view:
  - drag to pan
  - `Shift` + drag to rotate
  - scroll to zoom
- Click a visible repository node to open the repository on GitHub
- Use the sound toggle to mute or resume the ambient track

## Run Locally

Install dependencies and start the local server:

```bash
npm install
npm start
```

Then open:

```text
http://localhost:5173
```

Why use the local server instead of opening `index.html` directly:

- it serves the app with the correct content types
- it injects the current site origin into metadata placeholders
- it provides a same-origin `/api/github-events` proxy
- it exposes local `robots.txt` and `sitemap.xml` routes

## Deployment

This repo is set up to deploy cleanly on Vercel.

### What Vercel Handles

- `/` rewrites to `api/index`
- `/robots.txt` rewrites to `api/robots`
- `/sitemap.xml` rewrites to `api/sitemap`
- `/api/github-events` proxies the GitHub public events feed

### Optional Environment Variable

Set `SITE_URL` in production if you want to force a canonical origin for metadata, the sitemap, and social tags.

## Debugging API Issues

The app includes API logs on both the client and the local server:

- browser console logs are prefixed with `[Starfall API]`
- local proxy logs in the terminal are also prefixed with `[Starfall API]`

These logs help surface:

- GitHub response status
- poll interval and `ETag` behavior
- rate-limit headers when available
- when the app falls back to `demo` mode

## Project Structure

```text
.
|- index.html          # App shell, metadata, structured data, audio element
|- styles.css          # UI and scene styling
|- script.js           # Visualization, camera, event handling, controls
|- server.js           # Local dev server, metadata rendering, GitHub proxy
|- api/
|  |- index.js         # Vercel homepage handler
|  |- github-events.js # Vercel GitHub proxy
|  |- robots.js        # Vercel robots.txt
|  |- sitemap.js       # Vercel sitemap.xml
|  \- _shared.js       # Shared helpers for Vercel handlers
|- assets/
|  |- favicon/         # Generated favicon set
|  |- social-preview.svg
|  \- Calm-space-ambient-track.mp3
|- vercel.json
|- site.webmanifest
|- package.json
```

## Notes

- GitHub's public events API is rate-limited and not guaranteed to behave like a realtime websocket feed
- Region classification is heuristic and intentionally lightweight
- Browsers may block autoplay audio until the first user interaction
- `demo` mode is a fallback for continuity, not a replacement for the real GitHub stream

## License

[MIT](LICENSE)
