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
	console.log("Selected Animal:", animalID);
	var positions = window.ANIMALS[animalID];
	var waypoints = getTimeOrderedWaypoints(positions);
	var n_waypoints = waypoints.length;
	// Set the waypoint GUI maximum value to the lenght of waypoints list
	console.log("Waypoints:", n_waypoints);
	window.WAYPOINT_GUI.max(n_waypoints);
	// Reset waypoint to starting position
	window.WAYPOINT_GUI.setValue(0);
	// Clear map and add new markers
	clearMapMarkers();
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

function updateDisplays(animal) {
	// var speed = bat["ground-speed"];
	// var height = bat["height-above-msl"];
	var timestamp = animal.properties[window.TIMESTAMP_KEY].replace(".000","");
	document.getElementById("timeDisplay").innerHTML = timestamp;
	// var distance = animal["km-traveled"];
	// var traveled = "Traveled: " + distance.toFixed(2) + " km";
	// document.getElementById("distanceDisplay").innerHTML = traveled;
}

function updateTaxon(taxon) {
	var common_name = window.TAXON_MAP[taxon];
	var text = [common_name, "<br>", "<i>(", taxon, ")</i>"].join("");
	document.getElementById("taxonDisplay").innerHTML = text;
}

function flyToWaypoint(i, flight_time, waypoints, prev_latlon=null) {
	var first_wp = waypoints[0];
	var taxon = first_wp.properties[window.TAXON_KEY];
	updateTaxon(taxon);
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
			// Update the displays
			updateDisplays(animal);
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
