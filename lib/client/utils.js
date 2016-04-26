/**
 * Methods for selection of location search results
 */

geocodeOnSelect = () => {
    WSL.search.onSelect = (result) => {
        // geocode result
        if(result && result.title) {
            WSL.search.result = result.title
            WSL.locations.geocode(result.title)
        }
    }
}

updateLocationOnSelect = (data, instance) => {
    WSL.search.onSelect = (result) => {
        // update location
        const doc = data.doc
        const docType = data.docType
        result = result.title
        Session.set('locationResult', null)

        if(doc && result) {
            instance.selectedCity.set(result)
            WSL.locations.geocode(result)
            Tracker.autorun((c) => {
                if(Session.get('locationResult')) {
                    const locationResult = Session.get('locationResult')
                    const params = WSL.locations.getParams(doc._id, docType, locationResult, null)
                    const location = Locations.findOne({doc: doc._id, docType})

                    if(location) Meteor.call('updateLocationOfCollection', params)
                    else Meteor.call('addLocationToCollection', params)
                    c.stop()
                }
            })
        }
    }
}

/**
 * Override function to define what should happen when
 * the user is selecting a location result
 * @example
 * searchLocationsOnSelect = () => {
 *   WSL.search.onSelect = (result) => {
 *       // do something with the result
 *   }
 * }
 */

searchLocationsOnSelect = () => {
    WSL.search.onSelect = (result) => {
        console.log('searchLocationsOnSelect', result)
    }
}

/**
 * searchResponse function
 * uses the onResponse callback of semantic-ui:
 * http://semantic-ui.com/introduction/new.html#translates-any-api
 */

setSearchResponse = () => {
    // override of WSL.search.searchResponse
    WSL.search.searchResponse = (searchResponse) => {
        var response = {results : []}

        // translate API response to work with search
        $.each(searchResponse, function(index, item) {
            var maxResults = 4

            if(index >= maxResults) return false

            response.results.push({
                title: item.display_name
            })
        })
        return response
    }
}


/**
 * Map util functions
 *
 */

/**
 * Create leaflet map
 * @param {Object} location
 */

createMap = (location) => {
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

/**
 * Add marker
 * @param document
 * @param markers
 * @param data
 * @param template
 * @param Map
 */

addMarker = (document, markers, data, template, Map) => {
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

/**
 * Remove marker from map
 * @param {Object} document
 * @param {Object} markers
 * @param {Object} Map
 */

removeMaker = (document, markers, Map) => {
    layers = Map._layers
    let key, val
    for (key in layers) {
        val = layers[key]
        if (val._latlng) {
            if (val._latlng.lat === document.lat && val._latlng.lng === document.lng) {
                markers.removeLayer(val)
                Map.removeLayer(val)
            }
        }
    }
}

/**
 * Add markers to leaflet map
 * @param {Mongo.Collection} collection
 * @param {Array} data
 * @param {String} template
 * @param {Object} Map
 */

addMarkersToMap = (collection, data, template, Map) => {
    const query = collection.find()
    const markers = new L.MarkerClusterGroup({
        showCoverageOnHover: false
    })
    markers.clearLayers()

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
            removeMaker(newDocument, markers, Map)
            removeMaker(oldDocument, markers, Map)
            const id = newDocument.doc
            const dataItems = $.grep(data, function(e) { return e._id == id })
            if(dataItems.length > 0) {
                dataItems.forEach(item => {
                    addMarker(newDocument, markers, item, template, Map)
                })
            }
        },
        removed: (oldDocument) => removeMaker(oldDocument, markers, Map)
    })
}

/**
 * Remove all markers from map
 */

removeAllMarkers = () => {

    layers = Map._layers
    let key, val
    for (key in layers) {
        val = layers[key]
        if (val._latlng) {
            Map.removeLayer(val)
        }
    }
}

/**
 * Marker popup
 * @param {Object} marker
 * @param {Object} data
 * @param {String} template
 */

markerPopup = (marker, data, template) => {
    // wrapping node for bindPopup
    const containerNode = document.createElement('div')
    // render blaze template and attach it to node
    Blaze.renderWithData(Template[template], data, containerNode)
    // bind the containerNode to the popup
    marker.bindPopup(containerNode)
}