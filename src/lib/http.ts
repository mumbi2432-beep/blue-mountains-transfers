export async function clientKey(request: Request): Promise<string> {
	const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "local";
	const data = new TextEncoder().encode(ip);
	const hash = await crypto.subtle.digest("SHA-256", data);
	return [...new Uint8Array(hash)].slice(0, 8).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const clean = (v: FormDataEntryValue | null, max = 200): string =>
	typeof v === "string" ? v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, max) : "";

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
export const isPhone = (s: string) => {
	const d = s.replace(/\D/g, "");
	return d.length >= 8 && d.length <= 15;
};

export function redirectTo(path: string) {
	return new Response(null, { status: 303, headers: { Location: path } });
}
