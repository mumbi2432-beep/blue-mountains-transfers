import type { APIRoute } from "astro";
import { sendReports } from "../../../lib/reports";
import { redirectTo } from "../../../lib/http";

// Admin-only (middleware enforces Basic auth). Trigger from the admin screen, or monthly from a free cron service:
//   curl -u admin:PASSWORD -X POST -H "Content-Type: application/json" -d '{}' https://nepalipropertymarket.com.au/api/admin/send-reports/
export const POST: APIRoute = async ({ request, locals }) => {
	const result = await sendReports(locals.runtime.env);
	const isJson = (request.headers.get("content-type") ?? "").includes("json");
	if (isJson) return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
	const q = new URLSearchParams({ sent: String(result.sent), skipped: String(result.skipped), failed: String(result.failed), configured: result.configured ? "1" : "0" });
	return redirectTo(`/admin/?${q}#reports`);
};
