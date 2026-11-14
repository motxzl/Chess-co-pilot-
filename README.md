# Chess Co-Pilot — Secure Invitations

This repository contains the existing Chess Co-Pilot chess engine and its secure invitation access layer.

## Security architecture
- Node.js / Next.js server-side routes.
- PostgreSQL persistence for one-time invitations and sessions.
- Cryptographically random invitation codes and link tokens.
- HMAC digests for lookup, AES-256-GCM encryption for owner-only code display.
- Atomic one-time redemption.
- 24-hour HttpOnly, SameSite cookies.
- Admin dashboard, revocation, expiration and PostgreSQL-backed rate limits.

## Setup
See `README-SECURITY.md` for complete setup and deployment instructions.
