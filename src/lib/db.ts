import type { Area } from "../data/areas";
import { areaBySlug } from "../data/areas";

export interface Provider {
	id: number;
	slug: string;
	name: string;
	category: string;
	business_name: string | null;
	licence_no: string | null;
	abn: string | null;
	description: string | null;
	phone: string | null;
	whatsapp: string | null;
	email: string | null;
	website: string | null;
	address_suburb: string | null;
	address_state: string | null;
	nepali_speaking: number;
	licence_verified: number;
	status: "unclaimed" | "claimed" | "suspended";
	plan: "free" | "founding" | "standard";
	plan_expires_at: string | null;
	source: string | null;
	is_demo: number;
	created_at: string;
	// computed
	is_paid?: number;
	is_top?: number;
}

const PAID_SQL = `(p.plan != 'free' AND (p.plan_expires_at IS NULL OR p.plan_expires_at > datetime('now')))`;

/** Area keys a provider can be attached to for a page about `area`. */
function areaKeys(area: Area): string[] {
	return [area.slug, ...(area.lga ? [area.lga] : []), `city:${area.city.toLowerCase()}`];
}

/** Providers shown on a category + area page, best first. */
export async function providersForArea(db: D1Database, category: string, area: Area): Promise<Provider[]> {
	const keys = areaKeys(area);
	const ph = keys.map(() => "?").join(",");
	const { results } = await db
		.prepare(
			`SELECT p.*, ${PAID_SQL} AS is_paid,
			   MAX(CASE WHEN pa.area_slug = ? THEN pa.is_top ELSE 0 END) AS is_top
			 FROM providers p
			 JOIN provider_areas pa ON pa.provider_id = p.id
			 WHERE p.category = ? AND p.status != 'suspended' AND pa.area_slug IN (${ph})
			 GROUP BY p.id
			 ORDER BY is_top DESC, is_paid DESC, p.nepali_speaking DESC, p.licence_verified DESC, p.name ASC`,
		)
		.bind(area.slug, category, ...keys)
		.all<Provider>();
	return results ?? [];
}

/** Count of real (non-demo) providers per category for an area; drives the indexing rule. */
export async function realProviderCount(db: D1Database, category: string, area: Area): Promise<number> {
	const keys = areaKeys(area);
	const ph = keys.map(() => "?").join(",");
	const row = await db
		.prepare(
			`SELECT COUNT(DISTINCT p.id) AS n FROM providers p
			 JOIN provider_areas pa ON pa.provider_id = p.id
			 WHERE p.category = ? AND p.status != 'suspended' AND p.is_demo = 0 AND pa.area_slug IN (${ph})`,
		)
		.bind(category, ...keys)
		.first<{ n: number }>();
	return row?.n ?? 0;
}

/** For hub pages: provider counts keyed `${category}|${areaSlug}` (direct area attachments only). */
export async function countsByCategoryArea(db: D1Database): Promise<Record<string, number>> {
	const { results } = await db
		.prepare(
			`SELECT p.category AS category, pa.area_slug AS area, COUNT(DISTINCT p.id) AS n
			 FROM providers p JOIN provider_areas pa ON pa.provider_id = p.id
			 WHERE p.status != 'suspended' AND p.is_demo = 0 GROUP BY p.category, pa.area_slug`,
		)
		.all<{ category: string; area: string; n: number }>();
	const out: Record<string, number> = {};
	for (const r of results ?? []) out[`${r.category}|${r.area}`] = r.n;
	return out;
}

export async function providerBySlug(db: D1Database, slug: string): Promise<Provider | null> {
	return db
		.prepare(`SELECT p.*, ${PAID_SQL} AS is_paid FROM providers p WHERE p.slug = ? AND p.status != 'suspended'`)
		.bind(slug)
		.first<Provider>();
}

export async function areaSlugsForProvider(db: D1Database, providerId: number) {
	const { results } = await db
		.prepare(`SELECT area_slug, is_top FROM provider_areas WHERE provider_id = ?`)
		.bind(providerId)
		.all<{ area_slug: string; is_top: number }>();
	return results ?? [];
}

export function areaLabel(slug: string): string {
	if (slug.startsWith("city:")) {
		const c = slug.slice(5);
		return c.charAt(0).toUpperCase() + c.slice(1) + " (whole city)";
	}
	return areaBySlug(slug)?.name ?? slug;
}

export async function recordView(db: D1Database, providerId: number) {
	await db
		.prepare(
			`INSERT INTO provider_views (provider_id, day, views) VALUES (?, date('now'), 1)
			 ON CONFLICT(provider_id, day) DO UPDATE SET views = views + 1`,
		)
		.bind(providerId)
		.run();
}

/** Allow `limit` actions per `windowSec` per key. Returns true when allowed. */
export async function rateLimit(db: D1Database, key: string, limit: number, windowSec: number): Promise<boolean> {
	const now = Math.floor(Date.now() / 1000);
	const bucket = Math.floor(now / windowSec);
	const k = `${key}:${bucket}`;
	await db.prepare(`DELETE FROM rate_limits WHERE expires_at < ?`).bind(now).run();
	await db
		.prepare(
			`INSERT INTO rate_limits (key, count, expires_at) VALUES (?, 1, ?)
			 ON CONFLICT(key) DO UPDATE SET count = count + 1`,
		)
		.bind(k, (bucket + 1) * windowSec + 60)
		.run();
	const row = await db.prepare(`SELECT count FROM rate_limits WHERE key = ?`).bind(k).first<{ count: number }>();
	return (row?.count ?? 0) <= limit;
}

export function slugify(s: string): string {
	return s
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 80);
}
