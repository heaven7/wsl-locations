/**
 * before/after-Methods for inserting/updating collections of packages
 */

// heaven7:wsl-items

if(Package['heaven7:wsl-items']) {

    // insert
    Items.after.insert(function (doc) {
        check(doc, Schemas.Items);

        var location = Session.get('locationString'),
            ItemId = this._id;

        if (location) {
            params = {
                doc: ItemId,
                docType: 'Item',
                owner: {
                    user: Meteor.userId()
                },
                country: location.country,
                city: location.city,
                state: location.state,
                countryCode: location.countryCode,
                loc: {
                    lat: location.lat,
                    lng: location.lng
                }
            };
            check(params, Schema.Locations);
            var id = Location.insert(params);
            doc.location_id = id;
        }
    });

    // update
    Items.before.update(function (userId, doc, fieldNames, modifier, options) {
        modifier.$set = modifier.$set || {};
        modifier.$set.modified = Date.now();
    });
}
