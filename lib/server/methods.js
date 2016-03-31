Meteor.methods({
    geocode: (location, callback) => {
        //console.log('Meteor call geocode')
        var geo = new GeoCoder({ geocoderProvider: "openstreetmap" }),
            r = geo.geocode(location),
            result = r[0]

        // map to location schema
        if(result) {
            // openstreetmap
            result.loc = {}
            result.loc.lat = result['latitude']
            result.loc.lng = result['longitude']
            delete result['latitude']
            delete result['longitude']
        }
        return result
    },

    nominatim: (string, callback) => {
        var url = 'http://nominatim.openstreetmap.org/search?format=json&q=' + string,
            response = Meteor.http.get(url)
        //console.log(response)
//        return callback(null, response)
        return response
        try {

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
     * Adds the location object to an collection.
     * @param doc String
     * @param docType String
     * @param {Object|String} location
     * @example
     * location object
     * location = {
     *  lat: 52.5170365 // Float
     *  lng: 13.3888599 // Float
     * }
     * location String
     * location = 'Berlin'
     */

    addLocationToCollection: (doc, docType, location, callback) => {
        if (typeof location != 'object')
            // serverside geocoding
            location = Meteor.call('geocode', location)

        if (location) {
            var params = WSL.locations.getParams(doc, docType, location)
            check(params, Schemas.Locations)

            var id = Locations.insert(params)
        }
    },

    /**
     * Updates the location object to an collection.
     * @param doc String
     * @param docType String
     * @param {Object|String} location
     * @example
     * location object
     * location = {
     *  lat: 52.5170365 // Float
     *  lng: 13.3888599 // Float
     * }
     * location String
     * location = 'Berlin'
     */

    updateLocationOfCollection: (doc, docType, location, callback) => {
        if (location) {
            if (typeof location != 'object')
                location = Meteor.call('geocode', location)

            var params = WSL.locations.getParams(doc, docType, location)
            //console.log(params, location, doc, docType)
            check(params, Schemas.Locations)
            let id = Locations.findOne({doc, docType})
            if(id)
                Locations.update(id, {$set: params})
        }
    },

    /**
     * Removes the location object of an collection.
     * @param doc String
     */

    removeLocationFromCollection: (doc, callback) => {
        if (doc)
            Locations.remove({doc: doc })
    }
})