# Cowork runbook: take Nepali Property Market live

Paste the section "PROMPT FOR COWORK" into Cowork. Everything below it is the detail Cowork follows.
The owner (you) must be present for: logging in to accounts, choosing the admin password, and the Synergy nameserver change.

---------------------------------------------------------------------------------------------------
## PROMPT FOR COWORK (copy from here)

Goal: deploy the website in the GitHub repo `mumbi2432-beep/blue-mountains-transfers` (branch `main`) to Cloudflare and
connect the domain `nepalipropertymarket.com.au`. Follow `docs/COWORK_SETUP.md` in that repo, phases 1 to 7, in order.
Verify each phase before moving on. STOP and ask me whenever the runbook says STOP. Never type my passwords: I will log in
myself. Do not change any paid plans, delete any DNS record other than the ones the runbook names, or spend money.
Report the "Values to report back" list at the end.
---------------------------------------------------------------------------------------------------

## Rules for the agent
- The owner logs in to Cloudflare, GitHub, Synergy and Resend. The agent never asks for or types account passwords.
- Use only the **Free** plan on Cloudflare. If any screen asks for a payment method or a paid upgrade: STOP and ask.
- Do not delete DNS records except those named in Phase 5. Never delete `MX` or `TXT` records.
- If a screen does not match this runbook, take a screenshot, describe it, and ask the owner. Do not guess.

## Phase 0: code must be on `main` (owner or Claude Code does this)
Cloudflare deploys from `main`. The code currently lives on branch `claude/project-discussion-5c9rox`.
GitHub → Pull requests → open (or ask Claude Code to open) a PR from that branch into `main` → **Merge**.
Verify: `main` contains `package.json` with the name `nepali-property-market`.

## Phase 1: create the D1 database
1. dash.cloudflare.com → **Storage & databases → D1 SQL database → Create database**.
2. Name: `nepali-property-market`. Location hint: Oceania (or closest). Create.
3. Open the database → copy the **Database ID** (UUID). Keep it for Phase 3.
4. Open the **Console** tab. Open `docs/schema-for-cloudflare-console.sql` in the GitHub repo (use the **Raw** button),
   copy ALL of it, paste into the console, click **Execute**.
5. Verify: run `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;`.
   Expect these tables: claim_requests, click_events, leads, provider_areas, provider_views, providers, rate_limits, report_log.
   If the console rejects the whole file, run the file in pieces (one CREATE statement at a time).

## Phase 2: ask the owner for two values (STOP)
Ask the owner for:
- **ADMIN_NOTIFY_EMAIL**: the address that should get a copy of every lead and every new claim request.
- Confirm the owner has chosen an **admin password** (the owner types it themselves in Phase 4, not the agent).

## Phase 3: put the database ID and email into the code
Edit `wrangler.json` on `main` using the GitHub web editor (pencil icon):
- replace `REPLACE_WITH_D1_DATABASE_ID` with the Database ID from Phase 1;
- replace `REPLACE_WITH_YOUR_EMAIL` with the email from Phase 2.
Commit directly to `main` with the message "Set D1 id and notification email".
Verify: the file contains no remaining `REPLACE_WITH` text.

## Phase 4: deploy from GitHub
1. Cloudflare → **Workers & Pages → Create → Import a repository** (owner connects GitHub if asked; grant access to
   only the `blue-mountains-transfers` repo).
2. Select the repo, production branch `main`, project/worker name `nepali-property-market`
   (the name must match `"name"` in `wrangler.json`).
3. Build command: `npm run build`. Deploy command: leave default (`npx wrangler deploy`). Root directory: leave blank.
4. Save and deploy. Wait for the build to finish (2 to 5 minutes).
5. If the build fails, open the build log, copy the last 30 lines and report them to the owner. Do not change settings.
6. Open the `*.workers.dev` URL shown. Verify the home page loads with the blue hero and "Find Nepali-speaking property professionals".
7. Add the secret: Worker → **Settings → Variables and Secrets → Add → Type: Secret**, name `ADMIN_PASSWORD`,
   the OWNER types the value. Save/deploy.
8. Verify: `<workers.dev URL>/admin/` asks for a login; the owner enters any username + the password and sees "Admin".
   Also check `<workers.dev URL>/nepalese-real-estate-agents/schofields-nsw/` loads (it will show "No ... listed yet").

