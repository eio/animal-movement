document.getElementById('fly').addEventListener('click', () => {
	if (window.FLYING == false) {
		// Do it.
		startFlight(window.GUI_STATE.bat);
		document.getElementById('fly').innerHTML = "Stop";
		window.FLYING = true;
	} else {
		// Stop it.
		stopFlight();
	}
});

function stopFlight() {
	clearTimeout(window.TIMEOUT);
	document.getElementById('fly').innerHTML = "Fly";
	window.FLYING = false;
	console.log("Thank you for flying.")
}

function startFlight(bat) {
	console.log("Selected Bat:", bat);
	var positions = BATS[bat];
	var waypoints = getTimeOrderedWaypoints(positions);
	var n_waypoints = waypoints.length;
	// Set the waypoint GUI maximum value to the lenght of waypoints list
	console.log("Waypoints:", n_waypoints);
	window.WAYPOINT_GUI.max(n_waypoints);
	// Reset waypoint to starting position
	window.WAYPOINT_GUI.setValue(0);
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
	console.log("Begin journey.")
	var start_index = 0;
	flyToWaypoint(start_index, flight_time, waypoints);
}

function flyToWaypoint(i, flight_time, waypoints, prev_latlon=null) {
	var n_waypoints = waypoints.length;
	// Start stepping through the ordered waypoints list:
	window.TIMEOUT = setTimeout(function() {
		i = window.GUI_STATE.waypoint;
		if (i < n_waypoints - 1) {
			var bat = waypoints[i];
			var timestamp = bat["timestamp"].replace(".000","");
			// var speed = bat["ground-speed"];
			document.getElementById("timeDisplay").innerHTML = timestamp;
			var latitude = parseFloat(bat["location-lat"]);
			var longitude = parseFloat(bat["location-long"]);
			var height = bat["height-above-msl"];
			var lonlat = [longitude, latitude];
			// Figure out where the bat goes next
			var bat_next = waypoints[i + 1];
			var destLat = bat_next["location-lat"];
			var destLng = bat_next["location-long"];
			var bearing = getBearing(latitude, longitude, destLat, destLng);
			// var distance = bat["km-traveled"];
			// var traveled = "Traveled: " + distance.toFixed(2) + " km";
			// document.getElementById("distanceDisplay").innerHTML = traveled;
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
			map.flyTo(action);
			// Increment counter
			i += window.GUI_STATE.step;
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
