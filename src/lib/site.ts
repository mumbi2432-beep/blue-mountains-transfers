export const SITE_NAME = "Nepali Property Market";
export const SITE_TAGLINE = "Nepali-speaking property professionals across Australia";
export const SITE_URL = "https://nepalipropertymarket.com.au";

export const PLAN_LABELS: Record<string, string> = {
	free: "Free listing",
	founding: "Founding member",
	standard: "Featured",
};

export const url = (...parts: string[]) =>
	"/" + parts.map((p) => p.replace(/^\/|\/$/g, "")).filter(Boolean).join("/") + "/";

export const absolute = (path: string, base = SITE_URL) => new URL(path, base).toString();

export const pageTitle = (t: string) => `${t} | ${SITE_NAME}`;

// Clean a phone number for tel: / WhatsApp links. Assumes Australian numbers when no country code.
export function digits(phone: string | null | undefined): string {
	return (phone ?? "").replace(/[^\d+]/g, "");
}
export function waLink(phone: string | null | undefined): string | null {
	let d = (phone ?? "").replace(/\D/g, "");
	if (!d) return null;
	if (d.startsWith("0")) d = "61" + d.slice(1);
	return `https://wa.me/${d}`;
}
