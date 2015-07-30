Schemas.Locations = new SimpleSchema({

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

Locations.attachSchema(Schemas.Base);
Locations.attachSchema(Schemas.Settings);
Locations.attachSchema(Schemas.Locations);
