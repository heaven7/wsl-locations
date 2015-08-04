updateResults = function () {
    var results = [];

    results = Session.get('locationResult');
    $('#locationResult').replaceWith('<ul id="locationResult"></ul>');
    if (results && results.length > 0) {

        jQuery.each(results, function (key, val) {
            //            console.log(val['display_name']);
            $('<li>' + val['display_name'] + '</li>').appendTo('#locationResult');
        });
    }
}

Template.locationInputField.events({
    'keydown #locationField': _.throttle(function(event, template) {
        Session.set('locationString', $('#locationField').val());
    }, 500)
});

Template.locationInputField.rendered = function() {
    Session.set('locationResult', '');
};

Tracker.autorun(function() {
    var locationString = Session.get('locationString');
    WSL.locations.geocode(locationString);
    updateResults();
});