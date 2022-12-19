function addCurrentMapMarker(lonlat, props) {
	if (window.CURRENT_MARKER) {
		window.CURRENT_MARKER.remove();
	}
	window.CURRENT_MARKER = createMapMarker(lonlat, props, true);
}

function addMapMarkers(markers) {
	for (var i = markers.length - 1; i >= 0; i--) {
		var record = markers[i];
    	createMapMarker(record.geometry.coordinates, record.properties);
    }
}

function clearMapMarkers() {
	if (window.MAP_MARKERS) {
	    for (var i = window.MAP_MARKERS.length - 1; i >= 0; i--) {
	    	window.MAP_MARKERS[i].remove();
	    }
	    window.MAP_MARKERS = [];
	}
}

function createMapMarker(lonlat, props, current=false) {
	const feature = {
        "type": "Feature",
        "properties": props,
        "geometry": {
            "type": "Point",
            "coordinates": lonlat,
        }
        // "properties": {"height": height},
    }
	// create a HTML element for each feature
	const el = document.createElement('div');
	if (current == false) {
		el.className = 'marker';
	} else {
		el.className = 'current-marker';
	}
	// make a marker for each feature and add it to the map
	const marker = new mapboxgl.Marker(el)
		.setLngLat(feature.geometry.coordinates)
		.setPopup(
			new mapboxgl.Popup({ offset: 25 }) // add popups
			.setHTML(
			`<p><b>Latitude:</b>\t${lonlat[1]}</p>\
			<p><b>Longitude:</b>\t${lonlat[0]}</p>\
			<p><b>Timestamp:</b>\t${props[window.TIMESTAMP_KEY]}</p>`
			// `<h3>${props[window.ID_KEY]}</h3><p>${props[window.TIMESTAMP_KEY]}</p>`
			)
		)
		.addTo(window.MAP);

	// Keep track of all the markers
	// so they can be cleared later
	window.MAP_MARKERS.push(marker);
	return marker;
}