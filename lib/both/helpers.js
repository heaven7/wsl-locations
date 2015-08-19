///////////////////////////////////////////////////
// Collection Helpers
///////////////////////////////////////////////////

/**
 * Get all items related to a location
 * Usage: Locations.findOne(_id).items()
 */
Locations.helpers({
    items: function () {
        return Items.find({
            _id: this.doc
        });
    }
});