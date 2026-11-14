# Setup and deployment
Requirements: Node.js 20.9+ and PostgreSQL (Neon or Supabase PostgreSQL recommended).

1. Copy .env.example to .env.local.
2. Set DATABASE_URL, APP_ORIGIN, ADMIN_PASSWORD and three independent 32-byte hex secrets. Generate each secret with `openssl rand -hex 32`.
3. Install and migrate: `npm install && npm run db:migrate`.
4. Run locally: `npm run dev`.
5. Deploy as a Next.js app on Vercel. Add all environment variables in Vercel settings and run `npm run db:migrate` against the production database before sharing the site.
6. Keep the chess source only in `private/chess-copilot.html`; never copy it to `public/` or deploy an old public static copy.

Admin: visit /admin/login and use ADMIN_PASSWORD. Generate invitations in /admin. Guests open /invite?invite=... and enter the matching code. Codes are 128-bit random; invitation tokens are 256-bit random. Code and invitation token are stored encrypted using AES-256-GCM for admin retrieval, with keyed HMAC digests used for verification. Redemption uses one conditional PostgreSQL UPDATE, so only one concurrent request wins. Sessions are random opaque tokens stored as HMAC digests and expire after 24 hours. Cookies are HttpOnly and SameSite=Strict; Secure is enabled in production.

Rate limiting is PostgreSQL-backed: five redemption attempts per IP per ten minutes, and five admin login attempts per IP per fifteen minutes. Deploy behind a trusted proxy that supplies x-real-ip (Vercel does). Keep secrets out of Git and never use NEXT_PUBLIC_ for secrets. Back up the database and encryption key. If the encryption key is lost, existing invitations cannot be displayed in the dashboard again.

Before sharing, test valid redemption; reuse rejection; invalid, expired and revoked codes; concurrent redemption (exactly one success); unauthorized admin access; protected engine 401 when signed out; and session expiration. The existing chess engine HTML is copied unchanged.
