Meteor.methods({
    insertLocation: function (doc) {
        check(doc, Schemas.Locations);
        this.unblock();

        Locations.insert(doc, function (error) {
            if(error)
                throw new Meteor.error(500, error.message);
        })
    }
});