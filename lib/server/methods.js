Meteor.methods({
    geocode: function (location, callback) {
        this.unblock();
        try {
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
            //console.log('geocoded: ' + JSON.stringify(result));
            return callback(null, result);

        } catch(error) {
            console.log(error)
        }
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
            var myError = new Meteor.Error(errorCode, errorMessage);
            return callback(myError, null);
        }
    },

    addLocationToItem: function(itemId, location) {
        this.unblock();
        var params = WSL.locations.getParams(itemId, location);
        check(params, Schemas.Locations);

        var id = Locations.insert(params);
        Mongo.Collection.get('items').update({_id: itemId}, {
            $set: {
                location_id: id
            }
        });
    }
});