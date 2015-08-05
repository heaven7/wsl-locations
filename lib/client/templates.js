/**
 * locationInputField
 */

Template.locationInputField.events({
    'keydown #location-field': _.throttle(function(event, template) {
        Session.set('locationString', $('#location-field').val());
    }, 500)
});

Template.locationInputField.onRendered(function() {
    Session.set('locationResult', null);
    updateResults();
});

Tracker.autorun(function() {
    var locationString = Session.get('locationString');
    WSL.locations.geocode(locationString);
    updateResults();
});

/**
 * locationResults
 */

Template.locationResults.events({
    'click .result-item': function(event, template) {
        console.log('test');
    }
});