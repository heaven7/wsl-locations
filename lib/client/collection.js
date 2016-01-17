WSL.collection.addLocation = (collection, id) => {
    collection.after.insert((userId, doc) => {
        // console.log(collection._name + '.after.insert on client: ', doc._id)
        if (doc._id) {
            let search = Session.get('locationString')
            if(search) {
                let collectionName = _s.humanize(collection._name)
                // client side geocoding
                WSL.locations.geocode(search)
                Meteor.call('addLocationToCollection', doc._id, collectionName, Session.get('locationLatLng'))
            }
        }
    })
}
