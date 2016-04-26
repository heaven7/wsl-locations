/**
 * Adds a location to a desired collection object
 * @param Object collection Mongo.Collection
 * @param String id
 */

WSL.collection.addLocation = (collection, id) => {
    collection.after.insert((userId, doc) => {
        if (doc._id) {
            // get given or current position of user (session)
            WSL.locations.navigator.current()
            let search = WSL.search.result ? WSL.search.result : Session.get('currentPosition')

            if(search) {
                let collectionName = _s.humanize(collection._name)
                if(Session.get('locationResult')) {
                    const location = Session.get('locationResult')

                    let params = WSL.locations.getParams(doc._id, collectionName, location, null)
                    Meteor.call('addLocationToCollection', params)
                } else {
                    // client side geocoding
                    WSL.locations.geocode(search)
                }
            }
        }
    })
}

/**
 * Removes a location of a collection object
 * after the object is beeing removed
 * @param Object collection Mongo.Collection
 * @param String id
 */

WSL.collection.removeLocationAfter = (collection, id) => {
    collection.after.remove((userId, doc) => {
        if (doc._id)
            Meteor.call('removeLocationFromCollection', doc._id)
    })
}
