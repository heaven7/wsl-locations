geocodeOnSelect = () => {
    WSL.search.onSelect = (result) => {
        // geocode result
        if(result && result.title) {
            WSL.search.result = result.title
            WSL.locations.geocode(result.title)
        }
    }
}

updateLocationOnSelect = (data) => {
    WSL.search.onSelect = (result) => {
        // update location
        const doc = data.doc
        const docType = data.docType
        result = result.title

        if(doc && result) {
            WSL.locations.geocode(result)
            if(Session.get('locationResult')) {
                const location = Session.get('locationResult')
                let params = WSL.locations.getParams(doc._id, docType, location, null)
                Meteor.call('updateLocationOfCollection', params)
            }
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

setSearchResponse = () => {
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
}

/**
 * searchLocationInputField
 */

Template.searchLocationInputField.onRendered(function() {
    setSearchResponse()
    searchLocationsOnSelect()
})

Template.searchLocationInputField.helpers({
    url: () => "http://nominatim.openstreetmap.org/search?adressdetails=0&format=json&q={query}"
})

/**
 * insertLocationInputField
 */

Template.insertLocationInputField.helpers({
    url: () => "http://nominatim.openstreetmap.org/search?adressdetails=0&format=json&q={query}"
})

Template.insertLocationInputField.onRendered(function() {
    setSearchResponse()
    geocodeOnSelect()
})

/**
 * editLocationInputField
 */

Template.editLocationInputField.helpers({
    url: () => "http://nominatim.openstreetmap.org/search?adressdetails=0&format=json&q={query}",
    value: () => {
        const data = Template.currentData()
        const id = data.doc && data.doc._id
        if(id) {
            const location = Locations.findOne({doc: id})
            if(location) {
                return location.city
            }
        }
        return false
    }
})


Template.editLocationInputField.onRendered(function() {
    setSearchResponse()
    updateLocationOnSelect(Template.currentData())
})
