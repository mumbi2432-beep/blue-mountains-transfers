import type { APIRoute } from "astro";

export const GET: APIRoute = () =>
	new Response(
		["User-agent: *", "Allow: /", "Disallow: /admin/", "Disallow: /api/", "Disallow: /find/", "Disallow: /thanks/", "",
		 "Sitemap: https://nepalipropertymarket.com.au/sitemap.xml", ""].join("\n"),
		{ headers: { "Content-Type": "text/plain; charset=utf-8" } },
	);
