-- Providers: one row per business/person listed in the directory.
CREATE TABLE providers (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	slug TEXT NOT NULL UNIQUE,
	name TEXT NOT NULL,
	category TEXT NOT NULL,                -- category slug (see src/data/categories.ts)
	business_name TEXT,
	licence_no TEXT,                       -- e.g. NSW Fair Trading licence number
	abn TEXT,
	description TEXT,
	phone TEXT,
	whatsapp TEXT,
	email TEXT,                            -- lead notification address (never shown publicly)
	website TEXT,
	address_suburb TEXT,                   -- where the office is
	address_state TEXT,
	-- Trust signals. Only set to 1 when actually verified.
	nepali_speaking INTEGER NOT NULL DEFAULT 0,
	licence_verified INTEGER NOT NULL DEFAULT 0,
	-- Lifecycle: unclaimed (seeded from public data) -> claimed -> paid
	status TEXT NOT NULL DEFAULT 'unclaimed' CHECK (status IN ('unclaimed','claimed','suspended')),
	plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','founding','standard')),
	plan_expires_at TEXT,
	source TEXT,                           -- where the data came from (audit trail)
	is_demo INTEGER NOT NULL DEFAULT 0,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_providers_category ON providers(category);

-- Which areas (suburb/LGA slugs from src/data/areas.ts) a provider serves.
-- is_top = the exclusive top slot for that category+area (sold by admin).
CREATE TABLE provider_areas (
	provider_id INTEGER NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
	area_slug TEXT NOT NULL,
	is_top INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY (provider_id, area_slug)
);
CREATE INDEX idx_provider_areas_area ON provider_areas(area_slug);
-- Only one top slot per category+area is enforced in application code (admin action).

CREATE TABLE leads (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	provider_id INTEGER NOT NULL REFERENCES providers(id),
	area_slug TEXT,
	name TEXT NOT NULL,
	phone TEXT,
	email TEXT,
	message TEXT,
	source_page TEXT,
	emailed INTEGER NOT NULL DEFAULT 0,
	created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_leads_provider ON leads(provider_id, created_at);

-- Click-to-call / WhatsApp / website clicks, for the monthly provider report.
CREATE TABLE click_events (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	provider_id INTEGER NOT NULL REFERENCES providers(id),
	kind TEXT NOT NULL CHECK (kind IN ('call','whatsapp','website')),
	area_slug TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_clicks_provider ON click_events(provider_id, created_at);

-- Page views per provider profile (cheap counter, one row per provider per day).
CREATE TABLE provider_views (
	provider_id INTEGER NOT NULL REFERENCES providers(id),
	day TEXT NOT NULL,
	views INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY (provider_id, day)
);

-- Requests from providers to claim an unclaimed profile, or to join as new.
CREATE TABLE claim_requests (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	provider_id INTEGER REFERENCES providers(id),   -- null = new business not yet listed
	business_name TEXT NOT NULL,
	contact_name TEXT NOT NULL,
	phone TEXT NOT NULL,
	email TEXT NOT NULL,
	category TEXT,
	areas TEXT,
	licence_no TEXT,
	speaks_nepali INTEGER NOT NULL DEFAULT 0,
	notes TEXT,
	status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
	created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Very small rate-limit table (per IP hash per action per hour bucket).
CREATE TABLE rate_limits (
	key TEXT PRIMARY KEY,
	count INTEGER NOT NULL DEFAULT 0,
	expires_at INTEGER NOT NULL
);
-- Prevents sending the same provider the same month's report twice.
CREATE TABLE report_log (
	provider_id INTEGER NOT NULL REFERENCES providers(id),
	month TEXT NOT NULL,            -- 'YYYY-MM' the report was sent in
	sent_at TEXT NOT NULL DEFAULT (datetime('now')),
	PRIMARY KEY (provider_id, month)
);
