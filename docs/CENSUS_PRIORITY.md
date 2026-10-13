# Choosing priority suburbs and LGAs

`src/data/areas.ts` currently holds a **starting list from general knowledge**, with Sydney areas set to launch.
It is NOT yet validated against Census data. Do this before investing in outreach for other cities:

1. ABS Census 2021 → TableBuilder (free account) or DataPacks.
2. Pull by Suburb (SAL) and LGA: **Country of birth = Nepal**, **Language used at home = Nepali**, **Ancestry = Nepalese**.
3. Rank suburbs/LGAs by count (and share of population). Take the top ~30 per state to start.
4. Add each to `areas.ts` with a short, factual, unique `blurb`, then set `launch: true`.

Rule of thumb: launch an area only when you can write a genuinely local blurb AND expect to have at least one provider there.
