-- Prevents sending the same provider the same month's report twice.
CREATE TABLE report_log (
	provider_id INTEGER NOT NULL REFERENCES providers(id),
	month TEXT NOT NULL,            -- 'YYYY-MM' the report was sent in
	sent_at TEXT NOT NULL DEFAULT (datetime('now')),
	PRIMARY KEY (provider_id, month)
);
