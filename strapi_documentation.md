# Strapi — Study Guide & Technical Brief

> **Purpose:** A concise but comprehensive guide to help engineering, product, and content teams evaluate Strapi as a headless CMS and understand how to use it in projects.

---

## 1. What is Strapi?

**Strapi** is an open-source headless Content Management System (CMS) that enables teams to create, manage, and expose content via APIs. It provides an admin UI for editors, a content-type builder for developers, and auto-generated APIs that frontend or mobile apps can consume.

### What is a "headless CMS"?

- **Headless CMS**: A content management system that separates content storage and management (the "back end") from the presentation layer (the "front end"). It exposes content through APIs (REST/GraphQL) rather than coupling content to templates or themes.
- **Difference vs. traditional CMS (e.g., WordPress):**
  - Traditional CMS (monolithic): Backend + frontend tightly coupled; content and presentation live together; templates render HTML for visitors.
  - Headless CMS: Content is platform-agnostic and can be delivered to multiple channels (web, mobile, IoT) via APIs.

### Core features of Strapi

- **Admin Panel**: Web-based UI for editors to create/manage content, roles, and permissions.
- **Content-Type Builder**: Visual tool to define content models (single types and collection types) and components.
- **Auto-generated APIs**: REST and GraphQL endpoints generated from content models.
- **Authentication & Permissions**: Users & Permissions plugin with JWT-based auth and role-based access control.
- **Media Library**: Upload and manage images/files, with providers for local, AWS S3, Cloudinary, etc.
- **Plugins & Extensibility**: Plugin ecosystem (I18n, Email, Upload, Users-Permissions) and ability to create custom plugins or controllers/middlewares.
- **Custom Business Logic**: Customize controllers, services, routes, and lifecycle hooks.
- **Internationalization (i18n)**: Manage localized content.
- **Deployability**: Runs on Node.js; deployable to any Node-capable host (Render, Heroku, DigitalOcean, Vercel serverless backends with careful setup, Strapi Cloud).

### Technology stack

- **Runtime**: Node.js / JavaScript (TypeScript support available)
- **Framework**: Koa.js (Strapi v4 used Koa; v5 internals changed but Node remains core)
- **Database**: Works with SQL (Postgres, MySQL, SQLite) and NoSQL (MongoDB) depending on configuration
- **APIs**: Auto-generated REST endpoints and optional GraphQL plugin

---

## 2. Why Would We Use Strapi?

### Main advantages

- **Developer-friendly**: Flexible data modeling with code-first or UI-driven approaches, custom controllers/services, and middleware.
- **Editor-friendly**: Intuitive admin UI for non-technical editors to manage content and workflow.
- **Multi-channel**: Content delivered as JSON to any front-end framework or device.
- **Open-source & self-hostable**: Full control over data, hosting, and cost structure; no vendor lock-in.
- **Customizable auth & permissions**: Fine-grained roles for public vs authenticated content.
- **Extensible**: Plugins and code-level customizations allow adapting to complex business rules.

### Problems it solves for a dev team

- Eliminates the need to build a custom CMS for content management.
- Speeds up front-end development because APIs mirror content models.
- Provides a stable editor experience and content workflows.
- Simplifies multi-platform content delivery and localization.

### Potential disadvantages / cons

- **Maintenance overhead**: Self-hosting requires managing updates, backups, scaling, and security.
- **Learning curve**: Teams must learn Strapi-specific conventions (especially plugin/customization patterns).
- **Performance & scaling**: Needs careful architecture (caching, DB tuning, CDN) for high-traffic apps.
- **Breaking changes across major versions**: Migrating between major Strapi versions can require work (e.g., v4→v5 differences in populate syntax).
- **Plugin maturity**: Third-party plugins vary in quality; custom needs might require building plugins.

### Comparison with alternatives

**Strapi vs Contentful**

- Strapi: Open-source, self-hosted (or Strapi Cloud), full control over data and extensions; flexible but requires backend maintenance.
- Contentful: SaaS-first headless CMS with enterprise features, less maintenance but higher cost and vendor lock-in.

**Strapi vs Supabase (BaaS)**

- Strapi: Focused CMS features (admin UI, content modeling), editorial UX, roles/permissions, media library.
- Supabase: Backend-as-a-Service (postgres DB + auth + storage) — more generic backend building blocks, not an editor-first CMS. Use Supabase if you need a managed Postgres + realtime DB and plan to build custom content management UI.

---

## 3. How Do We Use Strapi?

### Basic developer workflow (getting started)

1. **Install Strapi** (local development). Typical command (v5 guidance may vary):
   ```bash
   # using npm
   npx create-strapi@latest my-project
   cd my-project
   npm run develop
   ```
2. **Open Admin UI**: `http://localhost:1337/admin` → create admin user.
3. **Create content types** via Content-Type Builder or code (single type for homepage, collection for posts).
4. **Define APIs & permissions**: configure API tokens, public role permissions (find/findOne), and JWT settings.
5. **Create content** in Content Manager.
6. **Consume API** from frontend.

### Define a data structure (example: Blog Post)

Using the Content-Type Builder, create a Collection Type named `Post` with fields:

- `title` (Text)
- `slug` (UID)
- `content` (Rich Text)
- `excerpt` (Text)
- `publishedAt` (DateTime)
- `featured_image` (Media)
- `author` (Relation to `User` or `Author` content type)
- `tags` (Component/Relation)

