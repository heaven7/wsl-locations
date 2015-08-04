Template.locationInputField.events({
    'keyup #locationField': _.throttle(function(event, template) {
        var locationString =  $('#locationField').val(),
            results = [];

        // geocode search string.
        WSL.locations.geocode(locationString);
        results = Session.get('locationResult');
        $('#locationResult').replaceWith('<ul id="locationResult"></ul>');

        jQuery.each(results, function (key, val) {
//            console.log(val['display_name']);
            $('<li>' + val['display_name'] + '</li>').appendTo('#locationResult');
        });

    }, 500)
});

Template.locationInputField.rendered = function() {
    Session.set('locationResult', '');
};