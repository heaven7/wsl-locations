WSL.collection.addLocation = (collection, id) => {
    collection.after.insert((userId, doc) => {
        if (doc._id) {
            // get current position of user (session)
            WSL.locations.navigator.current()
            let search = Object.keys(WSL.search.result).length ? WSL.search.result : Session.get('currentPosition')

            if(search) {
                let collectionName = _s.humanize(collection._name)
                // client side geocoding
                WSL.locations.geocode(search)
                Meteor.call('addLocationToCollection', doc._id, collectionName, search)
            }
        }
    })
}
