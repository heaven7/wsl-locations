Meteor.methods({
    geocode: function (doc, location) {
        // check(doc, Schemas.Locations);
        this.unblock();

        geo = new GeoCoder({
            geocoderProvider: "openstreetmap"
        });
        var r = geo.geocode(location),
            result = r[0];

        // map to schema
        doc.loc.lat = result['latitude'];
        doc.loc.lng = result['longitude'];
        doc.country = result['country'];
        doc.city = result['city'];
        doc.state = result['state'];
        doc.countryCode = result['countryCode'];
        console.log(JSON.stringify(doc));
//        Locations.upsert()

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