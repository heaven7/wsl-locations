geocodeOnSelect = () => {
    WSL.search.onSelect = (result) => {
        // geocode result
        if(result && result.title) {
            WSL.search.result = result.title
            WSL.locations.geocode(result.title)
        }
    }
}

updateLocationOnSelect = (doc) => {
    WSL.search.onSelect = (result) => {
        // update location
        const data = doc
        const document = data.doc
        const docType = data.docType
        let value = result.title

        if(document && value) {
            const id = document._id
            const locationObj = Locations.findOne({doc: document._id, docType})

            if(locationObj)
                Meteor.call('updateLocationOfCollection', id, docType, value)
        }
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
