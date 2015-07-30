/**
 * Locations Mongo Collection
 * @type {Mongo.Collection}
 */

Locations = new Meteor.Collection('locations');

/**
 * Ensure Index
 */

if (Meteor.isServer) {
    Locations._ensureIndex({
        loc: "2d"
    });
}

/**
 * WSL locations settings and methods.
 * @namespace WSL.locations
 * @type {Object} WSL.locations
 */

WSL.locations = {};

/**
 * Watch Id for navigator
 * @type  {Number} WSL.locations.watchId
 */

WSL.locations.watchId;

/**
 * Wrapper for navigator.geolocation
 * type {Object} WSL.locations.navigator
 */

WSL.locations.navigator = {
    current: function() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log(position.coords.latitude, position.coords.longitude);
            });
        } else {
            console.log('navigator.geolocation is not available');
        }
    },

    watchPosition: function() {
        if ('geolocation' in navigator) {
            WSL.locations.watchId = navigator.geolocation.watchPosition(function(position) {
                console.log(position.coords.latitude +':' + position.coords.longitude);
            });
        }
    }
};
