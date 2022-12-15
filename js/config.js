window.GUI_STATE = null;
// Flight duration for route segment (milliseconds):
window.FLIGHT_TIME = 3000;
// Is flying in progress?
window.FLYING = false;
// Mapbox 3D parameters
window.PITCH = 70;
window.ZOOM = 14.5;
// Get the unique bat IDs:
window.BAT_IDS = Object.keys(window.BATS).sort();
console.log("Bats:", window.BAT_IDS);