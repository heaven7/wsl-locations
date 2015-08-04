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
 * Client geocoding with different providers
 * and coming server side geocoding as fallback
 * @param {String} location
 * @param {String} provider
 */

WSL.locations.geocode = function (location, provider) {
    var url, params;
    provider = typeof provider !== 'undefined' ? provider : 'nominatim';

    switch(provider) {
        case 'nominatim':
            url = 'http://nominatim.openstreetmap.org/search';
            params = {
                params: {
                    format: 'json',
                    q: location
                }
            };
            break;
    }
    HTTP.call('GET', url, params, function (error, result) {
        if(error)
            console.log(error);
        if(result) {
            switch(provider) {
                case 'nominatim':
                    Session.set('locationResult', result.data);
                    break;
            }
        }
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
