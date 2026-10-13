# Getting your first 20 paying providers

The directory only earns once providers pay. Plan: sign 10-20 founding members by hand in your launch suburbs,
then use their results to sell the next ones. Target categories first: **real estate agents and mortgage brokers**.

## 1. Build the list (a day of work)
- Start with people you can reach: community Facebook groups and pages, Nepali business associations, events,
  your own contacts, agents who already advertise to the community.
- Public registers to look up licence holders (check each register's terms of use before exporting in bulk):
  NSW Fair Trading public register, ASIC Professional Registers (credit licensees and brokers), Tax Practitioners Board.
- Record only business contact details. Put them in a CSV (see `scripts/import-providers.mjs` for columns).
  Leave `nepali_speaking` as 0 unless they tell you or show it on their own site.

## 2. Contact them (Australian rules)
- **Spam Act:** commercial emails, SMS and WhatsApp-style messages need consent, which can be inferred for a
  business address that is publicly published for that purpose, and must say who you are and include an unsubscribe.
  Calling and in-person are simplest. If unsure, ask a lawyer before bulk emailing.
- Check the Do Not Call Register rules if cold calling.

### Short pitch (call or message)
> Hi {name}, I run Nepali Property Market, a new directory for Nepali buyers and sellers in {suburb}. I've listed
> {business} for free so you show up when people search for a Nepali-speaking {category} in {suburb}. I'm taking
> 20 founding members at $99/month (locked in) who get sponsored placement above free listings, instant enquiry
> emails and a monthly results report. Can I show you your page? It takes 2 minutes.

### After they say yes
1. Send them the link to their `/claim/{slug}/` page, or add them in `/admin/` and tick Claimed.
2. Check their licence on the official register, then tick **Licence checked**.
3. Tick **Nepali-speaking** only when they confirm it.
4. Set the plan (founding) and, if they want it, the exclusive **Top** slot for their area.
5. Collect payment manually (invoice) until Stripe is switched on.

## 3. Keep them
- Reply fast to every enquiry and watch the **Monthly provider reports** table in `/admin/`.
- Send reports monthly (button in `/admin/`, or schedule it with a free cron service, see `docs/SETUP.md`).
- Ask happy providers for a short testimonial you can use in the next pitch.
