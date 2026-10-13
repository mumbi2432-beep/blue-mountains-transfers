/// <reference path="../.astro/types.d.ts" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
	interface Locals extends Runtime {}
}

interface Env {
	DB: D1Database;
	ASSETS: Fetcher;
	SITE_URL: string;
	MAIL_FROM: string;
	ADMIN_NOTIFY_EMAIL: string;
	// secrets (wrangler secret put ...)
	ADMIN_PASSWORD?: string;
	RESEND_API_KEY?: string;
}
