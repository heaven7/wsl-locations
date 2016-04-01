var Map = null;
var Markers = [];

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
        let marker = L.marker(document.loc)
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
            const id = document.doc
            const dataItem = data.findOne(id)
            addMarker(document, markers, dataItem, template, Map)
        },
        changed: (newDocument, oldDocument) => {
            const id = document.doc
            const dataItem = data.findOne(id)
            removeMaker(oldDocument, Map)
            addMarker(newDocument, markers, dataItem, template, Map)
        },
        removed: (oldDocument) => {
            removeMaker(oldDocument, Map)
        }
    })
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
    this.SearchData = new ReactiveVar(null)
    // get actual user location
    WSL.locations.navigator.current()
})

Template.map.onRendered(function() {
    const data = Template.currentData().data
    const template = Template.currentData().template
    this.autorun(() => {
        let searchData = Template.instance().SearchData.get()
        if (searchData)
            Meteor.subscribe("locationSearch", searchData)

        let currentLocation = Session.get('currentPosition')
        createMap(currentLocation)
        let markers = new L.markerClusterGroup()
        addMarkersToMap(Locations, markers, data, template, Map)
    })
})