Optionally create a reusable `author` component with fields `name`, `bio`, `avatar`.

### How a frontend gets data from Strapi

- Strapi exposes REST endpoints at `/api/<content-type>` and GraphQL if plugin enabled.
- Example fetch call (frontend):

  ```js
  // Using fetch directly
  fetch("http://localhost:1337/api/posts?populate=featured_image")
    .then((r) => r.json())
    .then((data) => console.log(data));

  // Using axios with a preconfigured client
  axios.get(`${STRAPI_URL}/api/posts?populate=featured_image`);
  ```

- For authenticated content, include `Authorization: Bearer <API_TOKEN>` or use JWT with logged-in users.

### How non-technical editors use Strapi

- Editors log into the **Admin Panel** and use **Content Manager** to add/edit entries.
- Use the **Media Library** to upload/insert images.
- Use **Roles & Permissions** to limit access to certain content types or actions.
- Content can be saved as drafts and published via the UI.

---

## 4. Practical Use Case — Mini Study: Building a Company Blog

This section walks through a small, realistic example from install to frontend.

### Project Overview

Build a basic blog where editors can create posts (title, author, content, featured image) and the frontend (Next.js) displays a list of posts and single post pages.

### Step 1 — Setup Strapi (local)

1. Create project:
   ```bash
   npx create-strapi@latest company-blog
   cd company-blog
   npm run develop
   ```
2. Open Admin UI: `http://localhost:1337/admin` and create admin user.
3. Configure database (defaults to SQLite in development; use Postgres for production).

### Step 2 — Data Modeling (Content-Type)

In Content-Type Builder create Collection Type `Post` with fields:

- `title` — Text (required)
- `slug` — UID (from title)
- `excerpt` — Text
- `content` — Rich Text
- `publishedAt` — DateTime
- `featured_image` — Media (single)
- `author` — Relation to `Author` (optional: create `Author` single/collection type with name & bio)

Save and apply changes. Restart if prompted.

### Step 3 — Content Creation

1. Go to **Content Manager → Posts** → Create new post.
2. Fill fields, upload featured image, set publish date, and **Publish**.
3. Add 2–3 posts for testing.

### Step 4 — API & Permissions

1. Settings → Roles & Permissions → Public (or create a Public role) → enable `find` and `findOne` for `Post`.
2. Optionally create an API token for server-side fetching.

### Step 5 — Frontend (Next.js example)

**a) Axios client:**

```ts
// src/lib/api.ts
import axios from "axios";
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337",
  headers: { "Content-Type": "application/json" },
});
```

**b) Fetch posts (SSG or SSR example):**

```ts
// pages/index.tsx (or app/page.tsx)
export async function getStaticProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/posts?populate=featured_image`);
  const json = await res.json();

  return {
    props: { posts: json.data },
    revalidate: 60, // ISR
  };
}

export default function Home({ posts }) {
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.attributes.title}</h2>
          <img src={post.attributes.featured_image?.data?.attributes?.url} alt="" />
        </article>
      ))}
    </div>
  );
}
```

**c) Single post page:**

```ts
// pages/posts/[slug].tsx
export async function getStaticPaths() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/posts`);
  const json = await res.json();
  const paths = json.data.map((p) => ({ params: { slug: p.attributes.slug } }));
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/posts?filters[slug][$eq]=${params.slug}&populate=featured_image,author`
  );
  const json = await res.json();
  return { props: { post: json.data[0] }, revalidate: 60 };
}
```

### Step 6 — Production considerations

- Use a managed DB (Postgres) & object storage (AWS S3 / Cloudinary) for media.
- Add caching (CDN + HTTP caching + application-level caching) for performance.
- Use environment variables for `NEXT_PUBLIC_STRAPI_URL` and API tokens.
- Secure admin panel (IP allowlist, strong admin password, 2FA if available).

---

## Appendix — Best Practices & Tips

- **Use `populate` carefully:** In v5 you must explicitly populate components/relations: `?populate[field]=*`.
- **Prefer SSR/SSG for SEO-critical pages:** Use `getStaticProps`/ISR or server components to pre-render pages.
- **Use API tokens for server-side calls** and role-permissions for client-side public calls.
- **Avoid exposing admin tokens or sensitive keys in the browser.**
- **Version your content types** in code if you need migration capabilities (consider writing migration scripts or using Git for DB schema policies).
- **Backups:** schedule DB & media backups.
- **Monitoring:** instrument logs, set up alerts for Strapi server errors.

---

## Conclusion & Recommendation

Strapi is a strong candidate when you need an open, developer-friendly, editor-ready headless CMS that you can self-host and customize. It works especially well for projects where:

- you need editorial control and an intuitive admin UI,
- you want to serve multiple frontends from the same content source,
- you prefer owning infrastructure and data.

If your team prefers zero-backend maintenance and is comfortable with vendor lock-in, a SaaS like Contentful might be simpler. If you need a raw backend (DB + auth) and plan to build a custom admin, consider BaaS options like Supabase.

---

_Document prepared for internal evaluation. If you want, I can export this as a Google Doc or PDF, add diagrams, or tailor the mini-study to the exact features of the Rescue Connect project._
