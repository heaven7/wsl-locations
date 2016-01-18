/**
 * locationInputField
 */

Template.locationInputField.events({
    'keydown .location_search': _.throttle(function(event, template) {
        Session.set('locationString', $('#location_search').val())
        // client side geocoding
        // WSL.locations.geocode(Session.get('locationString'))
    }, 500)
})

Template.locationInputField.helpers({
    url: () => "http://nominatim.openstreetmap.org/search?adressdetails=1&format=json&q={query}"
})

Template.locationInputField.onRendered(function() {
    Session.set('locationResult', null)
    updateResults()

    // override of WSL.ui.searchResponse
    WSL.ui.searchResponse = (searchResponse) => {
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
})

Tracker.autorun(function() {
    var locationString = Session.get('locationString')
    WSL.locations.geocode(locationString)
    updateResults()
})

/**
 * locationResults
 */

Template.locationResults.events({
    'click .result-item': function(event, template) {
        console.log('test')
    }
})


