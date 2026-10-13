# Going live: step by step

You need: a Cloudflare account (free), a Resend account (free) for email, and access to the domain's DNS at Synergy.
Nothing here costs money at launch.

## 1. Cloudflare account
1. Log in at dash.cloudflare.com.
2. Create the database: **Storage & Databases → D1 → Create** and name it `nepali-property-market`.
3. Copy its **Database ID** into `wrangler.json` (`REPLACE_WITH_D1_DATABASE_ID`).
4. Put your own email in `ADMIN_NOTIFY_EMAIL` in `wrangler.json`.

## 2. Create tables
```bash
npm install
npx wrangler login
npm run db:migrate:remote
```

## 3. Secrets
```bash
npx wrangler secret put ADMIN_PASSWORD    # choose a long password for /admin/
npx wrangler secret put RESEND_API_KEY    # from resend.com, after verifying the domain
```
Without `RESEND_API_KEY` enquiries are still saved (visible in /admin/) but no emails are sent.

## 4. Deploy
```bash
npm run build && npx wrangler deploy
```

## 5. Connect the domain
1. In Cloudflare, **Add a site** → `nepalipropertymarket.com.au` (free plan). Cloudflare shows two nameservers.
2. In Synergy, change the domain's nameservers to those two.
3. In Cloudflare: Workers → your worker → **Settings → Domains & Routes → Add custom domain**.
4. Add an edge cache rule so pages are served fast: **Caching → Cache Rules → "Cache everything" for the hostname**,
   respect origin Cache-Control headers (the site already sends them).

## 6. Email (Resend)
Add and verify `nepalipropertymarket.com.au` in Resend (it gives DNS records to add in Cloudflare). Then the sender
`leads@nepalipropertymarket.com.au` works.

## 7. Search Console (only after you have real providers on pages)
Add the domain property, submit `https://nepalipropertymarket.com.au/sitemap.xml`.
The sitemap only lists pages that pass the quality rule, so it will be small at first. That is intended.

## 8. Load providers and launch areas
- Providers: `node scripts/import-providers.mjs` (CSV → SQL), or add one by one in `/admin/`.
- Areas: edit `launch` flags in `src/data/areas.ts` (see `docs/CENSUS_PRIORITY.md`).
