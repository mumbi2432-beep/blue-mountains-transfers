import { defineMiddleware } from "astro:middleware";

const PUBLIC_CACHE = "public, max-age=0, s-maxage=900, stale-while-revalidate=3600";

function safeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}

export const onRequest = defineMiddleware(async (ctx, next) => {
	const path = ctx.url.pathname;
	const isAdmin = path.startsWith("/admin") || path.startsWith("/api/admin");

	if (isAdmin) {
		const pw = ctx.locals.runtime?.env?.ADMIN_PASSWORD;
		if (!pw) return new Response("Admin is disabled: set the ADMIN_PASSWORD secret.", { status: 503 });
		const header = ctx.request.headers.get("authorization") ?? "";
		let ok = false;
		if (header.startsWith("Basic ")) {
			try {
				const decoded = atob(header.slice(6));
				const supplied = decoded.slice(decoded.indexOf(":") + 1);
				ok = safeEqual(supplied, pw);
			} catch {}
		}
		if (!ok) {
			return new Response("Authentication required", {
				status: 401,
				headers: { "WWW-Authenticate": 'Basic realm="Admin", charset="UTF-8"', "Cache-Control": "no-store" },
			});
		}
	}

	const res = await next();
	const headers = new Headers(res.headers);
	headers.set("X-Content-Type-Options", "nosniff");
	headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	headers.set("X-Frame-Options", "SAMEORIGIN");

	if (isAdmin || path.startsWith("/api/")) {
		headers.set("Cache-Control", "no-store");
		headers.set("X-Robots-Tag", "noindex, nofollow");
	} else if (ctx.request.method === "GET" && res.status === 200 && !headers.has("Cache-Control")) {
		const ct = headers.get("content-type") ?? "";
		if (ct.includes("text/html") || ct.includes("xml") || ct.includes("text/plain")) headers.set("Cache-Control", PUBLIC_CACHE);
	}
	return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
});
