getItemsAtLocation = (collectionName, place, radius, callback) => {
    if(place && radius) {
        let placeLocation = Meteor.call('geocode', place)
        const centerLat = placeLocation.loc.lat
        const centerLon = placeLocation.loc.lng

        const selector = {
            "loc": {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [centerLat, centerLon]
                    },
                    $maxDistance: radius * 1000,
                    $minDistance: 0
                }
            }
        }
        let locations = Locations.find(selector).fetch()
        let items = []

        locations.forEach(location => {
            let found = Mongo.Collection.get(collectionName).find({_id: location.doc}).fetch()
            if(found) items = items.concat(found)
        })

        return callback && callback(null, items)
    } else {
        return callback && callback("no data given", null)
    }
}

Meteor.methods({
    geocode: (location, callback) => {
        //console.log('Meteor call geocode')
        var geo = new GeoCoder({ geocoderProvider: "openstreetmap" }),
            r = geo.geocode(location),
            result = r[0]

        // map to location schema
        if(result) {
            // openstreetmap
            //console.log('result osm: ', result)
            result.loc = {}
            result.loc.lat = result['latitude']
            result.loc.lng = result['longitude']
            delete result['latitude']
            delete result['longitude']
        }
        return result
    },

    nominatim: (string, callback) => {

        try {
            let url = 'http://nominatim.openstreetmap.org/search?format=json&q=' + string
            return Meteor.http.get(url)
        } catch(error) {
            if(error.response) {
                var errorCode = error.response.data.code,
                    errorMessage = error.response.data.message
            } else {
                var errorCode = 500
                var errorMessage = 'Cannot access the API'
            }

            // Create an Error object and return it via callback
            var apiError = new Meteor.Error(errorCode, errorMessage)
            return callback(apiError, null)
        }
    },

    /**
     * Adds the location object to the collection.
     * @param {Object} location
     */

    addLocationToCollection: (location, callback) => {
        check(location, Schemas.Locations)
        Locations.insert(location)
    },

    /**
     * Updates the location object(s) of an item.
     * @param {Object} params
     */

    updateLocationOfCollection: (params, callback) => {
        check(params, Schemas.Locations)
        let locations = Locations.find({doc: params.doc, docType: params.docType}).fetch()
        locations.forEach(location => {
            Locations.update(location._id, {$set: params})
        })
    },

    /**
     * Removes the location object of an collection.
     * @param doc String
     */

    removeLocationFromCollection: (doc, callback) => {
        if (doc)
            Locations.remove({doc: doc })
    },

    /**
     * Get the documents found in a certain place and radius.
     * Returns an array of Objects
     * @param collectionName String
     * @param place String
     * @param radius Number
     * @returns {Array}
     */

    getItemsAtLocation:  (collectionName, place, radius) => {

        let getItemsAtLocationSync = Meteor.wrapAsync(getItemsAtLocation)
        let result = getItemsAtLocationSync(collectionName, place, radius)
        if(result)
            return result
    }
})