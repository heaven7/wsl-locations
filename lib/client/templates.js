Template.locationInputField.events({
    'keyup #locationField': _.throttle(function(event, template) {
        var locationString =  $('#locationField').val();
        Session.set('locationString', locationString);
        //console.log('string update: ' + locationString);
        Meteor.call('geocode', locationString);
    }, 500)
});

Template.locationInputField.rendered = function() {
    Session.set('locationString', '');
};

Tracker.autorun(function() {
    var locationString = Session.get('locationString');
});