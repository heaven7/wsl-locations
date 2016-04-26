
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
    city: () => {
        // get city by doc or by user selection
        const selectedCity = Template.instance().selectedCity.get()

        if(selectedCity) {
            return selectedCity
        } else {
            const data = Template.currentData()
            const id = data.doc && data.doc._id
            if(id) {
                const location = Locations.findOne({doc: id})
                return location && location.city
            }
        }
        return false
    }
})

Template.editLocationInputField.onCreated(function() {
    this.selectedCity = new ReactiveVar()
})

Template.editLocationInputField.onRendered(function() {
    setSearchResponse()
    updateLocationOnSelect(Template.currentData(), Template.instance())
})
