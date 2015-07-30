/**
 * Locations schema
 * @type {SimpleSchema} Schemas.Locations
 */

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

/**
 * Attach schemas
 */

Schemas.addBaseTo(Locations);
Locations.attachSchema(Schemas.Locations);
