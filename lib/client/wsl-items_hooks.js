Items.after.insert(function (userId, doc) {
    console.log('Items.after.insert on client: ' + this._id);
    if (this._id) {
        search = Session.get('locationString');
        if(search) {
            WSL.locations.geocode(search);
            Meteor.call('addLocationToItem', this._id, Session.get('locationLatLng'));
        }
    }
});

