# Nepali Property Market

Programmatic-SEO directory of Nepali-speaking property professionals in Australia
(nepalipropertymarket.com.au). Providers pay monthly to rank at the top of local pages.

Stack: Astro (server rendered) on Cloudflare Workers + D1. See `docs/PROJECT_BRIEF.md` for the approved plan and
`docs/SETUP.md` for going live.

## How it works
- `src/data/categories.ts`: provider categories (6 at launch) and their page copy.
- `src/data/areas.ts`: suburbs/LGAs. **Only areas with `launch: true` get pages**; the rest 404.
- D1 database (`db/migrations`): providers, areas they serve, leads, click events, claim requests.
- URLs: `/{category}/` hub, `/{category}/{area}/` money page, `/areas/{area}/` hub, `/provider/{slug}/` profile.
- Quality rule: a category+area page is indexed (and in the sitemap) only when it lists >=1 real provider; unclaimed
  profiles stay `noindex` until claimed.
- Paid placements are labelled "Sponsored". "Nepali-speaking" and "Licence checked" badges are manual flags in `/admin/`.

## Local development
```bash
npm install
npm run db:migrate:local
npm run db:seed-demo:local     # fake demo providers, local only
npm run build && npx wrangler dev --local --var ADMIN_PASSWORD:choose-a-password
```
Admin: `/admin/` (any username, the `ADMIN_PASSWORD` as password).

## Importing providers
`node scripts/import-providers.mjs providers.csv > import.sql` then run it with `wrangler d1 execute` (see script header).

## Other tools
- `scripts/rank-areas.mjs`: rank suburbs from an ABS Census export (see `docs/CENSUS_PRIORITY.md`).
- `docs/OUTREACH.md`: how to sign the first providers.
- Monthly provider reports: `/admin/` (see `docs/SETUP.md` step 9).
