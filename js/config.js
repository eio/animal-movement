window.GUI_STATE = null;
window.START_BUTTON_TEXT = "Start Animal Movement";
window.STOP_BUTTON_TEXT = "Stop Animal Movement";
window.THANK_YOU_TEXT = "Thank you for flying.";
// Flight duration for route segment (milliseconds):
window.FLIGHT_TIME = 3000;
// Flag indicating if movement is happening:
window.FLYING = false;
// Mapbox 3D parameters
window.PITCH = 70;
window.ZOOM = 14.5;
// Keep track of markers on the map
window.MAP_MARKERS = [];
window.CURRENT_MARKER = null;
// Data field names
window.ID_KEY = "individual-local-identifier"
window.TAXON_KEY = "individual-taxon-canonical-name"
window.TIMESTAMP_KEY = "timestamp"
// Create lookup dictionary of common names
window.TAXON_MAP = {
	"Tadarida teniotis": "European free-tailed bat",
	"Gallinago gallinago": "Common snipe",
	"Cuculus canorus": "Common cuckoo",
	"Streptopelia turtur": "Turtle dove",
	"Fregata aquila": "Ascension frigatebird",
	"Phaethon aethereus": "Red-billed tropicbird",
	"Onychoprion fuscatus": "Sooty tern",
}
// window.UNSPECIFIED = "unspecified";
// window.TAXON_MAP[window.UNSPECIFIED] = window.UNSPECIFIED

// Function to get all taxa options
function getTaxaInfo(datasets) {
	window.TAXA = {}
	for(var d=0; d<datasets.length; d++) {
		var data = datasets[d];
		for (const [identity, records] of Object.entries(data)) {
			for (var i=0; i<records.length; i++) {
				var row = records[i];
				var ident = row.properties[window.ID_KEY];
				var taxon = row.properties[window.TAXON_KEY];
				// Skip / hide taxa that aren't in the global taxon map
				if (!(taxon in window.TAXON_MAP)) {
					// taxon = window.UNSPECIFIED;
					continue;
				}
				if (!window.TAXA[taxon]) {
					// initialize list of individuals for this taxon
					window.TAXA[taxon] = [ident]
				} else {
					if (window.TAXA[taxon].indexOf(ident) < 0) {
						// add to list of individuals for this taxon
						window.TAXA[taxon].push(ident)
					}
				}
			}
		}
	};
	console.log("Records per taxa:", window.TAXA);
}
// Get all taxa options:
getTaxaInfo([
	window.BATS,
	window.CUCKOOS,
	window.DOVES,
	window.SEABIRDS
])
// Get the unique animal IDs:
window.BAT_IDS = Object.keys(window.BATS).sort();
window.CUCKOO_IDS = Object.keys(window.CUCKOOS).sort();
window.DOVE_IDS = Object.keys(window.DOVES).sort();
window.SEABIRD_IDS = Object.keys(window.SEABIRDS).sort();
// Reference for all unique animal IDs:
window.ANIMAL_IDS = window.BAT_IDS.concat(
	window.CUCKOO_IDS,
	window.DOVE_IDS,
	window.SEABIRD_IDS
)
// Store all the data in one common object
window.ANIMALS = Object.assign({}, BATS, CUCKOOS)
window.ANIMALS = Object.assign({}, window.ANIMALS, DOVES)
window.ANIMALS = Object.assign({}, window.ANIMALS, SEABIRDS)