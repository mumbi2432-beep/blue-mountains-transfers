// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	site: "https://nepalipropertymarket.com.au",
	output: "server",
	trailingSlash: "always",
	build: { format: "directory" },
	adapter: cloudflare({
		platformProxy: { enabled: true },
	}),
});
