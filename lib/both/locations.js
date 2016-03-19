/**
 * Locations Mongo Collection
 * @type {Mongo.Collection}
 */

Locations = new Meteor.Collection('locations')

/**
 * Search Index
 */

Meteor.startup(() => {
    if(WSL && WSL.search) {
        WSL.search.addIndex(Locations, ['loc'], 'mongodb')
    }
})

if (Meteor.isServer)
    Locations._ensureIndex({loc: "2d"})


Meteor.startup(() => {
    /**
     * Get the params ready for inserting them into a location
     * @param {String} doc
     * @param {String} docType
     * @param {String} location
     * @returns {Object}
     */

    WSL.locations.getParams = function(doc, docType, location, owner) {
        if (location && typeof location === 'object') {
            owner = owner ? owner : Meteor.userId && Meteor.userId()
            let lat = location.loc && location.loc.lat ? location.loc.lat : location.lat
            let lng = location.loc && location.loc.lat ? location.loc.lng : location.lng
            params = {
                doc: doc,
                docType: docType,
                owners: [ owner ],
                country: location.country || '',
                city: location.city || '',
                state: location.state || '',
                countryCode: location.countryCode || '',
                loc: [ lat, lng ],
                lat,
                lng
            }
            return params
        }
    }
})
