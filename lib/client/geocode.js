Meteor.startup(() => {


    /**
     * Client geocoding with different providers
     * and coming server side geocoding as fallback.
     *
     * With Session.get('locationResult') you'll get an object
     * array from the geocoder
     *
     * With Session.get('locationLatLng') you get the lat/lng results
     *
     * @param {String} location
     * @param {String} provider
     */

    WSL.locations.geocode = function (location, provider) {
        var url, params
        provider = typeof provider !== 'undefined' ? provider : 'nominatim'

        if(!location)
            return

        switch(provider) {
            case 'nominatim':
                url = 'http://nominatim.openstreetmap.org/search'
                params = {
                    params: {
                        format: 'json',
                        q: location,
                        addressdetails: 1,
                        limit: 3
                    }
                }
                break
        }
        HTTP.call('GET', url, params, function (error, result) {
            if(error)
                console.log(error)
            if(result) {
                switch(provider) {
                    case 'nominatim':
                        Session.set('locationResult', result.data[0])
                        let latlng = WSL.locations._extractLatLng(result.data[0])
                        if(latlng) Session.set('locationLatLng', latlng)
                        //console.log('Client side geocoding: ', Session.get('locationLatLng'), result.data[0])
                        break
                }
            }
        })
    }

    /**
     * Watch Id for navigator
     * @type  {Number} WSL.locations.watchId
     */

    WSL.locations.watchId

    /**
     * Wrapper for navigator.geolocation
     * type {Object} WSL.locations.navigator
     */

    WSL.locations.navigator = {
        // save the current coordinates in a session object
        current: () => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition( position => {

                    Session.set({
                        currentPosition: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })

                }, error => {
                    geolocFail()
                    clearTimeout()
                })
            } else {
                console.log('navigator.geolocation is not available')
            }
        },

        watchPosition: () => {
            if ('geolocation' in navigator) {
                WSL.locations.watchId = navigator.geolocation.watchPosition(function(position) {
                    console.log(position.coords.latitude +':' + position.coords.longitude)
                })
            }
        },

        clear: () => {
            if ('geolocation' in navigator)
                navigator.geolocation.clearWatch(WSL.locations.watchId)
        }
    }

    geolocFail = () => console.log('problem on detecting location')

    /**
     * Helper
     * Extract lat/lng
     * @param {Object} rawData
     * @returns {Object}
     * @private
     */

    WSL.locations._extractLatLng = function (rawData) {
        if (rawData && typeof rawData === 'object') {

            // list of names to get extracted from data
            var latLng = ['lat', 'lng', 'lon', 'latitude', 'longitude'],
                loc = {}

            _.each(rawData, function (v, i) {
                if(_.contains(latLng, i)) {
                    switch(i) {
                        case 'lat':
                        case 'latitude':
                            loc['lat'] = v
                            break
                        default:
                            loc['lng'] = v
                            break
                    }
                }
            })

            return loc
        }
    }
})