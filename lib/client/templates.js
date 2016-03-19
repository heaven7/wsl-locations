/**
 * locationInputField
 */

Template.locationInputField.events({
    'keydown .location_search': _.throttle(function(event, template) {
        Session.set('locationString', $('#location_search').val())
    }, 500)
})

Template.locationInputField.helpers({
    url: () => "http://nominatim.openstreetmap.org/search?adressdetails=0&format=json&q={query}"
})

Template.locationInputField.onRendered(function() {
    // override of WSL.search.searchResponse
    WSL.search.searchResponse = (searchResponse) => {
        var response = {results : []}

        // translate API response to work with search
        $.each(searchResponse, function(index, item) {
            //console.log(item)
            var maxResults = 4

            if(index >= maxResults) return false

            response.results.push({
                title: item.display_name
            })
        })
        //console.log(response)
        return response
    }

    // geocode search result
    this.autorun(() => {
        if(WSL.search && WSL.search.result) {
            WSL.locations.geocode(WSL.search.result)
        }

    })
})

Template.map.onRendered(() => {
    L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images'
    var map = L.map('map')
    L.tileLayer.provider('Thunderforest.Outdoors').addTo(map)
    var marker = L.marker([50.5, 30.5]).addTo(map);
    // wrapping node for bindPopup
    var containerNode = document.createElement('div');
    // Which template to use for the popup? Some data for it, and attach it to node
    Blaze.renderWithData(Template.popup, dataContext, containerNode);
    // Finally bind the containerNode to the popup
    marker.bindPopup(containerNode).openPopup();
})