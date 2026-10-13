import type { APIRoute } from "astro";
import { categoryBySlug } from "../data/categories";
import { areaBySlug } from "../data/areas";

export const GET: APIRoute = ({ url, redirect }) => {
	const c = categoryBySlug(url.searchParams.get("category") ?? "");
	const a = areaBySlug(url.searchParams.get("area") ?? "");
	if (c && a && a.launch) return redirect(`/${c.slug}/${a.slug}/`, 302);
	return redirect("/", 302);
};
