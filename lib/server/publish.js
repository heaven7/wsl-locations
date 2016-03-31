Meteor.publish(null, () => Locations.find())

Meteor.publish("locationSearch", (searchData) => {
    if(!searchData) return

    const radius = searchData.radius
    const centerLat = searchData.location.lat
    const centerLon = searchData.location.lng

    const selector = {
        "loc": {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [centerLon, centerLat]
                },
                $maxDistance: radius * 1000,
                $minDistance: 0
            }
        }
    }

    const geoWithin = {
        "loc": {
            $geoWithin : {
                $box : [bottomLeft, topRight]
            }
        }
    }

    return Locations.find(selector)
})
