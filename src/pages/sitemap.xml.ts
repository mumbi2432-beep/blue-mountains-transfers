import type { APIRoute } from "astro";
import { CATEGORIES } from "../data/categories";
import { launchedAreas } from "../data/areas";
import { SITE_URL } from "../lib/site";

// Only URLs that pass the quality rule are listed:
//  - category + area pages with at least one real provider
//  - area hubs with at least one real provider in any category
//  - claimed provider profiles with a real description
export const GET: APIRoute = async ({ locals }) => {
	const db = locals.runtime.env.DB;
	const urls = new Set<string>(["/", "/about/", "/list-your-business/", "/privacy/", "/terms/"]);
	for (const c of CATEGORIES) urls.add(`/${c.slug}/`);

	const areas = launchedAreas();
	const { results: direct } = await db
		.prepare(
			`SELECT DISTINCT p.category AS category, pa.area_slug AS area FROM providers p
			 JOIN provider_areas pa ON pa.provider_id = p.id
			 WHERE p.status != 'suspended' AND p.is_demo = 0`,
		)
		.all<{ category: string; area: string }>();
	const have = new Set((direct ?? []).map((r) => `${r.category}|${r.area}`));

	for (const c of CATEGORIES) {
		for (const a of areas) {
			const keys = [a.slug, ...(a.lga ? [a.lga] : []), `city:${a.city.toLowerCase()}`];
			if (keys.some((k) => have.has(`${c.slug}|${k}`))) {
				urls.add(`/${c.slug}/${a.slug}/`);
				urls.add(`/areas/${a.slug}/`);
			}
		}
	}
	const { results: provs } = await db
		.prepare(`SELECT slug FROM providers WHERE status = 'claimed' AND is_demo = 0 AND length(coalesce(description,'')) >= 60`)
		.all<{ slug: string }>();
	for (const p of provs ?? []) urls.add(`/provider/${p.slug}/`);

	const body =
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
		[...urls].sort().map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`).join("\n") +
		`\n</urlset>\n`;
	return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
