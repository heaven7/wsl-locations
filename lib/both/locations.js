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
    Locations._ensureIndex({loc: "2dsphere"})


Meteor.startup(() => {

    /**
     * WSL locations settings and methods.
     * @namespace WSL.locations
     * @type {Object} WSL.locations
     */

    WSL.locations = {}

    /**
     * Get the params ready for inserting them into a location
     * @param {String} doc
     * @param {String} docType
     * @param {String} location
     * @param {String} owner
     * @returns {Object}
     */

    WSL.locations.getParams = function(doc, docType, location, owner) {
        if (location && typeof location === 'object') {
            owner = owner ? owner : Meteor.userId && Meteor.userId()
            let lat = location.lat
            let lng = location.lon
            let address = location.address
            lat = parseFloat(lat)
            lng = parseFloat(lng)
            params = {
                doc: doc,
                docType: docType,
                owners: [ owner ],
                country: address.country || '',
                city: address.city || '',
                state: address.state || '',
                countryCode: address.countryCode || '',
                loc: [ lat, lng ],
                lat,
                lng
            }
            return params
        }
    }
})
