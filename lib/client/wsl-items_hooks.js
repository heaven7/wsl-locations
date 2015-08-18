Items.after.insert(function (userId, doc) {
    console.log('Items.after.insert on client: ' + this._id);
    console.log(Session.get('locationString'));
});
