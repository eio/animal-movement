function toggleFlight() {
	if (window.FLYING == false) {
		// Do it.
		startFlight(window.GUI_STATE.animal);
		window.FLY_TOGGLE_GUI.name(window.STOP_BUTTON_TEXT);
		window.FLYING = true;
	} else {
		// Stop it.
		stopFlight();
	}
}

function stopFlight() {
	clearTimeout(window.TIMEOUT);
	window.FLY_TOGGLE_GUI.name(window.START_BUTTON_TEXT);
	window.FLYING = false;
	console.log(window.THANK_YOU_TEXT)
}

function startFlight(animalID) {
	console.log("\nSelected Animal:", animalID);
	var animal = window.ANIMALS[animalID];
	// Update taxon display in top left
	updateTaxonDisplay(animal);
	// Order the waypoints chronologically
	var waypoints = getTimeOrderedWaypoints(animal);
	// Update duration display in top left
	updateDurationDisplay(waypoints);
	// Get the total number of waypoints in this voyage
	var n_waypoints = waypoints.length;
	console.log("Waypoints:", n_waypoints);
	// Set the waypoint GUI maximum value to the lenght of waypoints list
	window.WAYPOINT_GUI.max(n_waypoints);
	// Reset waypoint to starting position
	window.WAYPOINT_GUI.setValue(0);
	// Clear all map markers
	clearMapMarkers();
	// Add map markers for all waypoints in this voyage
	addMapMarkers(waypoints);
	// Start the flight action:
	flyToAllWaypoints(waypoints, FLIGHT_TIME);
}

function getTimeOrderedWaypoints(positions) {
	positions.sort(function(a,b){
		return new Date(a.timestamp) - new Date(b.timestamp);
	});
	return positions
}

function flyToAllWaypoints(waypoints, flight_time) {
	console.log("Begin voyage.")
	var start_index = 0;
	flyToWaypoint(start_index, flight_time, waypoints);
}

function updateTaxonDisplay(animal) {
	var first_record = animal[0];
	var taxon = first_record.properties[window.TAXON_KEY];
	var common_name = window.TAXON_MAP[taxon];
	var text = [common_name, "<br>", "<i>(", taxon, ")</i>"].join("");
	document.getElementById("taxonDisplay").innerHTML = text;
}

function updateDurationDisplay(waypoints) {
	var first_time = waypoints[0].properties[window.TIMESTAMP_KEY];
	var last_time = waypoints[waypoints.length - 1].properties[window.TIMESTAMP_KEY];
	var duration = Date.parse(last_time) - Date.parse(first_time);
	// Convert from milliseconds to hours
	duration = duration / 3600000;
	var unit_display = "hours";
	// If trip is longer than 3 days (72 hours)
	// then display duration in days instead of hours
	if (duration > 72) {
		// Convert from hours to days
		duration = duration / 24;
		unit_display = "days";
	}
	// Round to 2 decimal places
	duration = duration.toFixed(2);
	// Build the output string
	duration = "Total Time: " + duration + " " + unit_display;
	document.getElementById("durationDisplay").innerHTML = duration;
}

function updateTimeDisplay(animal) {
	var timestamp = animal.properties[window.TIMESTAMP_KEY].replace(".000","");
	document.getElementById("timeDisplay").innerHTML = timestamp;
}

function flyToWaypoint(i, flight_time, waypoints, prev_latlon=null) {
	var n_waypoints = waypoints.length;
	// Start stepping through the ordered waypoints list:
	window.TIMEOUT = setTimeout(function() {
		i = window.GUI_STATE.waypoint;
		if (i < n_waypoints - 1) {
			var animal = waypoints[i];
			var lonlat = animal.geometry.coordinates;
			addCurrentMapMarker(lonlat, animal.properties);
			// Figure out where the bat goes next
			var next_animal = waypoints[i + 1];
			var next_lonlat = next_animal.geometry.coordinates;
			var bearing = getBearing(lonlat[1], lonlat[0], next_lonlat[1], next_lonlat[0]);
			var target = {
				"center": lonlat,
				"zoom": window.ZOOM, // getZoom(height)
				"pitch": window.PITCH,
				"bearing": bearing
				// https://docs.mapbox.com/help/glossary/camera/
			};
			var action = {
				...target, // Fly to the selected target (...important)
				duration: flight_time, // Animate over X milliseconds
				essential: true // This animation is considered essential with
								// respect to prefers-reduced-motion
			};
			// Perform the map action
			window.MAP.flyTo(action);
			// Update the time display in top left
			updateTimeDisplay(animal);
			// Increment counter
			i += window.GUI_STATE.step;
			// Don't exceed waypoint count
			if (i > n_waypoints - 1) {
				i = n_waypoints - 1
			}
			window.WAYPOINT_GUI.setValue(i);
			var progress = "Waypoint: " + i + "/" + n_waypoints;
			document.getElementById("progressDisplay").innerHTML = progress;
			// Fly to the next one, keep track of previous location
			flyToWaypoint(i, flight_time, waypoints, lonlat);
		} else {
			// Stop it.
			stopFlight();
		}
	}, flight_time * 0.9)
}
