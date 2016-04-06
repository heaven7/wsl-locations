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

let addMarkersToMap = (collection, markers, data, template, Map) => {
    var query = collection.find()
    query.observe({
        added: (document) => {
            //console.log('added')
            const id = document.doc
            const dataItem = data.findOne(id)
            addMarker(document, markers, dataItem, template, Map)
        },
        changed: (newDocument, oldDocument) => {
            //console.log('changed')
            const id = document.doc
            const dataItem = data.findOne(id)
            removeMaker(oldDocument, Map)
            addMarker(newDocument, markers, dataItem, template, Map)
        },
        removed: (oldDocument) => {
            //console.log('removed')
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
    this.mapReady = new ReactiveVar()
})

Template.map.onRendered(function() {
    const template = Template.currentData().template
    let markers = new L.markerClusterGroup()
    this.mapReady.set(false)

    this.autorun(() => {
        let currentLocation = Session.get('currentPosition')
        const data = Template.currentData().data

        if(currentLocation && data.find().count() && this.mapReady.get() == false) {
            createMap(currentLocation)
            addMarkersToMap(Locations, markers, data, template, Map)
            this.mapReady.set(true)
        }
    })
})

Template.map.helpers({
    mapReady: () => Template.instance().mapReady.get()
})