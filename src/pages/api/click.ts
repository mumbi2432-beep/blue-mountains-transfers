import type { APIRoute } from "astro";
import { rateLimit } from "../../lib/db";
import { clean, clientKey } from "../../lib/http";

const KINDS = new Set(["call", "whatsapp", "website"]);

export const POST: APIRoute = async ({ request, locals }) => {
	const env = locals.runtime.env;
	try {
		const form = await request.formData();
		const slug = clean(form.get("provider"), 100);
		const kind = clean(form.get("kind"), 20);
		const area = clean(form.get("area"), 80);
		if (!slug || !KINDS.has(kind)) return new Response(null, { status: 204 });
		if (!(await rateLimit(env.DB, `click:${await clientKey(request)}`, 60, 3600))) return new Response(null, { status: 204 });
		await env.DB.prepare(
			`INSERT INTO click_events (provider_id, kind, area_slug) SELECT id, ?, ? FROM providers WHERE slug = ?`,
		)
			.bind(kind, area || null, slug)
			.run();
	} catch (e) {
		console.error("click error", e);
	}
	return new Response(null, { status: 204 });
};
