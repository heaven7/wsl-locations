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
    // wrapping node for bindPopup
    //var containerNode = document.createElement('div')
    // Which template to use for the popup? Some data for it, and attach it to node
    //Blaze.renderWithData(Template.popup, dataContext, containerNode)
    // Finally bind the containerNode to the popup
    //marker.bindPopup(containerNode).openPopup()
}

let addMarker = (document, Map) => {
    if (Map && document && document.loc) {
        let marker = L.marker(document.loc).addTo(Map)
            .on('click', function(event) {

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

let addMarkersToMap = (collection, Map) => {
    var query = collection.find()
    query.observe({
        added: (document) => {
            addMarker(document, Map)
        },
        changed: (newDocument, oldDocument) => {
            removeMaker(oldDocument, Map)
            addMarker(newDocument, Map)
        },
        removed: (oldDocument) => {
            removeMaker(oldDocument, Map)
        }
    })
}

Template.map.onCreated(function() {
    this.SearchData = new ReactiveVar(null)
    // get actual user location
    WSL.locations.navigator.current()
})

Template.map.onRendered(function() {

    this.autorun(() => {
        let searchData = Template.instance().SearchData.get()
        if (searchData)
            Meteor.subscribe("locationSearch", searchData)


        let currentLocation = Session.get('currentPosition')
        createMap(currentLocation)
        addMarkersToMap(Locations, Map)
    })
})