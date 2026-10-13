import type { APIRoute } from "astro";
import { categoryBySlug } from "../../../data/categories";
import { areaBySlug } from "../../../data/areas";
import { slugify } from "../../../lib/db";
import { clean, redirectTo } from "../../../lib/http";

const opt = (v: string) => (v ? v : null);

export const POST: APIRoute = async ({ request, locals }) => {
	const db = locals.runtime.env.DB;
	const f = await request.formData();
	const idRaw = clean(f.get("id"), 20);
	const name = clean(f.get("name"), 150);
	const category = clean(f.get("category"), 80);
	if (!name || !categoryBySlug(category)) return new Response("name and valid category required", { status: 400 });

	const plan = ["free", "founding", "standard"].includes(clean(f.get("plan"))) ? clean(f.get("plan")) : "free";
	const status = ["unclaimed", "claimed", "suspended"].includes(clean(f.get("status"))) ? clean(f.get("status")) : "unclaimed";
	const vals = [
		name, category, opt(clean(f.get("business_name"), 150)), opt(clean(f.get("licence_no"), 60)), opt(clean(f.get("abn"), 20)),
		opt(clean(f.get("description"), 2000)), opt(clean(f.get("phone"), 30)), opt(clean(f.get("whatsapp"), 30)),
		opt(clean(f.get("email"), 120)), opt(clean(f.get("website"), 200)), opt(clean(f.get("address_suburb"), 80)),
		opt(clean(f.get("address_state"), 5)), f.get("nepali_speaking") ? 1 : 0, f.get("licence_verified") ? 1 : 0,
		status, plan, opt(clean(f.get("plan_expires_at"), 30)), opt(clean(f.get("source"), 200)),
	];

	let id: number;
	if (idRaw && idRaw !== "new") {
		id = Number(idRaw);
		await db.prepare(
			`UPDATE providers SET name=?, category=?, business_name=?, licence_no=?, abn=?, description=?, phone=?, whatsapp=?, email=?,
			 website=?, address_suburb=?, address_state=?, nepali_speaking=?, licence_verified=?, status=?, plan=?, plan_expires_at=?, source=?,
			 updated_at=datetime('now') WHERE id=?`,
		).bind(...vals, id).run();
	} else {
		let slug = slugify(`${clean(f.get("business_name"), 150) || name}-${clean(f.get("address_suburb"), 80)}`);
		const exists = await db.prepare(`SELECT 1 AS x FROM providers WHERE slug = ?`).bind(slug).first();
		if (exists) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
		const r = await db.prepare(
			`INSERT INTO providers (name, category, business_name, licence_no, abn, description, phone, whatsapp, email, website,
			 address_suburb, address_state, nepali_speaking, licence_verified, status, plan, plan_expires_at, source, slug)
			 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
		).bind(...vals, slug).run();
		id = r.meta.last_row_id as number;
	}

	// Areas + exclusive top slots
	const areas = f.getAll("areas").map(String).filter((a) => a.startsWith("city:") || areaBySlug(a));
	const tops = new Set(f.getAll("top").map(String));
	await db.prepare(`DELETE FROM provider_areas WHERE provider_id = ?`).bind(id).run();
	for (const a of areas) {
		const isTop = tops.has(a) ? 1 : 0;
		if (isTop) {
			// only one top slot per category + area
			await db.prepare(
				`UPDATE provider_areas SET is_top = 0 WHERE area_slug = ? AND provider_id IN (SELECT id FROM providers WHERE category = ? AND id != ?)`,
			).bind(a, category, id).run();
		}
		await db.prepare(`INSERT INTO provider_areas (provider_id, area_slug, is_top) VALUES (?,?,?)`).bind(id, a, isTop).run();
	}
	return redirectTo(`/admin/provider/${id}/?saved=1`);
};
