Meteor.methods({
    geocode: function (location, callback) {
        //console.log('Meteor call geocode');
        this.unblock();
        var geo = new GeoCoder({ geocoderProvider: "openstreetmap" }),
            r = geo.geocode(location),
            result = r[0];

        // map to location schema
        if(result) {
            // openstreetmap
            result.loc = {};
            result.loc.lat = result['latitude'];
            result.loc.lng = result['longitude'];
            delete result['latitude'];
            delete result['longitude'];
        }
        return result;
    },

    nominatim: function (string, callback) {
        this.unblock();
        var url = 'http://nominatim.openstreetmap.org/search?format=json&q=' + string,
            response = Meteor.http.get(url);
        //console.log(response);
//        return callback(null, response);
        return response;
        try {

        } catch(error) {
            if(error.response) {
                var errorCode = error.response.data.code,
                    errorMessage = error.response.data.message;
            } else {
                var errorCode = 500;
                var errorMessage = 'Cannot access the API';
            }

            // Create an Error object and return it via callback
            var apiError = new Meteor.Error(errorCode, errorMessage);
            return callback(apiError, null);
        }
    },

    /**
     * Adds the location object to an item.
     * Location is an object or string:
     * loc {
     *  lat: Number
     *  lng: Number
     * }
     * @param itemId
     * @param {object|String} location
     */

    addLocationToItem: function(itemId, location, callback) {
        // console.log('addLocationToItem');
        this.unblock();
        if (typeof location != 'object')
            // serverside geocoding
            location = Meteor.call('geocode', location);

        // console.log(location);
        if (location) {
            var params = WSL.locations.getParams(itemId, 'Item', location);
            //check(params, Schemas.Locations);

            var id = Locations.insert(params);
            Mongo.Collection.get('items').update({_id: itemId}, {
                $set: {
                    location_id: id
                }
            });
        }
    }
});