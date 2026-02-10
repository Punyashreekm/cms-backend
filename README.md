# Geeka Backend

MongoDB-powered backend that serves the public Next.js site, the Admin CMS, and provides SEO-friendly content APIs.

## Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- Zod validation
- slugify for SEO slugs
- dotenv, cors, helmet

## Why MongoDB Only

The site content is document-driven (blogs, hero slides) and evolves quickly. MongoDB keeps the schema flexible without expensive migrations while still supporting indexes for SEO and performance.

## Folder Structure

```
backend/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/db.js
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── validations/
│   ├── middlewares/
│   └── utils/
├── .env
└── package.json
```

## Environment

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/geeka
SITE_URL=http://localhost:3000
SERVE_FRONTEND=false
```

## Running Locally

```
npm install
npm run dev
```

## Serving the Public Site + Admin CMS

If you export the Next.js apps to static HTML (`next build && next export`), place outputs at:

- `frontend/out` for the public site
- `admin/out` for the Admin CMS

Then set `SERVE_FRONTEND=true` in `.env`. Express will serve both:

- `/` → public site
- `/admin` → admin CMS

## API Endpoints

### Blog

- `POST /api/blogs` — create blog
- `GET /api/blogs` — list blogs
  - `?includeDrafts=true` for admin view
  - pagination: `?page=1&limit=10`
- `GET /api/blogs/:slug` — get blog by slug
  - `?includeDrafts=true` for admin view
- `PUT /api/blogs/:id` — update blog
- `DELETE /api/blogs/:id` — delete blog

### Hero Slider

- `POST /api/hero` — create slide
- `GET /api/hero` — list slides
  - `?includeInactive=true` for admin view
- `PUT /api/hero/:id` — update slide
- `DELETE /api/hero/:id` — delete slide

## Schema & Index Design

### Blog

- `slug` — indexed + unique for SEO routing
- `status` — indexed for public filtering (`published`)
- `createdAt` — indexed via timestamps for sorting

### Hero Slide

- `order` — indexed for slider ordering
- `isActive` — indexed for public filtering

## Slug Uniqueness Strategy

Blog slugs are generated from titles using `slugify`. Before saving:

1. Generate a base slug.
2. Check DB for existing slug.
3. If taken, append `-1`, `-2`, etc until unique.

This guarantees stable, SEO-friendly URLs.

## SEO Endpoint (Sitemap)

`GET /api/sitemap.xml`

- Fetches all **published** blog slugs
- Emits XML sitemap for search engines
- `SITE_URL` controls canonical base URL

## Security Awareness

- Input validation with Zod
- Helmet for safe headers
- CORS enabled
- Blog content is sanitized server-side (basic script tag removal)

For production, consider `sanitize-html` or DOMPurify (server-side) to prevent XSS in rich text content.

## Performance Notes

- Indexed queries for blogs and slides
- `.lean()` used on read-heavy endpoints
- Pagination-ready blog listing
- Minimal payload fields for list endpoints
