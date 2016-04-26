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

let createMap = (location) => {
    if(location) {
        Map = L.map('map')
        Map.setView(new L.LatLng(
            location['lat'],
            location['lng']
        ), 5)
        L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images'
        L.tileLayer.provider('Thunderforest.Outdoors').addTo(Map)
    }
}

let addMarker = (document, markers, data, template, Map) => {
    if (Map && document && document.loc) {
        let marker = L.marker(document.loc, {riseOnHover: true})
        markers.addLayer(marker)
        Map.addLayer(markers)
        markerPopup(marker, data, template)
        marker.on('click', function() {
            marker.openPopup()
        })
    }
}

let removeMaker = (document, Map) => {
    layers = Map._layers
    let key, val
    for (key in layers) {
        val = layers[key]
        if (val._latlng) {
            if (val._latlng.lat === document.lat && val._latlng.lng === document.lng) {
                Map.removeLayer(val)
            }
        }
    }
}

let addMarkersToMap = (collection, data, template, Map) => {
    const query = collection.find()
    const markers = new L.MarkerClusterGroup({
        showCoverageOnHover: false
    })

    query.observe({
        added: (document) => {
            const id = document.doc
            const dataItems = $.grep(data, function(e) { return e._id == id })
            if(dataItems.length > 0) {
                dataItems.forEach(item => {
                    addMarker(document, markers, item, template, Map)
                })
            }
        },
        changed: (newDocument, oldDocument) => {
            removeMaker(oldDocument, Map)
            const id = document.doc
            const dataItems = $.grep(data, function(e) { return e._id == id })
            if(dataItems.length > 0) {
                dataItems.forEach(item => {
                    addMarker(document, markers, item, template, Map)
                })
            }
        },
        removed: (oldDocument) => {
            removeMaker(oldDocument, Map)
        }
    })
}

let removeAllMarkers = () => {

    layers = Map._layers
    let key, val
    for (key in layers) {
        val = layers[key]
        if (val._latlng) {
            Map.removeLayer(val)
        }
    }
}

let markerPopup = (marker, data, template) => {
    // wrapping node for bindPopup
    const containerNode = document.createElement('div')
    // render blaze template and attach it to node
    Blaze.renderWithData(Template[template], data, containerNode)
    // bind the containerNode to the popup
    marker.bindPopup(containerNode)
}

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