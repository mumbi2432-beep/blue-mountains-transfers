-- LOCAL TESTING ONLY. Fake businesses, flagged is_demo=1 so they never get indexed or sitemapped.
-- Never run this against the production database.
INSERT INTO providers (slug, name, business_name, category, description, phone, email, address_suburb, address_state, nepali_speaking, licence_verified, status, plan, source, is_demo) VALUES
('demo-realty-schofields', 'Demo Agent', 'Demo Realty Schofields', 'nepalese-real-estate-agents', 'Fake demo listing used to test page templates. Not a real business.', '0400 000 001', 'demo1@example.com', 'Schofields', 'NSW', 1, 1, 'claimed', 'standard', 'demo', 1),
('demo-homes-blacktown', 'Demo Two', 'Demo Homes Blacktown', 'nepalese-real-estate-agents', 'Second fake demo listing, free plan, unclaimed.', '0400 000 002', NULL, 'Blacktown', 'NSW', 0, 0, 'unclaimed', 'free', 'demo', 1),
('demo-broker-sydney', 'Demo Broker', 'Demo Finance Sydney', 'nepalese-mortgage-brokers', 'Fake broker serving the whole of Sydney, used to test city-wide matching.', '0400 000 003', 'demo3@example.com', 'Parramatta', 'NSW', 1, 0, 'claimed', 'founding', 'demo', 1);
INSERT INTO provider_areas (provider_id, area_slug, is_top) VALUES
((SELECT id FROM providers WHERE slug='demo-realty-schofields'), 'schofields-nsw', 1),
((SELECT id FROM providers WHERE slug='demo-homes-blacktown'), 'blacktown-lga-nsw', 0),
((SELECT id FROM providers WHERE slug='demo-broker-sydney'), 'city:sydney', 0);
