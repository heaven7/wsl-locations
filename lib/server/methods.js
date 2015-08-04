Meteor.methods({
    geocode: function (location) {
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
        //console.log('geocoded: ' + JSON.stringify(result));

        return result;
    },

    location: {
        add: function (doc, location) {
            check(doc, Schemas.Locations);
            this.unblock();

            Locations.upsert(doc, function (error) {
                if (error)
                    throw new Meteor.error(500, error.message);
            })
        }
    }
});