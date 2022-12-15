function loadMap() {
	console.log("Loading map...")
	// TO MAKE THE MAP APPEAR YOU MUST ADD YOUR ACCESS TOKEN FROM
	// https://account.mapbox.com
	mapboxgl.accessToken = window.TOKEN;
	// These options control the camera position after animation
	const start = {
		center: [-42, 42],
		zoom: 1,
		pitch: 0,
		bearing: 0
	};
	window.map = new mapboxgl.Map({
		container: 'map',
		// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
		style: 'mapbox://styles/mapbox/satellite-streets-v12',
		...start
	});
	map.on('style.load', () => {
		// Custom atmosphere styling
		// map.setFog({
		// // 'color': 'rgb(220, 159, 159)', // Pink fog / lower atmosphere
		// 'color': 'rgb(220, 220, 200)', // Pink fog / lower atmosphere
		// 'high-color': 'rgb(36, 92, 223)', // Blue sky / upper atmosphere
		// 'horizon-blend': 0.4 // Exaggerate atmosphere (default is .1)
		// });
		map.addSource('mapbox-dem', {
		'type': 'raster-dem',
		'url': 'mapbox://mapbox.terrain-rgb'
		});
		map.setTerrain({
		'source': 'mapbox-dem',
		// 'exaggeration': 1.5
		});
		// Canvas2D: Multiple readback operations using getImageData are faster with the willReadFrequently attribute set to true.
		// See: https://html.spec.whatwg.org/multipage/canvas.html#concept-canvas-will-read-frequently
		const canvas = document.getElementsByClassName("mapboxgl-canvas")[0];
		canvas.getContext("2d", { willReadFrequently: true });
		// Indicate success:
		console.log("Map loaded.")
	});
}