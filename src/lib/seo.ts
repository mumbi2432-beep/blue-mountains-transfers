import type { Provider } from "./db";
import { SITE_NAME, absolute } from "./site";
import type { Category } from "../data/categories";
import type { Area } from "../data/areas";
import { STATE_NAMES } from "../data/areas";

const TYPE_BY_CATEGORY: Record<string, string> = {
	"nepalese-real-estate-agents": "RealEstateAgent",
	"nepalese-buyers-agents": "RealEstateAgent",
	"nepalese-mortgage-brokers": "FinancialService",
	"nepalese-conveyancers": "LegalService",
	"nepalese-accountants": "AccountingService",
	"nepalese-building-pest-inspectors": "ProfessionalService",
};

export function breadcrumbLd(items: { name: string; path: string }[], base?: string) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((it, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: it.name,
			item: absolute(it.path, base),
		})),
	};
}

export function faqLd(faqs: { q: string; a: string }[]) {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((f) => ({
			"@type": "Question",
			name: f.q,
			acceptedAnswer: { "@type": "Answer", text: f.a },
		})),
	};
}

export function providerLd(p: Provider, areas: Area[], base?: string) {
	const ld: Record<string, unknown> = {
		"@context": "https://schema.org",
		"@type": TYPE_BY_CATEGORY[p.category] ?? "ProfessionalService",
		name: p.business_name || p.name,
		url: absolute(`/provider/${p.slug}/`, base),
	};
	if (p.description) ld.description = p.description;
	if (p.phone) ld.telephone = p.phone;
	if (p.website) ld.sameAs = [p.website];
	if (p.address_suburb) {
		ld.address = {
			"@type": "PostalAddress",
			addressLocality: p.address_suburb,
			addressRegion: p.address_state ?? undefined,
			addressCountry: "AU",
		};
	}
	if (p.nepali_speaking) ld.knowsLanguage = ["en", "ne"];
	if (areas.length) ld.areaServed = areas.map((a) => ({ "@type": "AdministrativeArea", name: `${a.name}, ${a.state}` }));
	return ld; // deliberately no ratings: we do not collect reviews
}

export function itemListLd(items: { name: string; path: string }[], base?: string) {
	return {
		"@context": "https://schema.org",
		"@type": "ItemList",
		itemListElement: items.map((it, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: it.name,
			url: absolute(it.path, base),
		})),
	};
}

export function areaTitle(cat: Category, area: Area) {
	return `${cat.plural.replace(/ and /g, " & ")} - Nepali-speaking in ${area.name}, ${area.state}`;
}

export function areaDescription(cat: Category, area: Area, n: number) {
	const base = `Find Nepali-speaking ${cat.plural.toLowerCase()} in ${area.name}, ${STATE_NAMES[area.state]}.`;
	return n > 0
		? `${base} Compare ${n} listed ${n === 1 ? "professional" : "professionals"} and send a free enquiry.`
		: `${base} Listings are opening soon. Providers can get listed free.`;
}

export const SITE_JSON_LD = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: SITE_NAME,
	url: "https://nepalipropertymarket.com.au/",
};
