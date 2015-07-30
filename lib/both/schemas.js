Schemas.Locations = new SimpleSchema({

  doc: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },

  docType: {
    type: String
  },

  owners: {
    type: [Object],
    optional: true
  },

  "owners.$.user": {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },

  createdAt: {
      type: Date,
      optional: true,
      autoValue: function () {
          if (this.isInsert) {
              return new Date();
          }
      }
  },

  modified: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isInsert) {
        return this.unset();
      } else {
        return new Date();
      }
    }
  },

  validFrom: {
    type: Date,
    optional: true
  },

  validTo: {
    type: Date,
    optional: true
  },

  watchable: {
    type: Boolean,
    optional: true
  },

  shareable: {
    type: Boolean,
    optional: true
  },

  commentable: {
    type: Boolean,
    optional: true
  },

  loc: {
    type: [Object],
    optional: true
  },

  "loc.$.lat": {
    type: String,
    optional: true
  },

  "loc.$.lng": {
    type: String,
    optional: true
  }
});

Locations.attachSchema(Schemas.Locations);
