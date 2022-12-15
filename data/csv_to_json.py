import csv
import json
from math import pi, sin, cos, atan2, sqrt

# # Converts from degrees to radians.
# def toRadians(degrees):
#     return degrees * pi / 180

# # https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
# # This function takes in latitude and longitude of two locations
# # and returns the distance between them as the crow flies (in km)
# def getDistance(lat1, lon1, lat2, lon2):
#     R = 6371  # km
#     dLat = toRadians(lat2 - lat1)
#     dLon = toRadians(lon2 - lon1)
#     lat1 = toRadians(lat1)
#     lat2 = toRadians(lat2)
#     a = sin(dLat / 2) * sin(dLat / 2) + sin(dLon / 2) * sin(dLon / 2) * cos(lat1) * cos(
#         lat2
#     )
#     c = 2 * atan2(sqrt(a), sqrt(1 - a))
#     d = R * c
#     return d


def remove_unused_fields(bat):
    # SOURCE: https://www.movebank.org/cms/webapp?gwt_fragment=page=studies,path=study312057662
    # FIELDS:
    # event-id,visible,timestamp,location-long,location-lat,
    # gps:hdop,gps:maximum-signal-strength,gps:satellite-count,
    # ground-speed,height-above-msl,manually-marked-outlier,
    # sensor-type,individual-taxon-canonical-name,tag-local-identifier,
    # individual-local-identifier,study-name
    del bat["study-name"]
    del bat["sensor-type"]  # all "gps"
    return bat


with open("3D flights of European free-tailed bats.csv", "r") as csvfile:
    batreader = csv.DictReader(csvfile)
    bats = {}
    data = []
    for bat in batreader:
        bat = remove_unused_fields(bat)
        data.append(bat)

    for i in range(0, len(data)):
        bat = data[i]
        # prev_bat = data[i - 1]
        # bat["km-traveled"] = getDistance(
        #     prev_lat, prev_lon, bat["location-lat"], bat["location-long"]
        # )
        identity = bat["individual-local-identifier"]
        if identity in bats:
            bats[identity].append(bat)
        else:
            bats[identity] = [bat]


with open("bats.js", "w") as outfile:
    outfile.write("var BATS = %s%s" % (json.dumps(bats), ";"))