## Phase 5: connect the domain (owner must be present)
IMPORTANT: the owner has business email on this domain. Records must be preserved.
1. Cloudflare → **Add a domain** → `nepalipropertymarket.com.au` → **Free** plan → continue.
2. Cloudflare imports existing DNS records. **Screenshot the full list.** Confirm all `MX` and `TXT` records
   (email, SPF, DKIM) are present. If MX records are missing: STOP and ask the owner to read them from Synergy's DNS page,
   then add them here manually. Set all email-related records to **DNS only** (grey cloud).
3. Note the two Cloudflare **nameservers**.
4. **STOP: owner action at Synergy.** Owner logs in to Synergy Wholesale/Hosting → domain → **Name servers** → custom →
   paste the two Cloudflare nameservers. If DNSSEC is enabled at Synergy, disable it first.
5. Wait until Cloudflare shows the domain as **Active** (can take minutes to a day). Do not proceed until then.
6. Worker → **Settings → Domains & Routes → Add → Custom domain** → `nepalipropertymarket.com.au`.
   If it reports a conflicting `A`/`AAAA`/`CNAME` for the root domain (`@`), delete ONLY that conflicting record in
   Cloudflare DNS and retry. (Old website hosting records are the usual cause.)
7. Add a second custom domain `www.nepalipropertymarket.com.au` OR create a redirect rule www → apex:
   **Rules → Redirect Rules → Create** → hostname equals `www.nepalipropertymarket.com.au` → dynamic redirect to
   `https://nepalipropertymarket.com.au${http.request.uri.path}` status 301. (The apex is the canonical address.)
8. Verify: `https://nepalipropertymarket.com.au/` loads with a valid padlock. Verify business email still works
   (owner sends and receives a test email).

## Phase 6: speed rule
Cloudflare → the domain → **Caching → Cache Rules → Create rule**:
- name "Cache site pages"; when hostname equals `nepalipropertymarket.com.au` AND URI path does not start with `/admin`
  AND URI path does not start with `/api`;
- then: **Eligible for cache**, Edge TTL: **Use cache-control header if present**.
Verify: reload a page twice; the second response header `cf-cache-status` should be `HIT` (or `DYNAMIC` on the first load).
If it never shows HIT, report it. Do not worry; the site still works.

## Phase 7: email for enquiries (Resend)
1. Owner logs in / creates a free account at resend.com.
2. Resend → **Domains → Add domain** → `nepalipropertymarket.com.au`, region Sydney if offered.
3. Resend shows DNS records. Add each to Cloudflare DNS exactly as shown (type, name, value), set to **DNS only**.
   Do not touch existing records. Click **Verify** in Resend; wait until Verified.
4. Resend → **API Keys → Create** (permission: sending access only). The OWNER copies the key.
5. Worker → **Settings → Variables and Secrets → Add Secret** `RESEND_API_KEY` = the key (owner pastes it). Deploy.
6. Verify end to end (see "Final test").

## Final test (agent reports results)
1. Open `/admin/` → "Add provider": name "Zz Test", category Real estate agents, status **claimed**, plan free,
   your email in "Lead email", description of 60+ characters saying it is a test, area Schofields. Save.
2. Open that provider's public page, send an enquiry with the owner's mobile + email.
3. Expect: redirect to "Enquiry sent"; the lead appears in `/admin/` "Latest leads" with Emailed = yes;
   the owner receives the email (provider copy and admin copy).
4. Open `/robots.txt` and `/sitemap.xml`. Expect the sitemap to list only a few pages (that is correct: pages join the
   sitemap only after they have a real provider).
5. IMPORTANT: afterwards, in `/admin/` set the test provider status to **suspended** so it disappears from the public site.
   (Suspended providers are hidden from all pages and the sitemap.)

## Values to report back
- Worker URL (`*.workers.dev`), D1 database ID, whether the custom domain is Active, whether Resend shows Verified,
  result of each Final test step, and any screens that did not match this runbook.

## After launch (separate later tasks)
- **Google Search Console:** add property `nepalipropertymarket.com.au` (Domain type), verify via the DNS TXT record in Cloudflare,
  then submit `https://nepalipropertymarket.com.au/sitemap.xml`. Only do this once at least a few real providers are live.
- **Monthly reports cron:** see `docs/SETUP.md` step 9.
