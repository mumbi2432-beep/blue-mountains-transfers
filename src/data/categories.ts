// Provider categories. Slug doubles as the URL segment and the DB `category` value.
// `scope` decides how the exclusive top slot is sold: per suburb ("local") or per city/LGA ("wide").

export interface Category {
	slug: string;
	name: string; // singular, e.g. "Real estate agent"
	plural: string; // "Real estate agents"
	short: string; // used in cards
	scope: "local" | "wide";
	registerName: string; // where users can verify a provider
	registerUrl: string;
	intro: (area: string) => string;
	why: string; // why speaking Nepali matters for this service
	checklist: string[]; // what to look for / ask
	faqs: (area: string) => { q: string; a: string }[];
}

export const CATEGORIES: Category[] = [
	{
		slug: "nepalese-real-estate-agents",
		name: "Real estate agent",
		plural: "Real estate agents",
		short: "Buying, selling and property management",
		scope: "local",
		registerName: "your state's licensing register (e.g. NSW Fair Trading)",
		registerUrl: "https://www.fairtrading.nsw.gov.au/help-centre/online-tools/public-registers",
		intro: (area) =>
			`Looking to buy, sell or rent a home in ${area}? These real estate agents work with the Nepali community and can talk you through the process in Nepali or English.`,
		why: "Property is likely the biggest purchase of your life. Being able to ask questions in your own language, and having an agent who understands the community, can make the process far less stressful.",
		checklist: [
			"Ask for their current real estate licence or certificate of registration and check it on the state register.",
			"Ask how many properties they have sold or leased in the suburb in the last 12 months.",
			"Ask what their fees and marketing costs are, in writing, before you sign an agency agreement.",
			"Ask whether they can also help with property management after you buy.",
		],
		faqs: (area) => [
			{
				q: `How do I find a Nepali-speaking real estate agent in ${area}?`,
				a: `Browse the agents listed on this page. Profiles marked "Nepali-speaking" have told us (or shown on their own website) that they can assist in Nepali. You can send an enquiry directly from each profile.`,
			},
			{
				q: "Is it free to contact an agent through this site?",
				a: "Yes. Sending an enquiry to a listed agent costs you nothing and does not oblige you to use them.",
			},
			{
				q: "How can I check an agent is properly licensed?",
				a: "Every state runs a public register of licensed agents. Look up the agent's name or licence number before you sign anything.",
			},
		],
	},
	{
		slug: "nepalese-mortgage-brokers",
		name: "Mortgage broker",
		plural: "Mortgage brokers",
		short: "Home loans and refinancing",
		scope: "wide",
		registerName: "the ASIC Professional Registers",
		registerUrl: "https://services.asic.gov.au/professional-registers/",
		intro: (area) =>
			`Need a home loan or want to refinance in ${area}? These mortgage and finance brokers understand how Nepali families earn, save and borrow, and can explain your options in Nepali or English.`,
		why: "Lenders look at visa status, overseas income and savings history differently. A broker who regularly works with Nepali clients knows which lenders to approach and how to present your application.",
		checklist: [
			"Ask for their Australian Credit Licence (or the licence of the group they are authorised under) and verify it with ASIC.",
			"Ask how many lenders are on their panel and how they are paid.",
			"Ask for a written comparison, not just a single recommendation.",
			"Ask about their experience with your visa or income situation.",
		],
		faqs: (area) => [
			{
				q: `Can a mortgage broker in ${area} help if I am on a temporary visa?`,
				a: "Some lenders do lend to temporary visa holders, with different deposit and documentation requirements. An experienced broker can tell you which ones, but you should confirm current policy directly.",
			},
			{
				q: "Do I pay a mortgage broker?",
				a: "Most brokers are paid commission by the lender, though some also charge a fee. Always ask how your broker is paid before you proceed.",
			},
			{
				q: "How do I check a broker is licensed?",
				a: "Search the ASIC Professional Registers for the broker or their credit licensee.",
			},
		],
	},
	{
		slug: "nepalese-conveyancers",
		name: "Conveyancer or property solicitor",
		plural: "Conveyancers and property solicitors",
		short: "Contracts, settlement and legal checks",
		scope: "wide",
		registerName: "your state's conveyancer or law society register",
		registerUrl: "https://www.fairtrading.nsw.gov.au/help-centre/online-tools/public-registers",
		intro: (area) =>
			`Buying or selling property in ${area}? These conveyancers and property solicitors can review your contract and manage settlement, and some can do it in Nepali.`,
		why: "A property contract is a binding legal document. Understanding every clause in your own language lowers the risk of costly misunderstandings.",
		checklist: [
			"Confirm they are a licensed conveyancer or a practising solicitor in your state.",
			"Ask for a fixed quote that lists searches, disbursements and fees.",
			"Ask how quickly they review contracts, since many sales move fast.",
			"Ask whether they have professional indemnity insurance.",
		],
		faqs: (area) => [
			{
				q: `Do I need a conveyancer or solicitor to buy property in ${area}?`,
				a: "You are not generally required to use one, but most buyers and sellers do, because the contract and settlement process is complex.",
			},
			{
				q: "What is the difference between a conveyancer and a solicitor?",
				a: "Both can handle the property transfer. A solicitor can also give broader legal advice if something goes wrong. Ask which suits your situation.",
			},
		],
	},
	{
		slug: "nepalese-accountants",
		name: "Accountant or tax agent",
		plural: "Accountants and tax agents",
		short: "Tax returns, investors and business structures",
		scope: "wide",
		registerName: "the Tax Practitioners Board register",
		registerUrl: "https://www.tpb.gov.au/public-register",
		intro: (area) =>
			`Need an accountant or registered tax agent in ${area}? These professionals help Nepali individuals, investors and business owners with tax returns, property investment structures and more.`,
		why: "Tax rules for new arrivals, overseas income and property investors are specific. An accountant who regularly works with the community can save you from common mistakes.",
		checklist: [
			"Check they are registered with the Tax Practitioners Board.",
			"Ask what experience they have with property investors and overseas income.",
			"Ask for a clear fee schedule before work starts.",
			"Ask how they communicate (phone, WhatsApp, email) and how fast they respond.",
		],
		faqs: (area) => [
			{
				q: `How do I find a registered tax agent in ${area}?`,
				a: "Use the listings on this page, then confirm the agent's registration on the Tax Practitioners Board public register.",
			},
			{
				q: "Can an accountant help with buying an investment property?",
				a: "Yes. Many accountants advise on ownership structure and tax treatment before you buy. Speak to one before you sign a contract.",
			},
		],
	},
	{
		slug: "nepalese-buyers-agents",
		name: "Buyer's agent",
		plural: "Buyers' agents",
		short: "Find and negotiate property for you",
		scope: "wide",
		registerName: "your state's licensing register",
		registerUrl: "https://www.fairtrading.nsw.gov.au/help-centre/online-tools/public-registers",
		intro: (area) =>
			`Want an expert on your side when buying in ${area}? Buyers' agents search for properties, assess them and negotiate for you, and these ones can work with you in Nepali or English.`,
		why: "A buyer's agent works only for the buyer. For first-home buyers and interstate or overseas investors, local knowledge and negotiation skill can be worth the fee.",
		checklist: [
			"Confirm they hold the correct licence for acting as a buyer's agent in your state.",
			"Ask whether they take any commission from selling agents or developers.",
			"Ask for a written fee structure, including success fees.",
			"Ask for examples of recent purchases similar to yours.",
		],
		faqs: (area) => [
			{
				q: `What does a buyer's agent do in ${area}?`,
				a: "They search for suitable properties, check them, advise on price and negotiate or bid at auction on your behalf.",
			},
			{
				q: "How are buyers' agents paid?",
				a: "Usually a fixed fee, a percentage of the purchase price, or a mix. Ask for it in writing.",
			},
		],
	},
	{
		slug: "nepalese-building-pest-inspectors",
		name: "Building and pest inspector",
		plural: "Building and pest inspectors",
		short: "Pre-purchase inspections",
		scope: "wide",
		registerName: "your state's building licensing authority",
		registerUrl: "https://www.fairtrading.nsw.gov.au/help-centre/online-tools/public-registers",
		intro: (area) =>
			`Buying a home in ${area}? A building and pest inspection can reveal costly defects before you sign. These inspectors are listed for the Nepali community.`,
		why: "Inspection reports are technical. Having the findings explained in your own language helps you decide whether to proceed, negotiate or walk away.",
		checklist: [
			"Check their licence and insurance, since requirements vary by state.",
			"Ask whether the building and pest inspections are done by qualified individuals.",
			"Ask how soon you receive the report, and whether they will walk you through it.",
			"Ask whether the report meets the standard your lender or contract requires.",
		],
		faqs: (area) => [
			{
				q: `Do I need a building and pest inspection in ${area}?`,
				a: "It is strongly recommended before buying any established property. It is usually done during the cooling-off period or before auction.",
			},
			{
				q: "How long does an inspection report take?",
				a: "Most inspectors deliver a written report within a day or two. Ask before booking if you are on a tight timeline.",
			},
		],
	},
];

export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
