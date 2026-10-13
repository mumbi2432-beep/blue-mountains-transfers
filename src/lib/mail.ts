// Sends mail through Resend (https://resend.com). If no API key is configured the message is only logged,
// so local development and early testing work without an email account.
export async function sendMail(
	env: { RESEND_API_KEY?: string; MAIL_FROM: string },
	opts: { to: string; subject: string; text: string; replyTo?: string },
): Promise<boolean> {
	if (!env.RESEND_API_KEY) {
		console.log("[mail:dry-run]", opts.to, opts.subject);
		return false;
	}
	try {
		const res = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
			body: JSON.stringify({
				from: env.MAIL_FROM,
				to: [opts.to],
				subject: opts.subject,
				text: opts.text,
				...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
			}),
		});
		if (!res.ok) console.error("[mail] failed", res.status, await res.text());
		return res.ok;
	} catch (e) {
		console.error("[mail] error", e);
		return false;
	}
}
