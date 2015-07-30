Meteor.publish(null, function () {
    return Locations.find();
});
