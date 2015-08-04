/**
 * View helper
 */

updateResults = function () {
    var results = [];
    results = Session.get('locationResult');

    $('#location-result').replaceWith('<ul id="location-result"></ul>');
    if (results && results.length > 0) {
        jQuery.each(results, function (key, val) {
            $('<li class="result-item">' + val['display_name'] + '</li>').appendTo('#location-result');
        });
    }
};