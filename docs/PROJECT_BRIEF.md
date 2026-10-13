# Nepali Property Market — Project Brief (approved)

Domain: nepalipropertymarket.com.au (registered with Synergy Australia)

## What it is
A national programmatic-SEO directory of Nepali-speaking property professionals in Australia.
Providers pay monthly to rank at the top of local pages, e.g. "Nepalese real estate agent in Schofields".

## Revenue
- Free basic listing; paid ranking and upgrades.
- Founding members ~$99/month, locked in, first 20 providers.
- Standard ~$149-$249/month. One exclusive top slot per suburb + category.
- Local providers sold by suburb + category; wide-area providers (brokers) by city or LGA.
- Sponsored positions must be clearly labelled (Australian consumer law).

## Scope
- National site. Pages generated and indexed ONLY for priority suburbs/LGAs, ranked from ABS Census
  (Nepal-born, Nepali language at home, Nepali ancestry). Expansion = a switch, not a rebuild.
- Launch categories: real estate agents, mortgage/finance brokers, conveyancers/solicitors,
  accountants/tax agents, buyers' agents, building & pest inspectors.
- Later: migration agents, insurance brokers, builders/developers. Not planned: tradies/removalists.
- English only. Property listings are phase 2.
- Contact: enquiry form + click-to-call + WhatsApp, every lead logged and emailed to the provider.
- No reviews at launch. Use "Nepali-speaking" and licence-verified badges (only when verifiable;
  never infer from surnames).

## Cold start
Unclaimed profiles from public data -> providers claim and upgrade. Founder sells the first 10-20 by hand.

## Stack (final)
- Astro on Cloudflare Workers (free tier) + Cloudflare D1 database. Hosting cost ~$0 to start.
- Domain stays registered at Synergy; DNS pointed to Cloudflare. Synergy hosting not used.
- Transactional email (lead notifications) via an email API (e.g. Resend, free tier).
- Payments: Stripe for subscriptions when ready (Square exists; Stripe preferred for recurring billing).
- Houzez not used.

## Quality rule
Every indexed page needs unique local content; pages failing a minimum-content check stay noindex.

## Build order
1. Foundation: data model, page templates (suburb, category, provider).
2. Census-driven priority list; generate pages for priority suburbs only.
3. Seed unclaimed profiles + claim flow.
4. Lead forms, call/WhatsApp tracking, provider email notifications.
5. Paid tiers + billing, admin view.
6. Launch: sitemap, Search Console, schema markup.

## Founder to-dos
Cloudflare + Synergy DNS access, ABN for Stripe, hands-on selling.
