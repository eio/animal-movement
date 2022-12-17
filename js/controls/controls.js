// https://github.com/dataarts/dat.gui/blob/master/example.html
function loadControls() {
	///////////////////////////
	// GUI Controller State //
	/////////////////////////
	window.GUI_STATE = {
		animal: window.ANIMAL_IDS[0],
        step: 1,
        waypoint: 0,
        taxon: Object.keys(window.TAXA)[0],
        fly: function(){ toggleFlight() }
    };

    //////////////////////////////
	// Initialize GUI Controls //
	////////////////////////////
	const gui = new dat.gui.GUI();
	gui.remember(window.GUI_STATE);

	//////////////////////////////
	// Add Control UI Elements //
	////////////////////////////

	// The progress bar/navigation UI showing the current waypoint:
	window.WAYPOINT_GUI = gui.add(window.GUI_STATE, "waypoint").min(0).max(0).step(1).name("Waypoint");

	// The slider defining how many waypoints to skip/step on each iteration forward:
	gui.add(window.GUI_STATE, "step").min(1).max(100).step(1).name("Waypoint Step");

	// The animal taxa dropdown:
	gui.add(
		window.GUI_STATE, "taxon",
		Object.keys(window.TAXA)
	).onFinishChange(
	    function() {
	    	var animal_options = getSelectedTaxonAnimals();
	    	updateDropdown(window.ID_DROPDOWN, animal_options);
	    	window.ID_DROPDOWN.setValue(animal_options[0]);
	    }
	 ).name("Selected Taxon");

	// The individual animal ID dropdown:
	window.ID_DROPDOWN = gui.add(
		window.GUI_STATE, "animal",
		getSelectedTaxonAnimals()
	).name("Selected Animal");

	// The button to start/stop animating the selected animal's journey:
	window.FLY_TOGGLE_GUI = gui.add(window.GUI_STATE, "fly").name(window.START_BUTTON_TEXT);
}


// Return the list of animal IDs for the selected taxon (ordered alphabetically)
function getSelectedTaxonAnimals() {
	return Object.values(window.TAXA[window.GUI_STATE.taxon]).sort();
}


// https://stackoverflow.com/questions/18260307/dat-gui-update-the-dropdown-list-values-for-a-controller
function updateDropdown(target, list){   
    innerHTMLStr = "";
    for(var i=0; i<list.length; i++){
        var str = "<option value='" + list[i] + "'>" + list[i] + "</option>";
        innerHTMLStr += str;        
    }
    if (innerHTMLStr != "") {
    	target.domElement.children[0].innerHTML = innerHTMLStr;
    }
}
