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


WSL.locations.geocode = function (doc, location) {
    Meteor.call('geocode', doc, location, function (error, result) {
        if(error)
            wAlert.error(error.message);
        wAlert.success(result);
    });
};

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
    // save the current coordinates in a session object
    current: function() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {

                Session.set({
                    currentPosition: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                });
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
    },

    clear: function() {
        if ('geolocation' in navigator) {
            navigator.geolocation.clearWatch(WSL.locations.watchId);
        }
    }
};
