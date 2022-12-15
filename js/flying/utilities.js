// Converts from degrees to radians.
function toRadians(degrees) {
   return degrees * Math.PI / 180;
}
 
// Converts from radians to degrees.
function toDegrees(radians) {
    return radians * 180 / Math.PI;
}

// https://stackoverflow.com/questions/46590154/calculate-bearing-between-2-points-with-javascript
function getBearing(startLat, startLng, destLat, destLng) {
    startLat = toRadians(startLat);
    startLng = toRadians(startLng);
    destLat = toRadians(destLat);
    destLng = toRadians(destLng);

    y = Math.sin(destLng - startLng) * Math.cos(destLat);
    x = Math.cos(startLat) * Math.sin(destLat) - Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    brng = Math.atan2(y, x);
    brng = toDegrees(brng);
    return (brng + 360) % 360;
}

// const mapVals = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;
// function getZoom(height) {
//     // console.log("Height:", height);
//     // var zoomRange = [0, 23];
//     var zLow = 10;
//     var zHigh = 14;
//     var zoom = mapVals(height, 0, 1000, zLow, zHigh);
//     return zoom;
// }