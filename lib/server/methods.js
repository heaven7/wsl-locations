Meteor.methods({
    geocode: function (doc, location) {
        this.unblock();

        var geo = new GeoCoder({
            geocoderProvider: "openstreetmap"
        }), r = geo.geocode(location),
            result = r[0];

        if(doc && result) {
            check(doc, Schemas.Locations);
            /*
             // map to schema
             doc.loc.lat = result['latitude'];
             doc.loc.lng = result['longitude'];
             doc.country = result['country'];
             doc.city = result['city'];
             doc.state = result['state'];
             doc.countryCode = result['countryCode'];
             */
//           Locations.upsert()
        } else if(result) {
            return result;
        }
    },

    insertLocation: function (doc) {
        check(doc, Schemas.Locations);
        this.unblock();

        Locations.insert(doc, function (error) {
            if(error)
                throw new Meteor.error(500, error.message);
        })
    }
});