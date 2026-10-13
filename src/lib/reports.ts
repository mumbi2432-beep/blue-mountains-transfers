import type { Provider } from "./db";
import { PLAN_LABELS } from "./site";
import { sendMail } from "./mail";

export interface ProviderStats {
	id: number;
	slug: string;
	label: string;
	email: string | null;
	plan: Provider["plan"];
	views: number;
	calls: number;
	whatsapp: number;
	websites: number;
	leads: number;
	already_sent: number;
}

/** Stats for every claimed (non-demo) provider over the last `days` days. */
export async function providerStats(db: D1Database, days = 30): Promise<ProviderStats[]> {
	const since = `-${Math.max(1, Math.floor(days))} days`;
	const month = new Date().toISOString().slice(0, 7);
	const { results } = await db
		.prepare(
			`SELECT p.id, p.slug, coalesce(p.business_name, p.name) AS label, p.email, p.plan,
			  coalesce((SELECT SUM(views) FROM provider_views v WHERE v.provider_id = p.id AND v.day >= date('now', ?)), 0) AS views,
			  (SELECT COUNT(*) FROM click_events c WHERE c.provider_id = p.id AND c.kind = 'call' AND c.created_at >= datetime('now', ?)) AS calls,
			  (SELECT COUNT(*) FROM click_events c WHERE c.provider_id = p.id AND c.kind = 'whatsapp' AND c.created_at >= datetime('now', ?)) AS whatsapp,
			  (SELECT COUNT(*) FROM click_events c WHERE c.provider_id = p.id AND c.kind = 'website' AND c.created_at >= datetime('now', ?)) AS websites,
			  (SELECT COUNT(*) FROM leads l WHERE l.provider_id = p.id AND l.created_at >= datetime('now', ?)) AS leads,
			  (SELECT COUNT(*) FROM report_log r WHERE r.provider_id = p.id AND r.month = ?) AS already_sent
			 FROM providers p
			 WHERE p.status = 'claimed' AND p.is_demo = 0
			 ORDER BY p.plan != 'free' DESC, p.id`,
		)
		.bind(since, since, since, since, since, month)
		.all<ProviderStats>();
	return results ?? [];
}

export function reportText(s: ProviderStats, days: number, siteUrl: string): string {
	const paid = s.plan !== "free";
	const lines = [
		`Hi ${s.label},`,
		"",
		`Here is how your Nepali Property Market profile performed in the last ${days} days:`,
		"",
		`  Profile views:      ${s.views}`,
		`  Enquiries received: ${s.leads}`,
		`  Call taps:          ${s.calls}`,
		`  WhatsApp taps:      ${s.whatsapp}`,
		`  Website clicks:     ${s.websites}`,
		"",
		`Your plan: ${PLAN_LABELS[s.plan] ?? s.plan}.`,
		"",
	];
	if (!paid) {
		lines.push(
			"Featured businesses appear above free listings and can hold the exclusive top spot in their area.",
			`Reply to this email to upgrade, or see ${siteUrl}/list-your-business/.`,
			"",
		);
	} else {
		lines.push("Fast replies win these enquiries. If you have not yet responded to a recent enquiry, now is a good time.", "");
	}
	lines.push(`Your profile: ${siteUrl}/provider/${s.slug}/`, "", "Nepali Property Market", "Reply to this email if you want fewer or no reports.");
	return lines.join("\n");
}

export async function sendReports(
	env: Env,
	opts: { days?: number; force?: boolean } = {},
): Promise<{ configured: boolean; sent: number; skipped: number; failed: number }> {
	const days = opts.days ?? 30;
	const configured = !!env.RESEND_API_KEY;
	const month = new Date().toISOString().slice(0, 7);
	let sent = 0, skipped = 0, failed = 0;
	if (!configured) return { configured, sent, skipped, failed };

	for (const s of await providerStats(env.DB, days)) {
		if (!s.email || (s.already_sent && !opts.force)) { skipped++; continue; }
		const ok = await sendMail(env, {
			to: s.email,
			subject: `Your Nepali Property Market results: ${s.leads} enquiries, ${s.views} views`,
			text: reportText(s, days, env.SITE_URL),
			replyTo: env.ADMIN_NOTIFY_EMAIL,
		});
		if (ok) {
			sent++;
			await env.DB.prepare(`INSERT OR REPLACE INTO report_log (provider_id, month) VALUES (?, ?)`).bind(s.id, month).run();
		} else failed++;
	}
	return { configured, sent, skipped, failed };
}
