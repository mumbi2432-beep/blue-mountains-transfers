import type { APIRoute } from "astro";
import { categoryBySlug } from "../../data/categories";
import { rateLimit } from "../../lib/db";
import { clean, clientKey, isEmail, isPhone, redirectTo } from "../../lib/http";
import { sendMail } from "../../lib/mail";

export const POST: APIRoute = async ({ request, locals }) => {
	const env = locals.runtime.env;
	const form = await request.formData();

	// Honeypot: bots fill the hidden field. Pretend success.
	if (clean(form.get("website_url"))) return redirectTo("/thanks/?t=lead");

	const key = await clientKey(request);
	if (!(await rateLimit(env.DB, `lead:${key}`, 5, 3600))) return redirectTo("/thanks/?t=limit");

	const slug = clean(form.get("provider"), 100);
	const name = clean(form.get("name"), 100);
	const phone = clean(form.get("phone"), 30);
	const email = clean(form.get("email"), 120);
	const message = clean(form.get("message"), 1500);
	const area = clean(form.get("area"), 80);
	const consent = form.get("consent");
	const back = `/provider/${encodeURIComponent(slug)}/`;

	if (!name || !consent || (!phone && !email) || (phone && !isPhone(phone)) || (email && !isEmail(email))) {
		return redirectTo(`${back}?error=1#enquire`);
	}

	const p = await env.DB.prepare(`SELECT id, name, business_name, email, category, status FROM providers WHERE slug = ? AND status != 'suspended'`)
		.bind(slug)
		.first<{ id: number; name: string; business_name: string | null; email: string | null; category: string; status: string }>();
	if (!p) return redirectTo("/");

	const source = request.headers.get("referer") ?? "";
	const ins = await env.DB.prepare(
		`INSERT INTO leads (provider_id, area_slug, name, phone, email, message, source_page) VALUES (?,?,?,?,?,?,?)`,
	)
		.bind(p.id, area || null, name, phone || null, email || null, message || null, source.slice(0, 300))
		.run();

	const display = p.business_name || p.name;
	const cat = categoryBySlug(p.category);
	const body = [
		`New enquiry from Nepali Property Market for ${display}${cat ? ` (${cat.name})` : ""}.`,
		"",
		`Name: ${name}`,
		phone ? `Mobile: ${phone}` : "",
		email ? `Email: ${email}` : "",
		area ? `Area: ${area}` : "",
		"",
		message || "(no message)",
		"",
		"Please reply to the enquirer directly and promptly. Fast replies win these leads.",
	].filter((l) => l !== "").join("\n");

	let delivered = false;
	if (p.email) {
		delivered = await sendMail(env, { to: p.email, subject: `New enquiry from ${name} via Nepali Property Market`, text: body, replyTo: email || undefined });
	}
	// Always copy the admin, and cover providers without an email on file.
	await sendMail(env, {
		to: env.ADMIN_NOTIFY_EMAIL,
		subject: `[lead ${p.email ? (delivered ? "delivered" : "FAILED") : "no provider email"}] ${display}`,
		text: body,
		replyTo: email || undefined,
	});
	if (delivered) await env.DB.prepare(`UPDATE leads SET emailed = 1 WHERE id = ?`).bind(ins.meta.last_row_id).run();

	return redirectTo(`/thanks/?t=lead&p=${encodeURIComponent(slug)}`);
};
