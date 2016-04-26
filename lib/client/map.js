import MarkerClusterGroup from 'leaflet.markercluster'

Meteor.startup(() => {

    /**
     * WSL map settings and methods.
     * @namespace WSL.map
     * @type {Object} WSL.map
     */
    WSL.map = {}

    /**
     * Sets the center of the map
     * @param location Object
     * @param zoom Number
     */
    WSL.map.setToLocation = (location, zoom) => {
        check(location, Object)
        zoom = zoom || 8
        if(Map) {
            if(location && location['lat'] && location['lng']) {
                Map.setView(new L.LatLng(
                    location['lat'],
                    location['lng']
                ), zoom)
            }
        }
    }
})

Template.map.onCreated(function() {
    // get actual user location
    WSL.locations.navigator.current()
    this.mapReady = new ReactiveVar(false)
})

Template.map.onRendered(function() {
    this.autorun(() => {
        const template = Template.currentData().template
        const currentLocation = Session.get('currentPosition')
        const data = Template.currentData().data

        if(currentLocation) {
            if(this.mapReady.get() == false)
                createMap(currentLocation)
            if(data.length > 0) {
                removeAllMarkers(Map)
                addMarkersToMap(Locations, data, template, Map)
            }
            this.mapReady.set(true)
        }
    })
})

Template.map.helpers({
    mapReady: () => Template.instance().mapReady.get()
})