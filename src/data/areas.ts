// Areas (suburbs and LGAs) the directory can cover.
//
// IMPORTANT: Pages are only generated for areas with `launch: true`. Everything else returns 404.
// Priority tiers come from general knowledge of where Nepali communities live, NOT from ABS Census
// data yet. Validate with the 2021 Census (Nepal-born, Nepali language at home, Nepali ancestry)
// and flip `launch` per area. See docs/CENSUS_PRIORITY.md.

export interface Area {
	slug: string;
	name: string;
	type: "suburb" | "lga";
	state: "NSW" | "VIC" | "QLD" | "SA" | "WA" | "TAS" | "ACT" | "NT";
	city: string; // greater city / region
	lga?: string; // slug of the LGA area this suburb sits in
	blurb: string; // unique local copy; keep factual and non-numeric
	nearby: string[]; // slugs
	priority: 1 | 2 | 3;
	launch: boolean;
}

export const AREAS: Area[] = [
	// ---------- Sydney: LGAs ----------
	{ slug: "blacktown-lga-nsw", name: "Blacktown City", type: "lga", state: "NSW", city: "Sydney", blurb: "Blacktown City is one of the largest local government areas in Western Sydney, covering established suburbs like Blacktown and Quakers Hill and fast-growing release areas such as Schofields and Marsden Park. It is a major destination for new homes and has a large, diverse community.", nearby: ["parramatta-lga-nsw", "the-hills-shire-lga-nsw", "cumberland-lga-nsw"], priority: 1, launch: true },
	{ slug: "parramatta-lga-nsw", name: "City of Parramatta", type: "lga", state: "NSW", city: "Sydney", blurb: "The City of Parramatta covers Sydney's second CBD and surrounding suburbs including Harris Park and Westmead. With major hospitals, universities, transport links and ongoing development, it attracts buyers, investors and renters from many communities.", nearby: ["blacktown-lga-nsw", "cumberland-lga-nsw", "the-hills-shire-lga-nsw"], priority: 1, launch: true },
	{ slug: "cumberland-lga-nsw", name: "Cumberland City", type: "lga", state: "NSW", city: "Sydney", blurb: "Cumberland City in Sydney's west includes Auburn and Lidcombe. It is known for its cultural diversity, convenient train access and relatively accessible property prices compared with the inner city.", nearby: ["parramatta-lga-nsw", "strathfield-lga-nsw", "burwood-lga-nsw"], priority: 1, launch: true },
	{ slug: "the-hills-shire-lga-nsw", name: "The Hills Shire", type: "lga", state: "NSW", city: "Sydney", blurb: "The Hills Shire in Sydney's north-west includes Rouse Hill and Kellyville. It is popular with families for its newer housing, schools and the Metro Northwest rail line.", nearby: ["blacktown-lga-nsw", "parramatta-lga-nsw"], priority: 1, launch: true },
	{ slug: "georges-river-lga-nsw", name: "Georges River", type: "lga", state: "NSW", city: "Sydney", blurb: "Georges River Council in Sydney's south includes Hurstville. It has strong train connections, shopping and a long-established community of migrant families.", nearby: ["bayside-lga-nsw", "strathfield-lga-nsw"], priority: 1, launch: true },
	{ slug: "bayside-lga-nsw", name: "Bayside", type: "lga", state: "NSW", city: "Sydney", blurb: "Bayside Council in Sydney's south covers Rockdale and Kogarah, with easy access to the airport, the CBD and the St George area's shops and hospitals.", nearby: ["georges-river-lga-nsw"], priority: 1, launch: true },
	{ slug: "strathfield-lga-nsw", name: "Strathfield", type: "lga", state: "NSW", city: "Sydney", blurb: "Strathfield in Sydney's inner west is a major transport interchange popular with students and families, with a mix of apartments and established homes.", nearby: ["burwood-lga-nsw", "cumberland-lga-nsw"], priority: 1, launch: true },
	{ slug: "burwood-lga-nsw", name: "Burwood", type: "lga", state: "NSW", city: "Sydney", blurb: "Burwood in Sydney's inner west is a busy commercial and residential hub with a large apartment market and good rail access.", nearby: ["strathfield-lga-nsw", "cumberland-lga-nsw"], priority: 1, launch: true },
	{ slug: "liverpool-lga-nsw", name: "Liverpool", type: "lga", state: "NSW", city: "Sydney", blurb: "Liverpool in Sydney's south-west is a growing regional centre close to the Western Sydney Airport precinct, with a wide range of housing options.", nearby: ["blacktown-lga-nsw"], priority: 2, launch: false },

	// ---------- Sydney: suburbs ----------
	{ slug: "schofields-nsw", name: "Schofields", type: "suburb", state: "NSW", city: "Sydney", lga: "blacktown-lga-nsw", blurb: "Schofields is a growing suburb in Sydney's north-west, within Blacktown City. Newer estates, a train station on the Richmond line and nearby shops make it popular with young families and first-home buyers.", nearby: ["rouse-hill-nsw", "quakers-hill-nsw", "blacktown-nsw", "kellyville-nsw"], priority: 1, launch: true },
	{ slug: "rouse-hill-nsw", name: "Rouse Hill", type: "suburb", state: "NSW", city: "Sydney", lga: "the-hills-shire-lga-nsw", blurb: "Rouse Hill is a master-planned north-west Sydney suburb with a large town centre, a Metro station and many newer family homes.", nearby: ["schofields-nsw", "kellyville-nsw", "quakers-hill-nsw"], priority: 1, launch: true },
	{ slug: "kellyville-nsw", name: "Kellyville", type: "suburb", state: "NSW", city: "Sydney", lga: "the-hills-shire-lga-nsw", blurb: "Kellyville in Sydney's north-west is a sought-after family suburb with newer estates, well-regarded schools and Metro Northwest access.", nearby: ["rouse-hill-nsw", "schofields-nsw"], priority: 1, launch: true },
	{ slug: "quakers-hill-nsw", name: "Quakers Hill", type: "suburb", state: "NSW", city: "Sydney", lga: "blacktown-lga-nsw", blurb: "Quakers Hill is an established suburb in Sydney's north-west with a train station, local shops and a mix of older and renovated homes.", nearby: ["schofields-nsw", "blacktown-nsw", "rouse-hill-nsw"], priority: 1, launch: true },
	{ slug: "blacktown-nsw", name: "Blacktown", type: "suburb", state: "NSW", city: "Sydney", lga: "blacktown-lga-nsw", blurb: "Blacktown is the commercial heart of its local area, with a major shopping centre, hospital, train interchange and a broad mix of houses and apartments.", nearby: ["schofields-nsw", "quakers-hill-nsw", "parramatta-nsw"], priority: 1, launch: true },
	{ slug: "parramatta-nsw", name: "Parramatta", type: "suburb", state: "NSW", city: "Sydney", lga: "parramatta-lga-nsw", blurb: "Parramatta is Sydney's second CBD, with a growing apartment market, light rail, a major hospital precinct and a busy dining scene.", nearby: ["harris-park-nsw", "westmead-nsw", "auburn-nsw"], priority: 1, launch: true },
	{ slug: "harris-park-nsw", name: "Harris Park", type: "suburb", state: "NSW", city: "Sydney", lga: "parramatta-lga-nsw", blurb: "Harris Park, next to Parramatta, is known for its busy cultural precinct and strong community identity, with units and townhouses close to the train station.", nearby: ["parramatta-nsw", "auburn-nsw", "westmead-nsw"], priority: 1, launch: true },
	{ slug: "westmead-nsw", name: "Westmead", type: "suburb", state: "NSW", city: "Sydney", lga: "parramatta-lga-nsw", blurb: "Westmead is home to a large health and research precinct and is popular with hospital workers, students and investors.", nearby: ["parramatta-nsw", "harris-park-nsw"], priority: 2, launch: false },
	{ slug: "auburn-nsw", name: "Auburn", type: "suburb", state: "NSW", city: "Sydney", lga: "cumberland-lga-nsw", blurb: "Auburn in Sydney's west has a busy town centre, train interchange and a mix of apartments and older houses, popular with first-home buyers and investors.", nearby: ["lidcombe-nsw", "parramatta-nsw", "harris-park-nsw"], priority: 1, launch: true },
	{ slug: "lidcombe-nsw", name: "Lidcombe", type: "suburb", state: "NSW", city: "Sydney", lga: "cumberland-lga-nsw", blurb: "Lidcombe is a central western Sydney suburb with a train interchange, nearby parklands and a growing apartment market.", nearby: ["auburn-nsw", "strathfield-nsw"], priority: 2, launch: false },
	{ slug: "strathfield-nsw", name: "Strathfield", type: "suburb", state: "NSW", city: "Sydney", lga: "strathfield-lga-nsw", blurb: "Strathfield is a major inner-west rail interchange with a mix of leafy streets, apartments and nearby schools and colleges.", nearby: ["burwood-nsw", "lidcombe-nsw"], priority: 1, launch: true },
	{ slug: "burwood-nsw", name: "Burwood", type: "suburb", state: "NSW", city: "Sydney", lga: "burwood-lga-nsw", blurb: "Burwood is an inner-west commercial and residential centre with large shopping and dining areas and a dense apartment market.", nearby: ["strathfield-nsw"], priority: 1, launch: true },
	{ slug: "hurstville-nsw", name: "Hurstville", type: "suburb", state: "NSW", city: "Sydney", lga: "georges-river-lga-nsw", blurb: "Hurstville is a southern Sydney centre with a busy station, shopping precinct and many apartments, popular with students and young families.", nearby: ["kogarah-nsw", "rockdale-nsw"], priority: 1, launch: true },
	{ slug: "kogarah-nsw", name: "Kogarah", type: "suburb", state: "NSW", city: "Sydney", lga: "bayside-lga-nsw", blurb: "Kogarah in Sydney's south has a major hospital precinct, a train station and a growing mix of apartments and established houses.", nearby: ["hurstville-nsw", "rockdale-nsw"], priority: 1, launch: true },
	{ slug: "rockdale-nsw", name: "Rockdale", type: "suburb", state: "NSW", city: "Sydney", lga: "bayside-lga-nsw", blurb: "Rockdale is a Sydney south suburb close to the airport and the bay, with a train station, shops and a large apartment market.", nearby: ["kogarah-nsw", "hurstville-nsw"], priority: 1, launch: true },

	// ---------- Melbourne / Brisbane / Canberra (not launched until validated) ----------
	{ slug: "dandenong-vic", name: "Dandenong", type: "suburb", state: "VIC", city: "Melbourne", blurb: "Dandenong is the major hub of Melbourne's south-east, with a large shopping and market precinct and a diverse community.", nearby: ["noble-park-vic", "cranbourne-vic"], priority: 2, launch: false },
	{ slug: "noble-park-vic", name: "Noble Park", type: "suburb", state: "VIC", city: "Melbourne", blurb: "Noble Park is a south-east Melbourne suburb with train access and relatively accessible housing.", nearby: ["dandenong-vic", "clayton-vic"], priority: 2, launch: false },
	{ slug: "clayton-vic", name: "Clayton", type: "suburb", state: "VIC", city: "Melbourne", blurb: "Clayton is home to a major university campus and a large student and young-professional population in Melbourne's south-east.", nearby: ["noble-park-vic", "dandenong-vic"], priority: 2, launch: false },
	{ slug: "tarneit-vic", name: "Tarneit", type: "suburb", state: "VIC", city: "Melbourne", blurb: "Tarneit is a fast-growing suburb in Melbourne's west with new estates and a train station.", nearby: ["werribee-vic", "point-cook-vic"], priority: 2, launch: false },
	{ slug: "werribee-vic", name: "Werribee", type: "suburb", state: "VIC", city: "Melbourne", blurb: "Werribee is a large centre in Melbourne's outer west with a mix of established and new housing.", nearby: ["tarneit-vic", "point-cook-vic"], priority: 2, launch: false },
	{ slug: "point-cook-vic", name: "Point Cook", type: "suburb", state: "VIC", city: "Melbourne", blurb: "Point Cook is a large family-oriented suburb in Melbourne's south-west with newer homes and amenities.", nearby: ["tarneit-vic", "werribee-vic"], priority: 3, launch: false },
	{ slug: "cranbourne-vic", name: "Cranbourne", type: "suburb", state: "VIC", city: "Melbourne", blurb: "Cranbourne is a growing outer south-east Melbourne centre with large new estates.", nearby: ["dandenong-vic"], priority: 3, launch: false },
	{ slug: "sunnybank-qld", name: "Sunnybank", type: "suburb", state: "QLD", city: "Brisbane", blurb: "Sunnybank is a busy south Brisbane suburb known for its shopping and dining precincts and diverse community.", nearby: ["kuraby-qld", "underwood-qld"], priority: 2, launch: false },
	{ slug: "kuraby-qld", name: "Kuraby", type: "suburb", state: "QLD", city: "Brisbane", blurb: "Kuraby is a south Brisbane suburb with family homes and good road and rail connections.", nearby: ["sunnybank-qld", "underwood-qld"], priority: 2, launch: false },
	{ slug: "underwood-qld", name: "Underwood", type: "suburb", state: "QLD", city: "Brisbane", blurb: "Underwood sits between Brisbane and Logan, with family homes and easy motorway access.", nearby: ["sunnybank-qld", "kuraby-qld"], priority: 3, launch: false },
	{ slug: "gungahlin-act", name: "Gungahlin", type: "suburb", state: "ACT", city: "Canberra", blurb: "Gungahlin is a growing town centre in Canberra's north with light rail and newer housing.", nearby: [], priority: 3, launch: false },
];

export const areaBySlug = (slug: string) => AREAS.find((a) => a.slug === slug);
export const launchedAreas = () => AREAS.filter((a) => a.launch);
export const STATE_NAMES: Record<string, string> = {
	NSW: "New South Wales", VIC: "Victoria", QLD: "Queensland", SA: "South Australia",
	WA: "Western Australia", TAS: "Tasmania", ACT: "Australian Capital Territory", NT: "Northern Territory",
};
