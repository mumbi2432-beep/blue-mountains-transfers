import type { APIRoute } from "astro";
import { rateLimit } from "../../lib/db";
import { clean, clientKey, isEmail, isPhone, redirectTo } from "../../lib/http";
import { sendMail } from "../../lib/mail";

export const POST: APIRoute = async ({ request, locals }) => {
	const env = locals.runtime.env;
	const form = await request.formData();
	if (clean(form.get("website_url"))) return redirectTo("/thanks/?t=claim");

	if (!(await rateLimit(env.DB, `claim:${await clientKey(request)}`, 5, 3600))) return redirectTo("/thanks/?t=limit");

	const slug = clean(form.get("provider"), 100);
	const businessName = clean(form.get("business_name"), 150);
	const contactName = clean(form.get("contact_name"), 100);
	const phone = clean(form.get("phone"), 30);
	const email = clean(form.get("email"), 120);
	const category = clean(form.get("category"), 80);
	const areas = clean(form.get("areas"), 500);
	const licence = clean(form.get("licence_no"), 60);
	const notes = clean(form.get("notes"), 1000);
	const speaks = form.get("speaks_nepali") ? 1 : 0;
	const back = slug ? `/claim/${encodeURIComponent(slug)}/` : "/list-your-business/";

	if (!businessName || !contactName || !isPhone(phone) || !isEmail(email) || !form.get("consent")) {
		return redirectTo(`${back}?error=1#apply`);
	}

	let providerId: number | null = null;
	if (slug) {
		const p = await env.DB.prepare(`SELECT id FROM providers WHERE slug = ?`).bind(slug).first<{ id: number }>();
		providerId = p?.id ?? null;
	}
	await env.DB.prepare(
		`INSERT INTO claim_requests (provider_id, business_name, contact_name, phone, email, category, areas, licence_no, speaks_nepali, notes)
		 VALUES (?,?,?,?,?,?,?,?,?,?)`,
	)
		.bind(providerId, businessName, contactName, phone, email, category || null, areas || null, licence || null, speaks, notes || null)
		.run();

	await sendMail(env, {
		to: env.ADMIN_NOTIFY_EMAIL,
		subject: `New ${providerId ? "claim" : "listing"} request: ${businessName}`,
		text: `Business: ${businessName}\nContact: ${contactName}\nPhone: ${phone}\nEmail: ${email}\nCategory: ${category}\nAreas: ${areas}\nLicence: ${licence}\nSpeaks Nepali: ${speaks ? "yes (self-declared)" : "no"}\nNotes: ${notes}\n\nReview at /admin/`,
		replyTo: email,
	});
	return redirectTo("/thanks/?t=claim");
};
