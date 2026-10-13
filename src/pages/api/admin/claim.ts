import type { APIRoute } from "astro";
import { slugify } from "../../../lib/db";
import { clean, redirectTo } from "../../../lib/http";

export const POST: APIRoute = async ({ request, locals }) => {
	const db = locals.runtime.env.DB;
	const f = await request.formData();
	const id = Number(clean(f.get("id"), 20));
	const action = clean(f.get("action"), 10);
	const c = await db.prepare(`SELECT * FROM claim_requests WHERE id = ? AND status = 'pending'`).bind(id).first<any>();
	if (!c) return redirectTo("/admin/");

	if (action === "reject") {
		await db.prepare(`UPDATE claim_requests SET status='rejected' WHERE id=?`).bind(id).run();
		return redirectTo("/admin/");
	}

	let providerId = c.provider_id as number | null;
	if (providerId) {
		// Existing unclaimed profile: mark as claimed and route enquiries to the verified contact.
		await db.prepare(`UPDATE providers SET status='claimed', email=?, phone=COALESCE(phone, ?), updated_at=datetime('now') WHERE id=?`)
			.bind(c.email, c.phone, providerId).run();
	} else {
		let slug = slugify(c.business_name);
		const exists = await db.prepare(`SELECT 1 AS x FROM providers WHERE slug = ?`).bind(slug).first();
		if (exists) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
		const r = await db.prepare(
			`INSERT INTO providers (slug, name, business_name, category, phone, email, licence_no, status, source)
			 VALUES (?,?,?,?,?,?,?, 'claimed', 'self-submitted')`,
		).bind(slug, c.contact_name, c.business_name, c.category, c.phone, c.email, c.licence_no).run();
		providerId = r.meta.last_row_id as number;
	}
	await db.prepare(`UPDATE claim_requests SET status='approved', provider_id=? WHERE id=?`).bind(providerId, id).run();
	// Nepali-speaking and licence badges are NOT auto-applied: verify first, then tick them on the provider page.
	return redirectTo(`/admin/provider/${providerId}/`);
};
