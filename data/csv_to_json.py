import csv
import json
import argparse
from math import pi, sin, cos, atan2, sqrt

# Converts from degrees to radians.
def toRadians(degrees):
    return degrees * pi / 180


# https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
# This function takes in latitude and longitude of two locations
# and returns the distance between them as the crow flies (in km)
def getDistance(lat1, lon1, lat2, lon2):
    R = 6371  # km
    dLat = toRadians(lat2 - lat1)
    dLon = toRadians(lon2 - lon1)
    lat1 = toRadians(lat1)
    lat2 = toRadians(lat2)
    a = sin(dLat / 2) * sin(dLat / 2) + sin(dLon / 2) * sin(dLon / 2) * cos(lat1) * cos(
        lat2
    )
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    d = R * c
    return d


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--filename",
        type=str,
        help="The input CSV",
    )
    parser.add_argument(
        "--varname",
        type=str,
        help="The `var` name for the JSON data",
    )
    args = parser.parse_args()
    varname = args.varname
    filename = args.filename
    with open(filename, "r") as csvfile:
        animal_reader = csv.DictReader(csvfile)
        animals = {}
        data = []
        for animal in animal_reader:
            data.append(animal)

        skip = 0
        last_valid_i = 0
        total_distance = 0
        for i in range(0, len(data)):
            animal = data[i]
            lat = animal["location-lat"]
            lon = animal["location-long"]
            if lat == "" or lon == "":
                print("Skipped", skip)
                skip += 1
                continue
            else:
                last_valid_i = i
            # if i == 0:
            #     # initialization
            #     animal["km-traveled"] = 0
            # else:
            #     prev_bat = data[last_valid_i]
            #     prev_lat = prev_bat["location-lat"]
            #     prev_lon = prev_bat["location-long"]
            #     distance = getDistance(
            #         float(prev_lat),
            #         float(prev_lon),
            #         float(lat),
            #         float(lon),
            #     )
            #     total_distance = total_distance + distance
            #     animal["km-traveled"] = total_distance
            # output object is stored under animal ID
            identity = animal["individual-local-identifier"]
            if identity in animals:
                animals[identity].append(animal)
            else:
                animals[identity] = [animal]

    ###################
    ##  OUTPUT JSON  ##
    ###################
    outfile = "{}.js".format(varname)
    with open(outfile, "w") as outfile:
        outfile.write("var {} = {}{}".format(varname, json.dumps(animals), ";"))
        print("Output to: {}".format(outfile))
