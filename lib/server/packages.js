/**
 * before/after-Methods for inserting/updating collections of packages
 */

// heaven7:wsl-items

if(Package['heaven7:wsl-items']) {

    // insert
    Items.after.insert(function (userId, doc) {
        var location = Session.get('locationString'),
            ItemId = this._id;

        if (location) {
            params = {
                loc: {
                    lat: location.lat,
                    lng: location.lng
                }
            };
            var id = Location.insert(function (ItemId, doc, location) {
                });
            doc.location_id = id;
        }
    });

    // update
    Items.before.update(function (userId, doc, fieldNames, modifier, options) {
        modifier.$set = modifier.$set || {};
        modifier.$set.modified = Date.now();
    });
}
