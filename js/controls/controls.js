// https://github.com/dataarts/dat.gui/blob/master/example.html
function loadControls() {
	// controller state
	window.GUI_STATE = {
		animal: window.ANIMAL_IDS[0],
        step: 1,
        waypoint: 0,
        fly: function(){ toggleFlight() }
    };

	// initialize controls
	const gui = new dat.gui.GUI();
	gui.remember(window.GUI_STATE);

	/////////////////////////////
	// Add Control UI Elements //
	/////////////////////////////
	window.WAYPOINT_GUI = gui.add(window.GUI_STATE, "waypoint").min(0).max(0).step(1).name("Waypoint");
	gui.add(window.GUI_STATE, "step").min(1).max(100).step(1).name("Waypoint Step");
	gui.add(window.GUI_STATE, "animal", window.ANIMAL_IDS).name("Selected Animal");
	window.FLY_TOGGLE_GUI = gui.add(window.GUI_STATE, "fly").name(window.START_BUTTON_TEXT);
}