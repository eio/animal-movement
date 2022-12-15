window.GUI_STATE = null;
window.START_BUTTON_TEXT = "Start Animal Movement";
window.STOP_BUTTON_TEXT = "Stop Animal Movement";
window.THANK_YOU_TEXT = "Thank you for flying.";
// Flight duration for route segment (milliseconds):
window.FLIGHT_TIME = 3000;
// Is flying in progress?
window.FLYING = false;
// Mapbox 3D parameters
window.PITCH = 70;
window.ZOOM = 14.5;
// Get the unique animal IDs:
window.BAT_IDS = Object.keys(window.BATS).sort();
window.CUCKOO_IDS = Object.keys(window.CUCKOOS).sort();
window.TORTOISE_IDS = Object.keys(window.TORTOISES).sort();
console.log("Bats:", window.BAT_IDS);
console.log("Cuckoos:", window.CUCKOO_IDS);
console.log("Tortoises:", window.TORTOISE_IDS);
// Reference for all the creatures
window.ANIMAL_IDS = window.BAT_IDS.concat(window.CUCKOO_IDS, window.TORTOISE_IDS)
// Store all the data in one common object
window.ANIMALS = Object.assign({}, BATS, CUCKOOS)
window.ANIMALS = Object.assign({}, window.ANIMALS, TORTOISES)
// Common names
window.TAXON_MAP = {
	"Tadarida teniotis": "European free-tailed bat",
	"Chelonoidis": "Galápagos Tortoise",
	"Gallinago gallinago": "Common Snipe",
	"Cuculus canorus": "Common Cuckoo"
}